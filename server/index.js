const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { inboxCards, inboxData, generalReplies } = require('./cards');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for local dev
    methods: ["GET", "POST"]
  },
  pingTimeout: 30000,
  pingInterval: 10000
});

// Game state
const rooms = {};

// Helper: generate 4-letter room code
const generateRoomCode = () => {
  let result = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  for (let i = 0; i < 4; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
};

// Helper: shuffle array
const shuffle = (array) => {
  let currentIndex = array.length, randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
  }
  return array;
};

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('create_room', (payload, callback) => {
    const playerName = typeof payload === 'object' ? payload.playerName : payload;
    const playerId = (typeof payload === 'object' && payload.playerId) ? payload.playerId : socket.id;

    let roomCode = generateRoomCode();
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }

    const player = {
      id: playerId,
      socketId: socket.id,
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(playerName)}`,
      score: 0,
      hand: [],
      isHost: true,
      online: true
    };

    rooms[roomCode] = {
      id: roomCode,
      players: [player],
      status: 'lobby', // lobby, playing, judging, scoreboard, game_over
      judgeIndex: 0,
      currentInbox: null,
      submissions: [], // { playerId, card }
      inboxDeck: shuffle([...inboxCards]),
      replyDeck: shuffle([...generalReplies]),
      roundCount: 0,
      wallpaper: 'default'
    };

    socket.join(roomCode);
    callback({ success: true, roomCode, playerId: player.id });
    io.to(roomCode).emit('room_update', rooms[roomCode]);
  });

  socket.on('join_room', ({ roomCode, playerName, playerId }, callback) => {
    if (!roomCode) return callback({ success: false, message: 'Invalid room code' });
    roomCode = roomCode.toUpperCase();
    const room = rooms[roomCode];

    if (!room) {
      return callback({ success: false, message: 'Room not found' });
    }

    const pId = playerId || socket.id;

    // Check if player is reconnecting to an existing slot
    let existingPlayer = room.players.find(p => p.id === pId);
    if (existingPlayer) {
      existingPlayer.socketId = socket.id;
      existingPlayer.online = true;
      if (existingPlayer.disconnectTimeout) {
        clearTimeout(existingPlayer.disconnectTimeout);
        delete existingPlayer.disconnectTimeout;
      }
      socket.join(roomCode);
      callback({ success: true, roomCode, playerId: existingPlayer.id });
      io.to(roomCode).emit('room_update', room);
      return;
    }
    
    if (room.status !== 'lobby') {
      return callback({ success: false, message: 'Game already in progress' });
    }

    if (room.players.length >= 12) {
      return callback({ success: false, message: 'Room is full' });
    }

    const player = {
      id: pId,
      socketId: socket.id,
      name: playerName,
      avatar: `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(playerName)}`,
      score: 0,
      hand: [],
      isHost: false,
      online: true
    };

    room.players.push(player);
    socket.join(roomCode);
    callback({ success: true, roomCode, playerId: player.id });
    io.to(roomCode).emit('room_update', room);
  });

  // Reconnection event when browser tab is re-focused or refreshed
  socket.on('reconnect_room', ({ roomCode, playerId }, callback) => {
    if (!roomCode || !playerId) return callback && callback({ success: false, message: 'Missing parameters' });
    const formattedCode = roomCode.toUpperCase();
    const room = rooms[formattedCode];

    if (!room) {
      return callback && callback({ success: false, message: 'Room not found' });
    }

    const player = room.players.find(p => p.id === playerId);
    if (!player) {
      return callback && callback({ success: false, message: 'Player session not found in room' });
    }

    player.socketId = socket.id;
    player.online = true;
    if (player.disconnectTimeout) {
      clearTimeout(player.disconnectTimeout);
      delete player.disconnectTimeout;
    }

    socket.join(formattedCode);
    if (callback) callback({ success: true, roomCode: formattedCode, room });
    io.to(formattedCode).emit('room_update', room);
  });

  socket.on('update_settings', ({ roomCode, settings }) => {
    const room = rooms[roomCode];
    const player = room?.players.find(p => p.socketId === socket.id);
    if (room && player?.isHost) {
      if (settings.wallpaper) room.wallpaper = settings.wallpaper;
      io.to(roomCode).emit('room_update', room);
    }
  });

  const dealCards = (room) => {
    const inboxDataMatch = inboxData.find(d => d.message === room.currentInbox);

    // Create ONE shared pool of relevant cards, shuffled once
    const sharedRelevantPool = inboxDataMatch ? shuffle([...inboxDataMatch.relevant]) : [];
    
    // Fresh wildcard deck for this round so no overlap
    let wildcardDeck = shuffle([...generalReplies]);

    room.players.forEach(player => {
      // Clear hand every round
      player.hand = [];
      
      // Draw 3 UNIQUE relevant cards from shared pool
      let relevantToDraw = 3;
      while (relevantToDraw > 0 && sharedRelevantPool.length > 0) {
        player.hand.push(sharedRelevantPool.pop());
        relevantToDraw--;
      }

      // Fill rest with wildcards up to 5 cards
      while (player.hand.length < 5) {
        if (wildcardDeck.length === 0) {
          wildcardDeck = shuffle([...generalReplies]);
        }
        const card = wildcardDeck.pop();
        if (!player.hand.includes(card)) {
          player.hand.push(card);
        }
      }
      
      player.hand = shuffle(player.hand);
    });
  };

  const startRound = (room) => {
    if (room.inboxDeck.length === 0) {
       room.inboxDeck = shuffle([...inboxCards]);
    }
    room.currentInbox = room.inboxDeck.pop();
    room.submissions = [];
    room.status = 'playing';
    room.lastWinnerId = null;
    dealCards(room);
    io.to(room.id).emit('room_update', room);
  };

  socket.on('start_game', (roomCode) => {
    const room = rooms[roomCode];
    const player = room?.players.find(p => p.socketId === socket.id);
    if (room && player?.isHost) {
       startRound(room);
    }
  });

  socket.on('submit_card', ({ roomCode, card }) => {
    const room = rooms[roomCode];
    if (!room || room.status !== 'playing') return;

    const player = room.players.find(p => p.socketId === socket.id);
    if (!player) return;

    const judge = room.players[room.judgeIndex];
    if (player.id === judge?.id) return; // Judge can't submit

    // Remove card from hand
    player.hand = player.hand.filter(c => c !== card);
    
    // Add or replace submission
    const existingIndex = room.submissions.findIndex(s => s.playerId === player.id);
    if (existingIndex !== -1) {
      room.submissions[existingIndex].card = card;
    } else {
      room.submissions.push({ playerId: player.id, card });
    }
    
    io.to(roomCode).emit('room_update', room);

    // If everyone submitted (except judge)
    const requiredSubmissions = room.players.filter(p => p.id !== judge?.id).length;
    if (room.submissions.length >= requiredSubmissions) {
      room.status = 'judging';
      // Shuffle submissions so judge doesn't know who played what
      room.submissions = shuffle(room.submissions);
      io.to(roomCode).emit('room_update', room);
    }
  });

  socket.on('pick_winner', ({ roomCode, winningSubmission }) => {
    const room = rooms[roomCode];
    if (!room || room.status !== 'judging') return;

    const judge = room.players[room.judgeIndex];
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.id !== judge?.id) return; // Only judge can pick

    const winner = room.players.find(p => p.id === winningSubmission.playerId);
    if (winner) {
      winner.score += 1;
    }

    room.status = 'scoreboard';
    room.lastWinnerId = winner ? winner.id : null;
    io.to(roomCode).emit('room_update', room);
  });

  socket.on('reroll_round', (roomCode) => {
    const room = rooms[roomCode];
    if (!room || (room.status !== 'judging' && room.status !== 'playing')) return;

    const judge = room.players[room.judgeIndex];
    const player = room.players.find(p => p.socketId === socket.id);
    if (!player || player.id !== judge?.id) return; // Only judge can reroll

    startRound(room);
  });

  socket.on('next_round', (roomCode) => {
    const room = rooms[roomCode];
    const player = room?.players.find(p => p.socketId === socket.id);
    if (room && player?.isHost && room.status === 'scoreboard') {
       room.judgeIndex = (room.judgeIndex + 1) % room.players.length;
       room.roundCount++;
       
       // End the game after 10 rounds
       if (room.roundCount >= 10) {
         room.status = 'game_over';
         io.to(roomCode).emit('room_update', room);
       } else {
         startRound(room);
       }
    }
  });

  // Explicit leave room by user
  socket.on('leave_room', ({ roomCode }) => {
    if (!roomCode) return;
    const room = rooms[roomCode.toUpperCase()];
    if (!room) return;

    const playerIndex = room.players.findIndex(p => p.socketId === socket.id);
    if (playerIndex !== -1) {
      const player = room.players[playerIndex];
      if (player.disconnectTimeout) clearTimeout(player.disconnectTimeout);
      room.players.splice(playerIndex, 1);

      if (room.players.length === 0) {
        delete rooms[roomCode.toUpperCase()];
      } else {
        if (room.players[0]) room.players[0].isHost = true;
        if (room.judgeIndex >= room.players.length) room.judgeIndex = 0;
        io.to(roomCode.toUpperCase()).emit('room_update', room);
      }
    }
    socket.leave(roomCode.toUpperCase());
  });

  socket.on('disconnect', () => {
    console.log('User socket disconnected:', socket.id);
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const player = room.players.find(p => p.socketId === socket.id);
      if (player) {
        player.online = false;
        
        // 60-second grace period before actually removing the player from the game
        if (player.disconnectTimeout) clearTimeout(player.disconnectTimeout);
        player.disconnectTimeout = setTimeout(() => {
          if (!player.online) {
            const idx = room.players.findIndex(p => p.id === player.id);
            if (idx !== -1) {
              console.log(`Grace period expired for player ${player.name}, removing from room ${roomCode}`);
              room.players.splice(idx, 1);
              if (room.players.length === 0) {
                delete rooms[roomCode];
              } else {
                if (room.players[0]) room.players[0].isHost = true;
                if (room.judgeIndex >= room.players.length) room.judgeIndex = 0;
                io.to(roomCode).emit('room_update', room);
              }
            }
          }
        }, 60000);

        io.to(roomCode).emit('room_update', room);
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on port ${PORT} at 0.0.0.0`);
});

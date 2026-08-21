const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const cors = require('cors');
const { inboxCards, replyCards } = require('./cards');

const app = express();
app.use(cors());

const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // allow all for local dev
    methods: ["GET", "POST"]
  }
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

  socket.on('create_room', (playerName, callback) => {
    let roomCode = generateRoomCode();
    while (rooms[roomCode]) {
      roomCode = generateRoomCode();
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      hand: [],
      isHost: true
    };

    rooms[roomCode] = {
      id: roomCode,
      players: [player],
      status: 'lobby', // lobby, playing, judging
      judgeIndex: 0,
      currentInbox: null,
      submissions: [], // { playerId, card }
      inboxDeck: shuffle([...inboxCards]),
      replyDeck: shuffle([...replyCards]),
      roundCount: 0,
      wallpaper: 'default' // default, dark, purple, blue
    };

    socket.join(roomCode);
    callback({ success: true, roomCode });
    io.to(roomCode).emit('room_update', rooms[roomCode]);
  });

  socket.on('join_room', ({ roomCode, playerName }, callback) => {
    roomCode = roomCode.toUpperCase();
    const room = rooms[roomCode];

    if (!room) {
      return callback({ success: false, message: 'Room not found' });
    }
    
    if (room.status !== 'lobby') {
      return callback({ success: false, message: 'Game already in progress' });
    }

    if (room.players.length >= 8) {
      return callback({ success: false, message: 'Room is full' });
    }

    const player = {
      id: socket.id,
      name: playerName,
      score: 0,
      hand: [],
      isHost: false
    };

    room.players.push(player);
    socket.join(roomCode);
    callback({ success: true, roomCode });
    io.to(roomCode).emit('room_update', room);
  });

  socket.on('update_settings', ({ roomCode, settings }) => {
    const room = rooms[roomCode];
    if (room && room.players[0].id === socket.id) { // Only host
      if (settings.wallpaper) room.wallpaper = settings.wallpaper;
      io.to(roomCode).emit('room_update', room);
    }
  });

  const dealCards = (room) => {
    room.players.forEach(player => {
      while (player.hand.length < 7) {
        if (room.replyDeck.length === 0) {
          room.replyDeck = shuffle([...replyCards]); // reshuffle if empty
        }
        player.hand.push(room.replyDeck.pop());
      }
    });
  };

  const startRound = (room) => {
    if (room.inboxDeck.length === 0) {
       room.inboxDeck = shuffle([...inboxCards]);
    }
    room.currentInbox = room.inboxDeck.pop();
    room.submissions = [];
    room.status = 'playing';
    dealCards(room);
    io.to(room.id).emit('room_update', room);
  };

  socket.on('start_game', (roomCode) => {
    const room = rooms[roomCode];
    if (room && room.players[0].id === socket.id) { // Only host can start
       startRound(room);
    }
  });

  socket.on('submit_card', ({ roomCode, card }) => {
    const room = rooms[roomCode];
    if (!room || room.status !== 'playing') return;

    const judgeId = room.players[room.judgeIndex].id;
    if (socket.id === judgeId) return; // Judge can't submit

    const player = room.players.find(p => p.id === socket.id);
    if (!player) return;

    // Remove card from hand
    player.hand = player.hand.filter(c => c !== card);
    
    // Add to submissions
    room.submissions.push({ playerId: socket.id, card });
    
    io.to(roomCode).emit('room_update', room);

    // If everyone submitted (except judge)
    if (room.submissions.length === room.players.length - 1) {
      room.status = 'judging';
      // Shuffle submissions so judge doesn't know who played what
      room.submissions = shuffle(room.submissions);
      io.to(roomCode).emit('room_update', room);
    }
  });

  socket.on('pick_winner', ({ roomCode, winningSubmission }) => {
    const room = rooms[roomCode];
    if (!room || room.status !== 'judging') return;

    const judgeId = room.players[room.judgeIndex].id;
    if (socket.id !== judgeId) return; // Only judge can pick

    const winner = room.players.find(p => p.id === winningSubmission.playerId);
    if (winner) {
      winner.score += 1;
    }

    io.to(roomCode).emit('round_winner', {
      winningSubmission,
      winnerName: winner ? winner.name : 'Unknown'
    });

    // Wait 5 seconds, then start next round
    setTimeout(() => {
      // Next judge
      room.judgeIndex = (room.judgeIndex + 1) % room.players.length;
      room.roundCount++;
      startRound(room);
    }, 5000);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Find rooms user was in and remove them
    for (const roomCode in rooms) {
      const room = rooms[roomCode];
      const playerIndex = room.players.findIndex(p => p.id === socket.id);
      if (playerIndex !== -1) {
        room.players.splice(playerIndex, 1);
        
        if (room.players.length === 0) {
          delete rooms[roomCode]; // Clean up empty room
        } else {
          // If host left, make next person host
          if (room.players[0]) {
             room.players[0].isHost = true;
          }
          // Adjust judge index if necessary
          if (room.judgeIndex >= room.players.length) {
            room.judgeIndex = 0;
          }
          io.to(roomCode).emit('room_update', room);
        }
      }
    }
  });
});

const PORT = process.env.PORT || 3002;
server.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

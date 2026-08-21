"use client";

import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';

const socket: Socket = io('http://localhost:3002');

// Types
interface Player {
  id: string;
  name: string;
  isHost: boolean;
  hand: string[];
}

interface Submission {
  playerId: string;
  card: string;
}

interface Room {
  id: string;
  status: 'lobby' | 'playing' | 'judging';
  players: Player[];
  currentInbox: string;
  submissions: Submission[];
  judgeIndex: number;
  wallpaper: string;
}

// Helper components for iOS UI
const StatusBar = () => (
  <div className="ios-status-bar">
    <div className="status-time">9:41</div>
    <div className="dynamic-island"></div>
    <div className="status-icons">
      <svg className="icon-signal" viewBox="0 0 24 24" width="16" height="16">
        <rect x="2" y="14" width="3.5" height="5" rx="1" fill="currentColor"/>
        <rect x="7.5" y="11" width="3.5" height="8" rx="1" fill="currentColor"/>
        <rect x="13" y="7" width="3.5" height="12" rx="1" fill="currentColor"/>
        <rect x="18.5" y="3" width="3.5" height="16" rx="1" fill="currentColor"/>
      </svg>
      <svg className="icon-wifi" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12.55a11 11 0 0 1 14.08 0"></path>
        <path d="M1.42 9a16 16 0 0 1 21.16 0"></path>
        <path d="M8.53 16.11a6 6 0 0 1 6.95 0"></path>
        <line x1="12" y1="20" x2="12.01" y2="20"></line>
      </svg>
      <svg className="icon-battery" viewBox="0 0 24 24" width="24" height="14" fill="none" stroke="currentColor">
        <rect x="2" y="6" width="18" height="12" rx="3.5" strokeWidth="1.5" />
        <path d="M22 10.5v3" strokeWidth="2" strokeLinecap="round"/>
        <rect x="4" y="8" width="14" height="8" rx="1.5" fill="currentColor" stroke="none" />
      </svg>
    </div>
  </div>
);

interface HomeInboxProps {
  playerName: string;
  setPlayerName: (name: string) => void;
  roomCode: string;
  setRoomCode: (code: string) => void;
  onHost: () => void;
  onJoin: () => void;
  error: string;
}

const HomeInbox = ({ playerName, setPlayerName, roomCode, setRoomCode, onHost, onJoin, error }: HomeInboxProps) => (
  <div className="ios-screen messages-inbox">
    <div className="inbox-header">
      <div className="inbox-header-top">
        <button className="ios-btn-text">Edit</button>
        <svg className="compose-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </div>
      <h1 className="inbox-title">Messages</h1>
      <div className="search-bar">
        <svg className="search-icon" viewBox="0 0 24 24"><path fill="currentColor" d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
        <input type="text" placeholder="Search" readOnly />
      </div>
    </div>
    
    <div className="inbox-list">
      {/* Name Input Area (Styled as a pinned contact) */}
      <div className="inbox-item setup-item">
        <div className="avatar setup-avatar">👤</div>
        <div className="inbox-content">
          <div className="inbox-name">Your Profile</div>
          <input 
            type="text" 
            placeholder="Enter your name to play..." 
            value={playerName}
            onChange={e => setPlayerName(e.target.value)}
            className="ios-inline-input"
          />
        </div>
      </div>

      {error && <div className="error-text">{error}</div>}

      {/* Host Game Button */}
      <div className="inbox-item" onClick={onHost} role="button" tabIndex={0}>
        <div className="avatar host-avatar">
           <svg viewBox="0 0 24 24"><path fill="white" d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5 11h-4v4h-2v-4H7v-2h4V7h2v4h4v2z"/></svg>
        </div>
        <div className="inbox-content">
          <div className="inbox-top-line">
            <span className="inbox-name">Host a Game</span>
            <span className="inbox-time">9:41 AM</span>
          </div>
          <div className="inbox-preview">Start a new room and invite friends.</div>
        </div>
        <div className="inbox-chevron">›</div>
      </div>

      {/* Join Game Button */}
      <div className="inbox-item">
        <div className="avatar join-avatar">
           <svg viewBox="0 0 24 24"><path fill="white" d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </div>
        <div className="inbox-content">
          <div className="inbox-top-line">
            <span className="inbox-name">Join a Game</span>
            <span className="inbox-time">Yesterday</span>
          </div>
          <div className="inbox-preview join-input-preview">
            <input 
              type="text" 
              placeholder="Enter 4-letter code..." 
              value={roomCode}
              onChange={e => setRoomCode(e.target.value.toUpperCase())}
              maxLength={4}
              className="ios-inline-input"
            />
            <button className="ios-join-btn" onClick={onJoin}>Join</button>
          </div>
        </div>
      </div>
      
      {/* Fake History */}
      <div className="inbox-item">
        <div className="avatar fake-avatar">M</div>
        <div className="inbox-content">
          <div className="inbox-top-line">
            <span className="inbox-name">Mom</span>
            <span className="inbox-time">Tuesday</span>
          </div>
          <div className="inbox-preview">New phone, who dis?</div>
        </div>
        <div className="inbox-chevron">›</div>
      </div>

    </div>
  </div>
);

export default function Home() {
  const [gameState, setGameState] = useState<'home' | 'lobby' | 'game'>('home');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const [winnerAlert, setWinnerAlert] = useState<{ winnerName: string, card: string } | null>(null);

  useEffect(() => {
    socket.on('room_update', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      if (updatedRoom.status === 'lobby') setGameState('lobby');
      else setGameState('game');
    });

    socket.on('round_winner', ({ winningSubmission, winnerName }: { winningSubmission: Submission, winnerName: string }) => {
      setWinnerAlert({ winnerName, card: winningSubmission.card });
    });

    return () => {
      socket.off('room_update');
      socket.off('round_winner');
    };
  }, []);

  const handleCreateRoom = () => {
    if (!playerName) return setError('Please enter your name first.');
    socket.emit('create_room', playerName, (res: { success: boolean, roomCode?: string }) => {
      if (res.success && res.roomCode) {
         setRoomCode(res.roomCode);
         setError('');
      }
    });
  };

  const handleJoinRoom = () => {
    if (!playerName || !roomCode) return setError('Please enter name and room code.');
    socket.emit('join_room', { roomCode, playerName }, (res: { success: boolean, message?: string }) => {
      if (!res.success && res.message) {
        setError(res.message);
      } else {
        setError('');
      }
    });
  };

  const startGame = () => {
    if (room) socket.emit('start_game', room.id);
  };

  const submitCard = (card: string) => {
    if (room) socket.emit('submit_card', { roomCode: room.id, card });
  };

  const pickWinner = (submission: Submission) => {
    if (room) socket.emit('pick_winner', { roomCode: room.id, winningSubmission: submission });
  };

  const changeWallpaper = (w: string) => {
    if (room) socket.emit('update_settings', { roomCode: room.id, settings: { wallpaper: w } });
  };

  const myPlayer = room?.players.find(p => p.id === socket.id);
  const isJudge = room && room.players[room.judgeIndex]?.id === socket.id;
  const hasSubmitted = room?.submissions.some(s => s.playerId === socket.id);

  return (
    <div className="phone-bezel">
      <div className={`app-container ${room?.wallpaper ? 'wallpaper-' + room.wallpaper : 'wallpaper-default'}`}>
        <StatusBar />

        {winnerAlert && (
          <div className="ios-modal-overlay">
            <div className="ios-modal">
              <h3 className="ios-modal-title">Round Winner!</h3>
              <p className="ios-modal-message">
                <strong>{winnerAlert.winnerName}</strong> won with:<br/><br/>
                "{winnerAlert.card}"
              </p>
              <button className="ios-modal-btn" onClick={() => setWinnerAlert(null)}>OK</button>
            </div>
          </div>
        )}
        
        {gameState === 'home' && (
          <HomeInbox 
            playerName={playerName} 
            setPlayerName={setPlayerName}
            roomCode={roomCode}
            setRoomCode={setRoomCode}
            onHost={handleCreateRoom}
            onJoin={handleJoinRoom}
            error={error}
          />
        )}

        {gameState === 'lobby' && room && (
          <div className="ios-screen ios-chat">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-back" onClick={() => window.location.reload()}>
                <span className="chevron">‹</span>
                <span className="back-text">Filters</span>
              </div>
              <div className="chat-header-contact">
                <div className="group-avatars">
                  <div className="avatar-stack">👥</div>
                </div>
                <div className="chat-name">Room {room.id}</div>
                <div className="chat-subtitle">{room.players.length} People</div>
              </div>
              <div className="chat-header-right">
                <svg viewBox="0 0 24 24" className="info-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="16" x2="12" y2="12"></line>
                  <line x1="12" y1="8" x2="12.01" y2="8"></line>
                </svg>
              </div>
            </div>

            {/* Chat Area (System Messages) */}
            <div className="chat-messages lobby-messages">
              <div className="timestamp">Today 9:41 AM</div>
              <div className="system-message">You joined Room {room.id}</div>
              
              {room.players.map(p => (
                <div key={p.id} className="system-message">
                  {p.name} {p.isHost ? 'is the host' : 'joined the room'}
                </div>
              ))}

              {myPlayer?.isHost && (
                <div className="system-action-box">
                  <p>As the host, you control the chat wallpaper.</p>
                  <div className="wallpaper-picker">
                    <button className={room.wallpaper === 'default' ? 'active' : ''} onClick={() => changeWallpaper('default')}>Light</button>
                    <button className={room.wallpaper === 'dark' ? 'active' : ''} onClick={() => changeWallpaper('dark')}>Dark</button>
                    <button className={room.wallpaper === 'gradient' ? 'active' : ''} onClick={() => changeWallpaper('gradient')}>Vapor</button>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Keyboard Area */}
            <div className="ios-bottom-bar">
               {myPlayer?.isHost ? (
                 <button className="ios-primary-btn" onClick={startGame} disabled={room.players.length < 2}>
                   {room.players.length < 2 ? 'Need 2+ players to start' : 'Start Game'}
                 </button>
               ) : (
                 <div className="ios-waiting-text">Waiting for host to start...</div>
               )}
            </div>
          </div>
        )}

        {gameState === 'game' && room && (
          <div className="ios-screen ios-chat">
            {/* Header */}
            <div className="chat-header">
              <div className="chat-header-back">
                <span className="chevron">‹</span>
                <span className="back-text">{room.players.length}</span>
              </div>
              <div className="chat-header-contact">
                <div className="group-avatars">
                  <div className="avatar-single">{room.players[room.judgeIndex]?.name.charAt(0).toUpperCase()}</div>
                </div>
                <div className="chat-name">{isJudge ? 'You (Judge)' : room.players[room.judgeIndex]?.name}</div>
                <div className="chat-subtitle">Room {room.id}</div>
              </div>
              <div className="chat-header-right">
                <svg viewBox="0 0 24 24" className="facetime-icon" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <polygon points="23 7 16 12 23 17 23 7"></polygon>
                  <rect x="1" y="5" width="15" height="14" rx="3" ry="3"></rect>
                </svg>
              </div>
            </div>

            {/* Chat Area */}
            <div className="chat-messages">
              <div className="timestamp">Today 9:41 AM</div>
              
              <div className="imessage-row received-row">
                <div className="imessage received">
                  {room.currentInbox}
                </div>
              </div>

              {room.status === 'judging' && room.submissions.map((sub, idx) => (
                <div key={idx} className="imessage-row sent-row judging-row" onClick={() => isJudge && pickWinner(sub)}>
                  <div className="imessage sent">
                    {sub.card}
                  </div>
                </div>
              ))}

              {room.status === 'playing' && room.submissions.map((sub, idx) => (
                 <div key={idx} className="imessage-row sent-row">
                   <div className="imessage sent pending">
                     Delivered
                   </div>
                 </div>
              ))}
            </div>

            {/* Custom Keyboard / Hand */}
            <div className="ios-keyboard-area">
              <div className="keyboard-predictive-bar">
                {isJudge ? 'Tap a message above to pick the winner!' : 'Select a reply from your hand'}
              </div>
              
              {!isJudge && room.status === 'playing' && !hasSubmitted && (
                <div className="keyboard-hand">
                  {myPlayer?.hand.map((card, idx) => (
                    <div key={idx} className="hand-card" onClick={() => submitCard(card)}>
                      {card}
                    </div>
                  ))}
                </div>
              )}

              {!isJudge && room.status === 'playing' && hasSubmitted && (
                <div className="keyboard-status">Waiting for others...</div>
              )}

              {isJudge && room.status === 'playing' && (
                <div className="keyboard-status">Waiting for replies ({room.submissions.length}/{room.players.length - 1})</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

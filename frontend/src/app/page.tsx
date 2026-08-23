"use client";
import { useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { Home, Gamepad2, Trophy, User, ArrowLeft, Settings, MessageCircleQuestion, Crown, Heart, Clock, CheckCircle } from 'lucide-react';

const socket: Socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3002');

// Types
interface Player {
  id: string;
  name: string;
  avatar: string;
  score: number;
  hand: string[];
  isHost: boolean;
}

interface Room {
  id: string;
  players: Player[];
  status: 'lobby' | 'playing' | 'judging' | 'scoreboard' | 'game_over';
  judgeIndex: number;
  currentInbox: string | null;
  submissions: { playerId: string; card: string }[];
  roundCount: number;
  lastWinnerId: string | null;
}

export default function App() {
  const [playerName, setPlayerName] = useState('');
  const [room, setRoom] = useState<Room | null>(null);
  const [error, setError] = useState('');
  const [roomCodeInput, setRoomCodeInput] = useState('');
  const [selectedCard, setSelectedCard] = useState<string | null>(null);
  const [customReply, setCustomReply] = useState('');
  
  // local state
  const [myPlayer, setMyPlayer] = useState<Player | null>(null);

  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    const onConnect = () => setIsConnected(true);
    const onDisconnect = () => setIsConnected(false);
    
    socket.on('connect', onConnect);
    socket.on('disconnect', onDisconnect);

    socket.on('room_update', (updatedRoom: Room) => {
      setRoom(updatedRoom);
      const me = updatedRoom.players.find(p => p.id === socket.id);
      if (me) setMyPlayer(me);
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('disconnect', onDisconnect);
      socket.off('room_update');
    };
  }, []);

  const handleHost = () => {
    if (!isConnected) return setError('Not connected to server yet! Try refreshing.');
    if (!playerName) return setError('Please enter your name first.');
    console.log('Requesting to create room for', playerName);
    socket.emit('create_room', playerName, (res: any) => {
      if (!res.success) setError('Failed to create room');
    });
  };

  const handleJoin = () => {
    if (!isConnected) return setError('Not connected to server yet! Try refreshing.');
    if (!playerName) return setError('Please enter your name first.');
    if (roomCodeInput.length !== 4) return setError('Enter 4-letter code.');
    socket.emit('join_room', { roomCode: roomCodeInput, playerName }, (res: any) => {
      if (!res.success) setError(res.message);
    });
  };

  const handleStartGame = () => {
    if (room && myPlayer?.isHost) {
      socket.emit('start_game', room.id);
    }
  };

  const submitCard = () => {
    const cardToSubmit = customReply.trim() ? customReply.trim() : selectedCard;
    if (room && cardToSubmit) {
      socket.emit('submit_card', { roomCode: room.id, card: cardToSubmit });
      setSelectedCard(null);
      setCustomReply('');
    }
  };

  const pickWinner = (playerId: string) => {
    if (room && myPlayer?.id === room.players[room.judgeIndex].id) {
      const submission = room.submissions.find(s => s.playerId === playerId);
      if (submission) {
        socket.emit('pick_winner', { roomCode: room.id, winningSubmission: submission });
      }
    }
  };

  const nextRound = () => {
    if (room && myPlayer?.isHost) {
      socket.emit('next_round', room.id);
    }
  };

  const leaveRoom = () => {
    setRoom(null);
    socket.emit('disconnect'); 
    window.location.reload();
  };

  // --- RENDERING ---

  if (!room) {
    // HOME SCREEN
    return (
      <div className="app-container">
        {/* Top Profile */}
        <div className="top-header">
          <div className="header-profile">
            <img src={playerName ? `https://api.dicebear.com/7.x/micah/svg?seed=${encodeURIComponent(playerName)}` : 'https://api.dicebear.com/7.x/micah/svg?seed=Guest'} alt="Avatar" className="header-avatar" />
            <div>
              <div className="header-name">{playerName || 'Guest'}</div>
              <div className="header-role">Player</div>
            </div>
          </div>
          <div className="header-actions">
            <button className="icon-btn"><Settings size={20} /></button>
          </div>
        </div>

        {/* Title */}
        <div className="hero-title">
          <h1>Who Dis?</h1>
          <div className="hero-bubble">
            <MessageCircleQuestion size={30} fill="white" stroke="white" />
          </div>
        </div>
        <div className="hero-subtitle">The funniest replies. Wins. 🤪</div>

        {/* Input */}
        <div className="input-group">
          {error && <div className="error-msg">{error}</div>}
          <input 
            type="text" 
            className="text-input" 
            placeholder="Enter your name..." 
            value={playerName} 
            onChange={e => {setPlayerName(e.target.value); setError('');}}
          />
        </div>



        {/* Action Buttons */}
        <div className="action-buttons">
          <button className="btn-primary" onClick={handleHost}>
            Create Game <span>+</span>
          </button>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input 
              type="text" 
              className="text-input" 
              placeholder="Code (ABCD)" 
              value={roomCodeInput}
              onChange={e => setRoomCodeInput(e.target.value.toUpperCase())}
              style={{ width: '120px' }}
              maxLength={4}
            />
            <button className="btn-secondary" style={{ flex: 1 }} onClick={handleJoin}>
              Join Game <span>→</span>
            </button>
          </div>
        </div>

        {/* How to Play */}
        <div className="how-to-play">
          <h3><MessageCircleQuestion size={18}/> How to Play</h3>
          <div className="instruction-step">
            <div className="step-num">1</div>
            <div className="step-text">A random message is sent automatically.</div>
          </div>
          <div className="instruction-step">
            <div className="step-num">2</div>
            <div className="step-text">Everyone (except the host) replies.</div>
          </div>
          <div className="instruction-step">
            <div className="step-num">3</div>
            <div className="step-text">The host picks the funniest response.</div>
          </div>
          <div className="instruction-step">
            <div className="step-num">4</div>
            <div className="step-text">That player becomes the next judge!</div>
          </div>
        </div>


      </div>
    );
  }

  // Common Top Bar for Room
  const topBar = (
    <div className="game-top-bar">
      <button className="icon-btn" style={{ width: 40, height: 40 }} onClick={leaveRoom}><ArrowLeft size={20} /></button>
      <div className="round-indicator">
        <div className="round-title">Round {room.roundCount + 1}</div>
        <div className="round-dots">
          {[0,1,2,3,4].map(i => (
            <div key={i} className={`dot ${i <= room.roundCount ? 'active' : ''}`}></div>
          ))}
        </div>
      </div>
      <button className="btn-leave" onClick={leaveRoom}>Leave</button>
    </div>
  );

  const judge = room.players[room.judgeIndex];
  const amIJudge = myPlayer?.id === judge?.id;

  if (room.status === 'lobby') {
    return (
      <div className="app-container">
        {topBar}
        <div className="section-title" style={{ justifyContent: 'center', margin: '40px 0 20px', fontSize: '1.2rem' }}>
          Room Code: <strong style={{ color: 'var(--primary)', marginLeft: 8, fontSize: '1.5rem', letterSpacing: 2 }}>{room.id}</strong>
        </div>
        <div className="replies-list">
          <div className="section-title">Players ({room.players.length}/12)</div>
          {room.players.map(p => (
            <div key={p.id} className="player-list-item">
              <img src={p.avatar} alt="avatar" className="reply-avatar" />
              <div className="reply-name" style={{ color: 'var(--text-main)', fontSize: '1.1rem', flex: 1 }}>
                {p.name} {p.id === myPlayer?.id && '(You)'}
              </div>
              {p.isHost && <Crown size={20} style={{ color: 'var(--accent-gold)' }}/>}
            </div>
          ))}
        </div>
        {myPlayer?.isHost && (
          <div className="floating-action">
            <button className="btn-gold" onClick={handleStartGame}>Start Game</button>
          </div>
        )}
      </div>
    );
  }

  if (room.status === 'playing') {
    return (
      <div className="app-container">
        {topBar}
        
        {/* The Message */}
        <div className="message-box">
          <div className="message-header">
            <div className="msg-icon"><MessageCircleQuestion fill="white" size={24}/></div>
            <div>
              <div className="msg-title">The Message</div>
              <div className="msg-subtitle">Sent automatically</div>
            </div>
          </div>
          <div className="msg-bubble">
            {room.currentInbox}
          </div>
        </div>

        {amIJudge ? (
          <>
            <div className="judge-header" style={{ marginTop: 40 }}>
               <Clock className="crown-icon" style={{ filter: 'none', color: 'var(--primary)' }} />
               <div className="judge-title">Waiting for replies...</div>
               <div className="judge-subtitle">Everyone (except you) is replying<br/>to the message.</div>
            </div>
            
            <div className="replies-list" style={{ marginTop: 32 }}>
               <div className="section-title">
                 <span>Players</span>
                 <span>{room.submissions.length} / {room.players.length - 1}</span>
               </div>
               {room.players.filter(p => p.id !== judge.id).map(p => {
                 const hasReplied = room.submissions.some(s => s.playerId === p.id);
                 return (
                   <div key={p.id} className="reply-card">
                     <img src={p.avatar} alt="avatar" className="reply-avatar" />
                     <div className="reply-content" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: 48 }}>
                       <div className="reply-name" style={{ color: 'var(--text-main)', margin: 0, fontSize: '1rem' }}>
                         {p.name}
                       </div>
                       {hasReplied ? (
                         <div className="status-replied">Replied <CheckCircle size={14}/></div>
                       ) : (
                         <div className="status-typing">Typing...</div>
                       )}
                     </div>
                   </div>
                 );
               })}
            </div>
            <div className="floating-action">
               <div className="wait-box">
                 <span style={{ fontSize: '0.9rem' }}>You can't reply. You're the judge this round. 😜</span>
               </div>
            </div>
          </>
        ) : (
          <>
            <div className="section-title">
              <span>Your Hand</span>
            </div>
            <div className="hand-container">
              {myPlayer?.hand.map((card, i) => {
                 const isSub = room.submissions.some(s => s.playerId === myPlayer.id);
                 if (isSub) return null; // hide hand if submitted
                 return (
                   <div 
                     key={i} 
                     className={`hand-card ${selectedCard === card && !customReply ? 'selected' : ''}`}
                     style={selectedCard === card && !customReply ? { border: '2px solid var(--primary)', background: 'rgba(157,60,243,0.1)' } : {}}
                     onClick={() => { setSelectedCard(card); setCustomReply(''); }}
                   >
                     {card}
                   </div>
                 );
              })}
              
              {!room.submissions.some(s => s.playerId === myPlayer?.id) && (
                <div style={{ marginTop: '10px' }}>
                  <div className="section-title" style={{ padding: '0 0 12px 0', justifyContent: 'center' }}>
                    <span>— Or write your own —</span>
                  </div>
                  <input 
                    type="text" 
                    className="text-input" 
                    placeholder="Type a custom reply..." 
                    value={customReply}
                    onChange={(e) => {
                      setCustomReply(e.target.value);
                      if (e.target.value) setSelectedCard(null);
                    }}
                  />
                </div>
              )}
            </div>

            <div className="floating-action">
              {room.submissions.some(s => s.playerId === myPlayer?.id) ? (
                <div className="wait-box">Waiting for more replies...</div>
              ) : (
                <button className="btn-gold" onClick={submitCard} disabled={!selectedCard && !customReply.trim()}>
                  Submit Reply
                </button>
              )}
            </div>
          </>
        )}
      </div>
    );
  }

  if (room.status === 'judging') {
    return (
      <div className="app-container">
        {topBar}
        <div className="judge-header">
           <Crown className="crown-icon" color="var(--accent-gold)" fill="var(--accent-gold)" />
           <div className="judge-title">Pick the funniest reply!</div>
           <div className="judge-subtitle">Tap on the reply you think is the funniest.</div>
        </div>

        <div className="replies-list">
          {room.submissions.map((sub, i) => {
             const p = room.players.find(pl => pl.id === sub.playerId);
             return (
               <div 
                 key={i} 
                 className={`reply-card ${amIJudge ? 'selectable' : ''} ${selectedCard === sub.playerId ? 'selected' : ''}`}
                 onClick={() => { if (amIJudge) setSelectedCard(sub.playerId) }}
               >
                 <div className="reply-content" style={{ paddingLeft: 12 }}>
                   <div className="reply-text" style={{ fontSize: '1.1rem', fontWeight: 500 }}>{sub.card}</div>
                 </div>
               </div>
             )
          })}
        </div>
        
        {amIJudge ? (
          <div className="floating-action">
             <button className="btn-gold" onClick={() => pickWinner(selectedCard!)} disabled={!selectedCard}>
               Confirm Winner <Crown size={20} fill="black" />
             </button>
          </div>
        ) : (
          <div className="floating-action">
             <div className="wait-box">Judge is picking a winner...</div>
          </div>
        )}
      </div>
    );
  }

  if (room.status === 'scoreboard') {
     const winner = room.players.find(p => p.id === room.lastWinnerId);
     return (
       <div className="app-container">
          {topBar}
          <div className="winner-showcase">
             <Crown className="crown-icon" style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', filter: 'none' }} color="var(--accent-gold)" fill="var(--accent-gold)"/>
             <div className="winner-avatar-wrap">
               <img src={winner?.avatar} alt="winner" className="winner-avatar" />
               <div className="winner-badge">Winner!</div>
             </div>
             <div className="winner-subtitle">
                <span>{winner?.name}'s</span> reply was the funniest! 🎉<br/>
                {winner?.name} is the next judge.
             </div>
             
             {myPlayer?.isHost && (
               <div style={{ padding: '0 20px', marginBottom: 24 }}>
                 <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={nextRound}>Next Round</button>
               </div>
             )}
          </div>
          
          <div className="scoreboard">
            <div className="score-header"><Trophy size={20} /> Scoreboard</div>
            {[...room.players].sort((a,b) => b.score - a.score).map((p, i) => (
              <div key={p.id} className="score-row">
                 <div className="score-rank">{i + 1}</div>
                 <img src={p.avatar} alt="av" className="score-avatar" />
                 <div className="score-name">
                   {p.name} {p.id === myPlayer?.id && '(You)'}
                   {p.isHost && <Crown size={14} color="var(--accent-gold)"/>}
                 </div>
                 <div className="score-points">{p.score}</div>
              </div>
            ))}
          </div>
          

       </div>
     );
  }

  if (room.status === 'game_over') {
    const sortedPlayers = [...room.players].sort((a, b) => b.score - a.score);
    const champion = sortedPlayers[0];
    return (
      <div className="app-container" style={{ justifyContent: 'center', alignItems: 'center', textAlign: 'center', padding: 20 }}>
        <div className="judge-header" style={{ marginBottom: 0 }}>
          <Trophy size={60} color="var(--accent-gold)" style={{ filter: 'drop-shadow(0 0 20px rgba(255,190,11,0.5))', marginBottom: 16 }} />
          <div className="judge-title" style={{ fontSize: '2rem' }}>Game Over!</div>
          <div className="judge-subtitle" style={{ marginTop: 8 }}>10 rounds complete</div>
        </div>

        <div className="winner-showcase" style={{ margin: '30px 0 20px' }}>
          <div className="winner-avatar-wrap">
            <img src={champion?.avatar} alt="champion" className="winner-avatar" />
            <div className="winner-badge">🏆 Champion</div>
          </div>
          <div style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: 16 }}>{champion?.name}</div>
          <div style={{ color: 'var(--accent-gold)', fontSize: '1.1rem', fontWeight: 700 }}>{champion?.score} points</div>
        </div>

        <div className="scoreboard" style={{ width: '100%', borderRadius: 24 }}>
          <div className="score-header"><Trophy size={20} /> Final Standings</div>
          {sortedPlayers.map((p, i) => (
            <div key={p.id} className="score-row">
              <div className="score-rank" style={i === 0 ? { color: 'var(--accent-gold)', fontWeight: 800 } : {}}>{i + 1}</div>
              <img src={p.avatar} alt="av" className="score-avatar" />
              <div className="score-name">
                {p.name} {p.id === myPlayer?.id && '(You)'}
                {i === 0 && <Crown size={14} color="var(--accent-gold)" fill="var(--accent-gold)" />}
              </div>
              <div className="score-points" style={i === 0 ? { color: 'var(--accent-gold)' } : {}}>{p.score}</div>
            </div>
          ))}
        </div>

        <div style={{ padding: '24px 0', width: '100%' }}>
          <button className="btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={leaveRoom}>
            Play Again
          </button>
        </div>
      </div>
    );
  }

  return null;
}

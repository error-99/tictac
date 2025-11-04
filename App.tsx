
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Player, SquareValue, WinnerInfo, GameMode, GameState, OnlineGamePhase, ChatMessage } from './types';
import PlayerInfo from './components/PlayerInfo';
import GameBoard from './components/GameBoard';
import WinnerModal from './components/WinnerModal';
import { PlayerOneAvatar, PlayerTwoAvatar, SoundOnIcon, SoundOffIcon, ChatIcon } from './components/Icons';
import GameModeSelection from './components/GameModeSelection';
import OnlineLobby from './components/OnlineLobby';
import WaitingRoom from './components/WaitingRoom';
import ChatBox from './components/ChatBox';
import { gameService } from './services/gameService';
import { audioService } from './services/audioService';


const calculateWinner = (squares: SquareValue[]): WinnerInfo | null => {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return { winner: squares[a] as Player, line: lines[i] };
    }
  }
  if (squares.every(square => square !== null)) {
    return { winner: 'Draw', line: null };
  }
  return null;
};

const App: React.FC = () => {
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [player, setPlayer] = useState<Player | null>(null);
  const [onlinePhase, setOnlinePhase] = useState<OnlineGamePhase>('lobby');
  const [scores, setScores] = useState<{ X: number; O: number }>({ X: 0, O: 0 });
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [playerName, setPlayerName] = useState('');
  const [isSoundOn, setIsSoundOn] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [showWinnerModal, setShowWinnerModal] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  
  // Use refs to hold current state for use in callbacks without triggering re-renders of the effect
  const gameStateRef = useRef(gameState);
  gameStateRef.current = gameState;
  const playerRef = useRef(player);
  playerRef.current = player;
  const playerNameRef = useRef(playerName);
  playerNameRef.current = playerName;
  const onlinePhaseRef = useRef(onlinePhase);
  onlinePhaseRef.current = onlinePhase;
  const lastPlayedVoiceMessageTimestamp = useRef<number>(0);


  useEffect(() => {
    audioService.setSoundEnabled(isSoundOn);
  }, [isSoundOn]);

  // WebSocket connection and message handling
  useEffect(() => {
    if (gameMode !== 'online') return;

    const handleMessage = (data: any) => {
        const currentGameState = gameStateRef.current;
        if (!currentGameState || data.gameId !== currentGameState.gameId) return;

        switch(data.type) {
            case 'JOIN_REQUEST':
                if (playerRef.current === 'X' && currentGameState.status === 'waiting') {
                    const updatedGameState: GameState = {
                        ...currentGameState,
                        players: [currentGameState.players[0], { name: data.playerName, symbol: 'O' }],
                        status: 'playing',
                    };
                    setGameState(updatedGameState);
                    setOnlinePhase('playing');
                    gameService.send({
                        type: 'GAME_STATE_SYNC',
                        gameId: updatedGameState.gameId,
                        payload: updatedGameState,
                    });
                }
                break;
            
            case 'GAME_STATE_SYNC':
                const newGameState: GameState = data.payload;
                
                // Play move sound for receiving player
                if (JSON.stringify(newGameState.board) !== JSON.stringify(currentGameState.board) && newGameState.winnerInfo === null) {
                    audioService.playMove();
                }

                setGameState(newGameState);

                // Handle winner for receiving player
                if (newGameState.winnerInfo && !currentGameState.winnerInfo) {
                    setTimeout(() => {
                        if (newGameState.winnerInfo.winner === 'Draw') {
                            audioService.playDraw();
                        } else {
                            audioService.playWin();
                            setScores(prev => ({...prev, [newGameState.winnerInfo!.winner]: prev[newGameState.winnerInfo!.winner] + 1}))
                        }
                        setShowWinnerModal(true);
                    }, 3000);
                }

                // Handle voice messages for receiving player
                const latestVoiceMessage = newGameState.voiceMessages[newGameState.voiceMessages.length - 1];
                if (latestVoiceMessage && latestVoiceMessage.timestamp > lastPlayedVoiceMessageTimestamp.current) {
                    if (latestVoiceMessage.senderName !== playerNameRef.current) {
                       audioService.playVoiceMessage(latestVoiceMessage.audioBase64);
                    }
                    lastPlayedVoiceMessageTimestamp.current = latestVoiceMessage.timestamp;
                }

                // If a joiner receives the first sync, start the game.
                if (onlinePhaseRef.current !== 'playing' && newGameState.status === 'playing') {
                    setOnlinePhase('playing');
                }
                break;
        }
    };
    
    gameService.connect(handleMessage);

  }, [gameMode]);


  const handleSelectMode = (mode: GameMode) => {
    setGameMode(mode);
    resetScores();
    if (mode === 'local' || mode === 'ai') {
      startNewGame(mode);
    }
  };

  const startNewGame = (mode: 'local' | 'ai') => {
    const newGameState: GameState = {
      gameId: Math.random().toString(36).substr(2, 9),
      board: Array(9).fill(null),
      currentPlayer: 'X',
      players: [
        { name: mode === 'ai' ? 'You' : 'Player 1', symbol: 'X' },
        { name: mode === 'ai' ? 'Gemini AI' : 'Player 2', symbol: 'O' }
      ],
      status: 'playing',
      winnerInfo: null,
      chat: [],
      voiceMessages: [],
    };
    setGameState(newGameState);
    setShowWinnerModal(false);
  };
  
  const resetGame = (mode: 'local' | 'ai' | 'online') => {
     setShowWinnerModal(false);
     if (mode === 'online' && gameState) {
        const newGameState: GameState = {
            ...gameState,
            board: Array(9).fill(null),
            currentPlayer: 'X',
            status: 'playing',
            winnerInfo: null,
        };
        setGameState(newGameState);
        gameService.send({ type: 'GAME_STATE_SYNC', gameId: gameState.gameId, payload: newGameState });
     } else if (mode === 'local' || mode === 'ai') {
        startNewGame(mode);
     }
  };

  const resetScores = () => setScores({ X: 0, O: 0 });

  const broadcastGameState = (newState: GameState) => {
    if (gameMode === 'online') {
        gameService.send({ type: 'GAME_STATE_SYNC', gameId: newState.gameId, payload: newState });
    }
  };

  const updateBoardAndCheckWinner = useCallback((newBoard: SquareValue[]) => {
    if (!gameState) return;
    const newWinnerInfo = calculateWinner(newBoard);
    const nextPlayer = gameState.currentPlayer === 'X' ? 'O' : 'X';

    const updatedGameState: GameState = {
        ...gameState,
        board: newBoard,
        currentPlayer: nextPlayer,
        winnerInfo: newWinnerInfo,
        status: newWinnerInfo ? 'finished' : 'playing',
    };
    setGameState(updatedGameState); // Optimistic update
    broadcastGameState(updatedGameState);

    if (newWinnerInfo) {
        const handleWin = () => {
            if (newWinnerInfo.winner === 'Draw') {
                audioService.playDraw();
            } else {
                audioService.playWin();
                setScores(prevScores => ({
                    ...prevScores,
                    [newWinnerInfo.winner]: prevScores[newWinnerInfo.winner] + 1,
                }));
            }
            setShowWinnerModal(true);
        };
        setTimeout(handleWin, 3000);
    }
  }, [gameState, gameMode]);
  
  const getAiMove = useCallback(async (currentBoard: SquareValue[]) => {
    setIsAiThinking(true);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const prompt = `You are a Tic-Tac-Toe expert playing as 'O'. The board is a 9-element array. 'X' is the opponent, 'O' is you, and null is empty. Board: [${currentBoard.map(v => v ? `"${v}"` : 'null').join(', ')}]. Your task is to return the index (0-8) for your next move. The move must be on an empty (null) square.`;
      
      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              move: { type: Type.INTEGER, description: "The index from 0 to 8 for the next move." }
            },
            required: ["move"]
          },
          temperature: 0.5,
        }
      });
  
      const result = JSON.parse(response.text);
      if (typeof result.move === 'number' && result.move >= 0 && result.move < 9 && currentBoard[result.move] === null) {
        return result.move;
      } else {
        throw new Error("Invalid move received from AI.");
      }
    } catch (error) {
      console.error("AI move generation failed, falling back to random move:", error);
      const availableMoves = currentBoard.map((val, index) => (val === null ? index : null)).filter(val => val !== null) as number[];
      return availableMoves.length > 0 ? availableMoves[Math.floor(Math.random() * availableMoves.length)] : undefined;
    } finally {
      setIsAiThinking(false);
    }
  }, []);

  useEffect(() => {
    if (gameMode === 'ai' && gameState?.currentPlayer === 'O' && gameState.status === 'playing') {
      const makeAiMove = async () => {
        const moveIndex = await getAiMove(gameState.board);
        if (moveIndex !== undefined && gameState.status === 'playing') {
          audioService.playMove();
          const newBoard = gameState.board.slice();
          newBoard[moveIndex] = 'O';
          updateBoardAndCheckWinner(newBoard);
        }
      };
      const timerId = setTimeout(makeAiMove, 500);
      return () => clearTimeout(timerId);
    }
  }, [gameMode, gameState, getAiMove, updateBoardAndCheckWinner]);

  const handleSquareClick = (index: number) => {
    if (!gameState || gameState.board[index] || gameState.status !== 'playing') return;
    
    if(gameMode === 'online' && gameState.currentPlayer !== player) return;
    if(gameMode === 'ai' && gameState.currentPlayer === 'O') return;

    audioService.playMove();
    const newBoard = gameState.board.slice();
    newBoard[index] = gameState.currentPlayer;
    updateBoardAndCheckWinner(newBoard);
  };
  
  const handleCreateGame = (name: string) => {
    setPlayerName(name);
    const newGame: GameState = {
        gameId: Math.random().toString(36).substr(2, 9),
        board: Array(9).fill(null),
        players: [{ name: name, symbol: 'X' }, null],
        currentPlayer: 'X',
        status: 'waiting',
        winnerInfo: null,
        chat: [],
        voiceMessages: [],
    };
    setGameState(newGame);
    setPlayer('X');
    setOnlinePhase('waiting');
    window.history.pushState({}, '', `?gameId=${newGame.gameId}`);
  };

  const handleJoinGame = (name: string) => {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    if (gameId) {
      setPlayerName(name);
      setPlayer('O');
      const tempGameState: GameState = {
        gameId,
        board: Array(9).fill(null),
        players: [null, { name, symbol: 'O' }],
        currentPlayer: 'X',
        status: 'waiting',
        winnerInfo: null,
        chat: [],
        voiceMessages: [],
      };
      setGameState(tempGameState);
      setOnlinePhase('playing');
      gameService.send({ type: 'JOIN_REQUEST', gameId, playerName: name });
    }
  };

  const handleReturnToMenu = () => {
    setGameMode(null);
    setGameState(null);
    setOnlinePhase('lobby');
    setPlayer(null);
    setPlayerName('');
    window.history.pushState({}, '', '/');
  };
  
  const handleSendMessage = (message: string) => {
    if (gameMode === 'online' && gameState && playerName) {
      const newMessage: ChatMessage = { senderName: playerName, text: message, timestamp: Date.now() };
      const updatedGameState = {...gameState, chat: [...gameState.chat, newMessage]};
      setGameState(updatedGameState);
      broadcastGameState(updatedGameState);
    }
  };

  const handleStartRecording = async () => {
    if (isRecording) return;
    try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaRecorderRef.current = new MediaRecorder(stream);
        audioChunksRef.current = [];
        
        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };
        
        mediaRecorderRef.current.onstop = () => {
            const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/webm' });
            const reader = new FileReader();
            reader.readAsDataURL(audioBlob);
            reader.onloadend = () => {
                const base64String = reader.result as string;
                if (gameMode === 'online' && gameState && playerName) {
                    const newVoiceMessage = { senderName: playerName, audioBase64: base64String, timestamp: Date.now() };
                    const updatedGameState = {...gameState, voiceMessages: [...gameState.voiceMessages, newVoiceMessage]};
                    setGameState(updatedGameState);
                    broadcastGameState(updatedGameState);
                }
            };
            stream.getTracks().forEach(track => track.stop()); // Stop microphone access
        };
        
        mediaRecorderRef.current.start();
        setIsRecording(true);
    } catch (err) {
        console.error("Error accessing microphone:", err);
        alert("Microphone access is required for voice chat. Please allow permission and try again.");
    }
  };

  const handleStopRecording = () => {
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === "recording") {
          mediaRecorderRef.current.stop();
          setIsRecording(false);
      }
  };

  if (!gameMode) {
    return <GameModeSelection onSelectMode={handleSelectMode} />;
  }

  if (gameMode === 'online') {
    if (onlinePhase === 'lobby') {
       const gameId = new URLSearchParams(window.location.search).get('gameId');
       return <OnlineLobby onJoin={handleJoinGame} onCreate={handleCreateGame} isJoining={!!gameId} />;
    }
    if (onlinePhase === 'waiting' && gameState) {
      return <WaitingRoom gameId={gameState.gameId} />;
    }
  }

  if (!gameState) {
    return (
      <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold">Loading Game...</h2>
        <button onClick={handleReturnToMenu} className="mt-4 text-teal-500">Return to Menu</button>
      </div>
    );
  }

  const playerNames = {
    X: gameState.players[0]?.name || 'Player 1',
    O: gameState.players[1]?.name || 'Player 2',
  }
  const isMyTurn = gameMode !== 'online' || player === gameState.currentPlayer;

  const opponentName = gameMode === 'online' ? gameState.players.find(p => p && p.symbol !== player)?.name || 'Opponent' : '';
  let turnText = '';
  if (gameState.status === 'playing') {
    if (gameMode === 'online') {
      if (!gameState.players[1]) {
        turnText = "Waiting for opponent...";
      } else {
        turnText = isMyTurn ? "Your Turn" : `${opponentName}'s Turn`;
      }
    } else if (gameMode === 'ai') {
      turnText = gameState.currentPlayer === 'X' ? "Your Turn" : "Gemini's Turn";
    } else {
      turnText = `${playerNames[gameState.currentPlayer]}'s Turn`;
    }
  }


  const mainContent = (
    <>
      <header className="w-full flex justify-between items-center mb-6">
        <PlayerInfo
          name={playerNames.X}
          avatar={<PlayerOneAvatar />}
          isActive={gameState.currentPlayer === 'X' && gameState.status === 'playing'}
          isYou={gameMode === 'online' && player === 'X'}
        />
        <div className="text-4xl font-bold text-slate-700 px-4">
          {scores.X}<span className="text-slate-400 mx-2">:</span>{scores.O}
        </div>
        <PlayerInfo
          name={playerNames.O}
          avatar={<PlayerTwoAvatar />}
          isActive={gameState.currentPlayer === 'O' && gameState.status === 'playing'}
          isThinking={isAiThinking && gameMode === 'ai'}
          isRightAligned
          isYou={gameMode === 'online' && player === 'O'}
        />
      </header>

      <div className="text-center mb-4 h-8 flex items-center justify-center">
        <p className={`text-xl font-semibold transition-all duration-300 ${gameState.status === 'playing' ? 'opacity-100 scale-100' : 'opacity-0 scale-90'} ${isMyTurn ? 'text-teal-500' : 'text-slate-500'}`}>
          {turnText}
        </p>
      </div>
      
      <GameBoard
        squares={gameState.board}
        onClick={handleSquareClick}
        winningLine={gameState.winnerInfo?.line}
        isLocked={!isMyTurn || gameState.status !== 'playing' || !gameState.players[1]}
      />
    </>
  );

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 select-none">
       <div className="absolute top-4 right-4 flex items-center gap-4">
         <button onClick={handleReturnToMenu} className="text-slate-500 hover:text-slate-700 transition">
            &larr; Menu
          </button>
        <button onClick={() => setIsSoundOn(!isSoundOn)} className="text-slate-400 hover:text-slate-600 transition">
          {isSoundOn ? <SoundOnIcon /> : <SoundOffIcon />}
        </button>
      </div>

      {gameMode === 'online' ? (
        <>
          <main className="w-full max-w-5xl mx-auto flex flex-col md:flex-row items-start gap-8 mt-12">
              <div className="flex-grow w-full max-w-md mx-auto">{mainContent}</div>
              <div className="w-full md:w-80 lg:w-96 flex-shrink-0 hidden md:block">
                  <ChatBox 
                      messages={gameState.chat}
                      onSendMessage={handleSendMessage}
                      currentPlayerName={playerName}
                      onStartRecording={handleStartRecording}
                      onStopRecording={handleStopRecording}
                      isRecording={isRecording}
                  />
              </div>
          </main>
           {/* Mobile Chat FAB */}
          <div className="md:hidden fixed bottom-4 right-4 z-10">
            <button onClick={() => setIsChatOpen(true)} className="bg-teal-500 text-white rounded-full p-4 shadow-lg hover:bg-teal-600 transition transform hover:scale-110 active:scale-100">
              <ChatIcon />
            </button>
          </div>
          {/* Mobile Chat Modal */}
          {isChatOpen && (
            <div className="md:hidden fixed inset-0 bg-slate-50 z-50 flex flex-col animate-slide-in-up">
              <ChatBox 
                messages={gameState.chat}
                onSendMessage={handleSendMessage}
                currentPlayerName={playerName}
                onClose={() => setIsChatOpen(false)}
                onStartRecording={handleStartRecording}
                onStopRecording={handleStopRecording}
                isRecording={isRecording}
              />
            </div>
          )}
           <style>{`
              @keyframes slide-in-up {
                from { transform: translateY(100%); }
                to { transform: translateY(0); }
              }
              .animate-slide-in-up { animation: slide-in-up 0.3s ease-out; }
           `}</style>
        </>
      ) : (
         <main className="w-full max-w-md mx-auto flex flex-col items-center mt-12">
            {mainContent}
         </main>
      )}

      <WinnerModal 
        isVisible={showWinnerModal}
        winnerInfo={gameState.winnerInfo} 
        onReset={() => gameMode && resetGame(gameMode)} 
        playerNames={playerNames} 
      />
    </div>
  );
};

export default App;

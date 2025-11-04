
import React, { useState, useEffect, useCallback } from 'react';
import { GoogleGenAI, Type } from '@google/genai';
import { Player, SquareValue, WinnerInfo, GameMode, GameState, OnlineGamePhase, ChatMessage } from './types';
import PlayerInfo from './components/PlayerInfo';
import GameBoard from './components/GameBoard';
import WinnerModal from './components/WinnerModal';
import { PlayerOneAvatar, PlayerTwoAvatar, SoundOnIcon, SoundOffIcon } from './components/Icons';
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


  useEffect(() => {
    audioService.setSoundEnabled(isSoundOn);
  }, [isSoundOn]);

  // Effect to handle joining an online game via URL
  useEffect(() => {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    if (gameId) {
      const existingGame = gameService.getGame(gameId);
      if (existingGame) {
        setGameMode('online');
        if (existingGame.status === 'playing') {
          // This is a reconnect scenario, not fully implemented, just view for now.
          setGameState(existingGame);
          setOnlinePhase('playing');
        }
      }
    }
  }, []);
  
  // Polling for online game updates
  useEffect(() => {
    if (gameMode !== 'online' || !gameState?.gameId || onlinePhase !== 'playing') {
      return;
    }
  
    const intervalId = setInterval(() => {
      const latestGameState = gameService.getGame(gameState.gameId);
      if (latestGameState) {
        // A simple check to see if the state has changed
        if (JSON.stringify(latestGameState) !== JSON.stringify(gameState)) {
          setGameState(latestGameState);
          if (latestGameState.winnerInfo && !gameState.winnerInfo) {
             // Game just finished, update scores and play sound
             if (latestGameState.winnerInfo.winner === 'Draw') {
                audioService.playDraw();
             } else {
                audioService.playWin();
                setScores(prev => ({...prev, [latestGameState.winnerInfo!.winner]: prev[latestGameState.winnerInfo!.winner] + 1}))
             }
          }
        }
      }
    }, 1000);
  
    return () => clearInterval(intervalId);
  }, [gameMode, gameState, onlinePhase]);


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
        { name: mode === 'ai' ? 'You' : 'gyd f', symbol: 'X' },
        { name: mode === 'ai' ? 'Gemini AI' : 'Shavbir', symbol: 'O' }
      ],
      status: 'playing',
      winnerInfo: null,
      chat: [],
    };
    setGameState(newGameState);
  };
  
  const resetGame = (mode: 'local' | 'ai' | 'online') => {
     if (mode === 'online' && gameState) {
        const newGameState = gameService.resetGame(gameState.gameId);
        setGameState(newGameState);
     } else if (mode === 'local' || mode === 'ai') {
        startNewGame(mode);
     }
  };

  const resetScores = () => setScores({ X: 0, O: 0 });

  const updateBoardAndCheckWinner = useCallback((newBoard: SquareValue[]) => {
    const newWinnerInfo = calculateWinner(newBoard);
    const nextPlayer = gameState?.currentPlayer === 'X' ? 'O' : 'X';

    if (newWinnerInfo) {
        if (newWinnerInfo.winner === 'Draw') {
            audioService.playDraw();
        } else {
            audioService.playWin();
            setScores(prevScores => ({
                ...prevScores,
                [newWinnerInfo.winner]: prevScores[newWinnerInfo.winner] + 1,
            }));
        }
    }

    if (gameMode === 'online' && gameState) {
      const updatedGameState = gameService.updateGame(gameState.gameId, newBoard, nextPlayer, newWinnerInfo);
      setGameState(updatedGameState);
    } else {
       setGameState(prev => prev ? ({
        ...prev,
        board: newBoard,
        currentPlayer: nextPlayer,
        winnerInfo: newWinnerInfo,
        status: newWinnerInfo ? 'finished' : 'playing',
      }) : null);
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
    const game = gameService.createGame(name);
    setGameState(game);
    setPlayer('X');
    setOnlinePhase('waiting');
    window.history.pushState({}, '', `?gameId=${game.gameId}`);
  };

  const handleJoinGame = (name: string) => {
    const gameId = new URLSearchParams(window.location.search).get('gameId');
    if (gameId) {
      setPlayerName(name);
      try {
        const game = gameService.joinGame(gameId, name);
        setGameState(game);
        setPlayer('O');
        setOnlinePhase('playing');
      } catch (error: any) {
        alert(error.message);
        window.history.pushState({}, '', '/');
      }
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
      const updatedGameState = gameService.sendMessage(gameState.gameId, playerName, message);
      setGameState(updatedGameState);
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
      return <WaitingRoom gameId={gameState.gameId} onGameStart={(gs) => { setGameState(gs); setOnlinePhase('playing'); }} />;
    }
  }

  if (!gameState) {
    return (
      <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4">
        <h2 className="text-2xl font-bold">Something went wrong.</h2>
        <button onClick={handleReturnToMenu} className="mt-4 text-teal-500">Return to Menu</button>
      </div>
    );
  }

  const playerNames = {
    X: gameState.players[0]?.name || 'Player 1',
    O: gameState.players[1]?.name || 'Player 2',
  }
  const isMyTurn = gameMode !== 'online' || player === gameState.currentPlayer;

  const mainContent = (
    <>
      <header className="w-full flex justify-between items-center mb-6">
        <PlayerInfo
          name={playerNames.X}
          avatar={<PlayerOneAvatar />}
          isActive={gameState.currentPlayer === 'X' && gameState.status === 'playing'}
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
        />
      </header>
      
      <GameBoard
        squares={gameState.board}
        onClick={handleSquareClick}
        winningLine={gameState.winnerInfo?.line}
        isLocked={!isMyTurn || gameState.status !== 'playing'}
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
        <main className="w-full max-w-4xl mx-auto flex flex-col md:flex-row items-start gap-6 mt-12">
            <div className="flex-grow w-full max-w-md mx-auto">{mainContent}</div>
            <div className="w-full md:w-80 lg:w-96 flex-shrink-0">
                <ChatBox 
                    messages={gameState.chat}
                    onSendMessage={handleSendMessage}
                    currentPlayerName={playerName}
                />
            </div>
        </main>
      ) : (
         <main className="w-full max-w-md mx-auto flex flex-col items-center mt-12">
            {mainContent}
         </main>
      )}

      <WinnerModal 
        winnerInfo={gameState.winnerInfo} 
        onReset={() => gameMode && resetGame(gameMode)} 
        playerNames={playerNames} 
      />
    </div>
  );
};

export default App;

import React, { useEffect, useState } from 'react';
import { gameService } from '../services/gameService';
import { GameState } from '../types';

interface WaitingRoomProps {
  gameId: string;
  onGameStart: (gameState: GameState) => void;
}

const WaitingRoom: React.FC<WaitingRoomProps> = ({ gameId, onGameStart }) => {
  const [showCopied, setShowCopied] = useState(false);
  const gameUrl = `${window.location.origin}/?gameId=${gameId}`;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(gameUrl)}`;

  useEffect(() => {
    const intervalId = setInterval(() => {
      const game = gameService.getGame(gameId);
      if (game && game.status === 'playing') {
        onGameStart(game);
      }
    }, 1000); // Poll every second

    return () => clearInterval(intervalId);
  }, [gameId, onGameStart]);
  
  const handleCopyLink = () => {
    navigator.clipboard.writeText(gameUrl).then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-md text-center bg-white p-8 rounded-2xl shadow-lg">
        <h1 className="text-3xl font-bold text-slate-700 mb-4">Waiting for Opponent...</h1>
        <p className="text-slate-500 mb-6">Share this link or QR code with a friend to play.</p>
        
        <div className="flex justify-center mb-6">
            <img src={qrCodeUrl} alt="Game QR Code" className="rounded-lg shadow-md" />
        </div>

        <div className="relative mb-6">
            <input 
                type="text" 
                readOnly 
                value={gameUrl} 
                className="w-full bg-slate-100 text-slate-600 px-4 py-2 rounded-lg border border-slate-200 focus:outline-none"
            />
        </div>
        
        <button
          onClick={handleCopyLink}
          className="w-full bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 shadow-lg"
        >
          {showCopied ? 'Link Copied!' : 'Copy Link'}
        </button>
      </div>
    </div>
  );
};

export default WaitingRoom;

import React from 'react';
import { GameMode } from '../types';

interface GameModeSelectionProps {
  onSelectMode: (mode: GameMode) => void;
}

const GameModeSelection: React.FC<GameModeSelectionProps> = ({ onSelectMode }) => {
  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 select-none">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-slate-700 mb-2">Gemini</h1>
        <h2 className="text-6xl font-bold text-teal-500 mb-12">Tic-Tac-Toe</h2>
        <div className="space-y-4 flex flex-col items-center">
          <button
            onClick={() => onSelectMode('online')}
            className="w-64 bg-sky-500 text-white font-bold py-4 px-8 rounded-full hover:bg-sky-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-sky-400 focus:ring-opacity-75 shadow-lg text-lg transform hover:scale-105"
          >
            Play Online
          </button>
           <button
            onClick={() => onSelectMode('ai')}
            className="w-64 bg-teal-500 text-white font-bold py-4 px-8 rounded-full hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 shadow-lg text-lg transform hover:scale-105"
          >
            Play against AI
          </button>
          <button
            onClick={() => onSelectMode('local')}
            className="w-64 bg-slate-600 text-white font-bold py-4 px-8 rounded-full hover:bg-slate-700 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-slate-500 focus:ring-opacity-75 shadow-lg text-lg transform hover:scale-105"
          >
            Play with a Friend
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameModeSelection;

import React from 'react';
import { SquareValue } from '../types';
import { XIcon, OIcon } from './Icons';

interface GameBoardProps {
  squares: SquareValue[];
  onClick: (i: number) => void;
  winningLine: number[] | null;
  isLocked?: boolean;
}

const GameBoard: React.FC<GameBoardProps> = ({ squares, onClick, winningLine, isLocked }) => {
  const renderSquare = (i: number) => {
    const isWinningSquare = winningLine?.includes(i);
    const cursorClass = isLocked || squares[i] ? 'cursor-not-allowed' : 'cursor-pointer';

    return (
      <button
        key={i}
        onClick={() => !isLocked && onClick(i)}
        disabled={isLocked || !!squares[i]}
        className={`w-full h-full bg-slate-50 flex items-center justify-center rounded-lg transition-transform duration-200 ease-in-out transform hover:scale-105 active:scale-95 shadow-sm ${cursorClass}
          ${isWinningSquare ? 'bg-amber-200' : 'bg-white'}`}
        aria-label={`Square ${i + 1}: ${squares[i] || 'empty'}`}
      >
        {squares[i] === 'X' && <XIcon className={`w-3/4 h-3/4 ${isWinningSquare ? 'text-white' : 'text-sky-500'}`} />}
        {squares[i] === 'O' && <OIcon className={`w-3/4 h-3/4 ${isWinningSquare ? 'text-white' : 'text-rose-500'}`} />}
      </button>
    );
  };

  return (
    <div className="w-full max-w-sm aspect-square p-2 sm:p-3 grid grid-cols-3 grid-rows-3 gap-2 sm:gap-3 bg-slate-300 rounded-2xl shadow-lg">
      {squares.map((_, i) => renderSquare(i))}
    </div>
  );
};

export default GameBoard;
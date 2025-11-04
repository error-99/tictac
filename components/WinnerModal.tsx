import React from 'react';
import { WinnerInfo, Player } from '../types';
import { PlayerOneAvatar, PlayerTwoAvatar } from './Icons';

interface WinnerModalProps {
  isVisible: boolean;
  winnerInfo: WinnerInfo | null;
  onReset: () => void;
  playerNames: { [key in Player | string]: string };
}

const WinnerModal: React.FC<WinnerModalProps> = ({ isVisible, winnerInfo, onReset, playerNames }) => {
  if (!isVisible || !winnerInfo) return null;

  const { winner } = winnerInfo;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50 transition-opacity duration-300">
      <div className="bg-white rounded-2xl p-8 text-center shadow-2xl transform scale-95 transition-all duration-300 animate-fade-in-up w-full max-w-sm mx-4">
        {winner === 'Draw' ? (
          <h2 className="text-3xl font-bold text-slate-700 mb-4">It's a Draw!</h2>
        ) : (
          <>
            <h2 className="text-3xl font-bold text-slate-700 mb-4">
                Winner!
            </h2>
            <div className="flex justify-center mb-4">
              {winner === 'X' ? <PlayerOneAvatar size="large" /> : <PlayerTwoAvatar size="large" />}
            </div>
            <p className="text-xl text-slate-500">
              {playerNames[winner as Player]} takes the round!
            </p>
          </>
        )}
        <button
          onClick={onReset}
          className="mt-8 bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 shadow-lg"
        >
          Play Again
        </button>
      </div>
      <style>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(20px) scale(0.95);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default WinnerModal;
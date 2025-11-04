import React from 'react';

interface PlayerInfoProps {
  name: string;
  avatar: React.ReactNode;
  isActive: boolean;
  isRightAligned?: boolean;
  isThinking?: boolean;
  isYou?: boolean;
}

const PlayerInfo: React.FC<PlayerInfoProps> = ({ name, avatar, isActive, isRightAligned = false, isThinking = false, isYou = false }) => {
  return (
    <div className={`flex items-center gap-3 ${isRightAligned ? 'flex-row-reverse' : ''}`}>
      <div className="relative w-16 h-16">
        <svg className="absolute top-0 left-0 w-full h-full" viewBox="0 0 48 48">
          <circle
            cx="24"
            cy="24"
            r="22"
            fill="none"
            stroke={isActive ? '#f59e0b' : '#e2e8f0'}
            strokeWidth="4"
            className="transition-all duration-300"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center">
            {avatar}
        </div>
        {isThinking && (
          <div className="absolute inset-0 flex items-center justify-center bg-slate-800 bg-opacity-50 rounded-full">
            <svg className="animate-spin h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        )}
      </div>
      <div className={`h-12 ${isRightAligned ? 'text-right' : 'text-left'}`}>
        <p className="font-semibold text-slate-700 truncate max-w-[100px]">{name}</p>
        {isYou && <p className="text-xs text-teal-500 font-medium">You</p>}
      </div>
    </div>
  );
};

export default PlayerInfo;
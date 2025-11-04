import React, { useState } from 'react';

interface OnlineLobbyProps {
  onCreate: (name: string) => void;
  onJoin: (name: string) => void;
  isJoining: boolean;
}

const OnlineLobby: React.FC<OnlineLobbyProps> = ({ onCreate, onJoin, isJoining }) => {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      if (isJoining) {
        onJoin(name.trim());
      } else {
        onCreate(name.trim());
      }
    }
  };

  return (
    <div className="bg-slate-50 text-slate-800 min-h-screen flex flex-col items-center justify-center p-4 select-none">
      <div className="w-full max-w-sm text-center">
        <h1 className="text-4xl font-bold text-slate-700 mb-8">
          {isJoining ? 'Join Game' : 'Online Game'}
        </h1>
        <form onSubmit={handleSubmit} className="bg-white p-8 rounded-2xl shadow-lg">
          <label htmlFor="name" className="text-left block font-medium text-slate-600 mb-2">
            Enter your name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-400"
            placeholder="Your Name"
            maxLength={15}
            required
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full mt-6 bg-teal-500 text-white font-bold py-3 px-8 rounded-full hover:bg-teal-600 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-teal-400 focus:ring-opacity-75 shadow-lg text-lg disabled:bg-slate-400 disabled:cursor-not-allowed"
          >
            {isJoining ? 'Join Game' : 'Create Game'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default OnlineLobby;

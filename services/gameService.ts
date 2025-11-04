import { GameState, SquareValue, Player, WinnerInfo, ChatMessage, VoiceMessage } from '../types';

/**
 * NOTE: This is a placeholder service using localStorage to simulate a backend.
 * In a real-world application, this would be replaced with a proper backend
 * service using a real-time database like Firebase or a WebSocket server.
 */

// Helper to check for localStorage availability safely.
const isLocalStorageAvailable = () => {
    try {
        const testKey = '__test_local_storage__';
        localStorage.setItem(testKey, testKey);
        localStorage.removeItem(testKey);
        return true;
    } catch (e) {
        return false;
    }
};

// A wrapper around localStorage to gracefully handle environments where it's disabled.
const storage = {
    setItem: (key: string, value: any) => {
        if (isLocalStorageAvailable()) {
            localStorage.setItem(key, JSON.stringify(value));
        } else {
            console.warn('localStorage is not available. Online game state will not be persisted.');
        }
    },
    getItem: (key: string): any | null => {
        if (isLocalStorageAvailable()) {
            const item = localStorage.getItem(key);
            return item ? JSON.parse(item) : null;
        }
        console.warn('localStorage is not available. Cannot retrieve game state.');
        return null;
    }
};


const gameService = {
  createGame(playerName: string): GameState {
    const gameId = Math.random().toString(36).substr(2, 9);
    const gameState: GameState = {
      gameId,
      board: Array(9).fill(null),
      players: [{ name: playerName, symbol: 'X' }, null],
      currentPlayer: 'X',
      status: 'waiting',
      winnerInfo: null,
      chat: [],
      voiceMessages: [],
    };
    storage.setItem(gameId, gameState);
    return gameState;
  },

  getGame(gameId: string): GameState | null {
    return storage.getItem(gameId);
  },

  joinGame(gameId: string, playerName: string): GameState {
    const game = this.getGame(gameId);
    if (!game) {
      throw new Error('Game not found.');
    }
    if (game.status !== 'waiting') {
      throw new Error('Game has already started.');
    }
    game.players[1] = { name: playerName, symbol: 'O' };
    game.status = 'playing';
    storage.setItem(gameId, game);
    return game;
  },

  updateGame(gameId: string, board: SquareValue[], currentPlayer: Player, winnerInfo: WinnerInfo | null): GameState {
    const game = this.getGame(gameId);
    if (!game) {
        throw new Error('Game not found.');
    }
    game.board = board;
    game.currentPlayer = currentPlayer;
    game.winnerInfo = winnerInfo;
    if (winnerInfo) {
        game.status = 'finished';
    }
    storage.setItem(gameId, game);
    return game;
  },

  resetGame(gameId: string): GameState {
    const game = this.getGame(gameId);
    if (!game) {
        throw new Error('Game not found.');
    }
    game.board = Array(9).fill(null);
    game.currentPlayer = 'X';
    game.status = 'playing';
    game.winnerInfo = null;
    storage.setItem(gameId, game);
    return game;
  },
  
  sendMessage(gameId: string, senderName: string, text: string): GameState {
    const game = this.getGame(gameId);
    if (!game) {
        throw new Error('Game not found.');
    }
    const newMessage: ChatMessage = {
        senderName,
        text,
        timestamp: Date.now(),
    };
    game.chat.push(newMessage);
    storage.setItem(gameId, game);
    return game;
  },

  sendVoiceMessage(gameId: string, senderName: string, audioBase64: string): GameState {
    const game = this.getGame(gameId);
    if (!game) {
        throw new Error('Game not found.');
    }
    const newVoiceMessage: VoiceMessage = {
        senderName,
        audioBase64,
        timestamp: Date.now(),
    };
    game.voiceMessages.push(newVoiceMessage);
    storage.setItem(gameId, game);
    return game;
  }
};

export { gameService };
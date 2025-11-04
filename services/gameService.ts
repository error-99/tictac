import { GameState, SquareValue, Player, WinnerInfo, ChatMessage } from '../types';

/**
 * NOTE: This is a placeholder service using localStorage to simulate a backend.
 * In a real-world application, this would be replaced with a proper backend
 * service using a real-time database like Firebase or a WebSocket server.
 */
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
    };
    localStorage.setItem(gameId, JSON.stringify(gameState));
    return gameState;
  },

  getGame(gameId: string): GameState | null {
    const gameString = localStorage.getItem(gameId);
    return gameString ? JSON.parse(gameString) : null;
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
    localStorage.setItem(gameId, JSON.stringify(game));
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
    localStorage.setItem(gameId, JSON.stringify(game));
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
    localStorage.setItem(gameId, JSON.stringify(game));
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
    localStorage.setItem(gameId, JSON.stringify(game));
    return game;
  }
};

export { gameService };

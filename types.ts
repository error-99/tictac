export type Player = 'X' | 'O';
export type SquareValue = Player | null;
export type GameMode = 'local' | 'ai' | 'online' | null;
export type OnlineGamePhase = 'lobby' | 'waiting' | 'playing';

export interface WinnerInfo {
  winner: Player | 'Draw';
  line: number[] | null;
}

export interface PlayerInfo {
    name: string;
    symbol: Player;
}

export interface ChatMessage {
    senderName: string;
    text: string;
    timestamp: number;
}

export interface VoiceMessage {
    senderName: string;
    audioBase64: string;
    timestamp: number;
}

export interface GameState {
    gameId: string;
    board: SquareValue[];
    players: [PlayerInfo, PlayerInfo | null];
    currentPlayer: Player;
    status: 'waiting' | 'playing' | 'finished';
    winnerInfo: WinnerInfo | null;
    chat: ChatMessage[];
    voiceMessages: VoiceMessage[];
}
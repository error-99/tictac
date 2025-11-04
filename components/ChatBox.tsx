import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';
import { XMarkIcon, MicrophoneIcon, RecordingIcon } from './Icons';

interface ChatBoxProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    currentPlayerName: string;
    onClose?: () => void;
    onStartRecording: () => void;
    onStopRecording: () => void;
    isRecording: boolean;
}

const EMOJIS = ['😊', '😂', '👍', '🤔', '🎉', '😢'];

const ChatBox: React.FC<ChatBoxProps> = ({ 
    messages, 
    onSendMessage, 
    currentPlayerName, 
    onClose,
    onStartRecording,
    onStopRecording,
    isRecording
}) => {
    const [message, setMessage] = useState('');
    const [showEmojis, setShowEmojis] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }

    useEffect(scrollToBottom, [messages]);

    const handleSendMessage = (e: React.FormEvent) => {
        e.preventDefault();
        if (message.trim()) {
            onSendMessage(message.trim());
            setMessage('');
        }
    };
    
    const handleEmojiClick = (emoji: string) => {
        onSendMessage(emoji);
        setShowEmojis(false);
    };

    const handleMicPress = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        onStartRecording();
    };
    
    const handleMicRelease = (e: React.MouseEvent | React.TouchEvent) => {
        e.preventDefault();
        onStopRecording();
    };

    return (
        <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col max-h-[calc(100vh-10rem)] md:max-h-full">
            <div className="p-4 border-b border-slate-200 relative">
                <h3 className="font-bold text-slate-700 text-center">Game Chat</h3>
                {onClose && (
                    <button onClick={onClose} className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-500 hover:text-slate-700">
                        <XMarkIcon />
                    </button>
                )}
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.senderName === currentPlayerName ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-[80%] ${msg.senderName === currentPlayerName ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                           <p className="text-sm break-words">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 relative">
                 {showEmojis && (
                    <div className="absolute bottom-20 left-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 flex gap-2 animate-fade-in-up-short">
                        {EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="p-2 rounded-full hover:bg-slate-200 transition-colors flex-shrink-0">
                        <span className="text-xl">😊</span>
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Say something..."
                        className="flex-grow px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                        maxLength={100}
                    />
                    <button
                        type="button"
                        onMouseDown={handleMicPress}
                        onMouseUp={handleMicRelease}
                        onTouchStart={handleMicPress}
                        onTouchEnd={handleMicRelease}
                        className={`flex-shrink-0 p-2 rounded-full transition-all duration-200 ${isRecording ? 'bg-rose-500 text-white scale-110' : 'bg-slate-200 text-slate-600 hover:bg-slate-300'}`}
                        aria-label={isRecording ? 'Recording voice message' : 'Record voice message'}
                    >
                        {isRecording ? <RecordingIcon /> : <MicrophoneIcon />}
                    </button>
                    <button type="submit" className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition-colors disabled:bg-slate-400 flex-shrink-0" disabled={!message.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.53l4.949-1.414a.75.75 0 0 0-.531-.95L3.105 2.289Z" />
                          <path d="M3.105 2.289a.75.75 0 0 0-.95.826l1.414 4.949a.75.75 0 0 0 .53.95l4.949-1.414a.75.75 0 0 0-.95-.531L3.105 2.289Z" transform="translate(8.385 8.385)" />
                        </svg>
                    </button>
                </form>
            </div>
             <style>{`
                @keyframes fade-in-up-short {
                  from { opacity: 0; transform: translateY(10px); }
                  to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up-short { animation: fade-in-up-short 0.2s ease-out; }
             `}</style>
        </div>
    );
};

export default ChatBox;

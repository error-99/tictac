import React, { useState, useRef, useEffect } from 'react';
import { ChatMessage } from '../types';

interface ChatBoxProps {
    messages: ChatMessage[];
    onSendMessage: (message: string) => void;
    currentPlayerName: string;
}

const EMOJIS = ['😊', '😂', '👍', '🤔', '🎉', '😢'];

const ChatBox: React.FC<ChatBoxProps> = ({ messages, onSendMessage, currentPlayerName }) => {
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

    return (
        <div className="bg-white rounded-2xl shadow-lg h-full flex flex-col max-h-[calc(100vh-10rem)]">
            <div className="p-4 border-b border-slate-200">
                <h3 className="font-bold text-slate-700 text-center">Game Chat</h3>
            </div>
            <div className="flex-grow p-4 overflow-y-auto">
                {messages.map((msg, index) => (
                    <div key={index} className={`flex mb-3 ${msg.senderName === currentPlayerName ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg max-w-[80%] ${msg.senderName === currentPlayerName ? 'bg-teal-500 text-white' : 'bg-slate-200 text-slate-800'}`}>
                           <p className="text-sm">{msg.text}</p>
                        </div>
                    </div>
                ))}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-4 border-t border-slate-200 relative">
                 {showEmojis && (
                    <div className="absolute bottom-16 left-4 bg-white p-2 rounded-lg shadow-md border border-slate-200 flex gap-2">
                        {EMOJIS.map(emoji => (
                            <button key={emoji} onClick={() => handleEmojiClick(emoji)} className="text-2xl hover:scale-125 transition-transform">{emoji}</button>
                        ))}
                    </div>
                )}
                <form onSubmit={handleSendMessage} className="flex items-center gap-2">
                    <button type="button" onClick={() => setShowEmojis(!showEmojis)} className="p-2 rounded-full hover:bg-slate-200 transition-colors">
                        😊
                    </button>
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Say something..."
                        className="flex-grow px-4 py-2 border border-slate-300 rounded-full focus:outline-none focus:ring-2 focus:ring-teal-400"
                        maxLength={100}
                    />
                    <button type="submit" className="bg-teal-500 text-white rounded-full p-2 hover:bg-teal-600 transition-colors disabled:bg-slate-400" disabled={!message.trim()}>
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
                          <path d="M3.105 2.289a.75.75 0 0 0-.826.95l1.414 4.949a.75.75 0 0 0 .95.53l4.949-1.414a.75.75 0 0 0-.531-.95L3.105 2.289Z" />
                          <path d="M3.105 2.289a.75.75 0 0 0-.95.826l1.414 4.949a.75.75 0 0 0 .53.95l4.949-1.414a.75.75 0 0 0-.95-.531L3.105 2.289Z" transform="translate(8.385 8.385)" />
                        </svg>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ChatBox;


import React from 'react';

interface IconProps {
  className?: string;
}

export const XIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 10 L90 90 M90 10 L10 90" stroke="currentColor" strokeWidth="12" strokeLinecap="round"/>
  </svg>
);

export const OIcon: React.FC<IconProps> = ({ className }) => (
  <svg className={className} viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="50" cy="50" r="40" stroke="currentColor" strokeWidth="12"/>
  </svg>
);

interface AvatarProps {
  size?: 'small' | 'large';
}

export const PlayerOneAvatar: React.FC<AvatarProps> = ({ size = 'small' }) => {
    const dimensions = size === 'small' ? 'w-12 h-12' : 'w-24 h-24';
    return (
        <div className={`rounded-full bg-slate-800 flex items-center justify-center ${dimensions}`}>
            <svg width="75%" height="75%" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="38" cy="38" r="38" fill="#58C898"/>
                <path d="M76 38C76 58.9868 58.9868 76 38 76C17.0132 76 0 58.9868 0 38C0 26.6534 5.30826 16.5164 13.6823 9.87652C16.8153 17.599 23.606 31.0664 38 31.0664C52.394 31.0664 59.1847 17.599 62.3177 9.87652C70.6917 16.5164 76 26.6534 76 38Z" fill="#F4B400"/>
                <circle cx="38" cy="41.3478" r="16.3478" fill="#F8FAFC"/>
                <circle cx="38" cy="41.3478" r="7.43478" fill="#202124"/>
            </svg>
        </div>
    );
};
  
export const PlayerTwoAvatar: React.FC<AvatarProps> = ({ size = 'small' }) => {
    const dimensions = size === 'small' ? 'w-12 h-12' : 'w-24 h-24';
    return (
        <div className={`rounded-full bg-slate-800 flex items-center justify-center ${dimensions}`}>
            <svg width="75%" height="75%" viewBox="0 0 76 76" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="38" cy="38" r="38" fill="#F4B400"/>
                <path d="M54.1087 54.1087C63.6822 44.5352 63.6822 29.4648 54.1087 19.8913C44.5352 10.3178 29.4648 10.3178 19.8913 19.8913C12.3338 27.4488 11.2346 38.6499 16.2974 47.0177L0 63.3151L12.6849 76L28.9823 60.7026C37.3501 65.7654 48.5512 64.6662 54.1087 54.1087Z" fill="#4285F4"/>
                <path d="M38 10.3178C30.5652 10.3178 24.3478 16.5352 24.3478 23.9699C24.3478 31.4046 30.5652 37.622 38 37.622C45.4348 37.622 51.6522 31.4046 51.6522 23.9699C51.6522 16.5352 45.4348 10.3178 38 10.3178Z" fill="#F8FAFC"/>
                <circle cx="38" cy="23.9699" r="4.95652" fill="#202124"/>
                <path d="M12.6849 55.803L0 43.1181L10.3178 32.8003L22.999 45.4852L12.6849 55.803Z" fill="#F8FAFC"/>
                <path d="M19.8913 63.3151C17.413 60.8368 15.2283 58.0652 13.5217 55.0652L20.7304 47.8565L28.9823 56.1084L21.7736 63.3171C21.1478 63.3171 20.5217 63.3151 19.8913 63.3151Z" fill="#EA4335"/>
            </svg>
        </div>
    );
};

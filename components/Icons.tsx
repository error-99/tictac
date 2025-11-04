
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

export const SoundOnIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 0 1 0 12.728M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>  
);

export const SoundOffIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75 19.5 12m0 0 2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6.375a9 9 0 0 1 12.728 0M16.463 8.288a5.25 5.25 0 0 1 0 7.424M6.75 8.25l4.72-4.72a.75.75 0 0 1 1.28.53v15.88a.75.75 0 0 1-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 0 1 2.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75Z" />
    </svg>  
);

export const ChatIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
    </svg>
);

export const XMarkIcon: React.FC<IconProps> = ({ className = "w-6 h-6" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
    </svg>
);

export const MicrophoneIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
      <path d="M7 4a3 3 0 0 1 6 0v6a3 3 0 1 1-6 0V4Z" />
      <path d="M5.5 8.5a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V9a.5.5 0 0 1 .5-.5Z" />
      <path d="M10 12a4 4 0 0 0 4-4V4a4 4 0 1 0-8 0v4a4 4 0 0 0 4 4Z" />
      <path d="M11.5 8.5a.5.5 0 0 1 .5.5v1.5a.5.5 0 0 1-1 0V9a.5.5 0 0 1 .5-.5Z" />
      <path d="M10 18a.5.5 0 0 0 1 0v-1.11a4.52 4.52 0 0 0 3.09-2.613.5.5 0 0 0-.858-.512A3.52 3.52 0 0 1 10 15a3.52 3.52 0 0 1-3.232-2.235.5.5 0 0 0-.858.512A4.52 4.52 0 0 0 9 16.89V18a.5.5 0 0 0 1 0Z" />
    </svg>
);

export const RecordingIcon: React.FC<IconProps> = ({ className = "w-5 h-5" }) => (
    <svg className={className} viewBox="0 0 20 20" fill="currentColor">
      <circle cx="10" cy="10" r="6" className="animate-pulse" />
    </svg>
);

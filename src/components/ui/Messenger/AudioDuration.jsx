import { useEffect, useRef, useState } from 'react';

const AudioDuration = ({ src }) => {
  const [duration, setDuration] = useState(null);
  const audioRef = useRef(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    const handleLoadedMetadata = () => {
      if (!isNaN(audio.duration) && audio.duration !== Infinity) {
        setDuration(audio.duration);
      } else {
        console.warn('Duration is still invalid:', audio.duration);
      }
    };

    const handleError = (e) => {
      console.error('Audio metadata load failed:', e);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('error', handleError);

    audio.load(); // Force reload metadata

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('error', handleError);
    };
  }, [src]);

  const formatDuration = (seconds) => {
    if (!seconds || isNaN(seconds)) return '...';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  return (
    <>
      <audio
        ref={audioRef}
        src={src}
        preload="metadata"
        hidden
        crossOrigin="anonymous"
      />
      <span style={{ fontSize: '4rem' }}>
        {duration ? formatDuration(duration) : 'Loading...'}
      </span>
    </>
  );
};

export default AudioDuration;

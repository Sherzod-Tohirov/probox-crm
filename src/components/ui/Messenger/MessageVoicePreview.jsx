import { useRef, useState, useEffect } from 'react';
import styles from './styles/audio.module.scss';

export default function MessageVoicePreview({ file, onDelete }) {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [audioUrl, setAudioUrl] = useState(null);

  useEffect(() => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setAudioUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [file]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => {
      if (audio.duration === Infinity) {
        // Try to force duration calculation
        audio.currentTime = 1e101;
        audio.ontimeupdate = () => {
          audio.ontimeupdate = null;
          audio.currentTime = 0;
          setDuration(audio.duration);
        };
      } else {
        setDuration(audio.duration);
      }
    };
    audio.addEventListener('loadedmetadata', onLoaded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
    };
  }, [audioUrl]);
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onLoaded = () => setDuration(audio.duration);
    const onTimeUpdate = () => setCurrentTime(audio.currentTime);
    const onEnded = () => setIsPlaying(false);

    audio.addEventListener('loadedmetadata', onLoaded);
    audio.addEventListener('timeupdate', onTimeUpdate);
    audio.addEventListener('ended', onEnded);

    return () => {
      audio.removeEventListener('loadedmetadata', onLoaded);
      audio.removeEventListener('timeupdate', onTimeUpdate);
      audio.removeEventListener('ended', onEnded);
    };
  }, []);

  const percentPlayed = duration ? (currentTime / duration) * 100 : 0;

  return (
    <div className={styles.audioPreview}>
      {audioUrl && (
        <audio
          className={styles['audio-player']}
          controls
          ref={audioRef}
          src={audioUrl}
          preload="metadata"
        />
      )}

      <div className={styles.progressBar}>
        <div
          className={styles.progress}
          style={{ width: `${percentPlayed}%` }}
        />
      </div>
    </div>
  );
}

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from './styles/audioPlayer.module.scss';
import { Play, Pause } from 'lucide-react'; // Optional: for nice icons
import classNames from 'classnames';

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const AudioPlayer = ({ src, externalDuration, color = {}, className = '' }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(externalDuration || 0);
  const [currentTime, setCurrentTime] = useState(0);
  useEffect(() => {
    if (!waveformRef.current) return;

    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);

    wavesurfer.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: color.text || '#666',
      backend: 'MediaElement',
      progressColor: '#666',
      cursorColor: color.text || '#666',
      barWidth: 1,
      barRadius: 2,
      height: 40,
      responsive: true,
    });

    wavesurfer.current.load(src);

    wavesurfer.current.on('ready', () => {
      setIsLoading(false);
      if (!externalDuration) {
        setDuration(wavesurfer.current.getDuration());
      }
    });

    wavesurfer.current.on('error', () => {
      setHasError(true);
      setIsLoading(false);
    });

    wavesurfer.current.on('audioprocess', () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on('seek', () => {
      setCurrentTime(wavesurfer.current.getCurrentTime());
    });

    wavesurfer.current.on('finish', () => {
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      if (wavesurfer.current) {
        wavesurfer.current.destroy();
        wavesurfer.current = null;
      }
    };
  }, [src, externalDuration, color.text]);

  const togglePlay = () => {
    if (!wavesurfer.current || isLoading || hasError) return;
    wavesurfer.current.playPause();
    setIsPlaying(wavesurfer.current.isPlaying());
  };

  return (
    <div
      className={classNames(styles.audioPlayer, styles[className])}
      style={{ color: color.text, backgroundColor: color.bg }}
    >
      <button
        onClick={togglePlay}
        className={classNames(styles.playButton, {
          [styles.disabled]: isLoading || hasError,
        })}
        disabled={isLoading || hasError}
        type="button"
      >
        {isLoading ? (
          <span className={styles.loader} />
        ) : isPlaying ? (
          <Pause color="#666" size={18} />
        ) : (
          <Play color="#666" size={18} />
        )}
      </button>
      <div className={styles.waveformWrapper}>
        <div ref={waveformRef} className={styles.waveform} />
      </div>
      <div className={styles.timer}>
        {hasError
          ? 'Xatolik'
          : isLoading
            ? 'Yuklanmoqda...'
            : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </div>
    </div>
  );
};

export default AudioPlayer;

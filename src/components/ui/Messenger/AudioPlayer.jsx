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
  const activeLoadId = useRef(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [duration, setDuration] = useState(externalDuration || 0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current || !src) {
      setIsLoading(false);
      setHasError(true);
      return;
    }

    const loadId = ++activeLoadId.current;
    let isDisposed = false;

    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    setCurrentTime(0);
    setDuration(externalDuration || 0);

    const ws = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: color.text || '#666',
      progressColor: '#666',
      cursorColor: color.text || '#666',
      barWidth: 1,
      barRadius: 2,
      height: 40,
      responsive: true,
    });
    wavesurfer.current = ws;

    ws.load(src);

    ws.on('ready', () => {
      if (isDisposed || activeLoadId.current !== loadId) return;
      setIsLoading(false);
      if (!externalDuration) {
        setDuration(ws.getDuration());
      }
    });

    ws.on('error', (error) => {
      if (isDisposed || activeLoadId.current !== loadId) return;
      const errorText = String(error?.message || error || '').toLowerCase();
      if (
        errorText.includes('abort') ||
        errorText.includes('aborted') ||
        errorText.includes('interrupted')
      ) {
        return;
      }
      setHasError(true);
      setIsLoading(false);
    });

    ws.on('audioprocess', () => {
      if (isDisposed || activeLoadId.current !== loadId) return;
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('seek', () => {
      if (isDisposed || activeLoadId.current !== loadId) return;
      setCurrentTime(ws.getCurrentTime());
    });

    ws.on('finish', () => {
      if (isDisposed || activeLoadId.current !== loadId) return;
      setIsPlaying(false);
      setCurrentTime(0);
    });

    return () => {
      isDisposed = true;
      if (ws) {
        ws.destroy();
      }
      if (wavesurfer.current === ws) {
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
        <div
          ref={waveformRef}
          className={classNames(styles.waveform, { [styles.hidden]: hasError })}
        />
        {hasError && <span className={styles.errorText}>Yuklab bo'lmadi</span>}
      </div>
      <div className={styles.timer}>
        {isLoading
          ? 'Yuklanmoqda...'
          : `${formatTime(currentTime)} / ${formatTime(duration)}`}
      </div>
    </div>
  );
};

export default AudioPlayer;

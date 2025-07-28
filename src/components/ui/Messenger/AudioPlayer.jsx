import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';
import styles from './styles/audioPlayer.module.scss';
import { Play, Pause } from 'lucide-react'; // Optional: for nice icons

const formatTime = (seconds) => {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s < 10 ? '0' : ''}${s}`;
};

const AudioPlayer = ({ src, externalDuration, color = {} }) => {
  const waveformRef = useRef(null);
  const wavesurfer = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(externalDuration || 0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    if (!waveformRef.current) return;

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
      if (!externalDuration) {
        setDuration(wavesurfer.current.getDuration());
      }
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
      wavesurfer.current.destroy();
    };
  }, [src]);

  const togglePlay = () => {
    if (!wavesurfer.current) return;
    wavesurfer.current.playPause();
    setIsPlaying(wavesurfer.current.isPlaying());
  };

  return (
    <div
      className={styles.audioPlayer}
      style={{ color: color.text, backgroundColor: color.bg }}
    >
      <button onClick={togglePlay} className={styles.playButton}>
        {isPlaying ? (
          <Pause color={'#666'} size={18} />
        ) : (
          <Play color={'#666'} size={18} />
        )}
      </button>
      <div className={styles.waveformWrapper}>
        <div ref={waveformRef} className={styles.waveform} />
      </div>
      <div className={styles.timer}>
        {formatTime(currentTime)} / {formatTime(duration)}
      </div>
    </div>
  );
};

export default AudioPlayer;

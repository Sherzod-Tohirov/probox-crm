import { useRef, useState, useEffect } from 'react';
import styles from './styles/audio.module.scss';

const MessageVoicePreview = ({ audioBlob }) => {
  const audioRef = useRef(null);
  const canvasRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [duration, setDuration] = useState(0);
  const [hoverX, setHoverX] = useState(null);
  const [waveform, setWaveform] = useState([]);

  // Generate waveform data from audioBlob
  useEffect(() => {
    if (!audioBlob) return;
    const fileReader = new FileReader();
    fileReader.onload = function () {
      const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtx.decodeAudioData(fileReader.result, (buffer) => {
        const rawData = buffer.getChannelData(0);
        const samples = 80; // Number of bars
        const blockSize = Math.floor(rawData.length / samples);
        const waveformData = [];
        for (let i = 0; i < samples; i++) {
          let sum = 0;
          for (let j = 0; j < blockSize; j++) {
            sum += Math.abs(rawData[i * blockSize + j]);
          }
          waveformData.push(sum / blockSize);
        }
        setWaveform(waveformData);
      });
    };
    fileReader.readAsArrayBuffer(audioBlob);
  }, [audioBlob]);

  // Draw waveform
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || waveform.length === 0) return;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const width = canvas.width;
    const height = canvas.height;
    const barWidth = width / waveform.length;
    waveform.forEach((value, i) => {
      // Highlight played part
      if (progress / duration >= i / waveform.length) {
        ctx.fillStyle = '#007bff';
      } else {
        ctx.fillStyle = '#e0e0e0';
      }
      // Hover effect
      if (hoverX !== null && Math.abs(hoverX - i) < 1) {
        ctx.fillStyle = '#b3d7ff';
      }
      const barHeight = value * height;
      ctx.fillRect(i * barWidth, height - barHeight, barWidth - 1, barHeight);
    });
  }, [waveform, progress, duration, hoverX]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    const updateProgress = () => setProgress(audio.currentTime);
    const setAudioDuration = () => setDuration(audio.duration);
    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('loadedmetadata', setAudioDuration);
    audio.addEventListener('ended', () => setIsPlaying(false));
    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('loadedmetadata', setAudioDuration);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, []);

  const togglePlayback = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  // Seek audio on waveform click
  const handleCanvasClick = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const percent = x / rect.width;
    const seekTime = percent * duration;
    audioRef.current.currentTime = seekTime;
    setProgress(seekTime);
  };

  // Show hover effect on waveform
  const handleCanvasMouseMove = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const bar = Math.floor((x / rect.width) * waveform.length);
    setHoverX(bar);
  };
  const handleCanvasMouseLeave = () => setHoverX(null);

  return (
    <div className={styles['audio-preview']}>
      <audio
        ref={audioRef}
        src={URL.createObjectURL(audioBlob)}
        preload="metadata"
        style={{ display: 'none' }}
      />
      <div className={styles['audio-controls']}>
        <button
          className={styles['play-button']}
          onClick={togglePlayback}
          style={{
            width: 40,
            height: 40,
            borderRadius: '50%',
            background: isPlaying ? '#007bff' : '#fff',
            color: isPlaying ? '#fff' : '#007bff',
            border: '2px solid #007bff',
            fontSize: 22,
            cursor: 'pointer',
            boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
            transition: 'background 0.2s, color 0.2s',
          }}
        >
          {isPlaying ? '⏸' : '▶'}
        </button>
        <div className={styles['progress-bar']} style={{ marginLeft: 16 }}>
          <canvas
            ref={canvasRef}
            width={220}
            height={36}
            style={{
              width: 220,
              height: 36,
              cursor: 'pointer',
              borderRadius: 8,
              background: '#f7f7f7',
              boxShadow: '0 1px 4px rgba(0,0,0,0.04)',
              display: 'block',
            }}
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
            onMouseLeave={handleCanvasMouseLeave}
          />
        </div>
      </div>
    </div>
  );
};

export default MessageVoicePreview;

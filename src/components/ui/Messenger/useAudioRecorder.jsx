import { set } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';

const useAudioRecorder = ({
  sampleRate = 44100,
  echoCancellation = false,
  noiseSuppression = false,
} = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [intervalId, setIntervalId] = useState(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const startRecording = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate,
          echoCancellation,
          noiseSuppression,
        },
      });
      streamRef.current = stream;

      const mimeType = 'audio/webm;codecs=opus';
      if (!MediaRecorder.isTypeSupported(mimeType)) {
        console.error('Mime type audio/webm;codecs=opus not supported');
        throw new Error('Unsupported mime type');
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });

      const newIntervalId = setInterval(() => {
        setRecordingTime((prev) => prev + 1);
      }, 1000);
      setIntervalId(newIntervalId);

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        stream.getTracks().forEach((track) => track.stop());
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
    }
  }, [sampleRate, echoCancellation, noiseSuppression]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setRecordingTime(0);
      if (intervalId) clearInterval(intervalId);
      setIntervalId(null);
    }
  }, []);

  const togglePausePlay = useCallback(() => {
    if (!mediaRecorderRef.current) {
      console.warn('No audio available to play');
      return false;
    }

    if (mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.pause();
      setIsPaused(true);
      if (intervalId) clearInterval(intervalId);
    }

    if (mediaRecorderRef.current.state === 'paused') {
      mediaRecorderRef.current.resume();
      setIsPaused(false);
      const newIntervalId = setInterval(() => {
        setRecordingTime((prev) => (prev += 1));
      }, 1000);
      setIntervalId(newIntervalId);
    }
  }, [mediaRecorderRef.current]);

  useEffect(() => {
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
      if (audioPlayerRef.current) {
        audioPlayerRef.current.pause();
        URL.revokeObjectURL(audioPlayerRef.current.src);
        audioPlayerRef.current = null;
      }
    };
  }, []);

  return {
    isRecording,
    audioBlob,
    startRecording,
    stopRecording,
    togglePausePlay,
    isPlaying,
    recordingTime,
    isPaused,
  };
};

export default useAudioRecorder;

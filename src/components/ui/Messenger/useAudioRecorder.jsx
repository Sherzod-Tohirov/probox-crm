import { useCallback, useEffect, useRef, useState } from 'react';
import getAccurateDuration from '@utils/getAccurateDuration';

const useAudioRecorder = ({
  sampleRate = 44100,
  echoCancellation = false,
  noiseSuppression = false,
} = {}) => {
  const [isRecording, setIsRecording] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const intervalId = useRef(null);
  const [recordingTime, setRecordingTime] = useState(0);
  const [audioBlob, setAudioBlob] = useState(null);
  const mediaRecorderRef = useRef(null);
  const audioChunksRef = useRef([]);
  const streamRef = useRef(null);
  const audioPlayerRef = useRef(null);
  const startRecording = useCallback(async () => {
    try {
      // Check if the browser supports getUserMedia
      if (!navigator?.mediaDevices?.getUserMedia) {
        // For older browsers - fallback
        const getUserMedia =
          navigator?.getUserMedia ||
          navigator?.webkitGetUserMedia ||
          navigator?.mozGetUserMedia ||
          navigator?.msGetUserMedia;

        if (!getUserMedia) {
          throw new Error('getUserMedia is not supported in this browser');
        }
      }

      // Ensure we're in a secure context (HTTPS or localhost)
      if (!window.isSecureContext) {
        throw new Error(
          'Media devices can only be accessed in secure contexts'
        );
      }

      // Wait for mediaDevices to be ready
      await new Promise((resolve) => setTimeout(resolve, 100));

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
      intervalId.current = newIntervalId;

      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          audioChunksRef.current.push(e.data);
        }
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        setAudioBlob(audioBlob);
        const duration = await getAccurateDuration(audioBlob);
        audioBlob.duration = duration;
        stream.getTracks().forEach((track) => track.stop());
        setRecordingTime(0);
      };

      mediaRecorder.onpause = () => {
        setIsPaused(true);
        if (intervalId.current) clearInterval(intervalId.current);
      };

      mediaRecorder.onresume = () => {
        setIsPaused(false);
        const newIntervalId = setInterval(() => {
          setRecordingTime((prev) => prev + 1);
        }, 1000);
        intervalId.current = newIntervalId;
      };

      mediaRecorder.start(1000);
      mediaRecorderRef.current = mediaRecorder;
      setIsRecording(true);
    } catch (err) {
      console.error('Failed to start recording:', err);
      // Provide more specific error messages
      if (err.name === 'NotAllowedError') {
        throw new Error('Microphone permission denied');
      } else if (err.name === 'NotFoundError') {
        throw new Error('No microphone found');
      } else if (err.name === 'NotReadableError') {
        throw new Error('Microphone is already in use');
      } else {
        throw new Error(`Recording failed: ${err.message}`);
      }
    }
  }, [sampleRate, echoCancellation, noiseSuppression]);

  const stopRecording = useCallback(() => {
    if (
      mediaRecorderRef.current &&
      mediaRecorderRef.current.state !== 'inactive'
    ) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      setIsPaused(false);
      setRecordingTime(0);
      if (intervalId.current) clearInterval(intervalId.current);
      intervalId.current = null;
    }
  }, []);

  const togglePausePlay = useCallback(() => {
    if (!mediaRecorderRef.current) return;

    if (isPaused) {
      mediaRecorderRef.current.resume();
    } else {
      mediaRecorderRef.current.pause();
    }
  }, [isPaused]);

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
    recordingTime,
    isPaused,
  };
};

export default useAudioRecorder;

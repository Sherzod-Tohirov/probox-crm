import { useEffect } from 'react';
import useAudioRecorder from './useAudioRecorder';
import { Button } from '@components/ui';
import styles from './styles/messenger.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
const MessageVoiceRecorder = ({ onRecordingComplete }) => {
  const {
    isRecording,
    audioBlob,
    isPaused,
    recordingTime,
    togglePausePlay,
    startRecording,
    stopRecording,
  } = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
    sampleRate: 44100,
  });

  // when recording is finished
  useEffect(() => {
    if (audioBlob) {
      onRecordingComplete(audioBlob);
    }
  }, [audioBlob]);

  return (
    <div className={styles['voice-recorder-wrapper']}>
      <div className={styles['voice-recorder-controls']}>
        <Button
          iconColor={isRecording ? 'danger' : 'primary'}
          onClick={isRecording ? stopRecording : startRecording}
          variant={'text'}
          icon={isRecording ? 'stopCircleFilled' : 'micFilled'}
        ></Button>
        <AnimatePresence initial={false} exitBeforeEnter>
          {isRecording && (
            <motion.div
              className={styles['voice-recorder-controls']}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
            >
              <Button
                color="primary"
                className={styles['voice-recorder-pause']}
                onClick={togglePausePlay}
                variant={'text'}
                disabled={!isRecording}
              >
                {isPaused ? '▶' : '⏸'}
              </Button>
              <div className={styles['voice-recorder-timer']}>
                ⏱ {recordingTime}s
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default MessageVoiceRecorder;

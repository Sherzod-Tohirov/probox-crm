import { useEffect } from 'react';
import { useAudioRecorder } from 'react-audio-voice-recorder';
import { Button } from '@components/ui';
import styles from './styles/messenger.module.scss';
import { AnimatePresence, motion } from 'framer-motion';
const MessageVoiceRecorder = ({ onRecordingComplete }) => {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
  } = useAudioRecorder({
    noiseSuppression: true,
    echoCancellation: true,
    sampleRate: 44100,
  });

  // when recording is finished
  useEffect(() => {
    if (recordingBlob) {
      onRecordingComplete(recordingBlob);
    }
  }, [recordingBlob]);

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
                onClick={togglePauseResume}
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

import { useForm } from 'react-hook-form';
import { messengerSchema } from '@utils/validationSchemas';
import { yupResolver } from '@hookform/resolvers/yup';
import styles from './styles/messenger.module.scss';
import { Button, Col, Row, Box } from '@components/ui';
import classNames from 'classnames';
import { useCallback, useEffect, useState } from 'react';
import iconsMap from '@utils/iconsMap';
import MessageVoiceRecorder from './MessageVoiceRecorder';
import MessageVoicePreview from './MessageVoicePreview';

const messageInputRenderer = (type, form = {}, formData = {}) => {
  const handleKeyDown = useCallback((e) => {
    if (!isValid) return;
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      form.onSubmit({ msgText: e.target.value });
      form.reset();
    }
  });
  switch (type) {
    case 'image':
      if (!formData.msgPhoto) return;
      return (
        <Box align="center" gap={4} className={styles['file-preview']}>
          {Array.from(formData.msgPhoto).map((file, index) => (
            <img
              className={styles['file-preview-photo']}
              src={URL.createObjectURL(file)}
              key={index}
              alt={file[0]?.name || 'Uploaded file'}
            />
          ))}
        </Box>
      );
    case 'audio':
      if (!formData.audioBlob) return;
      return <MessageVoicePreview audioBlob={formData.audioBlob} />;
    default:
      return (
        <textarea
          className={styles['text-input']}
          onKeyDown={handleKeyDown}
          placeholder="Xabar yozish..."
          {...form.register('msgText')}
        ></textarea>
      );
  }
};

const MessageForm = ({ onSubmit, size = '' }) => {
  const [messageType, setMessageType] = useState('text');
  const [audioBlob, setAudioBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  console.log(isRecording, 'isRecording');
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { isValid },
  } = useForm({
    resolver: yupResolver(messengerSchema),
  });
  const [msgPhoto] = watch(['msgPhoto']);
  console.log(msgPhoto, 'msgPhoto');
  useEffect(() => {
    if (msgPhoto && msgPhoto?.length > 0) {
      setMessageType('image');
    } else if (audioBlob) {
      setMessageType('audio');
    } else {
      setMessageType('text');
    }
  }, [msgPhoto, audioBlob]);

  return (
    <form
      className={classNames(styles['text-input-form'], styles[size])}
      onSubmit={handleSubmit((data) => {
        onSubmit(data);
        reset();
      })}
    >
      {messageInputRenderer(
        messageType,
        { onSubmit, reset, register },
        {
          audioBlob,
          msgPhoto,
        }
      )}
      <Row
        style={{ marginTop: 'auto' }}
        direction="row"
        align="center"
        justify="space-between"
      >
        <Col>
          <Row direction="row" gutter={2} align="center">
            <Col>
              <Box>
                <label className={styles['file-input-label']}>
                  {iconsMap['addCircle']}

                  <input
                    {...register('msgPhoto')}
                    className={styles['file-input']}
                    type="file"
                    accept="image/*"
                  />
                </label>
              </Box>
            </Col>
            <Col>
              <MessageVoiceRecorder
                onRecordingComplete={(blob) => {
                  setAudioBlob(blob);
                  setIsRecording(false);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Button
            className={classNames(styles['send-btn'], {
              [styles['invalid']]: !isValid,
            })}
            style={{ fontWeight: 500 }}
            icon={'send'}
            variant={'text'}
            iconPosition="right"
            iconColor={'primary'}
            color={'primary'}
            type={'submit'}
          >
            Yuborish
          </Button>
        </Col>
      </Row>
    </form>
  );
};

export default MessageForm;

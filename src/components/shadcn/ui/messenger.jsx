import {
  createElement,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Cog,
  CornerDownLeft,
  Loader2,
  Mic,
  Paperclip,
  Pencil,
  PhoneCall,
  Send,
  Trash2,
  X,
} from 'lucide-react';
import moment from 'moment';

import useFetchExecutors from '@hooks/data/useFetchExecutors';
import { cn } from '@/lib/utils';
import {
  ACTION_META,
  OPERATOR_FIELDS,
} from '@/components/ui/Messenger/utils/constants';
import {
  formatChangeValue,
  getCallDirectionMeta,
  toRgba,
  translateFieldLabel,
} from '@/components/ui/Messenger/utils/formatters';
import { API_CLIENT_AUDIOS } from '@utils/apiUtils';
import { Button } from './button';
import { Input } from './input';

const getMessageId = (message) => message?._id ?? message?.id;

const getMessageText = (message) =>
  message?.Comments ??
  message?.message ??
  message?.text ??
  message?.content ??
  '';

const getMessageTimestamp = (message) =>
  message?.created_at ?? message?.createdAt ?? message?.timestamp;

const getSenderCode = (message) =>
  message?.SlpCode ?? message?.senderId ?? message?.sender?.id;

const isSystemMessage = (message) =>
  Boolean(message?.isSystem || message?.C) || Number(message?.SlpCode) === 0;

const parseAudioDuration = (value) => {
  if (value == null || value === '') return null;

  if (typeof value === 'string' && value.includes(':')) {
    const [minutesPart, secondsPart] = value
      .split(':')
      .map((chunk) => Number(chunk));
    if (Number.isFinite(minutesPart) && Number.isFinite(secondsPart)) {
      return Math.max(0, minutesPart * 60 + secondsPart);
    }
  }

  const parsed = Number(value);
  if (!Number.isFinite(parsed) || parsed < 0) return null;
  return parsed;
};

const formatAudioDuration = (seconds) => {
  const safeSeconds =
    Number.isFinite(seconds) && seconds >= 0 ? Math.floor(seconds) : 0;
  const minutes = Math.floor(safeSeconds / 60);
  const secs = safeSeconds % 60;
  return `${minutes}:${String(secs).padStart(2, '0')}`;
};

const resolveMediaSource = (rawSource, baseUrl = '') => {
  const source = String(rawSource || '').trim();
  if (!source) return '';

  if (
    source.startsWith('http://') ||
    source.startsWith('https://') ||
    source.startsWith('blob:') ||
    source.startsWith('data:')
  ) {
    return source;
  }

  if (!baseUrl) return source;

  if (source.startsWith('/')) {
    return `${baseUrl.replace(/\/$/, '')}${source}`;
  }

  return `${baseUrl}${source}`;
};

const getAudioMessageData = (message) => {
  const audio = message?.Audio ?? message?.audio;

  const rawSource =
    typeof audio === 'string'
      ? audio
      : (audio?.src ?? audio?.url ?? audio?.path ?? audio?.file ?? '');

  const source = resolveMediaSource(rawSource, API_CLIENT_AUDIOS);

  const rawDuration =
    audio && typeof audio === 'object'
      ? (audio?.duration ?? audio?.length ?? message?.audioDuration)
      : message?.audioDuration;

  return {
    source,
    duration: parseAudioDuration(rawDuration),
  };
};

const isTextMessage = (message) => {
  const hasAudio = Boolean(getAudioMessageData(message)?.source);
  const hasImage = Boolean(message?.Image || message?.image);
  const text = getMessageText(message);
  return !hasAudio && !hasImage && text !== null && text !== undefined;
};

const formatChangeValueForUi = (field, value, executorsMap) => {
  const fieldKey = String(field || '').toLowerCase();

  if (OPERATOR_FIELDS.has(fieldKey)) {
    const key = String(value ?? '').trim();
    if (!key) return '—';
    return executorsMap.get(key) || key;
  }

  return formatChangeValue(field, value);
};

const getLocalizedCallRecordingLabel = (message) => {
  const accountCode = String(
    message?.pbx?.accountcode ||
      message?.pbx?.direction ||
      message?.direction ||
      ''
  ).toLowerCase();

  if (accountCode === 'outbound') return "Chiquvchi qo'ng'iroq";
  if (accountCode === 'inbound') return "Kiruvchi qo'ng'iroq";

  return "Qo'ng'iroq yozuvi";
};

const getActionHeaderInfo = (message, _messageText) => {
  if (message?.action) {
    const meta = ACTION_META[message.action] || {
      label: message.action,
      color: '#64748b',
      icon: Cog,
    };

    const directionMeta = String(message.action).startsWith('call_')
      ? getCallDirectionMeta(message)
      : null;

    return { ...meta, directionMeta };
  }

  const audioData = getAudioMessageData(message);
  const isSystemAudioMessage =
    isSystemMessage(message) && Boolean(audioData?.source);

  if (isSystemAudioMessage) {
    const directionMeta = getCallDirectionMeta(message);
    const localizedLabel = getLocalizedCallRecordingLabel(message);

    return {
      label: localizedLabel,
      color: '#0ea5e9',
      icon: PhoneCall,
      directionMeta:
        localizedLabel === directionMeta?.label ? null : directionMeta,
    };
  }

  return null;
};

const resolveSenderName = (message, executorsMap, currentUserId) => {
  const directName =
    message?.senderName ?? message?.sender?.name ?? message?.SlpName ?? null;
  if (directName) return directName;

  if (isSystemMessage(message)) return 'Tizim';

  const senderCode = getSenderCode(message);
  if (senderCode == null || senderCode === '') return "Noma'lum";
  if (currentUserId != null && String(senderCode) === String(currentUserId)) {
    return 'Siz';
  }

  return executorsMap.get(String(senderCode)) || `Operator ${senderCode}`;
};

const MessengerAudioPlayer = ({ source, duration, isOwn = false }) => {
  const [resolvedDuration, setResolvedDuration] = useState(() =>
    parseAudioDuration(duration)
  );
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setResolvedDuration(parseAudioDuration(duration));
    setHasError(false);
  }, [source, duration]);

  return (
    <div
      className={cn('w-full max-w-[360px] space-y-[8px]', isOwn && 'ml-auto')}
    >
      <audio
        controls
        preload="metadata"
        src={source}
        className="h-[44px] w-full rounded-[10px]"
        onLoadedMetadata={(event) => {
          const metadataDuration = parseAudioDuration(
            event.currentTarget.duration
          );
          if (metadataDuration == null) return;
          setResolvedDuration((prev) =>
            prev == null ? metadataDuration : prev
          );
        }}
        onError={() => setHasError(true)}
      />

      <div className="flex items-center justify-between text-[11px]">
        <span style={{ color: 'var(--secondary-color)' }}>
          {hasError ? 'Audio yuklanmadi' : 'Audio'}
        </span>
        <span
          className="tabular-nums"
          style={{ color: 'var(--secondary-color)' }}
        >
          {formatAudioDuration(resolvedDuration ?? 0)}
        </span>
      </div>
    </div>
  );
};

const MessengerMessage = ({
  message,
  currentUserId,
  executorsMap,
  replyEnabled,
  onReply,
  onStartEdit,
  onRequestDelete,
  onConfirmDelete,
  onCancelDelete,
  isDeleteConfirmOpen,
  isEditing,
  editingText,
  onEditingTextChange,
  onCancelEdit,
  onSaveEdit,
  isSavingEdit,
  isDeleting,
}) => {
  const senderCode = getSenderCode(message);
  const isOwn =
    senderCode != null && currentUserId != null
      ? String(senderCode) === String(currentUserId)
      : message?.senderId === currentUserId;
  const isSystemMsg = isSystemMessage(message);

  const senderName = resolveSenderName(message, executorsMap, currentUserId);
  const timestamp = getMessageTimestamp(message);
  const formattedTime = timestamp
    ? moment(timestamp).format('D-MMM, YYYY HH:mm')
    : '';
  const messageText = getMessageText(message);
  const audioData = useMemo(() => getAudioMessageData(message), [message]);
  const hasAudio = Boolean(audioData?.source);
  const audioCaption = useMemo(
    () => (hasAudio ? getLocalizedCallRecordingLabel(message) : ''),
    [hasAudio, message]
  );
  const canReply = Boolean(replyEnabled && onReply);
  const isActionMessage = Boolean(message?.action);
  const isTextMsg = isTextMessage(message);
  const changeList = useMemo(
    () =>
      Array.isArray(message?.changes) ? message.changes.filter(Boolean) : [],
    [message?.changes]
  );
  const actionHeaderInfo = useMemo(
    () => getActionHeaderInfo(message, messageText),
    [message, messageText]
  );
  const canManageCurrentMessage =
    isOwn && !isSystemMsg && !isActionMessage && isTextMsg;
  const [isActionMenuOpen, setIsActionMenuOpen] = useState(false);
  const actionMenuRef = useRef(null);

  const handleContextMenu = useCallback(
    (event) => {
      if (!canManageCurrentMessage) return;
      event.preventDefault();
      setIsActionMenuOpen(true);
    },
    [canManageCurrentMessage]
  );

  useEffect(() => {
    if (!isActionMenuOpen) return undefined;

    const handleDocumentMouseDown = (event) => {
      if (!actionMenuRef.current?.contains(event.target)) {
        setIsActionMenuOpen(false);
      }
    };

    const handleEsc = (event) => {
      if (event.key === 'Escape') {
        setIsActionMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleDocumentMouseDown);
    document.addEventListener('keydown', handleEsc);

    return () => {
      document.removeEventListener('mousedown', handleDocumentMouseDown);
      document.removeEventListener('keydown', handleEsc);
    };
  }, [isActionMenuOpen]);

  useEffect(() => {
    if (!canManageCurrentMessage || isDeleteConfirmOpen || isEditing) {
      setIsActionMenuOpen(false);
    }
  }, [canManageCurrentMessage, isDeleteConfirmOpen, isEditing]);

  const avatar = message?.avatar || message?.sender?.avatar;
  const bubbleTone = isSystemMsg
    ? {
        backgroundColor: 'var(--warning-bg)',
        borderColor: 'var(--warning-color)',
      }
    : isOwn
      ? {
          backgroundColor: 'var(--info-bg)',
          borderColor: 'var(--info-color)',
        }
      : {
          backgroundColor: 'var(--filter-input-bg)',
          borderColor: 'var(--primary-border-color)',
        };

  return (
    <div
      className={cn(
        'flex gap-[10px] py-[10px] transition-opacity duration-200',
        isOwn && 'flex-row-reverse',
        isDeleting && 'opacity-70'
      )}
    >
      <div
        className="flex h-[34px] w-[34px] shrink-0 items-center justify-center overflow-hidden rounded-full border text-[13px] font-semibold"
        style={{
          backgroundColor: 'var(--primary-input-bg)',
          borderColor: 'var(--primary-border-color)',
          color: 'var(--primary-color)',
        }}
      >
        {avatar ? (
          <img
            src={avatar}
            alt={senderName}
            className="h-full w-full object-cover"
          />
        ) : (
          senderName.charAt(0).toUpperCase()
        )}
      </div>

      <div className={cn('min-w-0 flex-1', isOwn && 'text-right')}>
        <div
          className={cn(
            'mb-[2px] flex flex-wrap items-center gap-x-[8px] gap-y-[2px]',
            isOwn && 'justify-end'
          )}
        >
          <span
            className="text-[15px] font-semibold leading-[20px]"
            style={{ color: 'var(--primary-color)' }}
          >
            {senderName}
          </span>
          <span
            className="text-[12px] leading-[18px]"
            style={{ color: 'var(--secondary-color)' }}
          >
            {formattedTime}
          </span>
        </div>

        {isEditing ? (
          <div
            className="mt-[6px] rounded-[12px] border p-[10px]"
            style={{
              borderColor: 'var(--info-color)',
              backgroundColor: 'var(--info-bg)',
            }}
          >
            <textarea
              value={editingText}
              onChange={(e) => onEditingTextChange(e.target.value)}
              rows={3}
              className="w-full resize-none rounded-[8px] border px-[10px] py-[8px] text-[14px] outline-none"
              style={{
                borderColor: 'var(--primary-border-color)',
                backgroundColor: 'var(--primary-bg)',
                color: 'var(--primary-color)',
              }}
            />
            <div className="mt-[8px] flex items-center justify-end gap-[8px]">
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancelEdit}
                disabled={isSavingEdit}
                className="h-[30px] px-[10px] text-[12px]"
              >
                Bekor qilish
              </Button>
              <Button
                type="button"
                size="sm"
                onClick={onSaveEdit}
                disabled={isSavingEdit || !String(editingText || '').trim()}
                className="h-[30px] min-w-[92px] justify-center px-[10px] text-[12px]"
              >
                {isSavingEdit ? (
                  <>
                    <Loader2 size={13} className="animate-spin" />
                    Saqlash
                  </>
                ) : (
                  'Saqlash'
                )}
              </Button>
            </div>
          </div>
        ) : actionHeaderInfo ? (
          <div
            className="mt-[6px] rounded-[14px] border px-[10px] py-[9px]"
            style={{
              backgroundColor: toRgba(
                actionHeaderInfo?.color || '#64748b',
                0.1
              ),
              borderColor: toRgba(actionHeaderInfo?.color || '#64748b', 0.35),
            }}
          >
            {actionHeaderInfo ? (
              <div className="flex flex-wrap items-center justify-between gap-[6px]">
                <div className="flex min-w-0 items-center gap-[6px]">
                  <span style={{ color: actionHeaderInfo.color }}>
                    {actionHeaderInfo.icon
                      ? createElement(actionHeaderInfo.icon, { size: 13 })
                      : null}
                  </span>
                  <span
                    className="truncate text-[12px] font-semibold"
                    style={{ color: actionHeaderInfo.color }}
                  >
                    {actionHeaderInfo.label}
                  </span>
                </div>
                {actionHeaderInfo.directionMeta ? (
                  <span
                    className="inline-flex items-center gap-[4px] text-[11px]"
                    style={{ color: actionHeaderInfo.color }}
                  >
                    {createElement(actionHeaderInfo.directionMeta.icon, {
                      size: 12,
                    })}
                    {actionHeaderInfo.directionMeta.label}
                  </span>
                ) : null}
              </div>
            ) : null}

            {changeList.length > 0 ? (
              <div
                className="mt-[7px] space-y-[4px] rounded-[8px] border px-[8px] py-[6px]"
                style={{
                  borderColor: 'var(--primary-border-color)',
                  backgroundColor: 'var(--primary-bg)',
                }}
              >
                {changeList.map((change, index) => {
                  const field = translateFieldLabel(change?.field);
                  const fromValue = formatChangeValueForUi(
                    change?.field,
                    change?.from,
                    executorsMap
                  );
                  const toValue = formatChangeValueForUi(
                    change?.field,
                    change?.to,
                    executorsMap
                  );

                  return (
                    <div
                      key={change?._id || `${field}-${index}`}
                      className="flex flex-wrap items-center gap-x-[6px] gap-y-[2px] text-[11px]"
                    >
                      <span
                        className="font-semibold"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {field}:
                      </span>
                      <span
                        className="wrap-break-word"
                        style={{ color: 'var(--secondary-color)' }}
                      >
                        {fromValue}
                      </span>
                      <span style={{ color: 'var(--secondary-color)' }}>→</span>
                      <span
                        className="wrap-break-word"
                        style={{ color: 'var(--primary-color)' }}
                      >
                        {toValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : hasAudio ? null : messageText ? (
              <p
                className="mt-[6px] whitespace-pre-wrap wrap-break-word text-[12px]"
                style={{ color: 'var(--primary-color)' }}
              >
                {messageText}
              </p>
            ) : null}

            {hasAudio ? (
              <div className="mt-[8px]">
                <MessengerAudioPlayer
                  source={audioData.source}
                  duration={audioData.duration}
                  isOwn={isOwn}
                />
              </div>
            ) : null}
          </div>
        ) : (
          <div
            className="relative mt-[6px] rounded-[14px] border px-[12px] py-[10px]"
            style={bubbleTone}
            onContextMenu={handleContextMenu}
          >
            {isActionMenuOpen ? (
              <div
                ref={actionMenuRef}
                className="absolute right-[10px] top-[10px] z-20 min-w-[126px] rounded-[10px] border p-[6px] shadow-lg"
                style={{
                  backgroundColor: 'var(--primary-bg)',
                  borderColor: 'var(--primary-border-color)',
                }}
              >
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="h-[28px] w-full justify-start rounded-[8px] px-[8px] text-[12px]"
                  style={{ color: 'var(--secondary-color)' }}
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    onStartEdit?.();
                  }}
                >
                  <Pencil size={12} />
                  Tahrirlash
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  disabled={isDeleting}
                  className="h-[28px] w-full justify-start rounded-[8px] px-[8px] text-[12px]"
                  style={{ color: 'var(--danger-color)' }}
                  onClick={() => {
                    setIsActionMenuOpen(false);
                    onRequestDelete?.();
                  }}
                >
                  <Trash2 size={12} />
                  O'chirish
                </Button>
              </div>
            ) : null}

            {hasAudio ? (
              <div className="space-y-[6px]">
                <MessengerAudioPlayer
                  source={audioData.source}
                  duration={audioData.duration}
                  isOwn={isOwn}
                />
                {audioCaption ? (
                  <p
                    className="whitespace-pre-wrap wrap-break-word text-[14px] leading-[20px]"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    {audioCaption}
                  </p>
                ) : null}
              </div>
            ) : (
              <div
                className="whitespace-pre-wrap wrap-break-word text-[15px] leading-[22px]"
                style={{ color: 'var(--primary-color)' }}
              >
                {messageText || '—'}
              </div>
            )}

            <div
              className={cn(
                'relative mt-[8px] flex flex-wrap items-center gap-[4px]',
                isOwn && 'justify-end'
              )}
            >
              {isDeleteConfirmOpen ? (
                <div
                  className="absolute bottom-full right-0 z-20 mb-[6px] w-[190px] rounded-[10px] border p-[8px] shadow-lg"
                  style={{
                    backgroundColor: 'var(--primary-bg)',
                    borderColor: 'var(--primary-border-color)',
                  }}
                >
                  <p
                    className="text-[12px]"
                    style={{ color: 'var(--primary-color)' }}
                  >
                    Xabarni o'chirasizmi?
                  </p>
                  <div className="mt-[6px] flex justify-end gap-[6px]">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      disabled={isDeleting}
                      className="h-[26px] px-[8px] text-[11px]"
                      onClick={onCancelDelete}
                    >
                      Yo'q
                    </Button>
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      disabled={isDeleting}
                      className="h-[26px] min-w-[74px] justify-center px-[8px] text-[11px]"
                      onClick={onConfirmDelete}
                    >
                      {isDeleting ? (
                        <>
                          <Loader2 size={12} className="animate-spin" />
                          Ha
                        </>
                      ) : (
                        'Ha'
                      )}
                    </Button>
                  </div>
                </div>
              ) : null}

              {!isOwn ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={canReply ? () => onReply(message) : undefined}
                  disabled={!canReply}
                  className="h-[26px] rounded-[8px] px-[8px] text-[12px]"
                  style={{ color: 'var(--info-color)' }}
                >
                  <CornerDownLeft size={12} />
                  Javob yozish
                </Button>
              ) : null}

              {canManageCurrentMessage && onStartEdit ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onStartEdit}
                  disabled={isDeleting}
                  className="h-[26px] rounded-[8px] px-[8px] text-[12px]"
                  style={{ color: 'var(--secondary-color)' }}
                >
                  <Pencil size={12} />
                  Tahrirlash
                </Button>
              ) : null}

              {canManageCurrentMessage && onRequestDelete ? (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onRequestDelete}
                  disabled={isDeleting}
                  className="h-[26px] rounded-[8px] px-[8px] text-[12px]"
                  style={{ color: 'var(--danger-color)' }}
                >
                  <Trash2 size={12} />
                  O'chirish
                </Button>
              ) : null}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export const Messenger = ({
  messages = [],
  currentUserId,
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onSendFile,
  onReply,
  isLoading = false,
  className,
  onLoadMore,
  hasMore = false,
  isLoadingMore = false,
  replyEnabled = false,
}) => {
  const { data: executors } = useFetchExecutors();
  const executorsMap = useMemo(() => {
    const map = new Map();
    (executors || []).forEach((executor) => {
      if (executor?.SlpCode != null) {
        map.set(
          String(executor.SlpCode),
          executor?.SlpName || String(executor.SlpCode)
        );
      }
    });
    return map;
  }, [executors]);

  const [inputValue, setInputValue] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [isSavingEdit, setIsSavingEdit] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [deletingMessageId, setDeletingMessageId] = useState(null);
  const [deleteConfirmMessageId, setDeleteConfirmMessageId] = useState(null);

  const fileInputRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const previousLengthRef = useRef(0);
  const loadMoreScrollStateRef = useRef(null);
  const isLoadMorePendingRef = useRef(false);

  const sortedMessages = useMemo(() => {
    const safeMessages = Array.isArray(messages)
      ? messages.filter(Boolean)
      : [];
    return [...safeMessages].sort((a, b) => {
      const aDate = getMessageTimestamp(a);
      const bDate = getMessageTimestamp(b);
      if (!aDate && !bDate) return 0;
      if (!aDate) return -1;
      if (!bDate) return 1;
      return new Date(aDate).getTime() - new Date(bDate).getTime();
    });
  }, [messages]);

  useEffect(() => {
    const node = messagesContainerRef.current;
    if (!node) return;

    if (loadMoreScrollStateRef.current && !isLoadingMore) {
      const prevState = loadMoreScrollStateRef.current;
      const heightDiff = node.scrollHeight - prevState.scrollHeight;
      node.scrollTop = prevState.scrollTop + heightDiff;
      loadMoreScrollStateRef.current = null;
      previousLengthRef.current = sortedMessages.length;
      return;
    }

    const isFirstPaint = previousLengthRef.current === 0;
    const newMessageAdded = sortedMessages.length > previousLengthRef.current;
    if (isFirstPaint || newMessageAdded) {
      requestAnimationFrame(() => {
        node.scrollTo({
          top: node.scrollHeight,
          behavior: isFirstPaint ? 'auto' : 'smooth',
        });
      });
    }

    previousLengthRef.current = sortedMessages.length;
  }, [sortedMessages.length, isLoadingMore]);

  const resetComposer = useCallback(() => {
    setInputValue('');
    setSelectedFile(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  const handleSend = useCallback(async () => {
    if (isSendingMessage) return;

    const text = inputValue.trim();
    if (!text && !selectedFile) return;

    try {
      setIsSendingMessage(true);

      if (selectedFile && onSendFile) {
        await onSendFile(selectedFile);
      }

      if (text) {
        await onSendMessage?.({
          msgText: text,
          message: text,
          Comments: text,
        });
      }

      resetComposer();
    } catch (error) {
      console.error('Message send error:', error);
    } finally {
      setIsSendingMessage(false);
    }
  }, [
    inputValue,
    isSendingMessage,
    onSendFile,
    onSendMessage,
    resetComposer,
    selectedFile,
  ]);

  const handleEditSave = useCallback(async () => {
    const messageId = editingMessageId;
    const trimmed = editingText.trim();
    if (!messageId || !trimmed || !onEditMessage) return;

    try {
      setIsSavingEdit(true);
      await onEditMessage(messageId, {
        message: trimmed,
        Comments: trimmed,
        msgText: trimmed,
      });
      setEditingMessageId(null);
      setEditingText('');
    } catch (error) {
      console.error('Message edit error:', error);
    } finally {
      setIsSavingEdit(false);
    }
  }, [editingMessageId, editingText, onEditMessage]);

  const handleDeleteMessage = useCallback(
    async (messageId) => {
      if (!messageId || !onDeleteMessage || deletingMessageId) return;

      try {
        setDeletingMessageId(messageId);
        await onDeleteMessage(messageId);
      } catch (error) {
        console.error('Message delete error:', error);
      } finally {
        setDeletingMessageId((prev) => (prev === messageId ? null : prev));
        setDeleteConfirmMessageId((prev) => (prev === messageId ? null : prev));
      }
    },
    [deletingMessageId, onDeleteMessage]
  );

  const handleLoadMore = useCallback(() => {
    if (
      !onLoadMore ||
      !hasMore ||
      isLoadingMore ||
      isLoadMorePendingRef.current
    ) {
      return;
    }

    const node = messagesContainerRef.current;
    if (node) {
      loadMoreScrollStateRef.current = {
        scrollTop: node.scrollTop,
        scrollHeight: node.scrollHeight,
      };
    }
    isLoadMorePendingRef.current = true;
    onLoadMore();
  }, [hasMore, isLoadingMore, onLoadMore]);

  const handleMessagesScroll = useCallback(
    (event) => {
      if (!hasMore || !onLoadMore || isLoadingMore) return;

      const currentScrollTop = event.currentTarget.scrollTop;
      if (currentScrollTop <= 56) {
        handleLoadMore();
      }
    },
    [handleLoadMore, hasMore, isLoadingMore, onLoadMore]
  );

  useEffect(() => {
    if (!isLoadingMore) {
      isLoadMorePendingRef.current = false;
    }
  }, [isLoadingMore]);

  const handleFileSelect = useCallback((event) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  }, []);

  return (
    <div
      className={cn(
        'flex h-full flex-col overflow-hidden rounded-[22px] border border-(--primary-border-color) bg-(--primary-bg) shadow-sm',
        className
      )}
    >
      <div
        className="border-b px-[18px] pb-[12px] pt-[14px]"
        style={{ borderColor: 'var(--primary-border-color)' }}
      >
        <div className="flex items-center justify-between gap-[8px]">
          <h3
            className="text-[16px] font-semibold"
            style={{ color: 'var(--primary-color)' }}
          >
            Izohlar va harakatlar tarixi
          </h3>
          <span
            className="rounded-[999px] px-[8px] py-[2px] text-[11px] font-medium"
            style={{
              backgroundColor: 'var(--primary-input-bg)',
              color: 'var(--secondary-color)',
            }}
          >
            {sortedMessages.length}
          </span>
        </div>
      </div>

      <div
        ref={messagesContainerRef}
        onScroll={handleMessagesScroll}
        className="flex-1 overflow-y-auto px-[16px] py-[12px]"
        style={{ backgroundColor: 'var(--secondary-bg)' }}
      >
        {hasMore && onLoadMore ? (
          <div className="mb-[8px] flex justify-center py-[2px]">
            {isLoadingMore ? (
              <div
                className="inline-flex items-center gap-[6px] text-[11px]"
                style={{ color: 'var(--secondary-color)' }}
              >
                <Loader2 size={13} className="animate-spin" />
                Eski xabarlar yuklanmoqda...
              </div>
            ) : (
              <span
                className="text-[11px]"
                style={{ color: 'var(--secondary-color)' }}
              >
                Yuqoriga suring, eski xabarlar yuklanadi
              </span>
            )}
          </div>
        ) : null}

        {isLoading ? (
          <div className="flex items-center justify-center py-[40px]">
            <Loader2
              size={24}
              className="animate-spin"
              style={{ color: 'var(--secondary-color)' }}
            />
          </div>
        ) : sortedMessages.length === 0 ? (
          <div
            className="flex items-center justify-center py-[36px] text-[14px]"
            style={{ color: 'var(--secondary-color)' }}
          >
            Xabarlar yo'q
          </div>
        ) : (
          <div
            className="divide-y"
            style={{ borderColor: 'var(--primary-border-color)' }}
          >
            {sortedMessages.map((message, index) => {
              const messageId = getMessageId(message);
              const messageText = getMessageText(message);
              const senderCode = getSenderCode(message);
              const isOwnMessage =
                senderCode != null && currentUserId != null
                  ? String(senderCode) === String(currentUserId)
                  : message?.senderId === currentUserId;
              const canManageMessage =
                isOwnMessage &&
                !isSystemMessage(message) &&
                !message?.action &&
                isTextMessage(message);

              return (
                <MessengerMessage
                  key={messageId || `${getMessageTimestamp(message)}-${index}`}
                  message={message}
                  currentUserId={currentUserId}
                  executorsMap={executorsMap}
                  replyEnabled={replyEnabled}
                  onReply={onReply}
                  isEditing={editingMessageId === messageId}
                  editingText={editingText}
                  isSavingEdit={isSavingEdit}
                  isDeleting={deletingMessageId === messageId}
                  onEditingTextChange={setEditingText}
                  onCancelEdit={() => {
                    setEditingMessageId(null);
                    setEditingText('');
                    setDeleteConfirmMessageId(null);
                  }}
                  onSaveEdit={handleEditSave}
                  onStartEdit={
                    onEditMessage &&
                    messageId &&
                    canManageMessage &&
                    !deletingMessageId
                      ? () => {
                          setDeleteConfirmMessageId(null);
                          setEditingMessageId(messageId);
                          setEditingText(messageText || '');
                        }
                      : undefined
                  }
                  isDeleteConfirmOpen={deleteConfirmMessageId === messageId}
                  onCancelDelete={() => setDeleteConfirmMessageId(null)}
                  onRequestDelete={
                    onDeleteMessage &&
                    messageId &&
                    canManageMessage &&
                    !deletingMessageId
                      ? () => setDeleteConfirmMessageId(messageId)
                      : undefined
                  }
                  onConfirmDelete={
                    onDeleteMessage &&
                    messageId &&
                    canManageMessage &&
                    !deletingMessageId
                      ? () => handleDeleteMessage(messageId)
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      <div
        className="border-t px-[16px] py-[10px]"
        style={{ borderColor: 'var(--primary-border-color)' }}
      >
        {selectedFile ? (
          <div
            className="mb-[8px] flex items-center gap-[8px] rounded-[10px] border px-[10px] py-[8px]"
            style={{
              borderColor: 'var(--info-color)',
              backgroundColor: 'var(--info-bg)',
            }}
          >
            <Paperclip size={14} style={{ color: 'var(--info-color)' }} />
            <span
              className="min-w-0 flex-1 truncate text-[13px]"
              style={{ color: 'var(--info-color)' }}
            >
              {selectedFile.name}
            </span>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              disabled={isSendingMessage}
              onClick={() => {
                setSelectedFile(null);
                if (fileInputRef.current) fileInputRef.current.value = '';
              }}
              className="h-[24px] w-[24px] rounded-full"
              style={{ color: 'var(--info-color)' }}
            >
              <X size={13} />
            </Button>
          </div>
        ) : null}

        <div className="flex items-center gap-[8px]">
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={!onSendFile || isSendingMessage}
            className="h-[34px] w-[34px] shrink-0"
            style={{ color: 'var(--secondary-color)' }}
          >
            <Paperclip size={16} />
          </Button>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={handleFileSelect}
            accept="image/*,.pdf,.doc,.docx"
          />

          <div className="flex-1">
            <Input
              type="text"
              placeholder="Xabar yozish..."
              value={inputValue}
              disabled={isSendingMessage}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey && !isSendingMessage) {
                  e.preventDefault();
                  handleSend();
                }
              }}
            />
          </div>

          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled
            className="h-[34px] w-[34px] shrink-0"
            style={{ color: 'var(--secondary-color)' }}
            title="Audio reply tez orada qo'shiladi"
          >
            <Mic size={14} />
          </Button>

          <Button
            type="button"
            size="icon"
            onClick={handleSend}
            disabled={isSendingMessage || (!inputValue.trim() && !selectedFile)}
            className="h-[34px] w-[34px] shrink-0"
          >
            {isSendingMessage ? (
              <Loader2 size={14} className="animate-spin" />
            ) : (
              <Send size={14} />
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Messenger;

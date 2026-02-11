import moment from 'moment';
import classNames from 'classnames';
import {
  useState,
  useEffect,
  useMemo,
  useCallback,
  createElement,
} from 'react';
import {
  UserPlus,
  PenSquare,
  RefreshCcw,
  Users,
  FileEdit,
  Phone,
  PhoneCall,
  PhoneMissed,
  PhoneOff,
  CircleSlash,
  StickyNote,
  Cog,
  PhoneIncoming,
  PhoneOutgoing,
  ArrowRightLeft,
} from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useFloating, shift, offset, autoUpdate } from '@floating-ui/react-dom';

import { Col, Button, Typography, Box } from '@components/ui';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useAuth from '@hooks/useAuth';
import useTheme from '@hooks/useTheme';
import iconsMap from '@utils/iconsMap';
import getMessageColorForUser from '@utils/getMessageColorForUser';
import styles from './styles/messenger.module.scss';
import { API_CLIENT_AUDIOS, API_CLIENT_IMAGES } from '@utils/apiUtils';
import AudioPlayer from './AudioPlayer';

const ACTION_META = {
  lead_created: {
    label: 'Lead yaratildi',
    color: '#22c55e',
    icon: UserPlus,
  },
  lead_updated: {
    label: 'Lead yangilandi',
    color: '#3b82f6',
    icon: PenSquare,
  },
  status_changed: {
    label: "Status o'zgardi",
    color: '#f59e0b',
    icon: RefreshCcw,
  },
  operator_changed: {
    label: "Operator o'zgardi",
    color: '#0ea5e9',
    icon: Users,
  },
  field_changed: {
    label: "Maydon o'zgardi",
    color: '#8b5cf6',
    icon: FileEdit,
  },
  call_started: {
    label: "Qo'ng'iroq boshlandi",
    color: '#06b6d4',
    icon: Phone,
  },
  call_answered: {
    label: "Qo'ng'iroq qabul qilindi",
    color: '#16a34a',
    icon: PhoneCall,
  },
  call_no_answer: {
    label: "Qo'ng'iroqqa javob berilmadi",
    color: '#f97316',
    icon: PhoneMissed,
  },
  call_missed: {
    label: "O'tkazib yuborilgan qo'ng'iroq",
    color: '#ef4444',
    icon: PhoneMissed,
  },
  call_ended: {
    label: "Qo'ng'iroq yakunlandi",
    color: '#64748b',
    icon: PhoneOff,
  },
  auto_closed: {
    label: 'Tizim avtomatik yopdi',
    color: '#a855f7',
    icon: CircleSlash,
  },
  auto_ignored: {
    label: 'Tizim avtomatik e’tiborsiz qoldirdi',
    color: '#94a3b8',
    icon: CircleSlash,
  },
  note: {
    label: 'Eslatma',
    color: '#14b8a6',
    icon: StickyNote,
  },
};

const FIELD_LABELS = {
  status: 'Status',
  operator: 'Operator',
  slpCode: 'Operator',
  operatorFrom: 'Avvalgi operator',
  operatorTo: 'Yangi operator',
  answered: 'Javob berdi',
  interested: 'Qiziqdimi',
  rejectionReason: 'Rad etish sababi',
  callTime: "Qo'ng'iroq vaqti",
  call_time: "Qo'ng'iroq vaqti",
  'call time': "Qo'ng'iroq vaqti",
  callDuration: "Qo'ng'iroq davomiyligi",
  call_duration: "Qo'ng'iroq davomiyligi",
  duration: 'Davomiyligi',
  accountcode: 'Qo‘ng‘iroq turi',
  direction: "Yo'nalish",
  operator_ext: 'Operator raqami',
  client_phone: 'Mijoz telefoni',
  source: 'Manba',
  meetingDate: 'Uchrashuv sanasi',
  meetingConfirmedDate: 'Uchrashuv tasdiqlangan sana',
  callCount: "Qo'ng'iroqlar soni",
  passport: 'Passport',
  visit: 'Tashrif',
  scoring: 'Skoring',
  scoringResult: 'Skoring natija',
  finalLimit: 'Yakuniy limit',
  firstPayment: "Boshlang'ich to'lov",
  monthlyPayment: 'Oylik to‘lov',
  installmentMonths: "To'lov muddati",
  clientName: 'Mijoz ismi',
  clientPhone: 'Mijoz telefoni',
  branch: 'Filial',
  branchId: 'Filial',
  SlpCode: 'Operator',
  operatorId: 'Operator',
  isBlocked: 'Bloklanganmi',
  isDeleted: "O'chirilganmi",
  isSystem: 'Tizimmi',
  phone: 'Telefon',
  address: 'Manzil',
  note: 'Eslatma',
  comment: 'Izoh',
  comments: 'Izoh',
  seen: "Ko'rildimi",
  closed: 'Sifatsiz',
  clientFullName: 'Mijoz F.I.O',
};

const STATUS_LABELS = {
  Active: 'Faol',
  Blocked: 'Bloklangan',
  Purchased: 'Xarid qildi',
  Returned: 'Qaytarildi',
  Missed: "O'tkazib yuborildi",
  Ignored: "E'tiborsiz",
  NoAnswer: 'Javob bermadi',
  FollowUp: "Qayta a'loqa",
  Considering: "O'ylab ko'radi",
  WillVisitStore: "Do'konga boradi",
  WillSendPassport: 'Passport yuboradi',
  Scoring: 'Skoring',
  ScoringResult: 'Skoring natija',
  VisitedStore: "Do'konga keldi",
  NoPurchase: "Xarid bo'lmadi",
  Closed: 'Sifatsiz',
};

const translateFieldLabel = (field) => {
  const key = String(field || '').trim();
  if (!key) return 'Maydon';
  if (FIELD_LABELS[key]) return FIELD_LABELS[key];
  const lowerKey = key.toLowerCase();
  if (FIELD_LABELS[lowerKey]) return FIELD_LABELS[lowerKey];

  const normalized = key
    .replace(/\./g, ' ')
    .replace(/[_-]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .trim();
  if (!normalized) return 'Maydon';
  return normalized[0].toUpperCase() + normalized.slice(1);
};

const parseMomentFromUnknown = (rawValue) => {
  if (rawValue === null || rawValue === undefined || rawValue === '')
    return null;

  if (moment.isMoment(rawValue) && rawValue.isValid()) return rawValue.clone();

  if (typeof rawValue === 'number' && Number.isFinite(rawValue)) {
    const absolute = Math.abs(rawValue);
    if (absolute >= 1e12) {
      const m = moment(rawValue);
      return m.isValid() ? m : null;
    }
    if (absolute >= 1e9) {
      const m = moment.unix(rawValue);
      return m.isValid() ? m : null;
    }
    return null;
  }

  const value = String(rawValue).trim();
  if (!value) return null;

  if (/^\d{13}$/.test(value)) {
    const m = moment(Number(value));
    return m.isValid() ? m : null;
  }
  if (/^\d{10}$/.test(value)) {
    const m = moment.unix(Number(value));
    return m.isValid() ? m : null;
  }

  const m = moment(value);
  return m.isValid() ? m : null;
};

const formatUnknownDateTime = (rawValue) => {
  const parsed = parseMomentFromUnknown(rawValue);
  if (!parsed) return null;

  const asString = String(rawValue ?? '');
  const hasTime =
    typeof rawValue === 'number' ||
    /^\d{10,13}$/.test(asString) ||
    asString.includes('T') ||
    /\d{2}:\d{2}/.test(asString);

  return hasTime
    ? parsed.local().format('DD.MM.YYYY HH:mm')
    : parsed.local().format('DD.MM.YYYY');
};

const formatHistoryDateTime = (rawDate) => {
  return formatUnknownDateTime(rawDate) || '—';
};

const formatChangeValue = (field, value) => {
  if (value === true) return 'Ha';
  if (value === false) return "Yo'q";
  if (String(value).toLowerCase() === 'true') return 'Ha';
  if (String(value).toLowerCase() === 'false') return "Yo'q";
  if (value === null || value === undefined || value === '') return '—';

  if (field === 'status') {
    const translated = STATUS_LABELS[String(value)];
    return translated || String(value);
  }

  const fieldKey = String(field || '').toLowerCase();
  const normalizedFieldKey = fieldKey.replace(/\s+/g, '_').replace(/-/g, '_');
  const raw = String(value);
  const normalized = raw.toLowerCase();

  const isDateLikeField =
    /(?:^|_|\.)(date|time|stamp)(?:$|_)/i.test(normalizedFieldKey) ||
    /(?:^|_)(createdat|updatedat|created_at|updated_at|start_stamp|end_stamp|calltime|call_time)(?:$|_)/i.test(
      normalizedFieldKey
    );
  if (isDateLikeField) {
    const formatted = formatUnknownDateTime(value);
    if (formatted) return formatted;
  }

  if (
    normalizedFieldKey === 'accountcode' ||
    normalizedFieldKey === 'direction'
  ) {
    if (normalized === 'inbound') return 'Kiruvchi';
    if (normalized === 'outbound') return 'Chiquvchi';
  }

  return String(value);
};

const getCallDirectionMeta = (msg = {}) => {
  const rawDirection = String(
    msg?.direction || msg?.pbx?.direction || msg?.pbx?.accountcode || ''
  ).toLowerCase();

  if (rawDirection === 'inbound') {
    return {
      icon: PhoneIncoming,
      label: 'Kiruvchi qo‘ng‘iroq',
    };
  }
  if (rawDirection === 'outbound') {
    return {
      icon: PhoneOutgoing,
      label: 'Chiquvchi qo‘ng‘iroq',
    };
  }
  return {
    icon: ArrowRightLeft,
    label: "Qo'ng'iroq yo'nalishi noma'lum",
  };
};

// Helper: ensure colored bubbles look good in dark/light themes
const toRgba = (color, alpha = 1) => {
  if (!color) return '';
  // rgba(a,b,c,d)
  const rgbaMatch = color.match(
    /^rgba?\((\d+)\s*,\s*(\d+)\s*,\s*(\d+)(?:\s*,\s*(\d*\.?\d+))?\)$/i
  );
  if (rgbaMatch) {
    const [, r, g, b] = rgbaMatch;
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // #RRGGBB or #RGB
  const hex = color.trim();
  if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
    let r, g, b;
    if (hex.length === 4) {
      r = parseInt(hex[1] + hex[1], 16);
      g = parseInt(hex[2] + hex[2], 16);
      b = parseInt(hex[3] + hex[3], 16);
    } else {
      r = parseInt(hex.slice(1, 3), 16);
      g = parseInt(hex.slice(3, 5), 16);
      b = parseInt(hex.slice(5, 7), 16);
    }
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // Fallback: return as-is
  return color;
};

const MESSAGE_VARIANTS = {
  hidden: {
    opacity: 0,
    y: 18,
    scale: 0.98,
  },
  visible: (index = 0) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      type: 'tween',
      duration: 0.28,
      delay: Math.min(Math.max(index, 0), 10) * 0.07,
    },
  }),
  exit: {
    opacity: 0,
    y: -12,
    scale: 0.98,
    transition: {
      type: 'tween',
      duration: 0.18,
    },
  },
};

export default function Message({
  msg,
  onEditMessage,
  onDeleteMessage,
  size,
  animationIndex = 0,
}) {
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
  const { currentTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const baseMessageText = msg?.Comments ?? msg?.message ?? '';
  const [messageText, setMessageText] = useState(baseMessageText);
  const [editText, setEditText] = useState(baseMessageText);
  const isTextMessage =
    msg?.Audio === null &&
    msg?.Image === null &&
    baseMessageText !== null &&
    baseMessageText !== undefined;

  const { x, y, strategy, update, refs } = useFloating({
    placement: 'top-end',
    middleware: [offset(0), shift()],
  });

  useEffect(() => {
    if (!refs.reference.current || !refs.floating.current) return;
    return autoUpdate(refs.reference.current, refs.floating.current, update);
  }, [refs.reference, refs.floating, update]);

  useEffect(() => {
    setMessageText(baseMessageText);
    setEditText(baseMessageText);
  }, [baseMessageText]);

  const handleContextMenu = useCallback(
    (e) => {
      e.preventDefault();
      if (
        !msg?.isSystem &&
        !msg?.action &&
        String(msg?.['SlpCode']) === String(user?.SlpCode) &&
        isTextMessage
      ) {
        setShowMenu(true);
        update();
      }
    },
    [msg, user?.SlpCode, update, isTextMessage]
  );

  const handleEditSubmit = useCallback(async () => {
    try {
      setIsSubmitting(true);
      if (editText === '') {
        onDeleteMessage(msg?._id);
        return;
      }
      if (editText !== baseMessageText && typeof onEditMessage === 'function') {
        setMessageText(editText);
        await onEditMessage(msg?._id, { Comments: editText });
      }
    } catch (error) {
      setMessageText(baseMessageText);
      console.error(error);
    } finally {
      setIsSubmitting(false);
      setEditMode(false);
    }
  }, [editText, msg?._id, baseMessageText, onEditMessage, onDeleteMessage]);

  const handleClickOutside = useCallback(
    (e) => {
      if (
        refs.floating.current &&
        !refs.floating.current?.contains(e.target) &&
        !refs.reference.current?.contains(e.target)
      ) {
        setShowMenu(false);
      }
    },
    [refs.floating, refs.reference]
  );

  useEffect(() => {
    if (showMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    } else {
      document.removeEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu, handleClickOutside]);

  // Memoize expensive computations
  const timestamp = useMemo(
    () => formatHistoryDateTime(msg?.created_at ?? msg?.createdAt),
    [msg?.created_at, msg?.createdAt]
  );
  const timestampDateTime = useMemo(() => {
    const parsed = moment(msg?.created_at ?? msg?.createdAt);
    return parsed.isValid() ? parsed.toISOString() : undefined;
  }, [msg?.created_at, msg?.createdAt]);

  const msgColor = useMemo(
    () =>
      getMessageColorForUser(
        msg?.['SlpCode'],
        executors?.map((e) => e?.['SlpCode']) || []
      ),
    [msg?.['SlpCode'], executors]
  );

  const audioUrl = useMemo(() => {
    const path = msg?.Audio?.url;
    return path ? `${API_CLIENT_AUDIOS}${path}` : null;
  }, [msg?.Audio?.url]);

  const messageType = useMemo(() => {
    if (audioUrl) return 'audio';
    if (msg?.['Image']) return 'image';
    if (baseMessageText !== null && baseMessageText !== undefined)
      return 'text';
    return null;
  }, [audioUrl, msg?.Image, baseMessageText]);

  const actionInfo = useMemo(() => {
    if (!msg?.action) return null;
    const meta = ACTION_META[msg.action] || {
      label: msg.action,
      color: '#64748b',
      icon: Cog,
    };
    const isCallAction = String(msg.action).startsWith('call_');
    const directionMeta = isCallAction ? getCallDirectionMeta(msg) : null;
    return { ...meta, directionMeta };
  }, [msg]);

  const systemAudioActionInfo = useMemo(() => {
    if (!msg?.isSystem || messageType !== 'audio' || msg?.action) return null;
    const directionMeta = getCallDirectionMeta(msg);
    return {
      label: baseMessageText || "Qo'ng'iroq yozuvi",
      color: '#0ea5e9',
      icon: PhoneCall,
      directionMeta,
    };
  }, [msg, messageType, baseMessageText]);

  const headerInfo = actionInfo || systemAudioActionInfo;

  const changeList = useMemo(() => {
    if (!Array.isArray(msg?.changes)) return [];
    return msg.changes.filter(Boolean);
  }, [msg?.changes]);

  const actorLabel = useMemo(() => {
    if (msg?.isSystem) return 'Tizim';
    if (msg?.['SlpCode'] === user?.SlpCode) return 'Siz';
    const found = executors?.find(
      (executor) => String(executor?.SlpCode) === String(msg?.SlpCode)
    );
    if (found) return found?.SlpName;
    return `Operator ${msg?.['SlpCode'] ?? '-'}`;
  }, [msg, executors, user?.SlpCode]);

  const executorsByCode = useMemo(() => {
    const map = new Map();
    (executors || []).forEach((executor) => {
      const code = executor?.SlpCode;
      if (code !== null && code !== undefined && code !== '') {
        map.set(String(code), executor?.SlpName || String(code));
      }
    });
    return map;
  }, [executors]);

  const formatChangeValueForUi = useCallback(
    (field, value) => {
      const fieldKey = String(field || '').toLowerCase();
      if (
        fieldKey === 'slpcode' ||
        fieldKey === 'operator' ||
        fieldKey === 'operatorfrom' ||
        fieldKey === 'operatorto' ||
        fieldKey === 'operatorid'
      ) {
        const key = String(value ?? '').trim();
        if (!key) return '—';
        return executorsByCode.get(key) || key;
      }
      return formatChangeValue(field, value);
    },
    [executorsByCode]
  );

  // Theme-aware bubble background to keep readable contrast in dark mode
  const bubbleBg = useMemo(() => {
    if (!msgColor?.bg) return undefined;
    return currentTheme === 'dark' ? toRgba(msgColor.bg, 0.25) : msgColor.bg;
  }, [msgColor?.bg, currentTheme]);

  // Theme-aware accent color for author/icon
  const accentColor = useMemo(() => {
    return currentTheme === 'dark' ? '#e5e7eb' : msgColor?.text;
  }, [currentTheme, msgColor?.text]);
  useEffect(() => {
    if (!audioUrl) return;
    const audio = new Audio(audioUrl);

    audio.preload = 'metadata';

    audio.onloadedmetadata = () => {};

    // Cleanup
    return () => {
      audio.src = '';
    };
  }, [audioUrl]);

  return (
    <motion.div
      ref={refs.setReference}
      onContextMenu={handleContextMenu}
      className={classNames(styles.message, styles[size])}
      custom={animationIndex}
      variants={MESSAGE_VARIANTS}
      initial="hidden"
      animate="visible"
      exit="exit"
    >
      <Col>
        {headerInfo && (
          <div
            className={styles['message-action-wrapper']}
            style={{
              backgroundColor:
                currentTheme === 'dark'
                  ? toRgba(headerInfo.color, 0.18)
                  : toRgba(headerInfo.color, 0.08),
              borderColor: toRgba(headerInfo.color, 0.35),
            }}
          >
            <Box dir="row" align="center" gap={1}>
              <span
                className={styles['message-action-icon']}
                style={{ color: headerInfo.color }}
              >
                <headerInfo.icon size={14} />
              </span>
              <Typography
                element="strong"
                className={styles['message-action-title']}
                style={{ color: headerInfo.color }}
              >
                {headerInfo.label}
              </Typography>
            </Box>
            {headerInfo.directionMeta ? (
              <Typography
                element="span"
                className={styles['message-action-subtitle']}
              >
                <span className={styles['message-action-direction-icon']}>
                  {createElement(headerInfo.directionMeta.icon, { size: 13 })}
                </span>
                {headerInfo.directionMeta.label}
              </Typography>
            ) : null}
            {changeList.length > 0 ? (
              <div className={styles['message-change-log']}>
                {changeList.map((change, index) => {
                  const field = translateFieldLabel(change?.field);
                  const fromValue = formatChangeValueForUi(
                    change?.field,
                    change?.from
                  );
                  const toValue = formatChangeValueForUi(
                    change?.field,
                    change?.to
                  );
                  return (
                    <div
                      key={change?._id || `${field}-${index}`}
                      className={styles['message-change-row']}
                    >
                      <span className={styles['message-change-field']}>
                        {field}
                      </span>
                      <span className={styles['message-change-arrow']}>:</span>
                      <span className={styles['message-change-from']}>
                        {fromValue}
                      </span>
                      <span className={styles['message-change-arrow']}>→</span>
                      <span className={styles['message-change-to']}>
                        {toValue}
                      </span>
                    </div>
                  );
                })}
              </div>
            ) : null}
            <time
              className={styles['message-time']}
              dateTime={timestampDateTime}
            >
              {timestamp}
            </time>
          </div>
        )}
        {(() => {
          if (messageType === 'text' && !msg?.action) {
            return (
              <div
                style={{
                  backgroundColor: bubbleBg,
                  border:
                    currentTheme === 'dark'
                      ? '1px solid rgba(255,255,255,0.06)'
                      : '1px solid rgba(0,0,0,0.04)',
                  boxShadow:
                    currentTheme === 'dark'
                      ? '0 1px 2px rgba(0,0,0,0.6)'
                      : undefined,
                }}
                className={styles['message-text-wrapper']}
              >
                {editMode ? (
                  <textarea
                    className={styles['message-edit-input']}
                    value={editText}
                    disabled={isSubmitting}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey && !isSubmitting) {
                        handleEditSubmit();
                      }
                    }}
                    onChange={(e) => setEditText(e.target.value)}
                    autoFocus
                  />
                ) : (
                  <p className={styles['message-text']}>{messageText}</p>
                )}
                <Box dir="row" gap={2} align="center" justify="end">
                  {editMode && (
                    <Button
                      className={styles['message-edit-submit-btn']}
                      onClick={handleEditSubmit}
                      variant="text"
                      icon="send"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? 'Saqlanmoqda...' : 'Saqlash'}
                    </Button>
                  )}
                  <time
                    className={styles['message-time']}
                    dateTime={timestampDateTime}
                  >
                    {timestamp}
                  </time>
                </Box>
              </div>
            );
          }
          if (messageType === 'image') {
            const url = API_CLIENT_IMAGES + msg?.['Image'];
            return (
              <div className={styles['message-image-wrapper']}>
                <a
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  download
                >
                  <img
                    src={url}
                    className={styles['message-image']}
                    alt="message image"
                    loading="lazy"
                  />
                </a>
              </div>
            );
          }
          if (messageType === 'audio') {
            return (
              <div className={styles['message-audio-body']}>
                <AudioPlayer
                  className={size}
                  src={audioUrl}
                  externalDuration={msg?.['Audio']?.['duration']}
                  color={msgColor}
                />
              </div>
            );
          }
        })()}
      </Col>

      <Col>
        <Box dir="row" gap={1} align="center">
          <Typography
            style={{ color: accentColor }}
            element="span"
            className={styles['message-avatar-icon']}
          >
            {msg.avatar ? (
              <img
                src={msg.avatar}
                width={50}
                height={50}
                alt="avatar"
                loading="lazy"
              />
            ) : (
              iconsMap['avatarFilled']
            )}
          </Typography>
          <Typography
            style={{ color: accentColor }}
            element="span"
            className={styles['message-author']}
          >
            {actorLabel}
          </Typography>
        </Box>
      </Col>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            ref={refs.setFloating}
            style={{
              position: strategy,
              top: !isNaN(y) ? y + 25 : 0,
              left: !isNaN(x) ? x : 0,
              zIndex: 99999,
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={styles['message-text-menu']}
          >
            <ul className={styles['message-text-menu-list']}>
              <li className={styles['message-text-menu-list-item']}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    setEditMode(true);
                  }}
                  variant="text"
                  icon="pencil"
                  className={classNames(
                    styles['message-text-menu-btn'],
                    styles['edit']
                  )}
                  disabled={messageType !== 'text'}
                >
                  tahrirlash
                </Button>
              </li>
              <li className={styles['message-text-menu-list-item']}>
                <Button
                  onClick={() => {
                    setShowMenu(false);
                    onDeleteMessage(msg?._id);
                  }}
                  variant="text"
                  icon="deleteFilled"
                  className={classNames(
                    styles['message-text-menu-btn'],
                    styles['delete']
                  )}
                >
                  o'chirish
                </Button>
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

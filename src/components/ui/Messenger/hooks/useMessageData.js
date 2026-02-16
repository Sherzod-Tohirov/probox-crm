import { useMemo, useCallback } from 'react';
import moment from 'moment';
import { Cog, PhoneCall } from 'lucide-react';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useAuth from '@hooks/useAuth';
import useTheme from '@hooks/useTheme';
import getMessageColorForUser from '@utils/getMessageColorForUser';
import { API_CLIENT_AUDIOS } from '@utils/apiUtils';
import { ACTION_META, OPERATOR_FIELDS } from '../utils/constants';
import {
  formatHistoryDateTime,
  formatChangeValue,
  getCallDirectionMeta,
  toRgba,
} from '../utils/formatters';

export default function useMessageData(msg, baseMessageText) {
  const { data: executors } = useFetchExecutors();
  const { user } = useAuth();
  const { currentTheme } = useTheme();

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
    [msg, executors]
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
  }, [audioUrl, msg, baseMessageText]);

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
      if (code != null && code !== '') {
        map.set(String(code), executor?.SlpName || String(code));
      }
    });
    return map;
  }, [executors]);

  const formatChangeValueForUi = useCallback(
    (field, value) => {
      const fieldKey = String(field || '').toLowerCase();
      if (OPERATOR_FIELDS.has(fieldKey)) {
        const key = String(value ?? '').trim();
        if (!key) return '—';
        return executorsByCode.get(key) || key;
      }
      return formatChangeValue(field, value);
    },
    [executorsByCode]
  );

  const bubbleBg = useMemo(() => {
    if (!msgColor?.bg) return undefined;
    return currentTheme === 'dark' ? toRgba(msgColor.bg, 0.25) : msgColor.bg;
  }, [msgColor?.bg, currentTheme]);

  const accentColor = useMemo(() => {
    return currentTheme === 'dark' ? '#e5e7eb' : msgColor?.text;
  }, [currentTheme, msgColor?.text]);

  const isTextMessage =
    msg?.Audio === null &&
    msg?.Image === null &&
    baseMessageText !== null &&
    baseMessageText !== undefined;

  return {
    user,
    currentTheme,
    timestamp,
    timestampDateTime,
    msgColor,
    audioUrl,
    messageType,
    headerInfo,
    changeList,
    actorLabel,
    formatChangeValueForUi,
    bubbleBg,
    accentColor,
    isTextMessage,
  };
}

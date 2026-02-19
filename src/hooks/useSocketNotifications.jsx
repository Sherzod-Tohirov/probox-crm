import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import _ from 'lodash';
import { formatDateWithHour } from '@/utils/formatDate';

const LS_KEY = 'probox.notifications';

// Roles allowed to receive per-user "new lead" notifications
// (other roles like Manager, Admin, etc. will not be notified)
const NEW_LEAD_ALLOWED_ROLES = [];

function toArray(payload) {
  if (!payload) return [];
  if (Array.isArray(payload?.records)) return payload.records.filter(Boolean);
  if (Array.isArray(payload?.data)) return payload.data.filter(Boolean);
  return (Array.isArray(payload) ? payload : [payload]).filter(Boolean);
}

function dispatchRecordsEvent(eventName, records) {
  if (!eventName || !records.length) return;
  window.dispatchEvent(new CustomEvent(eventName, { detail: { records } }));
}

function readFromStorage() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch (_) {
    return [];
  }
}

function writeToStorage(list) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(list.slice(0, 100)));
  } catch (err) {
    console.log(err);
  }
}

function getSocketBaseUrl() {
  const apiUrl = import.meta.env.VITE_API_URL || '';
  if (apiUrl) {
    // Remove trailing /api if present
    const cleaned = apiUrl.replace(/\/?api\/?$/i, '');
    return cleaned;
  }
  return 'https://work-api.probox.uz';
}

function belongsToCurrentUser(lead, user) {
  if (!lead || !user) return false;
  const userCode = String(user?.SlpCode ?? '');
  if (lead?.SlpCode) {
    return lead?.SlpCode == userCode;
  }
  const operator =
    lead?.operator ?? lead?.Operator ?? lead?.slpCode ?? lead?.SlpCode;
  const operator2 = lead?.operator2 ?? lead?.Operator2;
  if (operator !== undefined && String(operator) === userCode) return true;
  if (operator2 !== undefined && String(operator2) === userCode) return true;
  return false;
}

function normalizeLeadToNotification(lead) {
  const id =
    lead?.id ??
    lead?._id ??
    `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const title = 'Yangi lead keldi';
  const clientName = lead?.clientName || lead?.name || 'Mijoz';
  const phone = lead?.clientPhone || lead?.phone || '';
  const source = lead?.source ? `• ${lead.source}` : '';
  const message = [clientName, phone, source].filter(Boolean).join(' ');
  const link = lead?._id ? `/leads/${lead._id}` : undefined;
  return {
    id: `lead-${id}`,
    type: 'lead',
    title,
    message,
    createdAt: Date.now(),
    read: false,
    link,
    data: lead,
  };
}

function normalizeAgreementDateNotification(payload) {
  const id =
    payload?.DocEntry ?? `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const title = "To'lov muddati keldi";
  const newDueDate = formatDateWithHour(payload?.newDueDate);
  return {
    id,
    type: 'agreementDate',
    title,
    message: [
      `Hujjat kodi: ${payload?.DocEntry ?? "yo'q"}, `,
      `Yangi muddat: ${newDueDate}`,
    ]
      .filter(Boolean)
      .join(' '),
    createdAt: Date.now(),
    read: false,
    link: payload?.DocEntry ? `/clients/${payload.DocEntry}` : undefined,
    data: payload,
  };
}

function normalizeInboundCallNotification(payload) {
  const leadId =
    payload?.leadId ??
    payload?.leadID ??
    payload?.LeadId ??
    payload?.id ??
    payload?._id;
  const callId =
    payload?.callId ??
    payload?.CallId ??
    payload?.pbx?.uniqueid ??
    payload?.uniqueid;

  const id =
    callId ??
    `${leadId ?? 'call'}-${Date.now()}-${Math.random().toString(36).slice(2)}`;

  const title = "Kiruvchi qo'ng'iroq";
  const clientName =
    payload?.clientFullName || payload?.clientName || payload?.name || 'Mijoz';
  const phone = payload?.clientPhone || payload?.phone || '';

  return {
    id: `inbound-call-${id}`,
    type: 'inboundCall',
    title,
    message: [clientName, phone].filter(Boolean).join(' • '),
    createdAt: Date.now(),
    read: false,
    link: leadId ? `/leads/${leadId}` : undefined,
    data: payload,
  };
}

export default function useSocketNotifications() {
  const { user, token } = useSelector((state) => state.auth);
  const socketRef = useRef(null);
  const [notifications, setNotifications] = useState(() => readFromStorage());
  const unreadCount = useMemo(
    () => notifications.filter((n) => !n.read).length,
    [notifications]
  );

  const addNotification = useCallback((notif) => {
    setNotifications((prev) => {
      if (prev.some((n) => n.id === notif.id)) return prev;
      const next = [notif, ...prev].slice(0, 100);
      writeToStorage(next);
      return next;
    });
  }, []);

  const markAsRead = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.map((n) => (n.id === id ? { ...n, read: true } : n));
      writeToStorage(next);
      return next;
    });
  }, []);

  const markAllAsRead = useCallback(() => {
    setNotifications((prev) => {
      const next = prev.map((n) => ({ ...n, read: true }));
      writeToStorage(next);
      return next;
    });
  }, []);

  const removeNotification = useCallback((id) => {
    setNotifications((prev) => {
      const next = prev.filter((n) => n.id !== id);
      writeToStorage(next);
      return next;
    });
  }, []);

  const clearAll = useCallback(() => {
    setNotifications(() => {
      try {
        localStorage.removeItem(LS_KEY);
      } catch (err) {
        console.log(err);
      }
      return [];
    });
  }, []);

  useEffect(() => {
    const baseUrl = getSocketBaseUrl();
    const socket = io(baseUrl, {
      transports: ['websocket'],
      auth: token ? { token } : undefined,
      reconnection: true,
      reconnectionAttempts: 5,
      autoConnect: true,
    });
    socketRef.current = socket;

    const onConnect = () => {
      console.log('🟢 Socketga ulandi');
    };
    const onError = () => {
      console.log('🔴 Socketda xatolik');
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);

    const handlerConfigs = [
      {
        event: 'new_leads',
        logLabel: 'socket payload',
        browserEvent: 'probox:new-lead',
        normalize: normalizeLeadToNotification,
        // Only notify users in the allowed roles and where lead belongs
        // to the current user by SlpCode/operator mapping.
        shouldNotify: (record, currentUser) => {
          if (!currentUser) return false;
          if (!NEW_LEAD_ALLOWED_ROLES.includes(currentUser.U_role)) {
            return false;
          }
          return belongsToCurrentUser(record, currentUser);
        },
      },
      {
        event: 'scoring_lead',
        logLabel: 'socket payload scoring',
        browserEvent: 'probox:new-lead',
        normalize: normalizeLeadToNotification,
        shouldNotify: (_, currentUser) => currentUser?.U_role === 'Scoring',
      },
      {
        event: 'invoice:newDueDateNotification',
        logLabel: 'socket payload new due date',
        browserEvent: 'invoice:agreement-date',
        normalize: normalizeAgreementDateNotification,
        shouldNotify: (record, currentUser) => {
          // console.log(record, 'record new due date', currentUser);
          return belongsToCurrentUser(record, currentUser);
        },
      },
      {
        event: 'pbx_answered',
        logLabel: 'socket payload inbound call',
        browserEvent: 'probox:inbound-call',
        normalize: normalizeInboundCallNotification,
        dispatchOnlyNotified: true,
        shouldNotify: (record, currentUser) => {
          return belongsToCurrentUser(record, currentUser);
        },
      },
      {
        event: 'incoming_call',
        logLabel: 'socket payload incoming call',
        browserEvent: 'probox:inbound-call',
        normalize: normalizeInboundCallNotification,
        dispatchOnlyNotified: true,
        shouldNotify: (record, currentUser) => {
          return belongsToCurrentUser(record, currentUser);
        },
      },
    ];

    const socketHandlers = handlerConfigs.map((config) => {
      const handler = (payload) => {
        if (config.logLabel) {
          console.log(payload, config.logLabel);
        }

        const records = toArray(payload);
        if (!records.length) return;

        const notifiedRecords = [];

        records.forEach((record) => {
          if (!user || !record) return;
          if (!config.shouldNotify?.(record, user)) return;

          notifiedRecords.push(record);

          const notif = config.normalize?.(record);
          if (notif) {
            addNotification(notif);
          }
        });

        const recordsForBrowserEvent = config.dispatchOnlyNotified
          ? notifiedRecords
          : records;

        dispatchRecordsEvent(config.browserEvent, recordsForBrowserEvent);
      };

      socket.on(config.event, handler);
      return { event: config.event, handler };
    });

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socketHandlers.forEach(({ event, handler }) => {
        socket.off(event, handler);
      });
      socket.disconnect();
    };
  }, [user, token, addNotification]);

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
  };
}

// useEffect(() => {
//   if (import.meta.env && import.meta.env.DEV) {
//     // expose test seed helper
//     window.seedNotifications = seedTest;

//     const seeded = sessionStorage.getItem('probox.notifications.devSeeded');
//     if (!seeded || notifications.length === 0) {
//       seedTest();
//       sessionStorage.setItem('probox.notifications.devSeeded', '1');
//     }
//   }

//   return () => {
//     if (import.meta.env && import.meta.env.DEV) {
//       delete window.seedNotifications;
//     }
//   };
// }, [seedTest]);

// const seedTest = useCallback(() => {
//   // Prevent duplicate autobatching when called from auto-seed repeatedly
//   if (!import.meta.env || !import.meta.env.DEV) return;
//   const code = user?.SlpCode ?? 0;
//   const stamp = Date.now();
//   const leads = [
//     {
//       id: `dev-${stamp}-a-${Math.random().toString(36).slice(2, 6)}`,
//       clientName: 'Doston',
//       clientPhone: '+998 90 123 45 67',
//       source: 'Meta',
//       operator: code,
//     },
//     {
//       id: `dev-${stamp}-b-${Math.random().toString(36).slice(2, 6)}`,
//       clientName: 'Malika',
//       clientPhone: '+998 91 765 43 21',
//       source: 'Manychat',
//       operator2: code,
//     },
//     {
//       id: `dev-${stamp}-c-${Math.random().toString(36).slice(2, 6)}`,
//       clientName: 'Javlon',
//       clientPhone: '+998 93 555 44 33',
//       source: 'Organika',
//       operator: code,
//     },
//   ];
//   leads.forEach((lead, i) => {
//     setTimeout(() => {
//       const notif = normalizeLeadToNotification(lead);
//       addNotification(notif);
//     }, i * 120);
//   });
// }, [user, addNotification]);

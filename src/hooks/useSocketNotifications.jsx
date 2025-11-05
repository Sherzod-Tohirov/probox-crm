import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';

const LS_KEY = 'probox.notifications';

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
  } catch (_) {}
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
      } catch (_) {}
      return [];
    });
  }, []);

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

    const onNewLeads = (payload) => {
      console.log(payload, 'socket payload');
      const records = Array.isArray(payload) ? payload : [payload];
      records.forEach((lead) => {
        if (!user || !lead) return;
        if (belongsToCurrentUser(lead, user)) {
          const notif = normalizeLeadToNotification(lead);
          addNotification(notif);
        }
        try {
          const id = lead?.id ?? lead?._id ?? null;
          console.log(id, 'id socket', lead);
          if (id) {
            window.dispatchEvent(
              new CustomEvent('probox:new-lead', { detail: { id, lead } })
            );
          }
        } catch (_) {}
      });
    };

    socket.on('connect', onConnect);
    socket.on('connect_error', onError);
    socket.on('new_leads', onNewLeads);

    return () => {
      socket.off('connect', onConnect);
      socket.off('connect_error', onError);
      socket.off('new_leads', onNewLeads);
      socket.disconnect();
    };
  }, [user, token, addNotification]);

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

  return {
    notifications,
    unreadCount,
    markAsRead,
    markAllAsRead,
    removeNotification,
    clearAll,
    // seedTest,
  };
}

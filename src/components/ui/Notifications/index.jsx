import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Button from '../Button';
import useSocketNotifications from '@/hooks/useSocketNotifications';
import styles from './notifications.module.scss';

export default function Notifications() {
  const { notifications, unreadCount, markAsRead, markAllAsRead, removeNotification, clearAll } =
    useSocketNotifications();
  const [open, setOpen] = useState(false);
  const [removingId, setRemovingId] = useState(null);
  const ref = useRef(null);

  const unreadList = useMemo(
    () => notifications.filter((n) => !n.read),
    [notifications]
  );
  console.log(notifications, 'notficiations');

  const toggle = useCallback(() => setOpen((p) => !p), []);

  useEffect(() => {
    const onDown = (e) => {
      if (!ref.current) return;
      if (!ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const handleItemClick = useCallback(
    (n) => {
      setRemovingId(n.id);
      setTimeout(() => {
        removeNotification(n.id);
        n.link ? (window.location.href = n.link) : null;
        setRemovingId(null);
      }, 150);
    },
    [removeNotification]
  );

  const handleMarkAll = useCallback(() => {
    clearAll();
  }, [clearAll]);

  return (
    <div className={styles.container} ref={ref}>
      <Button
        variant={'text'}
        icon={'notification'}
        iconColor={'primary'}
        iconSize={24}
        aria-label={'Bildirishnomalar'}
        onClick={toggle}
        className={`${styles.bell} ${unreadCount > 0 ? styles['has-unread'] : ''}`}
      />
      {unreadCount > 0 ? <span className={styles.badge} aria-hidden /> : null}

      {open ? (
        <div
          className={styles.dropdown}
          role="menu"
          aria-label="Bildirishnomalar menyusi"
        >
          <div className={styles.header}>
            <span className={styles.title}>Bildirishnomalar</span>
            <div className={styles.actions}>
              {unreadList.length > 0 ? (
                <button
                  className={styles.markAll}
                  onClick={handleMarkAll}
                  type="button"
                >
                  Hammasi o'qildi qilish
                </button>
              ) : null}
            </div>
          </div>
          <div className={styles.list}>
            {unreadList.length === 0 ? (
              <div className={styles.empty}>Yangi bildirishnoma yo'q</div>
            ) : (
              unreadList.slice(0, 10).map((n) => (
                <button
                  key={n.id}
                  type="button"
                  className={`${styles.item} ${removingId === n.id ? styles.removing : ''}`}
                  onClick={() => handleItemClick(n)}
                >
                  <div className={styles.itemTitle}>{n.title}</div>
                  {n.message ? (
                    <div className={styles.itemMsg}>{n.message}</div>
                  ) : null}
                </button>
              ))
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}

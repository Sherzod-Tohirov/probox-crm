import { useState, useEffect, useCallback, useRef } from 'react';

export default function useMessageActions({
  msg,
  user,
  isTextMessage,
  baseMessageText,
  onEditMessage,
  onDeleteMessage,
}) {
  const [showMenu, setShowMenu] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [messageText, setMessageText] = useState(baseMessageText);
  const [editText, setEditText] = useState(baseMessageText);
  const menuRef = useRef(null);

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
      }
    },
    [msg, user?.SlpCode, isTextMessage]
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

  useEffect(() => {
    if (!showMenu) return;
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showMenu]);

  return {
    showMenu,
    setShowMenu,
    editMode,
    setEditMode,
    isSubmitting,
    messageText,
    editText,
    setEditText,
    handleContextMenu,
    handleEditSubmit,
    menuRef,
  };
}

import { useState, useEffect, useCallback } from 'react';
import { useFloating, shift, offset, autoUpdate } from '@floating-ui/react-dom';

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
    floating: { x, y, strategy, refs },
  };
}

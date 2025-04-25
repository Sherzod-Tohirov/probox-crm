// utils/toastManager.js
import { toast } from "react-toastify";

let currentToastId = null;
const queue = [];
const shownMessages = new Set();

const processQueue = () => {
  if (currentToastId || queue.length === 0) return;

  const { content, options } = queue.shift();

  currentToastId = toast(content, {
    ...options,
    onClose: () => {
      currentToastId = null;
      shownMessages.delete(content); // allow this message again
      processQueue();
    },
  });
};

const enqueueToast = (content, options = {}) => {
  if (shownMessages.has(content)) return;

  queue.push({ content, options });
  shownMessages.add(content);
  processQueue();
};

const AlertManager = {
  show(content, options) {
    enqueueToast(content, options);
  },
  clear() {
    toast.dismiss();
    currentToastId = null;
    queue.length = 0;
    shownMessages.clear();
  },
};

export default AlertManager;

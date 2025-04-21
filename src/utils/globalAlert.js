let alertHandler = null;
let lastMessage = null;

export const setGlobalAlert = (fn = () => {}) => {
  alertHandler = fn;
};

export const alert = (message, options) => {
  console.log("lastmessage", lastMessage);
  if (lastMessage === message) return;
  lastMessage = message;
  if (alertHandler && typeof alertHandler === "function")
    alertHandler(message, options, () => {
      lastMessage = null;
    });
};

5;

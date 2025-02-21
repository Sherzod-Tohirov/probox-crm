import { matchPath } from "react-router-dom";

// Messenger routes config

export const messengerRoutes = ["/clients/:id"];

export function isMessengerRoute(pathname) {
  return messengerRoutes.some((route) => matchPath(route, pathname));
}



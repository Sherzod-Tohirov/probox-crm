import { matchPath } from 'react-router-dom';

// Messenger routes config

export const messengerRoutes = [
  {
    path: '/clients/:id',
    excluded_keys: ['statistics'],
  },
  {
    path: '/leads/:id',
    excluded_keys: ['statistics'],
  },
];

export function isMessengerRoute(pathname) {
  const segments = pathname.split('/');
  const lastSegment = segments[segments.length - 1];
  for (const route of messengerRoutes) {
    if (matchPath({ path: route.path, end: true }, pathname)) {
      if (route.excluded_keys && route.excluded_keys.includes(lastSegment)) {
        return false;
      }
      return true;
    }
  }

  return false;
}

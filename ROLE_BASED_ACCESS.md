# Role-Based Access Control (RBAC) Documentation

This document explains how the role-based access control system works in the ProBox CRM application.

## Overview

The system implements two-level protection:
1. **Sidebar Filtering**: Hides navigation links from users who don't have access
2. **Route Protection**: Redirects users to 404 if they try to access restricted pages directly via URL

## Architecture

### Core Files

- **`src/utils/routePermissions.js`** - Centralized configuration for route permissions
- **`src/components/ProtectedRoute.jsx`** - Route wrapper component that enforces access control
- **`src/utils/sidebarLinks.js`** - Sidebar navigation configuration (uses routePermissions)
- **`src/utils/filterSidebarLinks.js`** - Utility to filter sidebar links based on user role

## How It Works

### 1. Define Permissions

Edit `src/utils/routePermissions.js` to define which roles can access each route:

```javascript
const routePermissions = {
  '/statistics': {
    excludedRoles: ['Operator1', 'Operator2'], // These roles CANNOT access
  },
  '/leads': {
    allowedRoles: ['Operator1', 'Operator2', 'CEO'], // ONLY these roles can access
  },
  '/dashboard': {
    // No restrictions - all authenticated users can access
  },
};
```

**Permission Types:**
- **`excludedRoles`** - Array of roles that CANNOT access the route
- **`allowedRoles`** - Array of roles that CAN access the route
- **No restrictions** - All authenticated users can access

**Priority:** `excludedRoles` > `allowedRoles` > default (all authenticated users)

### 2. Protect Routes

In `src/routes.jsx`, wrap routes with `<ProtectedRoute>`:

```javascript
// Method 1: Explicit role definition (current approach)
{
  path: '/statistics',
  element: (
    <ProtectedRoute excludedRoles={['Operator1', 'Operator2']}>
      <Suspense fallback={<PageLoader />}>
        <Statistics />
      </Suspense>
    </ProtectedRoute>
  ),
}

// Method 2: Using centralized config (alternative)
{
  path: '/statistics',
  element: (
    <ProtectedRoute useCentralizedConfig={true}>
      <Suspense fallback={<PageLoader />}>
        <Statistics />
      </Suspense>
    </ProtectedRoute>
  ),
}
```

### 3. Sidebar Auto-Sync

The sidebar automatically syncs with route permissions by importing from the centralized config:

```javascript
// src/utils/sidebarLinks.js
import { getRoutePermissions } from './routePermissions';

const sidebarLinks = [
  {
    title: "Statistika",
    icon: "presentationChart",
    path: "/statistics",
    ...getRoutePermissions('/statistics'), // Automatically applies same permissions
  },
];
```

## Current Role Configuration

### Available Roles
- `CEO`
- `Operator1`
- `Operator2`
- Other roles (as defined in your system)

### Current Permissions

| Route | Accessible To | Restricted From |
|-------|--------------|-----------------|
| `/dashboard` | All authenticated users | None |
| `/clients` | All authenticated users | None |
| `/calendar` | All authenticated users | None |
| `/statistics` | CEO and other roles | Operator1, Operator2 |
| `/products` | All authenticated users | None |
| `/leads` | Operator1, Operator2, CEO | All other roles |

## Adding a New Protected Route

### Step 1: Add to routePermissions.js

```javascript
const routePermissions = {
  // ... existing routes
  '/admin': {
    allowedRoles: ['CEO'], // Only CEO can access
  },
};
```

### Step 2: Add to sidebarLinks.js (if needed in sidebar)

```javascript
const sidebarLinks = [
  // ... existing links
  {
    title: "Admin",
    icon: "settings",
    path: "/admin",
    ...getRoutePermissions('/admin'),
  },
];
```

### Step 3: Wrap route in routes.jsx

```javascript
{
  path: '/admin',
  element: (
    <ProtectedRoute allowedRoles={['CEO']}>
      <Suspense fallback={<PageLoader />}>
        <Admin />
      </Suspense>
    </ProtectedRoute>
  ),
}
```

## User Authentication

The system uses the `useAuth` hook to get the current user's role:

```javascript
const { user, isAuthenticated } = useAuth();
const userRole = user?.U_role; // Role property from user object
```

## Behavior

### Unauthorized Access Attempts

- **Not authenticated** → Redirects to `/login`
- **Authenticated but no access** → Redirects to `/404`
- **Has access** → Renders the requested page

### Sidebar Behavior

- Links that user cannot access are **hidden** from the sidebar
- No visual indication of hidden links (they simply don't appear)

## Testing

To test role-based access:

1. **Login as different roles**
2. **Check sidebar** - Verify correct links are visible
3. **Try direct URL access** - Attempt to navigate to restricted pages directly
4. **Verify redirect** - Confirm unauthorized access redirects to 404

## Best Practices

1. **Always define permissions in `routePermissions.js` first**
2. **Keep sidebar and route permissions in sync** (happens automatically with centralized config)
3. **Test with all role types** before deploying
4. **Document role changes** when adding new roles or modifying permissions
5. **Use `excludedRoles` for exceptions**, `allowedRoles` for exclusive access

## Troubleshooting

**Issue**: User can access page via URL even though sidebar link is hidden
- **Solution**: Ensure the route is wrapped with `<ProtectedRoute>` in `routes.jsx`

**Issue**: Sidebar and route permissions don't match
- **Solution**: Make sure `sidebarLinks.js` uses `...getRoutePermissions('/path')`

**Issue**: All users redirected to 404
- **Solution**: Check that `user.U_role` property exists and matches role names in permissions

## Future Enhancements

Consider implementing:
- **Permission levels** (read, write, delete)
- **Dynamic role management** from backend
- **Permission caching** for performance
- **Audit logging** for access attempts
- **Custom "Unauthorized" page** instead of 404

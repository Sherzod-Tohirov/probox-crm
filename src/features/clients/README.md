# Clients Feature Module

## Overview
This module contains all the feature-specific code for the Clients page, following the Feature-First architecture pattern.

## Structure

```
features/clients/
├── components/
│   ├── ClientsToolbar/          # Toolbar with zoom/density controls
│   ├── Filter/                  # Client filtering component
│   ├── ClientsPageFooter/       # Footer with pagination & actions
│   └── ...
├── hooks/
│   ├── useUIScale.js            # Global UI zoom management
│   ├── useTableDensity.js       # Table density controls
│   ├── useScrollRestoration.js  # Scroll position preservation
│   ├── useModalAutoClose.js     # Auto-close modals on events
│   └── useClientsTableColumns.js # Table columns configuration
└── README.md
```

## Custom Hooks

### `useUIScale()`
Manages global UI scaling (zoom in/out for entire application).

**Returns:**
- `uiScale` - Current scale value (0.5 - 2.0)
- `increaseScale()` - Increase scale by 0.1
- `decreaseScale()` - Decrease scale by 0.1
- `resetScale()` - Reset to 1.0
- `canIncrease` - Boolean flag
- `canDecrease` - Boolean flag
- `isDefault` - Boolean flag

**Storage:** `localStorage` as `uiScale`

### `useTableDensity(storageKey)`
Manages table row density (spacing/font size).

**Parameters:**
- `storageKey` - sessionStorage key (default: 'tableDensity')

**Returns:**
- `tableDensity` - Current density ('xxcompact' | 'xcompact' | 'compact' | 'normal' | 'large' | 'xlarge')
- `tableDensityClass` - CSS class string
- `increaseDensity()` - More spacing
- `decreaseDensity()` - Less spacing
- `resetDensity()` - Reset to 'normal'
- `isMinDensity` - Boolean flag
- `isMaxDensity` - Boolean flag
- `isDefaultDensity` - Boolean flag

**Storage:** `sessionStorage`

### `useScrollRestoration({ scrollContainerRef, storageKey, hasData })`
Preserves and restores scroll position during navigation.

**Parameters:**
- `scrollContainerRef` - Ref to scrollable element
- `storageKey` - sessionStorage key
- `hasData` - Whether data is loaded

**Returns:**
- `saveScrollPosition()` - Save current scroll position

**Usage:**
```javascript
const { saveScrollPosition } = useScrollRestoration({
  scrollContainerRef: tableRef,
  storageKey: 'scrollPositionClients',
  hasData: data?.length > 0,
});

// Call before navigation
const handleRowClick = () => {
  saveScrollPosition();
  navigate('/somewhere');
};
```

### `useModalAutoClose(scrollContainerRef)`
Automatically closes all modals on route change or scroll events.

**Parameters:**
- `scrollContainerRef` - Ref to scrollable element

**Side Effects:**
- Dispatches `closeAllModals()` on pathname change
- Dispatches `closeAllModals()` on scroll

## Components

### `<ClientsToolbar />`
Consolidated toolbar with all controls for the Clients page.

**Props:**
- `uiScale` - Current UI scale
- `onIncreaseUIScale` - Handler
- `onDecreaseUIScale` - Handler
- `onResetUIScale` - Handler
- `onIncreaseDensity` - Handler
- `onDecreaseDensity` - Handler
- `onResetDensity` - Handler
- `onToggleFilter` - Handler
- `isMobile` - Boolean
- `canIncreaseUI` - Boolean
- `canDecreaseUI` - Boolean
- `isDefaultUI` - Boolean
- `isMinDensity` - Boolean
- `isMaxDensity` - Boolean
- `isDefaultDensity` - Boolean

## Refactoring Benefits

### Before (359 lines)
- All logic in single component
- Repetitive code
- Hard to test
- Poor reusability

### After (201 lines)
- **44% size reduction** (359 → 201 lines)
- Logic extracted to reusable hooks
- Toolbar as separate component
- Clean separation of concerns
- Easy to test and maintain
- Hooks can be reused in other pages

## Code Quality Improvements

1. **Single Responsibility** - Each hook does one thing
2. **DRY Principle** - No repeated logic
3. **Testability** - Hooks can be tested in isolation
4. **Maintainability** - Clear code organization
5. **Reusability** - Hooks work anywhere
6. **Type Safety** - Clear parameter/return types

## Migration Guide

If you need to use these features in other pages:

```javascript
import useUIScale from '@features/clients/hooks/useUIScale';
import useTableDensity from '@features/clients/hooks/useTableDensity';

function MyPage() {
  const { uiScale, increaseScale } = useUIScale();
  const { tableDensityClass, increaseDensity } = useTableDensity('myPageDensity');
  
  // Use as needed
}
```

## Performance Notes

- All hooks use proper memoization (`useCallback`, `useMemo`)
- SessionStorage for page-specific settings
- LocalStorage for global settings
- Minimal re-renders through careful dependency management

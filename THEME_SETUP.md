# Theme System Documentation

## Overview
This application now supports **Light Mode**, **Dark Mode**, and **Auto Mode** (follows system preference).

## Features
- ✅ Light theme
- ✅ Dark theme  
- ✅ Auto mode (follows system settings)
- ✅ **Icon-based theme toggle** in Header (cycles through modes)
- ✅ Persistent theme selection (saved to localStorage)
- ✅ Smooth theme transitions
- ✅ All CSS variables automatically switch
- ✅ Optimized dark mode colors for better contrast
- ✅ Logo inverts automatically in dark mode

## Theme Options (Uzbek)
- **Yorug** 🌞 - Light mode (Sun icon)
- **Qorong'i** 🌙 - Dark mode (Moon icon)
- **Avto** 🖥️ - Auto (Monitor icon - follows system)

## How to Use
Click the theme icon in the header to cycle through modes:
- Light → Dark → Auto → Light (repeats)

## How It Works

### 1. Redux Store (`src/store/slices/themeSlice.js`)
Manages theme state with:
- `setTheme(mode)` - Change theme ('light' | 'dark' | 'auto')
- `initializeTheme()` - Initialize theme on app load

### 2. Custom Hook (`src/hooks/useTheme.js`)
Easy theme access in any component:
```javascript
import useTheme from '@hooks/useTheme';

const { mode, currentTheme, changeTheme } = useTheme();
// mode: 'light' | 'dark' | 'auto'
// currentTheme: actual applied theme ('light' | 'dark')
// changeTheme: function to change theme
```

### 3. CSS Variables (`src/assets/styles/_theme.scss`)
All colors are now CSS custom properties that automatically switch:
- `:root` and `[data-theme='light']` - Light theme colors
- `[data-theme='dark']` - Dark theme colors

### 4. Theme Selector Component (`src/components/ThemeSelector`)
Dropdown in header to select theme mode.

## Usage in Components

The theme automatically applies to all components using the SCSS variables because they now reference CSS custom properties:

```scss
// Old way (static)
color: #3c3f47;

// New way (theme-aware)
color: var(--primary-color);
```

All existing SCSS variables (`$primary-color`, `$primary-bg`, etc.) now map to CSS custom properties, so no changes needed in your components!

## Adding New Theme Colors

To add a new themeable color:

1. Add to `_theme.scss`:
```scss
:root, [data-theme='light'] {
  --my-new-color: #ffffff;
}

[data-theme='dark'] {
  --my-new-color: #000000;
}
```

2. Add to `_variables.scss`:
```scss
$my-new-color: var(--my-new-color);
```

3. Use in your styles:
```scss
.my-element {
  color: v.$my-new-color;
}
```

## Browser Support
Works with all modern browsers that support CSS custom properties.

## Performance
- Theme changes are instant
- Smooth 0.2s transitions on color properties
- Excludes animations/motions to prevent conflicts
- Uses localStorage for persistence

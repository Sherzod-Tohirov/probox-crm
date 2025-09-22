// breakpoints in pixels
export const breakpoints = {
  xs: 0, // Mobile
  sm: 576, // Small
  md: 1200, // Tablet
  lg: 1280, // Desktop
  xl: 1380, // Large desktop (optional)
};

export const getBreakpointValue = (value, breakpoint = 'md') => {
  if (typeof value === 'object') {
    return value[breakpoint] || value.md || value.xs || 'auto';
  }
  return value;
};

import { forwardRef, memo } from 'react';
import styles from './col.module.scss';
import classNames from 'classnames';

// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

// Default breakpoints (consistent with Row component)
const breakpoints = {
  xs: '0px', // Extra small (mobile)
  sm: '576px', // Small
  md: '768px', // Medium (tablet)
  lg: '992px', // Large (desktop)
};

/**
 * Col Component - Flexible column component with responsive support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.direction - Direction of the column ('row' or 'column')
 * @param {number|Object} props.span - Column span (1-24) or responsive object { xs: 24, md: 16 }
 * @param {boolean|Object} props.flexGrow - Whether to grow or responsive object { xs: false, md: true }
 * @param {string|Object} props.align - Alignment ('start', 'center', 'end') or responsive object
 * @param {string|Object} props.justify - Justification ('start', 'center', 'end', 'space-between') or responsive object
 * @param {boolean|Object} props.fullWidth - Full width or responsive object { xs: true, md: false }
 * @param {boolean|Object} props.fullHeight - Full height or responsive object { xs: true, md: false }
 * @param {number|Object} props.offset - Column offset (0-23) or responsive object { xs: 0, md: 3 }
 * @param {number|Object} props.gutter - Gap between children (rem units) or responsive object
 * @param {string} props.className - Additional CSS classes
 * @param {boolean} props.wrap - Whether to wrap children
 * @param {Object} props.style - Inline styles
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.Component} Col component
 */
function Col(
  {
    children,
    span,
    flexGrow = false,
    align = '',
    justify = '',
    direction = 'row',
    fullWidth = false,
    fullHeight = false,
    offset,
    gutter = 0,
    className,
    wrap = false,
    style,
    // Strip responsive sizing hints so they don't leak to the DOM
    xs,
    sm,
    md,
    lg,
    xl,
    ...props
  },
  ref
) {
  // Handle responsive span with CSS custom properties
  const getResponsiveSpanStyles = () => {
    if (!isResponsiveProp(span)) return {};

    const responsiveStyles = {};
    Object.keys(span).forEach((bp) => {
      const spanValue = span[bp];
      responsiveStyles[`--span-${bp}`] = `${(spanValue / 24) * 100}%`;
    });
    return responsiveStyles;
  };

  // Handle responsive offset with CSS custom properties
  const getResponsiveOffsetStyles = () => {
    if (!isResponsiveProp(offset)) return {};

    const responsiveStyles = {};
    Object.keys(offset).forEach((bp) => {
      const offsetValue = offset[bp];
      responsiveStyles[`--offset-${bp}`] = `${(offsetValue / 24) * 100}%`;
    });
    return responsiveStyles;
  };

  // Build responsive styles
  const colStyle = {
    display: 'flex',
    boxSizing: 'border-box',

    // Apply default styles for scalar props (using 24-column grid system)
    ...(typeof span === 'number'
      ? { flex: `0 0 ${(span / 24) * 100}%`, maxWidth: `${(span / 24) * 100}%` }
      : {}),
    ...(typeof offset === 'number'
      ? { marginLeft: `${(offset / 24) * 100}%` }
      : {}),
    ...(typeof gutter === 'number' ? { gap: `${gutter}rem` } : {}),
    flexWrap: wrap ? 'wrap' : 'nowrap',
    flexDirection: direction || 'row',
    flexGrow: typeof flexGrow === 'boolean' ? (flexGrow ? 1 : 0) : undefined,
    alignSelf: typeof align === 'string' && align ? align : undefined,
    justifySelf: typeof justify === 'string' && justify ? justify : undefined,
    width: typeof fullWidth === 'boolean' && fullWidth ? '100%' : 'auto',
    height: typeof fullHeight === 'boolean' && fullHeight ? '100%' : 'auto',

    // Add responsive custom properties
    ...getResponsiveSpanStyles(),
    ...getResponsiveOffsetStyles(),
    ...style,
  };

  return (
    <div
      ref={ref}
      className={classNames(
        styles.col,
        isResponsiveProp(span) ? 'col-responsive-span' : '',
        isResponsiveProp(offset) ? 'col-responsive-offset' : '',
        className
      )}
      style={colStyle}
      {...props}
    >
      {children}
    </div>
  );
}

export default memo(forwardRef(Col));

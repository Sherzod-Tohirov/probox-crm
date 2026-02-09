import { forwardRef, memo } from 'react';
import styles from './col.module.scss';
import classNames from 'classnames';

// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

/**
 * Col Component - Flexible column component with responsive support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {string} props.direction - Direction of the column ('row' or 'column')
 * @param {number|Object} props.span - Column span (1-24) or responsive object { xs: 24, md: 16 }
 * @param {number} props.xs - Shorthand for span at xs breakpoint (0-24)
 * @param {number} props.sm - Shorthand for span at sm breakpoint (0-24)
 * @param {number} props.md - Shorthand for span at md breakpoint (0-24)
 * @param {number} props.lg - Shorthand for span at lg breakpoint (0-24)
 * @param {number} props.xl - Shorthand for span at xl breakpoint (0-24)
 * @param {boolean|Object} props.flexGrow - Whether to grow or responsive object { xs: false, md: true }
 * @param {boolean|number} props.flexShrink - Whether to shrink (boolean or number value)
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
 * @example
 * // Object syntax
 * <Col span={{ xs: 24, md: 12 }}>Content</Col>
 *
 * // Shorthand syntax
 * <Col xs={24} md={12}>Content</Col>
 */
function Col(
  {
    children,
    span,
    flexGrow = false,
    flexShrink,
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
    // Responsive sizing props (shorthand syntax)
    xs,
    sm,
    md,
    lg,
    xl,
    ...props
  },
  ref
) {
  // Merge shorthand responsive props (xs, sm, md, lg, xl) with span object
  const getEffectiveSpan = () => {
    // If span is an object, use it directly
    if (isResponsiveProp(span)) return span;

    // If shorthand props are provided, build span object from them
    const hasResponsiveProps =
      xs !== undefined ||
      sm !== undefined ||
      md !== undefined ||
      lg !== undefined ||
      xl !== undefined;
    if (hasResponsiveProps) {
      const responsiveSpan = {};
      if (xs !== undefined) responsiveSpan.xs = xs;
      if (sm !== undefined) responsiveSpan.sm = sm;
      if (md !== undefined) responsiveSpan.md = md;
      if (lg !== undefined) responsiveSpan.lg = lg;
      if (xl !== undefined) responsiveSpan.xl = xl;
      return responsiveSpan;
    }

    // Otherwise return the scalar span value
    return span;
  };

  const effectiveSpan = getEffectiveSpan();

  // Handle responsive span with CSS custom properties
  const getResponsiveSpanStyles = () => {
    if (!isResponsiveProp(effectiveSpan)) return {};

    const responsiveStyles = {};
    Object.keys(effectiveSpan).forEach((bp) => {
      const spanValue = effectiveSpan[bp];
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

  // Calculate flexShrink value
  const getFlexShrinkValue = () => {
    if (flexShrink === undefined) return undefined;
    if (typeof flexShrink === 'boolean') return flexShrink ? 1 : 0;
    return flexShrink;
  };

  // Build responsive styles
  const colStyle = {
    display: 'flex',
    boxSizing: 'border-box',

    // Apply default styles for scalar props (using 24-column grid system)
    ...(typeof effectiveSpan === 'number'
      ? {
          flex: `0 0 ${(effectiveSpan / 24) * 100}%`,
          maxWidth: `${(effectiveSpan / 24) * 100}%`,
        }
      : {}),
    ...(typeof offset === 'number'
      ? { marginLeft: `${(offset / 24) * 100}%` }
      : {}),
    ...(typeof gutter === 'number' ? { gap: `${gutter}rem` } : {}),
    flexWrap: wrap ? 'wrap' : 'nowrap',
    flexDirection: direction || 'row',
    flexGrow: typeof flexGrow === 'boolean' ? (flexGrow ? 1 : 0) : undefined,
    flexShrink: getFlexShrinkValue(),
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
        isResponsiveProp(effectiveSpan) ? 'col-responsive-span' : '',
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

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

// Col Component
function Col(
  {
    children,
    span, // Scalar (e.g., 6) or object (e.g., { xs: 12, md: 6 })
    flexGrow = false, // Scalar or object { xs: false, md: true }
    align = '', // Scalar or object { xs: 'start', md: 'center' }
    justify = '', // Scalar or object { xs: 'start', md: 'center' }
    fullWidth = false, // Scalar or object { xs: true, md: false }
    fullHeight = false, // Scalar or object { xs: true, md: false }
    offset, // Scalar (e.g., 3) or object { xs: 0, md: 3 }
    gutter = 0, // Scalar (e.g., 0.5) or object { xs: 0.5, md: 1 }
    className,
    style,
    ...props
  },
  ref
) {
  // Build responsive classes based on props
  const responsiveClasses = {
    span: isResponsiveProp(span)
      ? Object.keys(span).reduce((acc, bp) => {
          acc[styles[`span-${bp}-${span[bp]}`]] = true;
          return acc;
        }, {})
      : span
        ? { [styles[`span-${span}`]]: true }
        : {},
    offset: isResponsiveProp(offset)
      ? Object.keys(offset).reduce((acc, bp) => {
          acc[styles[`offset-${bp}-${offset[bp]}`]] = true;
          return acc;
        }, {})
      : offset
        ? { [styles[`offset-${offset}`]]: true }
        : {},
    flexGrow: isResponsiveProp(flexGrow)
      ? Object.keys(flexGrow).reduce((acc, bp) => {
          acc[styles[`flexGrow-${bp}-${flexGrow[bp] ? 'true' : 'false'}`]] =
            true;
          return acc;
        }, {})
      : { [styles[`flexGrow-${flexGrow ? 'true' : 'false'}`]]: true },
    align: isResponsiveProp(align)
      ? Object.keys(align).reduce((acc, bp) => {
          acc[styles[`align-${bp}-${align[bp]}`]] = true;
          return acc;
        }, {})
      : align
        ? { [styles[`align-${align}`]]: true }
        : {},
    justify: isResponsiveProp(justify)
      ? Object.keys(justify).reduce((acc, bp) => {
          acc[styles[`justify-${bp}-${justify[bp]}`]] = true;
          return acc;
        }, {})
      : justify
        ? { [styles[`justify-${justify}`]]: true }
        : {},
    fullWidth: isResponsiveProp(fullWidth)
      ? Object.keys(fullWidth).reduce((acc, bp) => {
          acc[styles[`fullWidth-${bp}-${fullWidth[bp] ? 'true' : 'false'}`]] =
            true;
          return acc;
        }, {})
      : { [styles[`fullWidth-${fullWidth ? 'true' : 'false'}`]]: true },
    fullHeight: isResponsiveProp(fullHeight)
      ? Object.keys(fullHeight).reduce((acc, bp) => {
          acc[styles[`fullHeight-${bp}-${fullHeight[bp] ? 'true' : 'false'}`]] =
            true;
          return acc;
        }, {})
      : { [styles[`fullHeight-${fullHeight ? 'true' : 'false'}`]]: true },
  };

  // Build responsive styles
  const colStyle = {
    display: 'flex',
    boxSizing: 'border-box',
    // Apply default styles for scalar props
    ...(typeof span === 'number'
      ? { flex: `0 0 ${(span / 12) * 100}%`, maxWidth: `${(span / 12) * 100}%` }
      : {}),
    ...(typeof offset === 'number'
      ? { marginLeft: `${(offset / 12) * 100}%` }
      : {}),
    ...(typeof gutter === 'number' ? { gap: `${gutter}rem` } : {}),
    flexGrow: typeof flexGrow === 'boolean' ? (flexGrow ? 1 : 0) : undefined,
    alignSelf: typeof align === 'string' && align ? align : undefined,
    justifySelf: typeof justify === 'string' && justify ? justify : undefined,
    width: typeof fullWidth === 'boolean' && fullWidth ? '100%' : 'auto',
    height: typeof fullHeight === 'boolean' && fullHeight ? '100%' : 'auto',
    ...style,
  };

  return (
    <div
      ref={ref}
      className={classNames(
        styles.col,
        responsiveClasses.span,
        responsiveClasses.offset,
        responsiveClasses.flexGrow,
        responsiveClasses.align,
        responsiveClasses.justify,
        responsiveClasses.fullWidth,
        responsiveClasses.fullHeight,
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

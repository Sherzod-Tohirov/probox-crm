import styles from './row.module.scss';
import { forwardRef, memo } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

// Default breakpoints (customize as needed)
const breakpoints = {
  xs: '0px', // Extra small (mobile)
  sm: '576px', // Small
  md: '768px', // Medium (tablet)
  lg: '992px', // Large (desktop)
};

// Row Component
function Row(
  {
    children,
    gutter = 0, // Scalar or object { xs: 0, sm: 1, md: 1.5 }
    direction = 'column', // Scalar or object { xs: 'column', md: 'row' }
    justify = 'start', // Scalar or object { xs: 'start', md: 'center' }
    align = 'start', // Scalar or object { xs: 'start', md: 'center' }
    flexGrow = false, // Scalar or object { xs: false, md: true }
    wrap = false, // Scalar or object { xs: true, md: false }
    className,
    style,
    animated = false,
    ...props
  },
  ref
) {
  // Build responsive classes based on props
  const responsiveClasses = {
    direction: isResponsiveProp(direction)
      ? Object.keys(direction).reduce((acc, bp) => {
          acc[styles[`direction-${bp}-${direction[bp]}`]] = true;
          return acc;
        }, {})
      : { [styles[`direction-${direction}`]]: true },
    justify: isResponsiveProp(justify)
      ? Object.keys(justify).reduce((acc, bp) => {
          acc[styles[`justify-${bp}-${justify[bp]}`]] = true;
          return acc;
        }, {})
      : { [styles[`justify-${justify}`]]: true },
    align: isResponsiveProp(align)
      ? Object.keys(align).reduce((acc, bp) => {
          acc[styles[`align-${bp}-${align[bp]}`]] = true;
          return acc;
        }, {})
      : { [styles[`align-${align}`]]: true },
    wrap: isResponsiveProp(wrap)
      ? Object.keys(wrap).reduce((acc, bp) => {
          acc[styles[`wrap-${bp}-${wrap ? 'wrap' : 'nowrap'}`]] = true;
          return acc;
        }, {})
      : { [styles[`wrap-${wrap ? 'wrap' : 'nowrap'}`]]: true },
    flexGrow: isResponsiveProp(flexGrow)
      ? Object.keys(flexGrow).reduce((acc, bp) => {
          acc[styles[`flexGrow-${bp}-${flexGrow[bp] ? 'true' : 'false'}`]] =
            true;
          return acc;
        }, {})
      : { [styles[`flexGrow-${flexGrow ? 'true' : 'false'}`]]: true },
    gutter: isResponsiveProp(gutter)
      ? Object.keys(gutter).reduce((acc, bp) => {
          acc[styles[`gutter-${bp}-${gutter[bp]}rem`]] = true;
          return acc;
        }, {})
      : { [styles[`gutter-${gutter}rem`]]: true },
  };

  // Build responsive gutter styles
  const rowStyle = {
    display: 'flex',
    width: '100%',
    // Apply default gutter if scalar, otherwise rely on CSS variables
    ...(typeof gutter === 'number' ? { gap: `${gutter}rem` } : {}),
    ...style,
  };

  const Component = animated ? motion.div : 'div';

  return (
    <Component
      ref={ref}
      className={classNames(
        styles.row,
        responsiveClasses.direction,
        responsiveClasses.justify,
        responsiveClasses.align,
        responsiveClasses.wrap,
        responsiveClasses.flexGrow,
        responsiveClasses.gutter,
        className
      )}
      style={rowStyle}
      {...props}
    >
      {children}
    </Component>
  );
}

export default memo(forwardRef(Row));

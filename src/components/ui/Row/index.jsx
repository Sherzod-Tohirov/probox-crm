import styles from './row.module.scss';
import { forwardRef, memo } from 'react';
import classNames from 'classnames';
import { motion } from 'framer-motion';

// Utility to check if a prop is an object for responsive values
const isResponsiveProp = (prop) => typeof prop === 'object' && prop !== null;

/**
 * Row Component - Flexible row container with responsive support
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements
 * @param {number|Object} props.gutter - Gap between children (rem units) or responsive object { xs: 0, sm: 1, md: 1.5 }
 * @param {string|Object} props.direction - Flex direction ('row', 'column') or responsive object { xs: 'column', md: 'row' }
 * @param {string|Object} props.justify - Justify content ('start', 'center', 'end', 'space-between', 'space-around') or responsive object
 * @param {string|Object} props.align - Align items ('start', 'center', 'end') or responsive object
 * @param {boolean|Object} props.flexGrow - Whether to grow or responsive object { xs: false, md: true }
 * @param {boolean|Object} props.wrap - Whether to wrap children or responsive object { xs: true, md: false }
 * @param {string} props.className - Additional CSS classes
 * @param {Object} props.style - Inline styles
 * @param {boolean} props.animated - Whether to animate with framer-motion
 * @param {React.Ref} ref - Forwarded ref
 * @returns {React.Component} Row component
 */
function Row(
  {
    children,
    gutter = 0,
    direction = 'column',
    justify = 'start',
    align = 'start',
    flexGrow = false,
    wrap = false,
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
    gutter: {}, // Will be handled via CSS custom properties
  };

  // Handle responsive gutter with CSS custom properties
  const getResponsiveGutterStyles = () => {
    if (!isResponsiveProp(gutter)) return {};

    const responsiveStyles = {};
    Object.keys(gutter).forEach((bp) => {
      const gutterValue = gutter[bp];
      responsiveStyles[`--gutter-${bp}`] = `${gutterValue}rem`;
    });
    return responsiveStyles;
  };

  // Build responsive gutter data attributes
  const getGutterDataAttributes = () => {
    if (!isResponsiveProp(gutter)) return {};

    const dataAttributes = {};
    Object.keys(gutter).forEach((bp) => {
      dataAttributes[`data-gutter-${bp}`] = true;
    });
    return dataAttributes;
  };

  // Build responsive gutter styles
  const rowStyle = {
    display: 'flex',
    width: '100%',
    // Apply default gutter if scalar, otherwise rely on CSS variables
    ...(typeof gutter === 'number' ? { gap: `${gutter}rem` } : {}),
    // Add responsive custom properties
    ...getResponsiveGutterStyles(),
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
      {...getGutterDataAttributes()}
      {...props}
    >
      {children}
    </Component>
  );
}

export default memo(forwardRef(Row));

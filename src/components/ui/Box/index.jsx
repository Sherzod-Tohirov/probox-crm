import { memo, useMemo, forwardRef } from "react";
import PropTypes from "prop-types";
import styles from "./box.module.scss";
import classNames from "classnames";
import { motion } from "framer-motion";

const boxPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  component: PropTypes.elementType,
  dir: PropTypes.oneOf(['row', 'column', 'row-reverse', 'column-reverse', 'col']),
  align: PropTypes.oneOf(['start', 'center', 'end', 'stretch', 'baseline', 'flex-start', 'flex-end']),
  justify: PropTypes.oneOf(['start', 'center', 'end', 'space-between', 'space-around', 'space-evenly', 'flex-start', 'flex-end']),
  gap: PropTypes.number,
  pos: PropTypes.oneOf(['static', 'relative', 'absolute', 'fixed', 'sticky']),
  height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  padding: PropTypes.number,
  paddingX: PropTypes.number,
  paddingY: PropTypes.number,
  paddingTop: PropTypes.number,
  paddingBottom: PropTypes.number,
  paddingLeft: PropTypes.number,
  paddingRight: PropTypes.number,
  margin: PropTypes.number,
  marginX: PropTypes.number,
  marginY: PropTypes.number,
  marginTop: PropTypes.number,
  marginBottom: PropTypes.number,
  marginLeft: PropTypes.number,
  marginRight: PropTypes.number,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  'data-testid': PropTypes.string,
  id: PropTypes.string,
  role: PropTypes.string,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  tabIndex: PropTypes.number,
  style: PropTypes.object,
};

/**
 * Box Component - Flexible container with layout and spacing utilities
 * 
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Child elements to render inside the box
 * @param {string} [props.className] - Additional CSS classes
 * @param {React.ElementType} [props.component] - Component to render (defaults to motion.div)
 * @param {'row'|'column'|'row-reverse'|'column-reverse'|'col'} [props.dir='row'] - Flex direction ('col' is alias for 'column')
 * @param {'start'|'center'|'end'|'stretch'|'baseline'|'flex-start'|'flex-end'} [props.align='start'] - Align items (cross-axis)
 * @param {'start'|'center'|'end'|'space-between'|'space-around'|'space-evenly'|'flex-start'|'flex-end'} [props.justify='start'] - Justify content (main-axis)
 * @param {number} [props.gap=0] - Gap between children in rem units
 * @param {'static'|'relative'|'absolute'|'fixed'|'sticky'} [props.pos='static'] - CSS position property
 * @param {string|number} [props.height='auto'] - Height of the box
 * @param {string|number} [props.width='100%'] - Width of the box
 * @param {number} [props.padding=0] - Padding for all sides in rem units
 * @param {number} [props.paddingX=0] - Horizontal padding (left and right) in rem units
 * @param {number} [props.paddingY=0] - Vertical padding (top and bottom) in rem units
 * @param {number} [props.paddingTop=0] - Top padding in rem units
 * @param {number} [props.paddingBottom=0] - Bottom padding in rem units
 * @param {number} [props.paddingLeft=0] - Left padding in rem units
 * @param {number} [props.paddingRight=0] - Right padding in rem units
 * @param {number} [props.margin=0] - Margin for all sides in rem units
 * @param {number} [props.marginX=0] - Horizontal margin (left and right) in rem units
 * @param {number} [props.marginY=0] - Vertical margin (top and bottom) in rem units
 * @param {number} [props.marginTop=0] - Top margin in rem units
 * @param {number} [props.marginBottom=0] - Bottom margin in rem units
 * @param {number} [props.marginLeft=0] - Left margin in rem units
 * @param {number} [props.marginRight=0] - Right margin in rem units
 * @param {Function} [props.onClick] - Click event handler
 * @param {Function} [props.onMouseEnter] - Mouse enter event handler
 * @param {Function} [props.onMouseLeave] - Mouse leave event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {string} [props.data-testid] - Test ID for testing frameworks
 * @param {string} [props.id] - HTML id attribute
 * @param {string} [props.role] - ARIA role attribute
 * @param {string} [props.aria-label] - ARIA label for accessibility
 * @param {string} [props.aria-describedby] - ARIA described by reference
 * @param {number} [props.tabIndex] - Tab index for keyboard navigation
 * @param {Object} [props.style] - Inline styles object
 * 
 * @example
 * // Basic flex container
 * <Box dir="row" align="center" justify="space-between">
 *   <div>Left</div>
 *   <div>Right</div>
 * </Box>
 * 
 * @example
 * // Column layout with spacing
 * <Box dir="column" gap={2} padding={3}>
 *   <div>Item 1</div>
 *   <div>Item 2</div>
 * </Box>
 * 
 * @example
 * // Centered content with custom dimensions
 * <Box 
 *   align="center" 
 *   justify="center" 
 *   height="200px" 
 *   width="300px"
 *   padding={2}
 * >
 *   Centered content
 * </Box>
 * 
 * @example
 * // Using shorthand 'col' for column direction
 * <Box dir="col" gap={1} paddingY={2}>
 *   <div>Stacked item 1</div>
 *   <div>Stacked item 2</div>
 * </Box>
 */
const Box = forwardRef(({
  children,
  dir = "row",
  align = "start",
  justify = "start",
  gap = 0,
  pos = "static",
  height = "auto",
  width = "100%",
  padding = 0,
  paddingX = 0,
  paddingY = 0,
  paddingTop = 0,
  paddingBottom = 0,
  paddingLeft = 0,
  paddingRight = 0,
  margin = 0,
  marginX = 0,
  marginY = 0,
  marginTop = 0,
  marginBottom = 0,
  marginLeft = 0,
  marginRight = 0,
  className,
  component,
  ...props
}, ref) => {
  const boxStyle = useMemo(
    () => ({
      position: pos,
      width: width || "100%",
      height,
      flexDirection: dir === 'col' ? 'column' : dir, // Handle 'col' alias
      alignItems: align,
      justifyContent: justify,
      gap: `${gap}rem`,
      padding: `${paddingTop || paddingY || padding}rem ${
        paddingRight || paddingX || padding
      }rem ${paddingBottom || paddingY || padding}rem ${
        paddingLeft || paddingX || padding
      }rem`,
      margin: `${marginTop || marginY || margin}rem ${
        marginRight || marginX || margin
      }rem ${marginBottom || marginY || margin}rem ${
        marginLeft || marginX || margin
      }rem`,
      ...props.style,
    }),
    [
      dir,
      gap,
      align,
      justify,
      pos,
      width,
      height,
      padding,
      paddingX,
      paddingY,
      paddingTop,
      paddingBottom,
      paddingLeft,
      paddingRight,
      margin,
      marginX,
      marginY,
      marginTop,
      marginBottom,
      marginLeft,
      marginRight,
      props.style,
    ]
  );
  const Component = component || motion.div;
  return (
    <Component
      ref={ref}
      style={{ ...boxStyle }}
      className={classNames(styles.box, className)}
      {...props}>
      {children}
    </Component>
  );
});

const ForwardedBox = memo(Box);
ForwardedBox.propTypes = boxPropTypes;

export default ForwardedBox;

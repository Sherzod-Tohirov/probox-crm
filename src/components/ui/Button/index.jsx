import { OrbitProgress } from 'react-loading-indicators';
import { motion } from 'framer-motion';
import { forwardRef, memo, useMemo } from 'react';

import styles from './button.module.scss';
import iconsMap from '@utils/iconsMap';
import classNames from 'classnames';

import Typography from '../Typography';
import Box from '../Box';
import PropTypes from 'prop-types';

const buttonPropTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  variant: PropTypes.oneOf(['filled', 'outlined', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'danger']),
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  iconSize: PropTypes.oneOf([12, 16, 18, 20, 24, 28, 32]),
  iconColor: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  animated: PropTypes.bool,
  onClick: PropTypes.func,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
  onFocus: PropTypes.func,
  onBlur: PropTypes.func,
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
  form: PropTypes.string,
  name: PropTypes.string,
  value: PropTypes.string,
  tabIndex: PropTypes.number,
  'aria-label': PropTypes.string,
  'aria-describedby': PropTypes.string,
  'data-testid': PropTypes.string,
};

/**
 * Button Component - Flexible button with multiple variants, icons, and states
 *
 * @param {Object} props - Component props
 * @param {React.ReactNode} props.children - Button content (text, elements)
 * @param {string} [props.className] - Additional CSS classes
 * @param {'filled'|'outlined'|'text'} [props.variant='filled'] - Button style variant
 * @param {'primary'|'secondary'|'info'|'danger'} [props.color] - Button color theme
 * @param {string} [props.icon] - Icon name from iconsMap
 * @param {'left'|'right'} [props.iconPosition='left'] - Icon position relative to text
 * @param {12|16|18|20|24|28|32} [props.iconSize=24] - Icon size in pixels
 * @param {'primary'|'secondary'|'danger'} [props.iconColor] - Icon color theme
 * @param {boolean} [props.isLoading=false] - Show loading spinner
 * @param {boolean} [props.fullWidth=false] - Take full width of container
 * @param {boolean} [props.disabled=false] - Disable button interactions
 * @param {boolean} [props.animated=true] - Enable hover/click animations
 * @param {Function} [props.onClick] - Click event handler
 * @param {Function} [props.onMouseEnter] - Mouse enter event handler
 * @param {Function} [props.onMouseLeave] - Mouse leave event handler
 * @param {Function} [props.onFocus] - Focus event handler
 * @param {Function} [props.onBlur] - Blur event handler
 * @param {'button'|'submit'|'reset'} [props.type='button'] - Button type attribute
 * @param {string} [props.form] - Form ID this button belongs to
 * @param {string} [props.name] - Button name attribute
 * @param {string} [props.value] - Button value attribute
 * @param {number} [props.tabIndex] - Tab index for keyboard navigation
 * @param {string} [props.aria-label] - Accessibility label
 * @param {string} [props.aria-describedby] - Accessibility description reference
 * @param {string} [props.data-testid] - Test ID for testing frameworks
 *
 * @example
 * // Basic button
 * <Button>Click me</Button>
 *
 * @example
 * // Button with icon and loading state
 * <Button
 *   icon="save"
 *   iconPosition="left"
 *   isLoading={saving}
 *   onClick={handleSave}
 * >
 *   Save Changes
 * </Button>
 *
 * @example
 * // Danger variant with full width
 * <Button
 *   variant="filled"
 *   color="danger"
 *   fullWidth
 *   onClick={handleDelete}
 * >
 *   Delete Item
 * </Button>
 *
 * @example
 * // Outlined button with icon
 * <Button
 *   variant="outlined"
 *   icon="home"
 *   onClick={handleHome}
 * >
 *   Go Home
 * </Button>
 */
function Button(
  {
    children,
    className,
    variant = 'filled',
    color,
    icon,
    iconPosition = 'left',
    iconSize = 24,
    iconColor,
    isLoading = false,
    fullWidth = false,
    disabled = false,
    animated = true,
    ...props
  },
  ref
) {
  const Component = useMemo(
    () => (animated ? motion.button : 'button'),
    [animated]
  );

  return (
    <Component
      ref={ref}
      className={classNames(
        className,
        styles['btn'],
        styles[variant],
        styles[color],
        styles[`icon-${iconColor}-color`],
        disabled && styles['disabled'],
        isLoading && styles['loading'],
        fullWidth && styles['full-width'],
        { icon }
      )}
      {...(animated
        ? {
            whileTap: { scale: 0.95 },
            whileHover: { scale: 1.05 },
            animate: { scale: animated ? 1 : 0 },
            transition: {
              type: 'spring',
              stiffness: 300,
              damping: 15,
              duration: 0.1,
            },
          }
        : {})}
      disabled={disabled || isLoading}
      aria-disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <div className={styles['loading-wrapper']}>
          <OrbitProgress style={{ fontSize: '1rem' }} color="currentColor" />
        </div>
      ) : null}
      <Box
        className={classNames(
          styles[iconPosition],
          isLoading && styles['hide']
        )}
        gap={2}
        align="center"
        justify="center"
      >
        {icon ? (
          <Typography
            element="span"
            className={classNames(
              styles['icon-text'],
              styles[`icon-size-${iconSize}px`]
            )}
          >
            {iconsMap[icon]}
          </Typography>
        ) : (
          ''
        )}
        {children}
      </Box>
    </Component>
  );
}

const ForwardedButton = memo(forwardRef(Button));
ForwardedButton.propTypes = buttonPropTypes;
ForwardedButton.defaultProps = {
  variant: 'filled',
  iconPosition: 'left',
  iconSize: 24,
  isLoading: false,
  fullWidth: false,
  disabled: false,
  animated: true,
  type: 'button',
};

export default ForwardedButton;

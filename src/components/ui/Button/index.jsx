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
  variant: PropTypes.oneOf(['filled', 'text']),
  color: PropTypes.oneOf(['primary', 'secondary', 'info', 'danger']),
  icon: PropTypes.string,
  iconPosition: PropTypes.oneOf(['left', 'right']),
  iconSize: PropTypes.oneOf([12, 16, 18, 20, 24, 28, 32]),
  iconColor: PropTypes.oneOf(['primary', 'secondary', 'danger']),
  isLoading: PropTypes.bool,
  fullWidth: PropTypes.bool,
  disabled: PropTypes.bool,
  animated: PropTypes.bool,
};

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
      whileTap={{ scale: 0.95 }}
      whileHover={{ scale: 1.05 }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 15,
        duration: 0.1,
      }}
      disabled={isLoading}
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

export default ForwardedButton;

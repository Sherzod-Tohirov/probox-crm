import classNames from 'classnames';
import PropTypes from 'prop-types';
import { forwardRef, memo, useState } from 'react';
import styles from './avatar.module.scss';

function Avatar(
  {
    src,
    alt,
    name,
    size = 'md',
    shape = 'circle',
    className,
    fallbackColor,
    showBorder = false,
    status,
    ...props
  },
  ref
) {
  const [imageError, setImageError] = useState(false);

  // Generate initials from name
  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(' ');
    if (parts.length === 1) {
      return parts[0].charAt(0).toUpperCase();
    }
    return (
      parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
    ).toUpperCase();
  };

  // Generate a consistent color based on name
  const getColorFromName = (name) => {
    if (fallbackColor) return fallbackColor;
    if (!name) return 'primary';

    const colors = ['primary', 'secondary', 'tertiary', 'fourth', 'fifth'];
    const charCode = name.charCodeAt(0);
    return colors[charCode % colors.length];
  };

  const showImage = src && !imageError;
  const initials = getInitials(name || alt);
  const avatarColor = getColorFromName(name || alt);

  return (
    <div
      ref={ref}
      className={classNames(
        styles.avatar,
        styles[size],
        styles[shape],
        {
          [styles['with-border']]: showBorder,
          [styles[`status-${status}`]]: status,
        },
        className
      )}
      {...props}
    >
      {showImage ? (
        <img
          src={src}
          alt={alt || name || 'Avatar'}
          className={styles['avatar-image']}
          onError={() => setImageError(true)}
        />
      ) : (
        <div
          className={classNames(
            styles['avatar-fallback'],
            styles[`color-${avatarColor}`]
          )}
        >
          {initials}
        </div>
      )}
      {status && <span className={styles['status-indicator']} />}
    </div>
  );
}

const ForwardedAvatar = memo(forwardRef(Avatar));

ForwardedAvatar.propTypes = {
  src: PropTypes.string,
  alt: PropTypes.string,
  name: PropTypes.string,
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', '2xl']),
  shape: PropTypes.oneOf(['circle', 'square', 'rounded']),
  className: PropTypes.string,
  fallbackColor: PropTypes.oneOf([
    'primary',
    'secondary',
    'tertiary',
    'fourth',
    'fifth',
  ]),
  showBorder: PropTypes.bool,
  status: PropTypes.oneOf(['online', 'offline', 'away', 'busy']),
};

ForwardedAvatar.defaultProps = {
  size: 'md',
  shape: 'circle',
  showBorder: false,
};

export default ForwardedAvatar;

import classNames from 'classnames';
import styles from '../input.module.scss';

export const computeInputClasses = ({ variant, type, placeholderColor = 'primary', disabled, error, className }) =>
  classNames(
    styles['input'],
    styles[variant],
    styles[type],
    styles[`placeholder-${placeholderColor}`],
    styles[disabled ? 'disabled' : ''],
    styles[error ? 'error' : ''],
    className,
    { [styles.error]: !!error }
  );

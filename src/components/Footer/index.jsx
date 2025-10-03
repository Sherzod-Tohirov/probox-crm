import classNames from 'classnames';
import styles from './footer.module.scss';

export default function Footer({ children, className }) {
  return (
    <footer className={classNames(styles['footer'], className)}>{children}</footer>
  );
}

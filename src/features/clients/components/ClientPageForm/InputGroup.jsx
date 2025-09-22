import styles from './style.module.scss';
export default function InputGroup({ children, ...props }) {
  return (
    <div className={styles.inputGroup} {...props}>
      {children}
    </div>
  );
}

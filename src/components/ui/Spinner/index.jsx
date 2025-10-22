import React from 'react';
import styles from './spinner.module.scss';

export default function Spinner({ size = 'medium', className = '', ...props }) {
  return (
    <div className={`${styles.spinner} ${styles[size]} ${className}`} {...props}>
      <div className={styles['spinner-circle']}></div>
    </div>
  );
}

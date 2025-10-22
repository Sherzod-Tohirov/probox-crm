import React from 'react';
import { Typography } from '@components/ui';
import styles from './card.module.scss';

export default function Card({ title, children, className = '', ...props }) {
  const renderTitle = () => {
    if (!title) return null;
    
    // If title is a string, wrap it in Typography
    if (typeof title === 'string') {
      return (
        <div className={styles['card-header']}>
          <Typography variant="h5" element="h2" className={styles['card-title']}>
            {title}
          </Typography>
        </div>
      );
    }
    
    // If title is a React node, render it directly in header
    return (
      <div className={styles['card-header']}>
        {title}
      </div>
    );
  };

  return (
    <div className={`${styles['card']} ${className}`} {...props}>
      {renderTitle()}
      <div className={styles['card-body']}>
        {children}
      </div>
    </div>
  );
}

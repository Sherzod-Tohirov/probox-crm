import React from 'react';
import { Typography } from '@components/ui';
import styles from './card.module.scss';

export default function Card({ title, rightTitle, children, className = '', ...props }) {
  const renderTitle = () => {
    if (!title && !rightTitle) return null;
    
    // If title is a string, wrap it in Typography
    if (typeof title === 'string') {
      return (
        <div className={styles['card-header']}>
          <Typography variant="h5" element="h2" className={styles['card-title']}>
            {title}
          </Typography>
          {rightTitle && (
            <div className={styles['card-right-title']}>
              {typeof rightTitle === 'string' ? (
                <Typography variant="body1" className={styles['card-right-title-text']}>
                  {rightTitle}
                </Typography>
              ) : (
                rightTitle
              )}
            </div>
          )}
        </div>
      );
    }
    
    // If title is a React node, render it directly in header
    return (
      <div className={styles['card-header']}>
        {title}
        {rightTitle && (
          <div className={styles['card-right-title']}>
            {typeof rightTitle === 'string' ? (
              <Typography variant="body1" className={styles['card-right-title-text']}>
                {rightTitle}
              </Typography>
            ) : (
              rightTitle
            )}
          </div>
        )}
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

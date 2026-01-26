import styles from './skeleton.module.scss';

export default function Skeleton({ 
  width = '100%', 
  height = '20px', 
  borderRadius = '4px',
  className = '',
  ...props 
}) {
  return (
    <div 
      className={`${styles.skeleton} ${className}`}
      style={{ width, height, borderRadius }}
      {...props}
    />
  );
}

// Predefined skeleton components for common use cases
export function SkeletonText({ lines = 1, className = '', ...props }) {
  return (
    <div className={`${styles['skeleton-text']} ${className}`} {...props}>
      {Array.from({ length: lines }, (_, index) => (
        <Skeleton 
          key={index}
          height="16px"
          width={index === lines - 1 ? '70%' : '100%'}
          className={styles['skeleton-line']}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '', ...props }) {
  return (
    <div className={`${styles['skeleton-card']} ${className}`} {...props}>
      <div className={styles['skeleton-header']}>
        <Skeleton height="24px" width="200px" />
      </div>
      <div className={styles['skeleton-body']}>
        <div className={styles['skeleton-row']}>
          <Skeleton height="16px" width="120px" />
          <Skeleton height="40px" width="100%" />
        </div>
        <div className={styles['skeleton-row']}>
          <Skeleton height="16px" width="100px" />
          <Skeleton height="40px" width="100%" />
        </div>
        <div className={styles['skeleton-row']}>
          <Skeleton height="16px" width="140px" />
          <Skeleton height="40px" width="100%" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonNavigation({ className = '', ...props }) {
  return (
    <div className={`${styles['skeleton-navigation']} ${className}`} {...props}>
      <Skeleton height="36px" width="100px" borderRadius="8px" />
      <div className={styles['skeleton-divider']} />
      <div className={styles['skeleton-breadcrumb']}>
        <Skeleton height="20px" width="60px" />
        <span className={styles['skeleton-arrow']}>›</span>
        <Skeleton height="20px" width="80px" />
        <span className={styles['skeleton-arrow']}>›</span>
        <Skeleton height="20px" width="120px" />
      </div>
    </div>
  );
}

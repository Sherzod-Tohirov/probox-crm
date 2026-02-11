import Skeleton from '../Skeleton';

export default function Spinner({ size = 'medium', className = '', ...props }) {
  const sizeMap = {
    small: '24px',
    medium: '36px',
    large: '48px',
  };

  const dimension = sizeMap[size] || sizeMap.medium;

  return (
    <div className={className} {...props}>
      <Skeleton width={dimension} height={dimension} borderRadius="9999px" />
    </div>
  );
}

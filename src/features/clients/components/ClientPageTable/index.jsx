import { Table } from '@components/ui';
import styles from './style.module.scss';

export default function ClientPageTable({
  columns,
  data,
  isLoading,
  currentInstallmentId,
}) {
  const getRowStyles = (row) => {
    const isDark =
      document.documentElement.getAttribute('data-theme') === 'dark';
    
    return row['InstlmntID'] === currentInstallmentId
      ? {
          backgroundColor: isDark
            ? 'rgba(96, 165, 250, 0.15)'
            : 'rgba(10, 77, 104, 0.1)',
          borderLeft: isDark
            ? '3px solid #60a5fa'
            : '3px solid #0a4d68',
        }
      : {};
  };

  return (
    <div className={styles['table-container']}>
      <Table
        scrollable
        containerStyle={{
          minHeight: 'calc(35dvh)',
          maxHeight: 'calc(70vh)',
          width: '100%',
        }}
        uniqueKey="InstlmntID"
        style={{ fontSize: '3.2rem' }}
        columns={columns}
        isLoading={isLoading}
        data={data}
        getRowStyles={getRowStyles}
      />
    </div>
  );
}

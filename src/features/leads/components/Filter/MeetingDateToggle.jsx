import useTheme from '@/hooks/useTheme';

export default function MeetingDateToggle({ register, isEnabled }) {
  const { currentTheme } = useTheme();
  return (
    <label
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
        cursor: 'pointer',
        marginTop: 'auto',
        padding: '6px 10px',
        border:
          currentTheme === 'dark' ? '1px solid #e0e0e0' : '1px solid #e0e0e0',
        borderRadius: '6px',
        background: isEnabled
          ? currentTheme === 'dark'
            ? '#111827'
            : '#fff'
          : 'transparent',
        transition: 'all 0.2s ease',
        boxShadow: isEnabled ? '0 2px 8px rgba(0, 123, 255, 0.15)' : 'none',
        whiteSpace: 'nowrap',
        fontSize: '13px',
        height: '35px',
      }}
    >
      <input
        type="checkbox"
        {...register('enableMeetingDateFilter')}
        style={{
          cursor: 'pointer',
          width: '16px',
          height: '16px',
          margin: 0,
          border:
            currentTheme === 'dark' ? '1px solid #e0e0e0' : '1px solid #e0e0e0',
          accentColor: currentTheme === 'dark' ? '#fff' : 'var(--button-bg)',
        }}
      />
      <span style={{ fontSize: '13px', fontWeight: '500' }}>
        Uchrashuv sanasi
      </span>
    </label>
  );
}

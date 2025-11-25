export default function FilterAccordionHeader({ isOpen, onToggle }) {
  return (
    <div
      onClick={onToggle}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(10, 77, 104, 0.08)';
        e.currentTarget.style.borderColor = 'rgba(10, 77, 104, 0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(10, 77, 104, 0.05)';
        e.currentTarget.style.borderColor = 'rgba(10, 77, 104, 0.1)';
      }}
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '12px 8px',
        background: 'rgba(10, 77, 104, 0.05)',
        borderRadius: 8,
        cursor: 'pointer',
        marginBottom: isOpen ? 12 : 0,
        transition: 'all 0.2s ease',
        border: '1px solid rgba(10, 77, 104, 0.1)',
        userSelect: 'none',
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          style={{
            transform: isOpen ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.2s ease',
          }}
        >
          <polyline points="6 9 12 15 18 9"></polyline>
        </svg>
        <span style={{ fontWeight: 600, fontSize: 15, color: '#0a4d68' }}>
          Filterlar
        </span>
      </div>
      <span style={{ fontSize: 13, color: '#64748b' }}>
        {isOpen ? 'Yashirish' : "Ko'rsatish"}
      </span>
    </div>
  );
}

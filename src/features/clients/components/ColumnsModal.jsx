import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, Row, Col, Button } from '@components/ui';

export default function ColumnsModal({
  isOpen,
  onClose,
  columns = [],
  visibleColumns = {},
  onChangeVisibleColumns = () => {},
}) {
  const [columnsLocal, setColumnsLocal] = useState(visibleColumns || {});

  // Sync local columns when modal opens or external state changes
  useEffect(() => {
    setColumnsLocal(visibleColumns || {});
  }, [visibleColumns, isOpen]);

  const onSubmit = useCallback(() => {
    onChangeVisibleColumns(columnsLocal);
    onClose();
  }, [onClose, columnsLocal, onChangeVisibleColumns]);

  // Check if all columns are selected (except CardName which is always selected)
  const allSelected = useMemo(() => {
    return columns
      .filter((col) => col.key !== 'CardName')
      .every((col) => columnsLocal[col.key] !== false);
  }, [columns, columnsLocal]);

  const handleToggleAll = useCallback(() => {
    const currentlyAllSelected = columns
      .filter((col) => col.key !== 'CardName')
      .every((col) => columnsLocal[col.key] !== false);

    const newState = {};
    if (currentlyAllSelected) {
      // Deselect all except CardName
      columns.forEach((col) => {
        newState[col.key] = col.key === 'CardName';
      });
    } else {
      // Select all
      columns.forEach((col) => {
        newState[col.key] = true;
      });
    }
    setColumnsLocal(newState);
  }, [columns, columnsLocal]);

  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        width: '100%',
      }}
    >
      <Button variant="outlined" color="danger" onClick={onClose} type="button">
        Yopish
      </Button>
      <Button variant="filled" onClick={onSubmit}>
        Qo'llash
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'Jadval ustunlarini boshqarish'}
      size="lg"
      preventScroll
      footer={footer}
    >
      <Row direction="column" gutter={2} flexGrow>
        <Col fullWidth>
          <div
            style={{
              border: '1px solid rgba(148,163,184,0.18)',
              background: 'rgba(148,163,184,0.08)',
              borderRadius: 12,
              padding: 12,
            }}
          >
            <div
              style={{
                fontWeight: 700,
                margin: '0 0 12px',
                fontSize: 14,
                display: 'flex',
                alignItems: 'center',
                gap: 10,
              }}
            >
              <span>
                Jadval ustunlari (
                {
                  columns.filter((col) => columnsLocal[col.key] !== false)
                    .length
                }
                /{columns.length})
              </span>
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                }}
              >
                <input
                  type="checkbox"
                  checked={allSelected}
                  onChange={handleToggleAll}
                  style={{ width: 16, height: 16, cursor: 'pointer' }}
                />
                <span>Hammasini tanlash</span>
              </label>
            </div>
            <Row direction="row" gutter={2} wrap>
              {columns.map((col) => {
                const disabled = col.key === 'CardName';
                const checked = columnsLocal[col.key] !== false;
                return (
                  <Col key={col.key} style={{ minWidth: 200 }}>
                    <label
                      style={{
                        display: 'flex',
                        gap: 10,
                        alignItems: 'center',
                        cursor: disabled ? 'not-allowed' : 'pointer',
                        opacity: disabled ? 0.6 : 1,
                        fontSize: 14,
                        fontWeight: 500,
                        padding: '6px 8px',
                        borderRadius: 8,
                        border: '1px solid rgba(0,0,0,0.08)',
                        background: checked
                          ? 'rgba(10, 77, 104, 0.1)'
                          : 'transparent',
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <input
                        type="checkbox"
                        checked={checked}
                        disabled={disabled}
                        onChange={(e) =>
                          setColumnsLocal({
                            ...columnsLocal,
                            [col.key]: e.target.checked,
                          })
                        }
                        style={{
                          width: 18,
                          height: 18,
                          cursor: disabled ? 'not-allowed' : 'pointer',
                        }}
                      />
                      <span>{col.title || col.key}</span>
                    </label>
                  </Col>
                );
              })}
            </Row>
          </div>
        </Col>
      </Row>
    </Modal>
  );
}

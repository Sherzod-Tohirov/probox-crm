import { useCallback, useEffect, useState, useMemo } from 'react';
import { Modal, Row, Col, Button, Checkbox } from '@components/ui';

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
              <Row direction={'row'} gutter={2} align={'center'}>
                <Col>
                  <span>
                    Jadval ustunlari (
                    {
                      columns.filter((col) => columnsLocal[col.key] !== false)
                        .length
                    }
                    /{columns.length})
                  </span>
                </Col>
                <Col>
                  <Checkbox
                    label={'Hammasini tanlash'}
                    checked={allSelected}
                    onChange={handleToggleAll}
                    style={{ width: 16, height: 16, cursor: 'pointer' }}
                  />
                </Col>
              </Row>
            </div>
            <Row direction="row" gutter={4} wrap>
              {columns.map((col) => {
                const disabled = col.key === 'CardName';
                const checked = columnsLocal[col.key] !== false;
                return (
                  <Col key={col.key} style={{ minWidth: 200 }}>
                    <Checkbox
                      checked={checked}
                      disabled={disabled}
                      onChange={(e) => {
                        setColumnsLocal({
                          ...columnsLocal,
                          [col.key]: e.target.checked,
                        });
                      }}
                      label={col.title || col.key}
                    />
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

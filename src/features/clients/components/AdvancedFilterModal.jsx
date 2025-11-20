import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Row, Col, Button, Input } from '@components/ui';
import useIsMobile from '@/hooks/useIsMobile';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import selectOptionsCreator from '@utils/selectOptionsCreator';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';
import { productOptions, statusOptions } from '@utils/options';
import moment from 'moment';
import _ from 'lodash';

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
  initialValues,
  columns = [],
  visibleColumns = {},
  onChangeVisibleColumns = () => {},
}) {
  const isMobile = useIsMobile();
  const [columnsLocal, setColumnsLocal] = useState(visibleColumns || {});

  // Fetch executors
  const { data: executors = [], isLoading: isExecutorsLoading } =
    useFetchExecutors({
      include_role: ['Manager', 'Assistant'],
    });

  const executorsOptions = useMemo(
    () =>
      selectOptionsCreator(executors, {
        label: 'SlpName',
        value: 'SlpCode',
      }),
    [executors]
  );

  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      ...initialValues,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        initialValues?.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(
        executorsOptions,
        initialValues?.slpCode
      ),
    },
    mode: 'all',
  });

  useEffect(() => {
    if (isOpen && initialValues) {
      reset({
        ...initialValues,
        paymentStatus: getSelectOptionsFromKeys(
          statusOptions,
          initialValues.paymentStatus
        ),
        slpCode: getSelectOptionsFromKeys(
          executorsOptions,
          initialValues.slpCode
        ),
      });
    }
  }, [initialValues, isOpen, reset, executorsOptions]);

  // Sync local columns when modal opens or external state changes
  useEffect(() => {
    setColumnsLocal(visibleColumns || {});
  }, [visibleColumns, isOpen]);

  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  // Auto-set end date to end of selected start date month
  useEffect(() => {
    const startDate = moment(watchedStartDate, 'DD.MM.YYYY');
    if (!startDate.isValid()) return;
    setValue('endDate', moment(startDate).endOf('month').format('DD.MM.YYYY'));
  }, [watchedStartDate, setValue]);

  const onSubmit = useCallback(
    (data) => {
      onChangeVisibleColumns(columnsLocal);
      onApply(data);
      onClose();
    },
    [onApply, onClose, columnsLocal, onChangeVisibleColumns]
  );

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
        Bekor qilish
      </Button>
      <Button variant="filled" onClick={handleSubmit(onSubmit)}>
        Qo'llash
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={'Qidirish va Ustunlar'}
      size="lg"
      preventScroll
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Row direction="column" gutter={2} flexGrow>
          <Col flexGrow fullWidth>
            <div
              style={{
                width: '100%',
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(148,163,184,0.08)',
                borderRadius: 12,
                padding: 12,
                marginBottom: 12,
              }}
            >
              <div style={{ fontWeight: 700, margin: '0 0 8px', fontSize: 14 }}>
                Boshqa filterlar
              </div>
              <Row direction="row" gutter={2} wrap>
                <Col xs={12} sm={6} md={3} lg={2} xl={2}>
                  <Input
                    name="startDate"
                    size="full-grow"
                    variant="outlined"
                    label="Boshlanish vaqti"
                    canClickIcon={false}
                    datePickerOptions={{ maxDate: watchedEndDate }}
                    type="date"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2} xl={2}>
                  <Input
                    name="endDate"
                    size="full-grow"
                    variant="outlined"
                    label="Tugash vaqti"
                    canClickIcon={false}
                    datePickerOptions={{ minDate: watchedStartDate }}
                    type="date"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2} xl={2}>
                  <Input
                    size="full-grow"
                    canClickIcon={false}
                    variant="outlined"
                    label="Holati"
                    type="select"
                    control={control}
                    options={statusOptions}
                    multipleSelect={true}
                    name="paymentStatus"
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2} xl={2}>
                  <Input
                    type="select"
                    size="full-grow"
                    canClickIcon={false}
                    multipleSelect={true}
                    options={executorsOptions}
                    variant="outlined"
                    label="Mas'ul ijrochi"
                    isLoading={isExecutorsLoading}
                    control={control}
                    name="slpCode"
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2} xl={2}>
                  <Input
                    type="select"
                    size="full-grow"
                    canClickIcon={false}
                    options={productOptions}
                    variant="outlined"
                    label="Buyum"
                    control={control}
                    name="phoneConfiscated"
                  />
                </Col>
              </Row>
            </div>
          </Col>

          <Col fullWidth>
            <div
              style={{
                border: '1px solid rgba(148,163,184,0.18)',
                background: 'rgba(148,163,184,0.08)',
                borderRadius: 12,
                padding: 12,
              }}
            >
              <div style={{ fontWeight: 700, margin: '0 0 8px', fontSize: 14 }}>
                Jadval ustunlari
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
                          style={{ width: 18, height: 18 }}
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
      </form>
    </Modal>
  );
}

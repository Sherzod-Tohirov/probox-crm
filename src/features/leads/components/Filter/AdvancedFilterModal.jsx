import { useCallback, useEffect, useMemo, useState } from 'react';
import { useForm } from 'react-hook-form';
import { Modal, Row, Col, Button, Checkbox } from '@components/ui';
import SelectField from './fields/SelectField';
import MultiSelectField from './fields/MultiSelectField';
import MeetingAndDateSection from './sections/MeetingAndDateSection';
import RoleFilters from './sections/RoleFilters';
import useIsMobile from '@/hooks/useIsMobile';
import useFetchBranches from '@hooks/data/useFetchBranches';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import selectOptionsCreator from '@utils/selectOptionsCreator';
import {
  booleanOptionsAll,
  sourceOptions as leadSourceOptions,
  statusFilterOptions,
} from '../../utils/options';
import { normalizeFilterState, serializeFilter } from './utils';
import { REJECTION_REASON_OPTIONS } from '../../utils/constants';

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  onApply,
  initialValues,
  role,
  columns = [],
  visibleColumns = {},
  onChangeVisibleColumns = () => {},
}) {
  const isMobile = useIsMobile();
  const [columnsLocal, setColumnsLocal] = useState(visibleColumns || {});
  const [dateInputKey, setDateInputKey] = useState(0);

  // Fetch options
  const { data: branches = [] } = useFetchBranches();
  const { data: operator1List = [] } = useFetchExecutors({
    include_role: 'Operator1',
  });
  const { data: operator2List = [] } = useFetchExecutors({
    include_role: 'Operator2',
  });
  const shouldLoadSeller =
    role === 'Seller' || role === 'SellerM' || role === 'CEO';
  const shouldLoadScoring = role === 'Scoring';
  const { data: sellerList = [], isLoading: isSellerLoading } =
    useFetchExecutors(
      shouldLoadSeller ? { include_role: ['Seller', 'SellerM'] } : undefined
    );
  const { data: scoringList = [], isLoading: isScoringLoading } =
    useFetchExecutors(
      shouldLoadScoring ? { include_role: 'Scoring' } : undefined
    );

  const branchOptions = useMemo(
    () => selectOptionsCreator(branches, { label: 'name', value: 'id' }),
    [branches]
  );
  const operator1Options = useMemo(
    () =>
      selectOptionsCreator(operator1List, {
        label: 'SlpName',
        value: 'SlpCode',
      }),
    [operator1List]
  );
  const operator2Options = useMemo(
    () =>
      selectOptionsCreator(operator2List, {
        label: 'SlpName',
        value: 'SlpCode',
      }),
    [operator2List]
  );
  const sellerOptions = useMemo(
    () =>
      selectOptionsCreator(sellerList, {
        label: 'SlpName',
        value: 'SlpCode',
      }),
    [sellerList]
  );
  const scoringOptions = useMemo(
    () =>
      selectOptionsCreator(scoringList, {
        label: 'SlpName',
        value: 'SlpCode',
      }),
    [scoringList]
  );

  const defaults = useMemo(
    () =>
      normalizeFilterState(
        initialValues || {},
        branchOptions,
        operator1Options,
        operator2Options,
        statusFilterOptions,
        leadSourceOptions,
        shouldLoadSeller ? sellerOptions : [],
        shouldLoadScoring ? scoringOptions : []
      ),
    [
      initialValues,
      branchOptions,
      operator1Options,
      operator2Options,
      shouldLoadSeller,
      sellerOptions,
      shouldLoadScoring,
      scoringOptions,
    ]
  );

  const cantBeDisabled = ['clientName'];
  const { control, handleSubmit, reset, watch, register } = useForm({
    defaultValues: defaults,
    mode: 'all',
  });

  useEffect(() => {
    if (isOpen) {
      reset(defaults);
      setDateInputKey((prev) => prev + 1); // Force date inputs to re-render
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaults, isOpen]);

  // Sync local columns when modal opens or external state changes
  useEffect(() => {
    setColumnsLocal(visibleColumns || {});
  }, [visibleColumns, isOpen]);

  const watchedMeetingDateStart = watch('meetingDateStart');
  const watchedMeetingDateEnd = watch('meetingDateEnd');
  const meeting = watch('meeting');

  const onSubmit = useCallback(
    (data) => {
      const payload = serializeFilter(data);
      onChangeVisibleColumns(columnsLocal);
      onApply(payload);
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
        Yopish
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
      title="Qidirish va Ustunlar"
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
                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.5}>
                  <MultiSelectField
                    name="source"
                    label="Manba"
                    options={leadSourceOptions}
                    control={control}
                    isSearchable={false}
                  />
                </Col>
                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
                  <MultiSelectField
                    name="branch"
                    label="Filial"
                    options={branchOptions}
                    control={control}
                  />
                </Col>
                <MeetingAndDateSection
                  control={control}
                  isMobile={isMobile}
                  watchedMeeting={meeting}
                  watchedMeetingDateStart={watchedMeetingDateStart}
                  watchedMeetingDateEnd={watchedMeetingDateEnd}
                  dateInputKey={dateInputKey}
                />
                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
                  <SelectField
                    name="isBlocked"
                    label="Qora ro'yxat"
                    options={booleanOptionsAll}
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
                  <MultiSelectField
                    name="status"
                    label="Status"
                    options={statusFilterOptions}
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
                  <SelectField
                    name="purchase"
                    label="Xarid amalga oshdimi"
                    options={booleanOptionsAll}
                    control={control}
                  />
                </Col>

                <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
                  <MultiSelectField
                    name="rejectionReason"
                    label="Rad etish sababi"
                    options={REJECTION_REASON_OPTIONS}
                    control={control}
                  />
                </Col>

                <RoleFilters
                  role={role}
                  control={control}
                  isMobile={isMobile}
                  register={register}
                  sellerOptions={sellerOptions}
                  scoringOptions={scoringOptions}
                  isSellerLoading={isSellerLoading}
                  isScoringLoading={isScoringLoading}
                />
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
              <Row gutter={2}>
                <Col>
                  <Row direction="row" gutter={4} align="center">
                    <Col>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>
                        Jadval ustunlari
                      </div>
                    </Col>
                    <Col>
                      <Checkbox
                        label="Hammasini tanlash"
                        checked={Object.values(columnsLocal).every((e) => e)}
                        onChange={(e) => {
                          const isChecked = e.target.checked;

                          setColumnsLocal(
                            columns.reduce((acc, val) => {
                              if (cantBeDisabled.includes(val.key)) {
                                acc[val.key] = true;
                                return acc;
                              }
                              acc[val.key] = isChecked;
                              return acc;
                            }, {})
                          );
                        }}
                      />
                    </Col>
                  </Row>
                </Col>
                <Col>
                  <Row direction="row" gutter={4} wrap>
                    {columns.map((col) => {
                      const disabled = cantBeDisabled.includes(col.key);
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
                </Col>
              </Row>
            </div>
          </Col>
        </Row>
      </form>
    </Modal>
  );
}

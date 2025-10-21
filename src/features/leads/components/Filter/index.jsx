import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import moment from 'moment';
import { Button, Col, Input, Row, Accordion } from '@components/ui';
import { initialLeadsFilterState } from '@utils/store/initialStates';
import {
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import useIsMobile from '@/hooks/useIsMobile';
import useFetchBranches from '@hooks/data/useFetchBranches';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import selectOptionsCreator from '@utils/selectOptionsCreator';
import MeetingDateToggle from './MeetingDateToggle';
import styles from './style.module.scss';
import { AVAILABLE_LEAD_SOURCES } from '@features/leads/utils/constants';

const sourceOptions = [
  { value: '', label: 'Barchasi' },
  ...AVAILABLE_LEAD_SOURCES.map((source) => ({
    value: source,
    label: source,
  })),
];

export default function LeadsFilter({
  onFilter = () => {},
  isExpanded = false,
}) {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.leads.filter);
  const isMobile = useIsMobile();

  // Fetch branches
  const { data: branches = [], isLoading: isBranchesLoading } =
    useFetchBranches();
  // Fetch operators for Operator1 role
  const { data: operator1List = [], isLoading: isOperator1Loading } =
    useFetchExecutors({
      include_role: 'Operator1',
    });

  // Fetch operators for Operator2 role
  const { data: operator2List = [], isLoading: isOperator2Loading } =
    useFetchExecutors({
      include_role: 'Operator2',
    });

  // Create options for branches
  const branchOptions = useMemo(() => {
    return selectOptionsCreator(branches, {
      label: 'name',
      value: 'id',
    });
  }, [branches]);

  // Create options for operator1
  const operator1Options = useMemo(() => {
    return selectOptionsCreator(operator1List, {
      label: 'SlpName',
      value: 'SlpCode',
    });
  }, [operator1List]);

  // Create options for operator2
  const operator2Options = useMemo(() => {
    return selectOptionsCreator(operator2List, {
      label: 'SlpName',
      value: 'SlpCode',
    });
  }, [operator2List]);

  const { register, handleSubmit, reset, control, watch } = useForm({
    defaultValues: filterState,
    mode: 'all',
  });

  const watchedMeetingDateStart = watch('meetingDateStart');
  const watchedMeetingDateEnd = watch('meetingDateEnd');
  const enableMeetingDateFilter = watch('enableMeetingDateFilter');

  const onSubmit = useCallback(
    (data) => {
      const payload = { ...data };

      // Remove date fields if date filter is disabled
      if (!data.enableMeetingDateFilter) {
        delete payload.meetingDateStart;
        delete payload.meetingDateEnd;
      }

      dispatch(setLeadsCurrentPage(0));
      dispatch(setLeadsFilter(payload));
      onFilter(payload);
    },
    [dispatch, onFilter]
  );

  const onClear = useCallback(() => {
    dispatch(setLeadsCurrentPage(0));
    dispatch(setLeadsFilter(initialLeadsFilterState));
    reset(initialLeadsFilterState);
    onFilter(initialLeadsFilterState);
  }, [dispatch, reset, onFilter]);

  return (
    <Accordion
      isOpen={isExpanded}
      defaultOpen={isExpanded}
      isEnabled={isMobile}
    >
      <form onSubmit={handleSubmit(onSubmit)} className={styles['filter-form']}>
        <Row direction="row" gutter={2} wrap align="flex-end">
          {/* All filters in one row on desktop */}
          <Col xs={12} sm={6} md={2} lg={2} xl={2}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Qidiruv"
              type="search"
              placeholder="Ismi | Telefon"
              placeholderColor="secondary"
              control={control}
              {...register('search')}
            />
          </Col>

          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Manba"
              type="select"
              options={sourceOptions}
              canClickIcon={false}
              control={control}
              {...register('source')}
            />
          </Col>

          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Filial"
              type="select"
              options={branchOptions}
              canClickIcon={false}
              multipleSelect={true}
              isLoading={isBranchesLoading}
              control={control}
              {...register('branch')}
            />
          </Col>

          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Operator 1"
              type="select"
              options={operator1Options}
              canClickIcon={false}
              multipleSelect={true}
              isLoading={isOperator1Loading}
              control={control}
              showAvatars={true}
              avatarSize={22}
              {...register('operator')}
            />
          </Col>

          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Operator 2"
              type="select"
              options={operator2Options}
              canClickIcon={false}
              multipleSelect={true}
              isLoading={isOperator2Loading}
              control={control}
              showAvatars={true}
              avatarSize={22}
              {...register('operator2')}
            />
          </Col>

          {/* Meeting Date Toggle - inline with date inputs */}
          <Col xs={12} sm="auto" style={{ minWidth: 'auto' }}>
            <MeetingDateToggle
              register={register}
              isEnabled={enableMeetingDateFilter}
            />
          </Col>

          {/* Meeting Date Inputs - Always visible, just disabled */}
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.3}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Boshlanish"
              canClickIcon={false}
              type="date"
              disabled={!enableMeetingDateFilter}
              datePickerOptions={{
                maxDate: watchedMeetingDateEnd
                  ? moment(watchedMeetingDateEnd, 'DD.MM.YYYY').toDate()
                  : undefined,
              }}
              control={control}
              {...register('meetingDateStart')}
            />
          </Col>

          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.3}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Tugash"
              canClickIcon={false}
              type="date"
              disabled={!enableMeetingDateFilter}
              datePickerOptions={{
                minDate: watchedMeetingDateStart
                  ? moment(watchedMeetingDateStart, 'DD.MM.YYYY').toDate()
                  : undefined,
              }}
              control={control}
              {...register('meetingDateEnd')}
            />
          </Col>

          {/* Action Buttons */}
          <Col xs={12} sm="auto" style={{ marginLeft: 'auto' }}>
            <Row direction="row" gutter={2}>
              <Col>
                <Button
                  className="leads-filter-clear"
                  variant="outlined"
                  color="danger"
                  onClick={(e) => {
                    e.preventDefault();
                    onClear();
                  }}
                >
                  Tozalash
                </Button>
              </Col>
              <Col>
                <Button
                  className="leads-filter-search"
                  icon="search"
                  iconSize={18}
                  variant="filled"
                  type="submit"
                >
                  Qidirish
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Accordion>
  );
}

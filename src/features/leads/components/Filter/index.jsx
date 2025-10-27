import { useCallback, useMemo, useEffect } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Col, Row, Accordion } from '@components/ui';
import { initialLeadsFilterState } from '@utils/store/initialStates';
import {
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import useIsMobile from '@/hooks/useIsMobile';
import useFetchBranches from '@hooks/data/useFetchBranches';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import selectOptionsCreator from '@utils/selectOptionsCreator';
import useAuth from '@/hooks/useAuth';
import styles from './style.module.scss';
import HeaderFilters from './sections/HeaderFilters';
import MeetingAndDateSection from './sections/MeetingAndDateSection';
import RoleFilters from './sections/RoleFilters';
import SelectField from './fields/SelectField';
import { booleanOptionsAll } from './options';
import {
  normalizeFilterState,
  serializeFilter,
  persistFilterToStorage,
} from './utils';

export default function LeadsFilter({
  onFilter = () => {},
  isExpanded = false,
}) {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.leads.filter);
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const role = user?.U_role;

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

  // Ensure multiple select fields are arrays for form initialization
  const normalizedFilterState = useMemo(
    () =>
      normalizeFilterState(
        filterState,
        branchOptions,
        operator1Options,
        operator2Options
      ),
    [filterState, branchOptions, operator1Options, operator2Options]
  );

  const { register, handleSubmit, reset, control, watch, setValue } = useForm({
    defaultValues: normalizedFilterState,
    mode: 'all',
  });

  const watchedMeetingDateStart = watch('meetingDateStart');
  const watchedMeetingDateEnd = watch('meetingDateEnd');
  const meeting = watch('meeting');

  // Reset form when normalized filter state changes (e.g., when options are loaded)
  useEffect(() => {
    reset(normalizedFilterState);
  }, [normalizedFilterState, reset]);

  useEffect(() => {
    const meetingValue = typeof meeting === 'object' ? meeting?.value : meeting;
    if (
      meetingValue === '' ||
      meetingValue === undefined ||
      meetingValue === null
    ) {
      if (watchedMeetingDateStart) setValue('meetingDateStart', '');
      if (watchedMeetingDateEnd) setValue('meetingDateEnd', '');
      return;
    }
    const start = moment().startOf('month').format('DD.MM.YYYY');
    const end = moment().endOf('month').format('DD.MM.YYYY');
    if (!watchedMeetingDateStart) setValue('meetingDateStart', start);
    if (!watchedMeetingDateEnd) setValue('meetingDateEnd', end);
  }, [meeting, watchedMeetingDateStart, watchedMeetingDateEnd, setValue]);

  const onSubmit = useCallback(
    (data) => {
      const payload = serializeFilter(data);
      dispatch(setLeadsCurrentPage(1));
      onFilter(payload);
    },
    [dispatch, onFilter]
  );

  // Persist filter draft to localStorage on any form change (without dispatching)
  useEffect(() => {
    const subscription = watch((values) => {
      const payload = serializeFilter(values);
      persistFilterToStorage(payload);
    });
    return () => subscription.unsubscribe?.();
  }, [watch]);

  const onClear = useCallback(() => {
    dispatch(setLeadsCurrentPage(1));

    // Reset form with normalized initial state
    const normalizedInitialState = { ...initialLeadsFilterState };
    ['branch', 'operator', 'operator2'].forEach((field) => {
      normalizedInitialState[field] = [];
    });

    reset(normalizedInitialState);
    const pruned = serializeFilter(normalizedInitialState);
    onFilter(pruned);
  }, [dispatch, reset, onFilter]);

  return (
    <Accordion isOpen={isExpanded} isEnabled={true}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['filter-form']}
        style={{ width: '100%' }}
      >
        <HeaderFilters
          control={control}
          register={register}
          isMobile={isMobile}
          branchOptions={branchOptions}
          operator1Options={operator1Options}
          operator2Options={operator2Options}
          isBranchesLoading={isBranchesLoading}
          isOperator1Loading={isOperator1Loading}
          isOperator2Loading={isOperator2Loading}
        />

        <MeetingAndDateSection
          control={control}
          isMobile={isMobile}
          watchedMeeting={meeting}
          watchedMeetingDateStart={watchedMeetingDateStart}
          watchedMeetingDateEnd={watchedMeetingDateEnd}
        />

        <Row direction="row" gutter={isMobile ? 2 : 1} wrap align="flex-end">
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="purchase"
              label="Xarid"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
        </Row>

        <RoleFilters
          role={role}
          control={control}
          isMobile={isMobile}
          register={register}
        />

        <Row direction="row" gutter={isMobile ? 2 : 1} wrap align="flex-end">
          {/* Action Buttons */}
          <Col
            xs={12}
            sm="auto"
            style={{ marginLeft: isMobile ? '0' : 'auto' }}
            className={isMobile ? styles['action-buttons'] : ''}
          >
            <Row direction="row" gutter={2} style={{ marginTop: 'auto' }}>
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

import { useCallback, useMemo, useEffect, useRef } from 'react';
import moment from 'moment';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Col, Row, Accordion } from '@components/ui';
import { initialLeadsFilterState } from '@utils/store/initialStates';
import { setLeadsCurrentPage } from '@store/slices/leadsPageSlice';
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
import {
  booleanOptionsAll,
  sourceOptions as leadSourceOptions,
} from './options';
import { normalizeFilterState, serializeFilter } from './utils';

export default function LeadsFilter({
  onFilter = () => {},
  isExpanded = false,
  minimal = false,
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
        operator2Options,
        leadSourceOptions
      ),
    [
      filterState,
      branchOptions,
      operator1Options,
      operator2Options,
      leadSourceOptions,
    ]
  );

  const { register, handleSubmit, reset, control, watch, setValue, getValues } =
    useForm({
      defaultValues: normalizedFilterState,
      mode: 'onSubmit',
    });

  const watchedMeetingDateStart = watch('meetingDateStart');
  const watchedMeetingDateEnd = watch('meetingDateEnd');
  const meeting = watch('meeting');
  const search = watch('search');
  const lastSearchRef = useRef(search ?? '');

  // Reset form when normalized filter state changes, only if different
  useEffect(() => {
    const current = getValues();
    let same = false;
    try {
      same = JSON.stringify(current) === JSON.stringify(normalizedFilterState);
    } catch (_) {}
    if (!same) {
      reset(normalizedFilterState);
    }
  }, [normalizedFilterState, reset, getValues]);

  useEffect(() => {
    const meetingValue = typeof meeting === 'object' ? meeting?.value : meeting;
    if (
      meetingValue === '' ||
      meetingValue === undefined ||
      meetingValue === null
    ) {
      // Clear dates when meeting is 'All'
      if (watchedMeetingDateStart) setValue('meetingDateStart', '');
      if (watchedMeetingDateEnd) setValue('meetingDateEnd', '');
      return;
    }
    const start = moment().startOf('month').format('DD.MM.YYYY');
    const end = moment().endOf('month').format('DD.MM.YYYY');
    if (!watchedMeetingDateStart) setValue('meetingDateStart', start);
    if (!watchedMeetingDateEnd) setValue('meetingDateEnd', end);
  }, [meeting, watchedMeetingDateStart, watchedMeetingDateEnd, setValue]);

  // Debounced real-time search (only for 'search' field) with loop guard
  useEffect(() => {
    const current = search ?? '';
    if (lastSearchRef.current === current) return;
    const handler = setTimeout(() => {
      lastSearchRef.current = current;
      const values = getValues();
      const payload = serializeFilter({
        ...values,
        source: values.source,
        branch: values.branch,
        operator: values.operator,
        operator2: values.operator2,
      });
      dispatch(setLeadsCurrentPage(0));
      onFilter(payload);
    }, 400);
    return () => clearTimeout(handler);
  }, [search]);

  const onSubmit = useCallback(
    (data) => {
      const payload = serializeFilter(data);
      dispatch(setLeadsCurrentPage(0));
      onFilter(payload);
    },
    [dispatch, onFilter]
  );

  const submitForm = useCallback(() => {
    const payload = serializeFilter(getValues());
    dispatch(setLeadsCurrentPage(0));
    onFilter(payload);
  }, [dispatch, onFilter, getValues]);

  // No draft persistence needed; keep logic simple

  const onClear = useCallback(() => {
    dispatch(setLeadsCurrentPage(0));

    // Reset form with normalized initial state
    const normalizedInitialState = { ...initialLeadsFilterState };
    ['source', 'branch', 'operator', 'operator2', 'seller', 'scoring'].forEach(
      (field) => {
        normalizedInitialState[field] = [];
      }
    );
    normalizedInitialState.meeting = '';

    reset(normalizedInitialState);
    const pruned = serializeFilter(normalizedInitialState);
    onFilter(pruned);
  }, [dispatch, reset, onFilter]);

  if (minimal) {
    return (
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['filter-form']}
        style={{ width: '100%' }}
      >
        <Row direction={'row'} justify={'between'} gutter={12} wrap>
          <Col flexGrow>
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
              minimal
            />
          </Col>
          <Col style={{ alignSelf: 'end' }}>
            <Row
              direction="row"
              gutter={isMobile ? 2 : 1}
              wrap
              align="flex-end"
              style={{ alignSelf: 'end' }}
            >
              <Col
                xs={12}
                sm="auto"
                style={{ marginLeft: isMobile ? '0' : 'auto' }}
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
          </Col>
        </Row>
      </form>
    );
  }

  return (
    <Accordion isOpen={isExpanded} isEnabled={true}>
      <form
        onSubmit={handleSubmit(onSubmit)}
        className={styles['filter-form']}
        style={{ width: '100%' }}
      >
        <Row>
          <Col flexGrow>
            <Row>
              <Col>
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
              </Col>

              <Col>
                <div className={styles.gridRow}>
                  <MeetingAndDateSection
                    control={control}
                    isMobile={isMobile}
                    watchedMeeting={meeting}
                    watchedMeetingDateStart={watchedMeetingDateStart}
                    watchedMeetingDateEnd={watchedMeetingDateEnd}
                    inline={true}
                  />
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
                      label="Xarid amalga oshdimi"
                      options={booleanOptionsAll}
                      control={control}
                    />
                  </Col>

                  <RoleFilters
                    role={role}
                    control={control}
                    isMobile={isMobile}
                    register={register}
                  />
                </div>
              </Col>
            </Row>
          </Col>

          <Col>
            <Row
              direction="row"
              gutter={isMobile ? 2 : 1}
              wrap
              align="flex-end"
            >
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
          </Col>
        </Row>
      </form>
    </Accordion>
  );
}

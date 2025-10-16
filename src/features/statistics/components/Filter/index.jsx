import classNames from 'classnames';
import { useForm } from 'react-hook-form';
import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Input, Button, Accordion } from '@components/ui';
import useFilter from '@features/statistics/hooks/useFilter';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';
import useWatchedFields from '@features/statistics/hooks/useWatchedFields';
import { initialStatisticsFilterState } from '@utils/store/initialStates';
import { setStatisticsFilter } from '@store/slices/statisticsPageSlice';
import styles from './style.module.scss';
import _ from 'lodash';
import moment from 'moment';
import useIsMobile from '@/hooks/useIsMobile';

const Filter = ({ onFilter, setParams, isExpanded = false }) => {
  const { executors } = useFilter();
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.statistics.filter);
  const {
    setValue,
    register,
    handleSubmit,
    reset,
    watch,
    control,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...filterState,
      slpCode: getSelectOptionsFromKeys(executors.options, filterState.slpCode),
    },
    mode: 'all',
  });
  const watchedFields = useWatchedFields(watch);
  const handleFilterClear = useCallback(() => {
    dispatch(setStatisticsFilter(initialStatisticsFilterState));
    reset({
      ...initialStatisticsFilterState,
      slpCode: getSelectOptionsFromKeys(
        executors.options,
        initialStatisticsFilterState.slpCode
      ),
    });
    setFilterToggle(false);
    setParams({
      ...initialStatisticsFilterState,
    });
  }, [initialStatisticsFilterState, executors.options]);

  useEffect(() => {
    if (!watchedFields.startDate || !watchedFields.endDate) return;

    const startDate = moment(watchedFields.startDate, 'DD.MM.YYYY');
    const endDate = moment(watchedFields.endDate, 'DD.MM.YYYY');

    if (!startDate.isValid() || !endDate.isValid()) return;

    // Only enforce: endDate cannot be before startDate
    const isEndBeforeStart = endDate.isBefore(startDate, 'day');

    if (isEndBeforeStart) {
      // Set endDate to match startDate
      setValue('endDate', startDate.format('DD.MM.YYYY'), {
        shouldValidate: true,
      });
    }
  }, [watchedFields.startDate, watchedFields.endDate, setValue]);

  // When startDate is set/changed, auto-set endDate to the end of that month
  useEffect(() => {
    if (!watchedFields.startDate) return;
    const startDate = moment(watchedFields.startDate, 'DD.MM.YYYY');
    if (!startDate.isValid()) return;
    const endOfMonth = startDate.clone().endOf('month').format('DD.MM.YYYY');
    setValue('endDate', endOfMonth, { shouldValidate: true });
  }, [watchedFields.startDate, setValue]);

  useEffect(() => {
    if (watchedFields.startDate !== filterState.startDate) {
      dispatch(
        setStatisticsFilter({
          ...filterState,
          startDate: watchedFields.startDate,
        })
      );
    }
  }, [watchedFields.startDate, filterState.startDate, dispatch]);

  useEffect(() => {
    if (watchedFields.endDate !== filterState.endDate) {
      dispatch(
        setStatisticsFilter({
          ...filterState,
          endDate: watchedFields.endDate,
        })
      );
    }
  }, [watchedFields.endDate, filterState.endDate, dispatch]);

  return (
    <Accordion isEnabled={isMobile} isOpen={isExpanded}>
      <form
        className={styles['filter-form']}
        onSubmit={handleSubmit((data) => {
          onFilter(data);
        })}
        autoComplete="off"
      >
        <Row direction={isMobile ? 'column' : 'row'} gutter={4} wrap>
          <Col gutter={4} fullWidth={isMobile} flexGrow={!isMobile}>
            <Input
              id={'startDate'}
              size={'full-grow'}
              variant={'outlined'}
              label={'Boshlanish vaqti'}
              canClickIcon={false}
              type={'date'}
              datePickerOptions={{
                maxDate: watchedFields.endDate
                  ? moment(watchedFields.endDate, 'DD.MM.YYYY').toDate()
                  : undefined,
              }}
              control={control}
              {...register('startDate')}
            />
          </Col>
          <Col fullWidth={isMobile} flexGrow={!isMobile}>
            <Input
              size={'full-grow'}
              variant={'outlined'}
              label={'Tugash vaqti'}
              canClickIcon={false}
              type={'date'}
              datePickerOptions={{
                minDate: watchedFields.startDate
                  ? moment(watchedFields.startDate, 'DD.MM.YYYY').toDate()
                  : undefined,
              }}
              error={errors?.endDate?.message}
              control={control}
              {...register('endDate')}
            />
          </Col>
          <Col fullWidth={isMobile} flexGrow={!isMobile}>
            <Input
              type={'select'}
              size={'full-grow'}
              canClickIcon={false}
              multipleSelect={true}
              showAvatars={true}
              options={executors.options}
              variant={'outlined'}
              label={"Mas'ul ijrochi"}
              isLoading={executors.isLoading}
              control={control}
              {...register('slpCode')}
            />
          </Col>
          <Col
            style={{ marginTop: 'auto' }}
            fullWidth={isMobile}
            flexGrow={!isMobile}
          >
            <Row direction="row" gutter={2}>
              <Col flexGrow>
                <Button
                  fullWidth
                  className={classNames(styles['filter-btn'], styles['clear'])}
                  onClick={handleFilterClear}
                  icon={'delete'}
                  iconSize={18}
                  variant={'filled'}
                  type="submit"
                >
                  Tozalash
                </Button>
              </Col>
              <Col flexGrow>
                <Button
                  fullWidth
                  className={styles['filter-btn']}
                  icon={'search'}
                  iconSize={18}
                  variant={'filled'}
                  type="submit"
                >
                  Qidiruv
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </form>
    </Accordion>
  );
};

export default memo(Filter);

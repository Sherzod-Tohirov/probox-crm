import classNames from 'classnames';
import useAuth from '@hooks/useAuth';
import { useForm } from 'react-hook-form';
import { memo, useCallback, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Row, Col, Input, Button } from '@components/ui';
import useFilter from '@features/statistics/hooks/useFilter';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';
import useWatchedFields from '@features/statistics/hooks/useWatchedFields';
import { initialStatisticsFilterState } from '@utils/store/initialStates';
import { setStatisticsFilter } from '@store/slices/statisticsPageSlice';
import formatDate from '@utils/formatDate';
import styles from './style.module.scss';
import _ from 'lodash';
import moment from 'moment';

const Filter = ({ onFilter, setParams }) => {
  const { executors } = useFilter();
  const { user } = useAuth();
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
    setParams({
      ...initialStatisticsFilterState,
    });
  }, [initialStatisticsFilterState, executors.options]);

  useEffect(() => {
    const startDate = moment(watchedFields.startDate, 'DD.MM.YYYY');
    const endDate = moment(watchedFields.endDate, 'DD.MM.YYYY');

    const isSameMonth = startDate.isSame(endDate, 'month');
    if (watchedFields.startDate && !isSameMonth) {
      let newEndDate = startDate.clone().endOf('month');
      if (newEndDate.date() !== startDate.date()) {
        newEndDate = newEndDate.endOf('month');
      }
      setValue('endDate', newEndDate.format('DD.MM.YYYY'));
    }
  }, [watchedFields.startDate, setValue]);

  useEffect(() => {
    if (_.isEmpty(executors.options)) return;

    reset({
      ...filterState,
      slpCode: getSelectOptionsFromKeys(
        executors.options,
        filterState.slpCode ? filterState.slpCode : String(user?.SlpCode) || ''
      ),
    });
    setParams({
      startDate: formatDate(filterState.startDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
      endDate: formatDate(filterState.endDate, 'DD.MM.YYYY', 'YYYY.MM.DD'),
      slpCode: filterState.slpCode || String(user?.SlpCode) || '',
    });
  }, [executors.options, reset]);

  return (
    <form
      className={styles['filter-form']}
      onSubmit={handleSubmit(onFilter)}
      autoComplete="off"
    >
      <Row direction={'row'} gutter={6.25} wrap>
        <Col gutter={4} flexGrow>
          <Input
            id={'startDate'}
            size={'full-grow'}
            variant={'outlined'}
            label={'Boshlanish vaqti'}
            canClickIcon={false}
            type={'date'}
            control={control}
            {...register('startDate')}
          />
          <Input
            size={'full-grow'}
            variant={'outlined'}
            label={'Tugash vaqti'}
            canClickIcon={false}
            type={'date'}
            datePickerOptions={{ minDate: watchedFields.startDate }}
            error={errors?.endDate?.message}
            control={control}
            {...register('endDate')}
          />
          <Input
            type={'select'}
            size={'full-grow'}
            canClickIcon={false}
            multipleSelect={true}
            options={executors.options}
            variant={'outlined'}
            label={"Mas'ul ijrochi"}
            isLoading={executors.isLoading}
            control={control}
            {...register('slpCode')}
          />
        </Col>
        <Col style={{ marginTop: 'auto' }} flexGrow>
          <Row direction="row" gutter={2}>
            <Col flexGrow>
              <Button
                fullWidth
                className={classNames(styles['filter-btn'], styles['clear'])}
                onClick={handleFilterClear}
                icon={'delete'}
                iconSize={18}
                variant={'filled'}
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
              >
                Qidiruv
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </form>
  );
};

export default memo(Filter);

import { useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useForm } from 'react-hook-form';
import { Button, Col, Input, Row, Accordion } from '@components/ui';
import { initialLeadsFilterState } from '@utils/store/initialStates';
import {
  setLeadsCurrentPage,
  setLeadsFilter,
} from '@store/slices/leadsPageSlice';
import useIsMobile from '@/hooks/useIsMobile';
import styles from './style.module.scss';

const sourceOptions = [
  { value: '', label: 'Barchasi' },
  { value: 'Manychat', label: 'Manychat' },
  { value: 'Meta', label: 'Meta' },
  { value: 'Organika', label: 'Organika' },
  { value: 'Kiruvchi qongiroq', label: 'Kiruvchi qongiroq' },
  { value: 'Community', label: 'Community' },
];
export default function LeadsFilter({
  onFilter = () => {},
  isExpanded = false,
}) {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.leads.filter);
  const isMobile = useIsMobile();

  const { register, handleSubmit, reset, control } = useForm({
    defaultValues: filterState,
    mode: 'all',
  });

  const onSubmit = useCallback(
    (data) => {
      const payload = { ...data };
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
        <Row direction="row" gutter={6} wrap>
          <Col flexGrow>
            <Row direction="row" gutter={4} wrap>
              <Col flexGrow>
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
              {/* <Col flexGrow>
                <Input
                  id="startDate"
                  size="full-grow"
                  variant="outlined"
                  label="Boshlanish vaqti"
                  canClickIcon={false}
                  type="date"
                  datePickerOptions={{
                    maxDate: watch('endDate')
                      ? moment(watch('endDate'), 'DD.MM.YYYY').toDate()
                      : undefined,
                  }}
                  control={control}
                  {...register('startDate')}
                />
              </Col> */}
              {/* <Col flexGrow>
                <Input
                  size="full-grow"
                  variant="outlined"
                  label="Tugash vaqti"
                  canClickIcon={false}
                  type="date"
                  datePickerOptions={{
                    minDate: watchedStart
                      ? moment(watchedStart, 'DD.MM.YYYY').toDate()
                      : undefined,
                  }}
                  control={control}
                  {...register('endDate')}
                />
              </Col> */}
              <Col flexGrow>
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
            </Row>
          </Col>
          <Col flexGrow style={{ marginTop: '25px' }}>
            <Row direction="row" gutter={2}>
              <Col>
                <Button
                  className="leads-filter-clear"
                  variant="filled"
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

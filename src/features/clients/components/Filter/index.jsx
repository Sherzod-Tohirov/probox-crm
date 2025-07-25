import _ from 'lodash';
import moment from 'moment';
import classNames from 'classnames';
import styles from './filter.module.scss';
import { Button, Col, Input, Row } from '@components/ui';

import useAlert from '@hooks/useAlert';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import useFilter from '@features/clients/hooks/useFilter';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import useWatchFilterFields from '@features/clients/hooks/useWatchFilterFields';
import { store } from '@store/store';
import FilterMenu from './FilterMenu';
import { offset, shift } from '@floating-ui/react';
import { yupResolver } from '@hookform/resolvers/yup';
import selectOptionsCreator from '@utils/selectOptionsCreator';
import { productOptions, statusOptions } from '@utils/options';
import { filterClientFormSchema } from '@utils/validationSchemas';
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import { initialClientsFilterState } from '@utils/store/initialStates';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';

import {
  setLastAction,
  setClientsFilter,
  setClientsCurrentPage,
} from '@store/slices/clientsPageSlice';

import { AnimatePresence } from 'framer-motion';

export default function Filter({ onFilter }) {
  const isFirstRender = useRef(true);
  const formRef = useRef(null);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const { alert } = useAlert();

  const { refs, floatingStyles, strategy, x, y } = useFloating({
    open: showFilterMenu,
    onOpenChange: setShowFilterMenu,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
  });

  const [toggleSearchFields, setToggleSearchFields] = useState({
    search: false,
    phone: false,
  });

  const dispatch = useDispatch(); // Add dispatch
  const { query, phone } = useFilter();
  const { data: executors, isPending: isExecutorsLoading } =
    useFetchExecutors();
  const filterState = useSelector((state) => state.page.clients.filter);
  const clientsPageState = useSelector((state) => state.page.clients);

  const executorsOptions = useMemo(() => {
    return selectOptionsCreator(executors, {
      label: 'SlpName',
      value: 'SlpCode',
    });
  }, [executors]);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...filterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(executorsOptions, filterState.slpCode),
    },
    resolver: yupResolver(filterClientFormSchema),
    mode: 'all',
  });

  const watchedFields = useWatchFilterFields(watch);
  const handleSearchSelect = useCallback((clientData, filterKey) => {
    setValue(filterKey, clientData);
    dispatch(
      setClientsFilter({
        ...filterState, // Preserve existing filters
        [filterKey]: clientData,
      })
    );

    setToggleSearchFields((prev) => ({
      ...prev,
      [filterKey]: false,
    }));
  }, []);

  const handleFilterClear = useCallback(() => {
    handleStoreFilterLastAction();
    dispatch(setClientsFilter(initialClientsFilterState));
    dispatch(setClientsCurrentPage(0));
    const payload = {
      ...initialClientsFilterState,
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        initialClientsFilterState.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(
        executorsOptions,
        initialClientsFilterState.slpCode
      ),
    };
    reset(payload);
    onFilter(payload);
  }, [initialClientsFilterState, statusOptions, executorsOptions]);

  const handleStoreFilterLastAction = useCallback(() => {
    const clientsPageState = store.getState().page.clients;
    console.log(clientsPageState, 'clientsPageState');
    try {
      const lastActions = Array.isArray(clientsPageState.lastAction)
        ? clientsPageState.lastAction
        : [];

      const payload = {
        type: 'clients_filter_last_action',
        oldValue: {
          currentPage: clientsPageState.currentPage,
          filter: { ...clientsPageState.filter, search: '', phone: '998' },
        },
        newValue: {},
      };

      const hasLastAction = lastActions.some(
        (action) => action.type === payload.type
      );

      const updatedLastActions = hasLastAction
        ? lastActions.map((action) =>
            action.type === payload.type
              ? { ...action, oldValue: payload.oldValue }
              : action
          )
        : [...lastActions, payload];
      dispatch(setLastAction(updatedLastActions));
    } catch (error) {
      console.error('Failed to store last action:', error);
    }
  }, []);

  const handleFilter = useCallback((data) => {
    try {
      handleStoreFilterLastAction();
      dispatch(setClientsCurrentPage(0));
      onFilter(data);
    } catch (error) {
      console.log(error);
    }
  }, []);

  const handleRollbackFilterLastAction = useCallback(() => {
    const storedLastAction = clientsPageState.lastAction.find(
      (action) => action.type === 'clients_filter_last_action'
    );
    try {
      if (storedLastAction) {
        dispatch(setClientsFilter(storedLastAction.oldValue.filter));
        dispatch(setClientsCurrentPage(storedLastAction.oldValue.currentPage));
        const payload = {
          ...storedLastAction.oldValue.filter,
          search: '',
          phone: '998',
          paymentStatus: getSelectOptionsFromKeys(
            statusOptions,
            storedLastAction.oldValue.filter.paymentStatus
          ),
          slpCode: getSelectOptionsFromKeys(
            executorsOptions,
            storedLastAction.oldValue.filter.slpCode
          ),
        };
        reset(payload);
        onFilter(payload);
      } else {
        alert('Xatolik yuz berdi!', { type: 'error' });
      }
    } catch (error) {
      console.log(error);
    }
  }, [clientsPageState, statusOptions, executorsOptions]);

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
    if (!_.isEmpty(executorsOptions)) {
      const formattedSlpCode = _.map(watchedFields.slpCode, 'value').join(',');
      if (filterState && filterState.slpCode !== formattedSlpCode) {
        dispatch(
          setClientsFilter({
            ...filterState,
            search: '',
            phone: '998',
            slpCode: formattedSlpCode,
          })
        );
        setValue('search', '');
        setValue('phone', '998');
      }
    }
  }, [watchedFields.slpCode, executorsOptions]);

  useEffect(() => {
    if (!_.isEmpty(executorsOptions)) {
      const selectedOptions = getSelectOptionsFromKeys(
        executorsOptions,
        filterState.slpCode
      );
      const selectedPaymentStatus = getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      );

      reset({
        ...filterState,
        paymentStatus: selectedPaymentStatus,
        slpCode: selectedOptions,
      });
    }
  }, [executorsOptions]);

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    if (!watchedFields.search) {
      setValue('phone', '998');
    }
  }, [watchedFields.search]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (refs.reference && refs.reference.current.contains(event.target))
        return;
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [refs]);

  return (
    <form
      ref={formRef}
      className={styles['filter-form']}
      onSubmit={handleSubmit(handleFilter)}
      autoComplete="off"
    >
      <Row direction={'row'} gutter={6.25} wrap>
        <Col flexGrow>
          <Row direction={'row'} gutter={4} wrap>
            <Col flexGrow>
              <Input
                style={{ minWidth: '230px' }}
                size={'full-grow'}
                variant={'outlined'}
                label={'IMEI | FIO'}
                type={'search'}
                placeholder={'4567890449494 | Ismi Sharif'}
                placeholderColor={'secondary'}
                searchText={watchedFields.search}
                onFocus={() => {
                  setToggleSearchFields((prev) => ({ ...prev, search: true }));
                }}
                onSearch={query.onSearch}
                onSearchSelect={(client) => {
                  handleSearchSelect(client.CardName, 'search');
                }}
                renderSearchItem={query.renderItem}
                searchable={toggleSearchFields.search}
                control={control}
                {...register('search')}
              />
            </Col>
            <Col flexGrow>
              <Input
                type={'tel'}
                size={'full-grow'}
                variant={'outlined'}
                label={'Telefon raqami'}
                onSearch={phone.onSearch}
                searchText={watchedFields.phone}
                searchable={toggleSearchFields.phone}
                onFocus={() => {
                  setToggleSearchFields((prev) => ({ ...prev, phone: true }));
                }}
                onSearchSelect={(client) => {
                  handleSearchSelect(client.Phone1, 'phone');
                }}
                renderSearchItem={phone.renderItem}
                placeholder={'90 123 45 67'}
                control={control}
                name={'phone'}
              />
            </Col>
            <Col flexGrow>
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
            </Col>
            <Col flexGrow>
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
            </Col>
            <Col flexGrow>
              <Input
                size={'full-grow'}
                style={{ minWidth: '160px' }}
                canClickIcon={false}
                variant={'outlined'}
                label={'Holati'}
                type={'select'}
                className={'paymentStatus'}
                control={control}
                options={statusOptions}
                multipleSelect={true}
                {...register('paymentStatus')}
              />
            </Col>
            <Col flexGrow>
              <Input
                type={'select'}
                size={'full-grow'}
                style={{ minWidth: '140px' }}
                canClickIcon={false}
                multipleSelect={true}
                options={executorsOptions}
                variant={'outlined'}
                label={"Mas'ul ijrochi"}
                isLoading={isExecutorsLoading}
                control={control}
                {...register('slpCode')}
              />
            </Col>
            <Col flexGrow>
              <Input
                type={'select'}
                size={'full-grow'}
                canClickIcon={false}
                options={productOptions}
                variant={'outlined'}
                label={'Buyum'}
                {...register('phoneConfiscated')}
              />
            </Col>
          </Row>
        </Col>
        <Col flexGrow style={{ marginTop: '25px' }}>
          <Row direction="row" gutter={2}>
            <Col flexGrow>
              <Button
                fullWidth
                ref={refs.setReference}
                className={classNames(styles['filter-btn'], styles['clear'])}
                onClick={(e) => {
                  e.preventDefault();
                  setShowFilterMenu((p) => !p);
                }}
                icon={'filter'}
                iconSize={18}
                animated={false}
                variant={'filled'}
              >
                Filter
              </Button>
              <AnimatePresence initial={false}>
                {showFilterMenu ? (
                  <FilterMenu
                    ref={refs.setFloating}
                    floatingStyles={{
                      ...floatingStyles,
                      position: strategy,
                      top: y ?? 0,
                      left: x ?? 0,
                    }}
                    onClose={() => setShowFilterMenu(false)}
                    menuList={[
                      {
                        label: 'Tozalash',
                        icon: 'delete',
                        onClick: (e) => {
                          handleFilterClear();
                          setTimeout(() => {
                            formRef.current?.requestSubmit(); // native submit trigger
                          }, 0); // ensure React state updates finish
                        },
                      },
                      {
                        label: 'Eski holatiga qaytarish',
                        icon: 'refresh',
                        onClick: handleRollbackFilterLastAction,
                      },
                    ]}
                  />
                ) : null}
              </AnimatePresence>
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
}

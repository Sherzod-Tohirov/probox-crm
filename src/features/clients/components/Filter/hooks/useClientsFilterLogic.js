import { useCallback, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import moment from 'moment';
import { store } from '@store/store';
import {
  setClientsFilter,
  setClientsCurrentPage,
  setLastAction,
} from '@store/slices/clientsPageSlice';
import { initialClientsFilterState } from '@/store/utils/initialStates';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';
import { statusOptions } from '@utils/options';

const LAST_ACTION_TYPE = 'clients_filter_last_action';

export default function useClientsFilterLogic(executorsOptions, onFilter) {
  const dispatch = useDispatch();
  const filterState = useSelector((state) => state.page.clients.filter);

  const { control, handleSubmit, setValue, watch, reset, getValues } = useForm({
    defaultValues: {
      search: filterState.search || '',
      phone: filterState.phone || '998',
      startDate: filterState.startDate || '',
      endDate: filterState.endDate || '',
      paymentStatus: getSelectOptionsFromKeys(
        statusOptions,
        filterState.paymentStatus
      ),
      slpCode: getSelectOptionsFromKeys(executorsOptions, filterState.slpCode),
      phoneConfiscated: filterState.phoneConfiscated || '',
    },
    mode: 'all',
  });

  const watchedSearch = watch('search');
  const watchedPhone = watch('phone');
  const watchedStartDate = watch('startDate');
  const watchedEndDate = watch('endDate');

  // Auto-set end date to end of selected start date month
  // Only if endDate is empty or invalid, or if endDate is before startDate
  // This effect only runs when startDate changes, not when endDate changes
  useEffect(() => {
    const startDate = moment(watchedStartDate, 'DD.MM.YYYY');
    if (!startDate.isValid()) return;

    const endDate = moment(watchedEndDate, 'DD.MM.YYYY');
    const endDateIsEmpty = !watchedEndDate || watchedEndDate.trim() === '';
    const endDateIsInvalid = !endDate.isValid();
    const endDateIsBeforeStart =
      endDate.isValid() && endDate.isBefore(startDate, 'day');

    // Only auto-set if endDate is empty, invalid, or before startDate
    // Don't change if user has manually selected a valid endDate after startDate
    if (endDateIsEmpty || endDateIsInvalid || endDateIsBeforeStart) {
      setValue(
        'endDate',
        moment(startDate).endOf('month').format('DD.MM.YYYY'),
        { shouldDirty: false }
      );
    }
  }, [watchedStartDate, setValue]); // Removed watchedEndDate from dependencies to prevent unnecessary re-runs

  useEffect(() => {
    setValue(
      'slpCode',
      getSelectOptionsFromKeys(executorsOptions, filterState.slpCode)
    );
  }, [executorsOptions, setValue, filterState.slpCode]);

  const applyFilter = useCallback(
    (next) => {
      try {
        dispatch(setClientsFilter(next));
        dispatch(setClientsCurrentPage(0));
        onFilter(next);
      } catch (_) {}
    },
    [dispatch, onFilter]
  );

  const handleFilter = useCallback(
    (data) => {
      const cleanedData = {};

      Object.keys(data).forEach((key) => {
        const value = data[key];

        // Always preserve startDate and endDate, even if empty
        if (key === 'startDate' || key === 'endDate') {
          cleanedData[key] = value || '';
          return;
        }

        if (value === null || value === undefined || value === '') return;
        if (key === 'phone' && value === '998') return;
        if (Array.isArray(value) && value.length === 0) return;
        if (typeof value === 'string' && value.trim() === '') return;

        cleanedData[key] = value;
      });

      // Normalize multi-select filters
      if (
        Array.isArray(cleanedData.slpCode) &&
        cleanedData.slpCode.length > 0
      ) {
        cleanedData.slpCode = cleanedData.slpCode
          .map((opt) => opt?.value)
          .filter((v) => v !== undefined && v !== null && v !== '')
          .join(',');
      }

      if (
        Array.isArray(cleanedData.paymentStatus) &&
        cleanedData.paymentStatus.length > 0
      ) {
        cleanedData.paymentStatus = cleanedData.paymentStatus
          .map((opt) => opt?.value)
          .filter((v) => v !== undefined && v !== null && v !== '')
          .join(',');
      }

      applyFilter(cleanedData);
    },
    [applyFilter]
  );

  const saveLastAction = useCallback(() => {
    try {
      const state = store.getState().page.clients;
      const actions = Array.isArray(state.lastAction) ? state.lastAction : [];
      const payload = {
        type: LAST_ACTION_TYPE,
        oldValue: { currentPage: state.currentPage, filter: state.filter },
        newValue: {},
      };
      const updated = actions.some((a) => a.type === LAST_ACTION_TYPE)
        ? actions.map((a) =>
            a.type === LAST_ACTION_TYPE
              ? { ...a, oldValue: payload.oldValue }
              : a
          )
        : [...actions, payload];
      dispatch(setLastAction(updated));
    } catch (_) {}
  }, [dispatch]);

  const handleClear = useCallback(() => {
    saveLastAction();
    const startOfMonth = moment().startOf('month').format('DD.MM.YYYY');
    const endOfMonth = moment().endOf('month').format('DD.MM.YYYY');
    reset({
      search: '',
      phone: '998',
      startDate: startOfMonth,
      endDate: endOfMonth,
      paymentStatus: [],
      slpCode: [],
      phoneConfiscated: '',
    });
    applyFilter(initialClientsFilterState);
  }, [saveLastAction, reset, applyFilter]);

  const handleRollback = useCallback(() => {
    try {
      const state = store.getState().page.clients;
      const action = Array.isArray(state.lastAction)
        ? state.lastAction.find((a) => a.type === LAST_ACTION_TYPE)
        : null;
      if (!action) return;

      dispatch(setClientsFilter(action.oldValue.filter));
      dispatch(setClientsCurrentPage(action.oldValue.currentPage));
      reset({
        search: action.oldValue.filter.search || '',
        phone: action.oldValue.filter.phone || '998',
        startDate: action.oldValue.filter.startDate || '',
        endDate: action.oldValue.filter.endDate || '',
        paymentStatus: getSelectOptionsFromKeys(
          statusOptions,
          action.oldValue.filter.paymentStatus
        ),
        slpCode: getSelectOptionsFromKeys(
          executorsOptions,
          action.oldValue.filter.slpCode
        ),
        phoneConfiscated: action.oldValue.filter.phoneConfiscated || '',
      });
      onFilter(action.oldValue.filter);
    } catch (_) {}
  }, [dispatch, reset, onFilter, executorsOptions]);

  return {
    control,
    handleSubmit,
    setValue,
    getValues,
    watchedSearch,
    watchedPhone,
    watchedStartDate,
    watchedEndDate,
    handleFilter,
    handleClear,
    handleRollback,
  };
}

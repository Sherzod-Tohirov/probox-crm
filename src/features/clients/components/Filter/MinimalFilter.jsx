import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Input, Row, ContextMenu } from '@components/ui';
import useIsMobile from '@hooks/useIsMobile';
import useFilter from '@features/clients/hooks/useFilter';
import {
  setClientsFilter,
  setClientsCurrentPage,
  setLastAction,
} from '@store/slices/clientsPageSlice';
import styles from './filter.module.scss';
import { initialClientsFilterState } from '@utils/store/initialStates';
import { AnimatePresence } from 'framer-motion';
import { offset, shift } from '@floating-ui/react';
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import { store } from '@store/store';

export default function MinimalFilter({ onFilter }) {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { query, phone } = useFilter();

  const [toggleSearchFields, setToggleSearchFields] = useState({
    search: false,
    phone: false,
  });

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const { refs, floatingStyles, strategy, x, y } = useFloating({
    open: showFilterMenu,
    onOpenChange: setShowFilterMenu,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
  });

  const filterState = useSelector((state) => state.page.clients.filter);

  const { control, handleSubmit, setValue, watch, reset } = useForm({
    defaultValues: {
      search: filterState.search || '',
      phone: filterState.phone || '998',
    },
    mode: 'all',
  });

  const watchedSearch = watch('search');
  const watchedPhone = watch('phone');

  const handleSearchSelect = useCallback(
    (clientData, filterKey) => {
      setValue(filterKey, clientData);
      dispatch(
        setClientsFilter({
          ...filterState,
          [filterKey]: clientData,
        })
      );
      setToggleSearchFields((prev) => ({
        ...prev,
        [filterKey]: false,
      }));
    },
    [dispatch, filterState, setValue]
  );

  const handleFilter = useCallback(
    (data) => {
      try {
        dispatch(setClientsCurrentPage(0));
        onFilter(data);
      } catch (error) {
        console.log(error);
      }
    },
    [dispatch, onFilter]
  );

  const handleClear = useCallback(() => {
    // store last action snapshot
    try {
      const clientsPageState = store.getState().page.clients;
      const lastActions = Array.isArray(clientsPageState.lastAction)
        ? clientsPageState.lastAction
        : [];
      const payloadLast = {
        type: 'clients_filter_last_action',
        oldValue: {
          currentPage: clientsPageState.currentPage,
          filter: { ...clientsPageState.filter, search: '', phone: '998' },
        },
        newValue: {},
      };
      const hasLastAction = lastActions.some(
        (action) => action.type === payloadLast.type
      );
      const updatedLastActions = hasLastAction
        ? lastActions.map((action) =>
            action.type === payloadLast.type
              ? { ...action, oldValue: payloadLast.oldValue }
              : action
          )
        : [...lastActions, payloadLast];
      dispatch(setLastAction(updatedLastActions));
    } catch (_) {}

    const payload = { ...initialClientsFilterState };
    dispatch(setClientsFilter(payload));
    dispatch(setClientsCurrentPage(0));
    reset({ search: '', phone: '998' });
    onFilter(payload);
  }, [dispatch, reset, onFilter]);

  const handleRollback = useCallback(() => {
    try {
      const clientsPageState = store.getState().page.clients;
      const storedLastAction = Array.isArray(clientsPageState.lastAction)
        ? clientsPageState.lastAction.find(
            (action) => action.type === 'clients_filter_last_action'
          )
        : null;
      if (!storedLastAction) return;
      const { oldValue } = storedLastAction;
      dispatch(setClientsFilter(oldValue.filter));
      dispatch(setClientsCurrentPage(oldValue.currentPage));
      reset({ search: '', phone: '998' });
      onFilter(oldValue.filter);
    } catch (_) {}
  }, [dispatch, reset, onFilter]);

  useEffect(() => {
    reset({
      search: filterState.search || '',
      phone: filterState.phone || '998',
    });
  }, [filterState, reset]);

  return (
    <form
      className={styles['filter-form']}
      onSubmit={handleSubmit(handleFilter)}
      autoComplete="off"
    >
      <Row direction="row" gutter={6.25} wrap={isMobile}>
        <Col flexGrow>
          <Row direction="row" gutter={4} wrap={isMobile}>
            <Col flexGrow>
              <Input
                size="small"
                variant="outlined"
                label="IMEI | FIO"
                type="search"
                placeholder="4567890449494 | Ismi Sharif"
                placeholderColor="secondary"
                searchText={watchedSearch}
                onFocus={() => {
                  setToggleSearchFields((prev) => ({
                    ...prev,
                    search: true,
                  }));
                }}
                onSearch={query.onSearch}
                onSearchSelect={(client) => {
                  handleSearchSelect(client.CardName, 'search');
                }}
                renderSearchItem={query.renderItem}
                searchable={toggleSearchFields.search}
                control={control}
                name="search"
              />
            </Col>
            <Col flexGrow>
              <Input
                type="tel"
                size="small"
                variant="outlined"
                label="Telefon raqami"
                onSearch={phone.onSearch}
                searchText={watchedPhone}
                searchable={toggleSearchFields.phone}
                onFocus={() => {
                  setToggleSearchFields((prev) => ({ ...prev, phone: true }));
                }}
                onSearchSelect={(client) => {
                  handleSearchSelect(client.Phone1, 'phone');
                }}
                renderSearchItem={phone.renderItem}
                placeholder="90 123 45 67"
                control={control}
                name="phone"
              />
            </Col>
          </Row>
        </Col>
        <Col flexGrow={isMobile} style={{ marginTop: isMobile ? 0 : '25px' }}>
          <Row direction="row" gutter={2} wrap={false}>
            <Col>
              <Button
                ref={refs.setReference}
                className={styles['filter-btn']}
                icon={'filter'}
                iconSize={18}
                animated={false}
                variant={'filled'}
                onClick={(e) => {
                  e.preventDefault();
                  setShowFilterMenu((p) => !p);
                }}
              >
                Filter
              </Button>
              <AnimatePresence initial={false}>
                {showFilterMenu ? (
                  <ContextMenu
                    ref={refs.setFloating}
                    floatingStyles={{
                      ...floatingStyles,
                      position: strategy,
                      top: y ?? 0,
                      left: x ?? 0,
                    }}
                    onClose={() => setShowFilterMenu(false)}
                    menuItems={[
                      {
                        key: 'clear',
                        label: 'Tozalash',
                        icon: 'delete',
                        onClick: () => handleClear(),
                      },
                      {
                        key: 'rollback',
                        label: 'Eski holatiga qaytarish',
                        icon: 'refresh',
                        onClick: () => handleRollback(),
                      },
                    ]}
                  />
                ) : null}
              </AnimatePresence>
            </Col>
            <Col>
              <Button
                fullWidth={isMobile}
                className={styles['filter-btn']}
                icon="search"
                iconSize={18}
                variant="filled"
                type="submit"
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

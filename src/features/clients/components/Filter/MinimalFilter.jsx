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

const LAST_ACTION_TYPE = 'clients_filter_last_action';

export default function MinimalFilter({ onFilter }) {
  const isMobile = useIsMobile();
  const dispatch = useDispatch();
  const { query, phone } = useFilter();

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState({
    search: false,
    phone: false,
  });

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

  // Close menu on click outside
  useEffect(() => {
    if (!showFilterMenu) return;

    const handleClickOutside = (event) => {
      if (
        refs.floating.current &&
        !refs.floating.current.contains(event.target) &&
        refs.reference.current &&
        !refs.reference.current.contains(event.target)
      ) {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showFilterMenu, refs]);

  // Close menu on ESC key
  useEffect(() => {
    if (!showFilterMenu) return;

    const handleEscKey = (event) => {
      if (event.key === 'Escape') {
        setShowFilterMenu(false);
      }
    };

    document.addEventListener('keydown', handleEscKey);
    return () => document.removeEventListener('keydown', handleEscKey);
  }, [showFilterMenu]);

  const pickSearchValue = useCallback((client, typed) => {
    const digits = (typed || '').replace(/\D/g, '');
    return digits.length >= 5 && client?.IntrSerial
      ? client.IntrSerial
      : client?.CardName || client?.IntrSerial || '';
  }, []);

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

  const handleSearchSelect = useCallback(
    (client, sourceKey) => {
      const nextValues = {
        search:
          sourceKey === 'search'
            ? pickSearchValue(client, watchedSearch)
            : watchedSearch || '',
        phone:
          sourceKey === 'phone'
            ? (client?.Phone1 ?? '998')
            : watchedPhone || '998',
      };
      setValue('search', nextValues.search);
      setValue('phone', nextValues.phone);

      // Close the dropdown after selection
      setShowSearchDropdown((prev) => ({ ...prev, [sourceKey]: false }));

      const updatedFilter = { ...filterState, ...nextValues };
      applyFilter(updatedFilter);
    },
    [
      filterState,
      watchedSearch,
      watchedPhone,
      setValue,
      applyFilter,
      pickSearchValue,
    ]
  );

  const handleFilter = useCallback(
    (data) => {
      const updatedFilter = {
        ...filterState,
        search: data.search,
        phone: data.phone,
      };
      applyFilter(updatedFilter);
    },
    [filterState, applyFilter]
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
    reset({ search: '', phone: '998' });
    applyFilter(initialClientsFilterState);
    setShowFilterMenu(false);
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
      reset({ search: '', phone: '998' });
      onFilter(action.oldValue.filter);
      setShowFilterMenu(false);
    } catch (_) {}
  }, [dispatch, reset, onFilter]);

  useEffect(() => {
    reset({
      search: filterState.search || '',
      phone: filterState.phone || '998',
    });
  }, [filterState, reset]);

  const searchInputProps = {
    size: 'longer',
    variant: 'outlined',
    control,
    searchable: true,
    onSearch: query.onSearch,
    renderSearchItem: query.renderItem,
    onSearchSelect: (client) => handleSearchSelect(client, 'search'),
  };

  const phoneInputProps = {
    type: 'tel',
    size: 'longer',
    variant: 'outlined',
    control,
    searchable: true,
    onSearch: phone.onSearch,
    renderSearchItem: phone.renderItem,
    onSearchSelect: (client) => handleSearchSelect(client, 'phone'),
  };

  return (
    <form
      className={styles['filter-form']}
      onSubmit={handleSubmit(handleFilter)}
      autoComplete="off"
    >
      <Row direction="row" gutter={6.25} wrap={isMobile}>
        <Col>
          <Row direction="row" gutter={4} wrap={isMobile}>
            <Col flexGrow>
              <Input
                {...searchInputProps}
                name="search"
                label="IMEI | FIO"
                type="search"
                placeholder="4567890449494 | Ismi Sharif"
                placeholderColor="secondary"
                searchText={showSearchDropdown.search ? watchedSearch : ''}
                onFocus={() =>
                  setShowSearchDropdown((prev) => ({ ...prev, search: true }))
                }
                onBlur={() => {
                  setTimeout(() => {
                    setShowSearchDropdown((prev) => ({
                      ...prev,
                      search: false,
                    }));
                  }, 200);
                }}
              />
            </Col>
            <Col flexGrow>
              <Input
                {...phoneInputProps}
                name="phone"
                label="Telefon raqami"
                placeholder="90 123 45 67"
                searchText={showSearchDropdown.phone ? watchedPhone : ''}
                onFocus={() =>
                  setShowSearchDropdown((prev) => ({ ...prev, phone: true }))
                }
                onBlur={() => {
                  setTimeout(() => {
                    setShowSearchDropdown((prev) => ({
                      ...prev,
                      phone: false,
                    }));
                  }, 200);
                }}
              />
            </Col>
          </Row>
        </Col>
        <Col style={{ marginTop: 'auto', marginLeft: 'auto' }}>
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

import { useCallback, useEffect, useState, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { Button, Col, Input, Row, ContextMenu, Modal } from '@components/ui';
import useIsMobile from '@hooks/useIsMobile';
import useFilter from '@features/clients/hooks/useFilter';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import getSelectOptionsFromKeys from '@utils/getSelectOptionsFromKeys';
import { productOptions, statusOptions } from '@utils/options';
import moment from 'moment';
import _ from 'lodash';
import {
  setClientsFilter,
  setClientsCurrentPage,
  setLastAction,
} from '@store/slices/clientsPageSlice';
import styles from './filter.module.scss';
import { initialClientsFilterState } from '@utils/store/initialStates';
import { AnimatePresence, motion } from 'framer-motion';
import { offset, shift } from '@floating-ui/react';
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import { store } from '@store/store';

const LAST_ACTION_TYPE = 'clients_filter_last_action';

export default function ClientsFilter({ onFilter }) {
  const { isMobile: isMobileOnly } = useIsMobile({ withDetails: true });
  const dispatch = useDispatch();
  const { query, phone } = useFilter();
  const [isFilterOpen, setIsFilterOpen] = useState(() => {
    try {
      const saved = localStorage.getItem('clientsFilterAccordionOpen');
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  useEffect(() => {
    localStorage.setItem(
      'clientsFilterAccordionOpen',
      JSON.stringify(isFilterOpen)
    );
  }, [isFilterOpen]);

  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMobileFiltersModal, setShowMobileFiltersModal] = useState(false);
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

  // Fetch executors
  const { data: executors = [], isLoading: isExecutorsLoading } =
    useFetchExecutors({
      include_role: ['Manager', 'Assistant'],
    });

  const executorsOptions = useMemo(() => {
    const options =
      executors?.map((executor) => ({
        label: executor.SlpName,
        value: executor.SlpCode,
        avatarUrl: executor.avatarUrl || executor.Avatar || executor.image,
      })) || [];

    return options;
  }, [executors]);

  const { control, handleSubmit, setValue, watch, reset } = useForm({
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
  useEffect(() => {
    const startDate = moment(watchedStartDate, 'DD.MM.YYYY');
    if (!startDate.isValid()) return;
    setValue('endDate', moment(startDate).endOf('month').format('DD.MM.YYYY'));
  }, [watchedStartDate, setValue]);

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
      const nextValues = {};

      const searchValue =
        sourceKey === 'search'
          ? pickSearchValue(client, watchedSearch)
          : watchedSearch || '';
      const phoneValue =
        sourceKey === 'phone'
          ? (client?.Phone1 ?? '998')
          : watchedPhone || '998';

      // Only add non-empty values
      if (searchValue && searchValue.trim()) {
        nextValues.search = searchValue;
      }
      if (phoneValue && phoneValue !== '998' && phoneValue.trim()) {
        nextValues.phone = phoneValue;
      }

      setValue('search', searchValue);
      setValue('phone', phoneValue);

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
      // Clean up the data to remove empty values
      const cleanedData = {};

      Object.keys(data).forEach((key) => {
        const value = data[key];

        // Skip empty strings, null, undefined
        if (value === null || value === undefined || value === '') {
          return;
        }

        // Skip default phone value
        if (key === 'phone' && value === '998') {
          return;
        }

        // Skip empty arrays
        if (Array.isArray(value) && value.length === 0) {
          return;
        }

        // Skip whitespace-only strings
        if (typeof value === 'string' && value.trim() === '') {
          return;
        }

        // Add valid value
        cleanedData[key] = value;
      });

      const updatedFilter = {
        ...filterState,
        ...cleanedData,
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
    reset({
      search: '',
      phone: '998',
      startDate: '',
      endDate: '',
      paymentStatus: [],
      slpCode: [],
      phoneConfiscated: '',
    });
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
      setShowFilterMenu(false);
    } catch (_) {}
  }, [dispatch, reset, onFilter, executorsOptions]);

  useEffect(() => {
    reset({
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
    });
  }, [filterState, reset, executorsOptions]);

  const searchInputProps = {
    variant: 'outlined',
    control,
    searchable: true,
    onSearch: query.onSearch,
    renderSearchItem: query.renderItem,
    onSearchSelect: (client) => handleSearchSelect(client, 'search'),
  };

  const phoneInputProps = {
    type: 'tel',
    variant: 'outlined',
    control,
    searchable: true,
    onSearch: phone.onSearch,
    renderSearchItem: phone.renderItem,
    onSearchSelect: (client) => handleSearchSelect(client, 'phone'),
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Accordion Header - Only on Mobile */}
      {isMobileOnly && (
        <div
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = 'rgba(10, 77, 104, 0.08)';
            e.currentTarget.style.borderColor = 'rgba(10, 77, 104, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = 'rgba(10, 77, 104, 0.05)';
            e.currentTarget.style.borderColor = 'rgba(10, 77, 104, 0.1)';
          }}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '12px 8px',
            background: 'rgba(10, 77, 104, 0.05)',
            borderRadius: 8,
            cursor: 'pointer',
            marginBottom: isFilterOpen ? 12 : 0,
            transition: 'all 0.2s ease',
            border: '1px solid rgba(10, 77, 104, 0.1)',
            userSelect: 'none',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              style={{
                transform: isFilterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                transition: 'transform 0.2s ease',
              }}
            >
              <polyline points="6 9 12 15 18 9"></polyline>
            </svg>
            <span style={{ fontWeight: 600, fontSize: 15, color: '#0a4d68' }}>
              Filterlar
            </span>
          </div>
          <span style={{ fontSize: 13, color: '#64748b' }}>
            {isFilterOpen ? 'Yashirish' : "Ko'rsatish"}
          </span>
        </div>
      )}
      {/* Filter Form - Collapsible on Mobile, Always Visible on Tablet/Desktop */}
      {isMobileOnly ? (
        <AnimatePresence initial={false}>
          {isFilterOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              style={{ overflow: 'hidden' }}
            >
              <form
                className={styles['filter-form']}
                onSubmit={handleSubmit(handleFilter)}
                autoComplete="off"
                style={{ paddingTop: 12 }}
              >
                <Row
                  direction="row"
                  gutter={isMobileOnly ? 4 : 3}
                  wrap
                  align="end"
                >
                  <Col
                    flexGrow={isMobileOnly}
                    style={isMobileOnly ? { width: '100%' } : {}}
                  >
                    <Input
                      {...searchInputProps}
                      name="search"
                      label="IMEI | FIO"
                      size={isMobileOnly ? 'full-grow' : undefined}
                      type="search"
                      placeholder="4567890449494 | Ismi Sharif"
                      placeholderColor="secondary"
                      searchText={
                        showSearchDropdown.search ? watchedSearch : ''
                      }
                      onFocus={() =>
                        setShowSearchDropdown((prev) => ({
                          ...prev,
                          search: true,
                        }))
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
                  <Col
                    flexGrow={isMobileOnly}
                    style={isMobileOnly ? { width: '100%' } : {}}
                  >
                    <Input
                      {...phoneInputProps}
                      name="phone"
                      label="Telefon raqami"
                      size={isMobileOnly ? 'full-grow' : undefined}
                      placeholder="90 123 45 67"
                      searchText={showSearchDropdown.phone ? watchedPhone : ''}
                      onFocus={() =>
                        setShowSearchDropdown((prev) => ({
                          ...prev,
                          phone: true,
                        }))
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
                  {/* Additional filters - hidden on mobile only (not tablets) */}
                  {!isMobileOnly && (
                    <>
                      <Col xs={12} sm={6} md={3} lg={2}>
                        <Input
                          name="startDate"
                          size="full-grow"
                          variant="outlined"
                          label="Boshlanish vaqti"
                          canClickIcon={false}
                          datePickerOptions={{ maxDate: watchedEndDate }}
                          type="date"
                          control={control}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={3} lg={2}>
                        <Input
                          name="endDate"
                          size="full-grow"
                          variant="outlined"
                          label="Tugash vaqti"
                          canClickIcon={false}
                          datePickerOptions={{ minDate: watchedStartDate }}
                          type="date"
                          control={control}
                        />
                      </Col>
                      <Col xs={12} sm={6} md={3} lg={2}>
                        <Input
                          size="full-grow"
                          canClickIcon={false}
                          variant="outlined"
                          label="Holati"
                          type="select"
                          control={control}
                          options={statusOptions}
                          multipleSelect={true}
                          name="paymentStatus"
                        />
                      </Col>
                      <Col xs={12} sm={6} md={3} lg={2}>
                        <Input
                          type="select"
                          size="full-grow"
                          canClickIcon={false}
                          multipleSelect={true}
                          options={executorsOptions}
                          variant="outlined"
                          showAvatars={true}
                          avatarSize={20}
                          label="Mas'ul ijrochi"
                          isLoading={isExecutorsLoading}
                          control={control}
                          name="slpCode"
                        />
                      </Col>
                      <Col xs={12} sm={6} md={3} lg={2}>
                        <Input
                          type="select"
                          size="full-grow"
                          canClickIcon={false}
                          options={productOptions}
                          variant="outlined"
                          label="Buyum"
                          control={control}
                          name="phoneConfiscated"
                        />
                      </Col>
                    </>
                  )}
                  {/* Action Buttons */}
                  <Col
                    style={
                      isMobileOnly ? { width: '100%' } : { marginLeft: 'auto' }
                    }
                  >
                    <Row
                      direction="row"
                      gutter={isMobileOnly ? 3 : 2}
                      wrap={isMobileOnly}
                      align="end"
                    >
                      {isMobileOnly && (
                        <Col flexGrow>
                          <Button
                            fullWidth
                            className={styles['filter-btn']}
                            icon={'sliders'}
                            iconSize={18}
                            variant={'outlined'}
                            onClick={(e) => {
                              e.preventDefault();
                              setShowMobileFiltersModal(true);
                            }}
                          >
                            Filterlar
                          </Button>
                        </Col>
                      )}
                      <Col flexGrow={isMobileOnly}>
                        <Button
                          ref={refs.setReference}
                          fullWidth={isMobileOnly}
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
                      <Col flexGrow={isMobileOnly}>
                        <Button
                          fullWidth={isMobileOnly}
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
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <form
          className={styles['filter-form']}
          onSubmit={handleSubmit(handleFilter)}
          autoComplete="off"
        >
          <Row direction="row" gutter={3} wrap align="end">
            <Col
              flexGrow={isMobileOnly}
              style={isMobileOnly ? { width: '100%' } : {}}
            >
              <Input
                {...searchInputProps}
                name="search"
                label="IMEI | FIO"
                size={isMobileOnly ? 'full-grow' : undefined}
                style={isMobileOnly ? {} : { minWidth: '290px' }}
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
            <Col
              flexGrow={isMobileOnly}
              style={isMobileOnly ? { width: '100%' } : {}}
            >
              <Input
                {...phoneInputProps}
                name="phone"
                style={isMobileOnly ? {} : { minWidth: '280px' }}
                label="Telefon raqami"
                size={isMobileOnly ? 'full-grow' : undefined}
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
            {/* Additional filters - hidden on mobile only (not tablets) */}
            {!isMobileOnly && (
              <>
                <Col xs={12} sm={6} md={3} lg={2}>
                  <Input
                    name="startDate"
                    size="full-grow"
                    variant="outlined"
                    label="Boshlanish vaqti"
                    canClickIcon={false}
                    datePickerOptions={{ maxDate: watchedEndDate }}
                    type="date"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2}>
                  <Input
                    name="endDate"
                    size="full-grow"
                    variant="outlined"
                    label="Tugash vaqti"
                    canClickIcon={false}
                    datePickerOptions={{ minDate: watchedStartDate }}
                    type="date"
                    control={control}
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2}>
                  <Input
                    size="full-grow"
                    canClickIcon={false}
                    variant="outlined"
                    label="Holati"
                    type="select"
                    control={control}
                    options={statusOptions}
                    multipleSelect={true}
                    name="paymentStatus"
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2}>
                  <Input
                    type="select"
                    size="full-grow"
                    canClickIcon={false}
                    multipleSelect={true}
                    options={executorsOptions}
                    variant="outlined"
                    showAvatars={true}
                    avatarSize={20}
                    label="Mas'ul ijrochi"
                    isLoading={isExecutorsLoading}
                    control={control}
                    name="slpCode"
                  />
                </Col>
                <Col xs={12} sm={6} md={3} lg={2}>
                  <Input
                    type="select"
                    size="full-grow"
                    canClickIcon={false}
                    options={productOptions}
                    variant="outlined"
                    label="Buyum"
                    control={control}
                    name="phoneConfiscated"
                  />
                </Col>
              </>
            )}
            {/* Action Buttons */}
            <Col
              style={isMobileOnly ? { width: '100%' } : { marginLeft: 'auto' }}
            >
              <Row
                direction="row"
                gutter={isMobileOnly ? 3 : 2}
                wrap={isMobileOnly}
                align="end"
              >
                {isMobileOnly && (
                  <Col flexGrow>
                    <Button
                      fullWidth
                      className={styles['filter-btn']}
                      icon={'sliders'}
                      iconSize={18}
                      variant={'outlined'}
                      onClick={(e) => {
                        e.preventDefault();
                        setShowMobileFiltersModal(true);
                      }}
                    >
                      Filterlar
                    </Button>
                  </Col>
                )}
                <Col flexGrow={isMobileOnly}>
                  <Button
                    ref={refs.setReference}
                    fullWidth={isMobileOnly}
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
                <Col flexGrow={isMobileOnly}>
                  <Button
                    fullWidth={isMobileOnly}
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
      )}

      {/* Mobile Filters Modal */}
      <Modal
        isOpen={showMobileFiltersModal}
        onClose={() => setShowMobileFiltersModal(false)}
        title="Qo'shimcha filterlar"
        size="md"
        footer={
          <div
            style={{
              display: 'flex',
              gap: 12,
              justifyContent: 'space-between',
              width: '100%',
            }}
          >
            <Button
              variant="outlined"
              color="danger"
              onClick={() => setShowMobileFiltersModal(false)}
              fullWidth
            >
              Yopish
            </Button>
            <Button
              variant="filled"
              onClick={() => {
                handleSubmit(handleFilter)();
                setShowMobileFiltersModal(false);
              }}
              fullWidth
            >
              Qo'llash
            </Button>
          </div>
        }
      >
        <Row direction="column" gutter={6}>
          <Col fullWidth>
            <Input
              name="startDate"
              size="full-grow"
              variant="outlined"
              label="Boshlanish vaqti"
              canClickIcon={false}
              datePickerOptions={{ maxDate: watchedEndDate }}
              type="date"
              control={control}
            />
          </Col>
          <Col fullWidth>
            <Input
              name="endDate"
              size="full-grow"
              variant="outlined"
              label="Tugash vaqti"
              canClickIcon={false}
              datePickerOptions={{ minDate: watchedStartDate }}
              type="date"
              control={control}
            />
          </Col>
          <Col fullWidth>
            <Input
              size="full-grow"
              canClickIcon={false}
              variant="outlined"
              label="Holati"
              type="select"
              control={control}
              options={statusOptions}
              multipleSelect={true}
              name="paymentStatus"
            />
          </Col>
          <Col fullWidth>
            <Input
              type="select"
              size="full-grow"
              canClickIcon={false}
              multipleSelect={true}
              options={executorsOptions}
              variant="outlined"
              showAvatars={true}
              avatarSize={20}
              label="Mas'ul ijrochi"
              isLoading={isExecutorsLoading}
              control={control}
              name="slpCode"
            />
          </Col>
          <Col fullWidth>
            <Input
              type="select"
              size="full-grow"
              canClickIcon={false}
              options={productOptions}
              variant="outlined"
              label="Buyum"
              control={control}
              name="phoneConfiscated"
            />
          </Col>
        </Row>
      </Modal>
    </div>
  );
}

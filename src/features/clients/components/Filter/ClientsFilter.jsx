import { useCallback, useEffect, useState, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { offset, shift } from '@floating-ui/react';
import { autoUpdate, flip, useFloating } from '@floating-ui/react-dom';
import useIsMobile from '@hooks/useIsMobile';
import useFilter from '@features/clients/hooks/useFilter';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useClientsFilterLogic from './hooks/useClientsFilterLogic';
import FilterAccordionHeader from './components/FilterAccordionHeader';
import FilterForm from './components/FilterForm';
import MobileFiltersModal from './components/MobileFiltersModal';

export default function ClientsFilter({ onFilter }) {
  const { isMobile: isMobileOnly } = useIsMobile({ withDetails: true });
  const { query, phone } = useFilter();

  // Accordion state (mobile only)
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

  // UI state
  const [showFilterMenu, setShowFilterMenu] = useState(false);
  const [showMobileFiltersModal, setShowMobileFiltersModal] = useState(false);
  const [showSearchDropdown, setShowSearchDropdown] = useState({
    search: false,
    phone: false,
  });

  // Floating UI for menu
  const { refs, floatingStyles, strategy, x, y } = useFloating({
    open: showFilterMenu,
    onOpenChange: setShowFilterMenu,
    middleware: [offset(8), flip(), shift({ padding: 8 })],
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
  });

  // Fetch executors
  const { data: executors = [], isLoading: isExecutorsLoading } =
    useFetchExecutors({
      include_role: ['Manager', 'Assistant'],
    });

  const executorsOptions = useMemo(
    () =>
      executors?.map((executor) => ({
        label: executor.SlpName,
        value: executor.SlpCode,
        avatarUrl: executor.avatarUrl || executor.Avatar || executor.image,
      })) || [],
    [executors]
  );

  // Filter logic
  const {
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
  } = useClientsFilterLogic(executorsOptions, onFilter);

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

  // Close menu on ESC
  useEffect(() => {
    if (!showFilterMenu) return;
    const handleEscKey = (event) => {
      if (event.key === 'Escape') setShowFilterMenu(false);
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

  const handleSearchSelect = useCallback(
    (client, sourceKey) => {
      const searchValue =
        sourceKey === 'search'
          ? pickSearchValue(client, watchedSearch)
          : watchedSearch || '';
      const phoneValue =
        sourceKey === 'phone'
          ? (client?.Phone1 ?? '998')
          : watchedPhone || '998';

      setValue('search', searchValue);
      setValue('phone', phoneValue);
      setShowSearchDropdown((prev) => ({ ...prev, [sourceKey]: false }));

      const allFormValues = getValues();
      handleFilter({
        ...allFormValues,
        search: searchValue,
        phone: phoneValue,
      });
    },
    [
      watchedSearch,
      watchedPhone,
      setValue,
      getValues,
      handleFilter,
      pickSearchValue,
    ]
  );

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

  const formProps = {
    onSubmit: handleSubmit(handleFilter),
    isMobileOnly,
    control,
    searchInputProps,
    phoneInputProps,
    watchedSearch,
    watchedPhone,
    watchedStartDate,
    watchedEndDate,
    showSearchDropdown,
    onFocusSearch: () => setShowSearchDropdown((p) => ({ ...p, search: true })),
    onBlurSearch: () =>
      setTimeout(
        () => setShowSearchDropdown((p) => ({ ...p, search: false })),
        200
      ),
    onFocusPhone: () => setShowSearchDropdown((p) => ({ ...p, phone: true })),
    onBlurPhone: () =>
      setTimeout(
        () => setShowSearchDropdown((p) => ({ ...p, phone: false })),
        200
      ),
    executorsOptions,
    isExecutorsLoading,
    showFilterMenu,
    setShowFilterMenu,
    setShowMobileFiltersModal,
    onClear: handleClear,
    onRollback: handleRollback,
    floatingRefs: refs,
    floatingStyles,
    strategy,
    x,
    y,
  };

  return (
    <div style={{ width: '100%' }}>
      {/* Mobile Accordion Header */}
      {isMobileOnly && (
        <FilterAccordionHeader
          isOpen={isFilterOpen}
          onToggle={() => setIsFilterOpen(!isFilterOpen)}
        />
      )}

      {/* Filter Form */}
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
              <div style={{ paddingTop: 12 }}>
                <FilterForm {...formProps} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <FilterForm {...formProps} />
      )}

      {/* Mobile Filters Modal */}
      <MobileFiltersModal
        isOpen={showMobileFiltersModal}
        onClose={() => setShowMobileFiltersModal(false)}
        onApply={() => {
          handleSubmit(handleFilter)();
          setShowMobileFiltersModal(false);
        }}
        control={control}
        executorsOptions={executorsOptions}
        isExecutorsLoading={isExecutorsLoading}
        watchedStartDate={watchedStartDate}
        watchedEndDate={watchedEndDate}
      />
    </div>
  );
}

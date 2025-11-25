import { Row, Col } from '@components/ui';
import SearchFields from './SearchFields';
import AdvancedFilters from './AdvancedFilters';
import FilterActions from './FilterActions';
import styles from '../filter.module.scss';

export default function FilterForm({
  onSubmit,
  isMobileOnly,
  control,
  searchInputProps,
  phoneInputProps,
  watchedSearch,
  watchedPhone,
  watchedStartDate,
  watchedEndDate,
  showSearchDropdown,
  onFocusSearch,
  onBlurSearch,
  onFocusPhone,
  onBlurPhone,
  executorsOptions,
  isExecutorsLoading,
  showFilterMenu,
  setShowFilterMenu,
  setShowMobileFiltersModal,
  onClear,
  onRollback,
  floatingRefs,
  floatingStyles,
  strategy,
  x,
  y,
}) {
  return (
    <form
      className={styles['filter-form']}
      onSubmit={onSubmit}
      autoComplete="off"
    >
      <Row direction="row" gutter={isMobileOnly ? 4 : 3} wrap align="end">
        <SearchFields
          control={control}
          isMobileOnly={isMobileOnly}
          searchInputProps={searchInputProps}
          phoneInputProps={phoneInputProps}
          watchedSearch={watchedSearch}
          watchedPhone={watchedPhone}
          showSearchDropdown={showSearchDropdown}
          onFocusSearch={onFocusSearch}
          onBlurSearch={onBlurSearch}
          onFocusPhone={onFocusPhone}
          onBlurPhone={onBlurPhone}
        />

        {!isMobileOnly && (
          <AdvancedFilters
            control={control}
            executorsOptions={executorsOptions}
            isExecutorsLoading={isExecutorsLoading}
            watchedStartDate={watchedStartDate}
            watchedEndDate={watchedEndDate}
          />
        )}

        <FilterActions
          isMobileOnly={isMobileOnly}
          showFilterMenu={showFilterMenu}
          setShowFilterMenu={setShowFilterMenu}
          setShowMobileFiltersModal={setShowMobileFiltersModal}
          onClear={onClear}
          onRollback={onRollback}
          refs={floatingRefs}
          floatingStyles={floatingStyles}
          strategy={strategy}
          x={x}
          y={y}
        />
      </Row>
    </form>
  );
}

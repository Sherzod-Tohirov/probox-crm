import { Col, Input } from '@components/ui';

export default function SearchFields({
  control,
  isMobileOnly,
  searchInputProps,
  phoneInputProps,
  watchedSearch,
  watchedPhone,
  showSearchDropdown,
  onFocusSearch,
  onBlurSearch,
  onFocusPhone,
  onBlurPhone,
}) {
  return (
    <>
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
          onFocus={onFocusSearch}
          onBlur={onBlurSearch}
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
          onFocus={onFocusPhone}
          onBlur={onBlurPhone}
        />
      </Col>
    </>
  );
}

import { useState, useCallback } from 'react';
import { Col, Input } from '@components/ui';
import FormField from '../../LeadPageForm/FormField';
import SearchField from '@components/ui/Input/components/SearchField';
import styles from '../leadPageTabs.module.scss';
import { formatCurrencyUZS } from '../../../utils/deviceUtils';

export default function DeviceSearchField({
  canEdit,
  selectedDevicesCount,
  leadData,
  branchFilterOptions,
  control,
  onSearch,
  onSelect,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const handleSearchInput = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearchTerm(value);
    const hasValue = Boolean(value.trim());
    setIsSuggestionsOpen(hasValue);
  }, []);

  const handleSelectDevice = useCallback(
    (item) => {
      onSelect(item);
      setSearchTerm('');
      setIsSuggestionsOpen(false);
    },
    [onSelect]
  );

  const renderIphoneItem = useCallback(
    (item) => (
      <div className={styles['search-item']}>
        <span className={styles['search-item-name']}>{item.name}</span>
        <span className={styles['search-item-meta']}>
          {item.storage} • {item.color}
          {item.imei && (
            <>
              {' • '}
              <span className={styles['search-item-imei']}>
                IMEI: {item.imei}
              </span>
            </>
          )}
          {item.onHand && (
            <>
              {' • '}
              <span className={styles['search-item-onhand']}>
                {item.onHand}
              </span>
            </>
          )}
        </span>
        <span className={styles['search-item-price']}>{item.price}</span>
      </div>
    ),
    []
  );

  return (
    <Col className={styles['search-field-wrapper']} fullWidth gutter={4}>
      <Input
        size="longer"
        variant="outlined"
        label="Qidirish"
        type="search"
        disabled={!canEdit}
        placeholder={
          selectedDevicesCount
            ? `${selectedDevicesCount} ta qurilma tanlangan`
            : 'iPhone modelini qidirish'
        }
        icon="search"
        value={searchTerm}
        onChange={handleSearchInput}
        onFocus={() => {
          if (searchTerm.trim()) {
            setIsSuggestionsOpen(true);
          }
        }}
      />
      <span className={styles['search-field-wrapper-inner-text']}>
        Maximum limit:{' '}
        {leadData?.finalLimit
          ? formatCurrencyUZS(leadData.finalLimit)
          : "Ma'lumot yo'q"}
      </span>
      {branchFilterOptions.length > 0 && (
        <div className={styles['search-field-branch-filter']}>
          <FormField
            label="Filial bo'yicha qidirish"
            type="select"
            options={branchFilterOptions}
            name="searchBranchFilter"
            disabled={!canEdit}
            control={control}
          />
        </div>
      )}
      {isSuggestionsOpen && searchTerm.trim() && canEdit && (
        <SearchField
          renderItem={renderIphoneItem}
          searchText={searchTerm}
          onSearch={onSearch}
          onSelect={handleSelectDevice}
        />
      )}
    </Col>
  );
}


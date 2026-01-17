import { useState, useCallback } from 'react';
import { Col, Input, Row } from '@components/ui';
import FormField from '../../LeadPageForm/FormField';
import SearchField from '@components/ui/Input/components/SearchField';
import styles from '../leadPageTabs.module.scss';
import {
  formatCurrencyUZS,
  CONTRACT_CONDITION_OPTIONS,
  CALCULATION_TYPE_OPTIONS,
} from '../../../utils/deviceUtils';
import useIsMobile from '@/hooks/useIsMobile';

export default function DeviceSearchField({
  canEdit,
  selectedDevicesCount,
  calculationTypeFilter,
  internalLimit,
  leadData,
  branchFilterOptions,
  control,
  onSearch,
  onSelect,
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const isMobile = useIsMobile();
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
  const getFinalLimitText = () => {
    switch (calculationTypeFilter) {
      case 'internalLimit': {
        return `Maximum ichki limit: ${internalLimit ? formatCurrencyUZS(internalLimit) : "Ma'lumot yo'q"}`;
      }
      case 'firstPayment': {
        return `Dastlabki to'lov foizi: ${leadData?.finalPercentage ? String(leadData.finalPercentage) + ' %' : "Ma'lumot yo'q"}`;
      }
      default: {
        return `Maximum limit: ${leadData?.finalLimit ? formatCurrencyUZS(leadData.finalLimit) : "Ma'lumot yo'q"}`;
      }
    }
  };

  return (
    <Row
      direction={'row'}
      className={styles['search-field-wrapper']}
      fullWidth
      justify={'space-between'}
      wrap
      gutter={4}
    >
      <Col align={'end'} flexGrow>
        <Input
          size={isMobile ? 'full-grow' : 'longer'}
          variant="outlined"
          label="Qidirish"
          type="search"
          disabled={!canEdit}
          style={{ minWidth: '240px' }}
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
      </Col>
      <Col flexGrow>
        <Row gutter={2}>
          <Col align={isMobile ? 'start' : 'end'}>
            <span className={styles['search-field-wrapper-inner-text']}>
              {getFinalLimitText()}
            </span>
          </Col>
          <Col justify={'end'} align={'end'}>
            <Row direction={'row'} gutter={6} wrap>
              {/* to'lov turi bo'yicha form field */}
              <Col>
                <div className={styles['search-field-branch-filter']}>
                  <FormField
                    label="Xisoblash turi bo'yicha qidirish"
                    type="select"
                    options={CALCULATION_TYPE_OPTIONS}
                    name="calculationTypeFilter"
                    disabled={!canEdit}
                    control={control}
                  />
                </div>
              </Col>
              <Col>
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
              </Col>
              <Col>
                <div className={styles['search-field-branch-filter']}>
                  <FormField
                    label="Holat bo'yicha qidirish"
                    type="select"
                    options={CONTRACT_CONDITION_OPTIONS}
                    name="conditionFilter"
                    disabled={!canEdit}
                    control={control}
                  />
                </div>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      {isSuggestionsOpen && searchTerm.trim() && canEdit && (
        <SearchField
          renderItem={renderIphoneItem}
          searchText={searchTerm}
          onSearch={onSearch}
          onSelect={handleSelectDevice}
        />
      )}
    </Row>
  );
}

import { useEffect, useState, useCallback } from 'react';
import { Row, Input } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions.jsx';
import moment from 'moment';
import SearchField from '@components/ui/Input/SearchField';

const MOCK_IPHONES = [
  {
    id: '16pm-256',
    name: 'iPhone 16 Pro Max',
    storage: '256 GB',
    color: 'Natural Titanium',
    price: "17 990 000 so'm",
  },
  {
    id: '16pm-512',
    name: 'iPhone 16 Pro Max',
    storage: '512 GB',
    color: 'White Titanium',
    price: "19 490 000 so'm",
  },
  {
    id: '16p-256',
    name: 'iPhone 16 Pro',
    storage: '256 GB',
    color: 'Desert Titanium',
    price: "16 790 000 so'm",
  },
  {
    id: '16p-512',
    name: 'iPhone 16 Pro',
    storage: '512 GB',
    color: 'Black Titanium',
    price: "18 290 000 so'm",
  },
  {
    id: '16-128',
    name: 'iPhone 16',
    storage: '128 GB',
    color: 'Ultramarine',
    price: "12 990 000 so'm",
  },
  {
    id: '16-256',
    name: 'iPhone 16',
    storage: '256 GB',
    color: 'Blush Pink',
    price: "13 790 000 so'm",
  },
  {
    id: '16plus-128',
    name: 'iPhone 16 Plus',
    storage: '128 GB',
    color: 'Teal',
    price: "13 990 000 so'm",
  },
  {
    id: '16plus-256',
    name: 'iPhone 16 Plus',
    storage: '256 GB',
    color: 'Stone',
    price: "14 990 000 so'm",
  },
  {
    id: '15pm-256',
    name: 'iPhone 15 Pro Max',
    storage: '256 GB',
    color: 'Blue Titanium',
    price: "15 290 000 so'm",
  },
  {
    id: '15p-128',
    name: 'iPhone 15 Pro',
    storage: '128 GB',
    color: 'Natural Titanium',
    price: "13 790 000 so'm",
  },
];

const PAGE_SIZE = 5;

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch, setValue } = form || {};

  // Reset form when leadData changes
  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');

  const fieldPurchase = watch('purchase');
  const fieldSellType = watch('saleType');

  useEffect(() => {
    if (!form) return;
    if (leadData) {
      reset({
        meetingConfirmed: leadData.meetingConfirmed,
        meetingConfirmedDate: leadData.meetingConfirmedDate
          ? moment(leadData.meetingConfirmedDate, 'YYYY.MM.DD').format(
              'DD.MM.YYYY'
            )
          : '',
        branch2: leadData?.branch2,
        seller: leadData.seller === null ? 'null' : leadData.seller,
        purchase: leadData.purchase,
        purchaseDate: leadData.purchaseDate
          ? moment(leadData.purchaseDate, 'YYYY.MM.DD').format('DD.MM.YYYY')
          : '',
        saleType: leadData.saleType,
        passportId: leadData.passportId,
        jshshir: leadData.jshshir,
      });
    }
  }, [leadData, reset]);

  useEffect(() => {
    if (!form) return;
    if (fieldSellType && fieldPurchase !== null) {
      setValue('purchaseDate', moment().format('DD.MM.YYYY'));
    }
  }, [fieldSellType, setValue, fieldPurchase]);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);

  const handleSearchInput = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearchTerm(value);
    if (!value) {
      setSelectedDevice(null);
      setIsSuggestionsOpen(false);
    } else {
      setIsSuggestionsOpen(true);
    }
  }, []);

  const handleDeviceSearch = useCallback(async (text, page = 1) => {
    const normalized = text.trim().toLowerCase();
    const filtered = normalized
      ? MOCK_IPHONES.filter(
          (item) =>
            item.name.toLowerCase().includes(normalized) ||
            item.color.toLowerCase().includes(normalized) ||
            item.storage.toLowerCase().includes(normalized)
        )
      : MOCK_IPHONES;

    const total = filtered.length;
    const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));
    const start = (page - 1) * PAGE_SIZE;
    const end = start + PAGE_SIZE;
    const pageData = filtered.slice(start, end);

    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          data: pageData,
          total,
          totalPages,
        });
      }, 200);
    });
  }, []);

  const handleSelectDevice = useCallback((item) => {
    setSelectedDevice(item);
    setSearchTerm('');
    setIsSuggestionsOpen(false);
  }, []);

  const renderIphoneItem = useCallback(
    (item) => (
      <div className={styles['search-item']}>
        <span className={styles['search-item-name']}>{item.name}</span>
        <span className={styles['search-item-meta']}>
          {item.storage} • {item.color}
        </span>
        <span className={styles['search-item-price']}>{item.price}</span>
      </div>
    ),
    []
  );

  return (
    <Row direction="column" className={styles['tab-content']}>
      <TabHeader
        title="Sotuvchi Ma'lumotlari"
        onSave={handleSubmit}
        disabled={!canEdit}
        isSubmitting={isSubmitting}
      />

      <form onSubmit={handleSubmit}>
        <FieldGroup title="Uchrashuv ma'lumotlari">
          <FormField
            name="meetingConfirmed"
            label="Uchrashuv tasdiqlandi"
            control={control}
            type="confirm"
            disabled={!canEdit}
          />
          <FormField
            name="meetingConfirmedDate"
            label="Tasdiqlangan sana"
            control={control}
            type="date"
            disabled={!canEdit}
          />
          <FormField
            name="branch2"
            label="Filial"
            control={control}
            type="select"
            options={branchOptions}
            placeholderOption={true}
            disabled={!canEdit}
          />
          <FormField
            name="seller"
            label="Sotuvchi"
            type="select"
            options={sellerOptions}
            placeholderOption={{ value: 'null', label: '-' }}
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>
        {!leadData?.finalLimit && fieldSellType === 'nasiya' && canEdit && (
          <Row className={styles['error-message']}>
            Xaridni tasdiqlash uchun limit mavjud emas
          </Row>
        )}
        <FieldGroup title="Xarid ma'lumotlari">
          <FormField
            name="saleType"
            label="Savdo turi"
            type="select"
            options={sellTypeOptions}
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="purchase"
            label="Xarid amalga oshdimi?"
            control={control}
            type={
              !leadData.finalLimit && fieldSellType === 'nasiya'
                ? 'confirmOnlyFalse'
                : 'confirm'
            }
            disabled={!canEdit}
          />
          <FormField
            name="purchaseDate"
            label="Xarid sanasi"
            control={control}
            type="date"
            disabled={!canEdit || fieldPurchase !== 'true'}
          />
        </FieldGroup>

        <FieldGroup title="Hujjat ma'lumotlari">
          <FormField
            name="passportId"
            label="Pasport ID"
            control={control}
            disabled={!canEdit}
          />
          <FormField
            name="jshshir"
            label="JSHSHIR"
            control={control}
            disabled={!canEdit}
          />
        </FieldGroup>
      </form>
      <FieldGroup title="Shartnoma ma'lumotlari">
        <div className={styles['search-section']}>
          <div className={styles['search-field-wrapper']}>
            <Input
              size="longer"
              variant="outlined"
              label="Qidirish"
              type="search"
              disabled={!canEdit}
              placeholder={
                selectedDevice
                  ? selectedDevice.name
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
            {isSuggestionsOpen && searchTerm.trim() && canEdit && (
              <SearchField
                renderItem={renderIphoneItem}
                searchText={searchTerm}
                onSearch={handleDeviceSearch}
                onSelect={handleSelectDevice}
              />
            )}
          </div>
          {selectedDevice && (
            <div className={styles['selected-device']}>
              <span className={styles['selected-device-label']}>
                Tanlangan qurilma
              </span>
              <span className={styles['selected-device-name']}>
                {selectedDevice.name}
              </span>
              <span className={styles['selected-device-meta']}>
                {selectedDevice.storage} • {selectedDevice.color}
              </span>
              <span className={styles['selected-device-price']}>
                {selectedDevice.price}
              </span>
            </div>
          )}
        </div>
      </FieldGroup>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}

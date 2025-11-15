import { useEffect, useState, useCallback, useMemo, useRef } from 'react';
import { Row, Col, Input, Table } from '@components/ui';
import FormField from '../LeadPageForm/FormField';
import FieldGroup from '../LeadPageForm/FieldGroup';
import TabHeader from './TabHeader';
import useSellerForm from '../../hooks/useSellerForm.jsx';
import styles from './leadPageTabs.module.scss';
import { useSelectOptions } from '../../hooks/useSelectOptions.jsx';
import moment from 'moment';
import SearchField from '@components/ui/Input/components/SearchField';
import useIsMobile from '@hooks/useIsMobile';
import { Button } from '@components/ui';

const MOCK_IPHONES = [
  {
    id: '1',
    name: 'iPhone 16 Pro Max',
    storage: '256 GB',
    color: 'Natural Titanium',
    price: "17 990 000 so'm",
  },
  {
    id: '2',
    name: 'iPhone 16 Pro Max',
    storage: '512 GB',
    color: 'White Titanium',
    price: "19 490 000 so'm",
  },
  {
    id: '3',
    name: 'iPhone 16 Pro',
    storage: '256 GB',
    color: 'Desert Titanium',
    price: "16 790 000 so'm",
  },
  {
    id: '4',
    name: 'iPhone 16 Pro',
    storage: '512 GB',
    color: 'Black Titanium',
    price: "18 290 000 so'm",
  },
  {
    id: '5',
    name: 'iPhone 16',
    storage: '128 GB',
    color: 'Ultramarine',
    price: "12 990 000 so'm",
  },
  {
    id: '6',
    name: 'iPhone 16',
    storage: '256 GB',
    color: 'Blush Pink',
    price: "13 790 000 so'm",
  },
  {
    id: '7',
    name: 'iPhone 16 Plus',
    storage: '128 GB',
    color: 'Teal',
    price: "13 990 000 so'm",
  },
  {
    id: '8',
    name: 'iPhone 16 Plus',
    storage: '256 GB',
    color: 'Stone',
    price: "14 990 000 so'm",
  },
  {
    id: '9',
    name: 'iPhone 15 Pro Max',
    storage: '256 GB',
    color: 'Blue Titanium',
    price: "15 290 000 so'm",
  },
  {
    id: '10',
    name: 'iPhone 15 Pro',
    storage: '128 GB',
    color: 'Natural Titanium',
    price: "13 790 000 so'm",
  },
];

const PAGE_SIZE = 5;
const DEFAULT_RENT_PERIOD = 1;

const extractNumericValue = (priceText) => {
  if (!priceText) return null;
  const digits = priceText.toString().replace(/[^\d]/g, '');
  if (!digits) return null;
  const parsed = Number(digits);
  return Number.isNaN(parsed) ? null : parsed;
};

const formatNumberWithSeparators = (value) => {
  if (value === null || value === undefined || value === '') return '';
  const numeric = Number(value);
  if (Number.isNaN(numeric)) return '';
  const rounded = Math.round(numeric);
  if (!Number.isFinite(rounded)) return '';
  return rounded.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
};

const formatCurrencyUZS = (value) => {
  const formatted = formatNumberWithSeparators(value);
  return formatted ? `${formatted} so'm` : '';
};

export default function SellerTab({ leadId, leadData, canEdit, onSuccess }) {
  const { form, handleSubmit, isSubmitting, error } = useSellerForm(
    leadId,
    leadData,
    onSuccess
  );

  const { control, reset, watch, setValue } = form || {};
  const { isMobile } = useIsMobile();

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
  const isAcceptedFinalPercentage =
    Number(leadData.finalPercentage) > 0 &&
    Number(leadData.finalPercentage) <= 25;
  console.log(isAcceptedFinalPercentage, 'isAcceptedPercentage');
  console.log(leadData.finalPercentage, 'finalPercentage');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDevices, setSelectedDevices] = useState([]);
  const [isSuggestionsOpen, setIsSuggestionsOpen] = useState(false);
  const [isDrawing, setIsDrawing] = useState(false);
  const signatureCanvasRef = useRef(null);
  const signatureContextRef = useRef(null);
  const signatureWrapperRef = useRef(null);
  const [signatureDataUrl, setSignatureDataUrl] = useState(null);
  const [hasSignature, setHasSignature] = useState(false);

  const rentPeriodOptions = useMemo(
    () =>
      Array.from({ length: 10 }, (_, index) => {
        const month = index + 1;
        return { value: month, label: String(month) };
      }),
    []
  );

  const handleRentPeriodChange = useCallback((deviceId, value) => {
    setSelectedDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              rentPeriod:
                Number(value) ||
                Number(device.rentPeriod) ||
                DEFAULT_RENT_PERIOD,
            }
          : device
      )
    );
  }, []);

  const handleFirstPaymentChange = useCallback((deviceId, rawValue) => {
    setSelectedDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId
          ? {
              ...device,
              firstPayment: (() => {
                const stringValue =
                  typeof rawValue === 'string'
                    ? rawValue
                    : rawValue === null || rawValue === undefined
                      ? ''
                      : String(rawValue);
                const sanitized = stringValue.replace(/[^\d]/g, '');
                if (!sanitized) {
                  return '';
                }
                const parsed = Number(sanitized);
                return Number.isNaN(parsed) ? '' : parsed;
              })(),
            }
          : device
      )
    );
  }, []);

  const initializeSignatureCanvas = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    const wrapper = signatureWrapperRef.current;

    if (!canvas || !wrapper) return;

    const rect = wrapper.getBoundingClientRect();
    const width = rect.width || wrapper.clientWidth || 320;
    const baseHeight = isMobile ? 160 : 220;
    const height = rect.height || baseHeight;
    const devicePixelRatio = window.devicePixelRatio || 1;

    canvas.width = width * devicePixelRatio;
    canvas.height = height * devicePixelRatio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = isMobile ? 2 : 2.5;
    context.strokeStyle = '#111111';
    context.imageSmoothingEnabled = false;

    const displayWidth = canvas.width / devicePixelRatio;
    const displayHeight = canvas.height / devicePixelRatio;
    context.clearRect(0, 0, displayWidth, displayHeight);
    context.beginPath();

    signatureContextRef.current = context;
    if (signatureDataUrl) {
      const image = new Image();
      image.onload = () => {
        context.save();
        context.setTransform(1, 0, 0, 1, 0, 0);
        context.imageSmoothingEnabled = false;
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        context.restore();
        context.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
        context.imageSmoothingEnabled = false;
        context.beginPath();
      };
      image.src = signatureDataUrl;
    }
  }, [isMobile, signatureDataUrl]);

  useEffect(() => {
    initializeSignatureCanvas();
    const handleResize = () => initializeSignatureCanvas();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [initializeSignatureCanvas, selectedDevices.length]);

  useEffect(() => {
    setHasSignature(Boolean(signatureDataUrl));
  }, [signatureDataUrl]);

  const getCanvasCoordinates = useCallback((event) => {
    const canvas = signatureCanvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const pointerX =
      typeof event.clientX === 'number'
        ? event.clientX
        : (event.touches?.[0]?.clientX ?? 0);
    const pointerY =
      typeof event.clientY === 'number'
        ? event.clientY
        : (event.touches?.[0]?.clientY ?? 0);

    return {
      x: pointerX - rect.left,
      y: pointerY - rect.top,
    };
  }, []);

  const finishDrawing = useCallback(
    (event) => {
      if (!isDrawing) return;

      const canvas = signatureCanvasRef.current;
      const context = signatureContextRef.current;
      if (context) {
        context.closePath();
      }

      if (canvas && typeof event?.pointerId === 'number') {
        try {
          canvas.releasePointerCapture(event.pointerId);
        } catch {
          // ignore if capture was not set
        }
      }

      setIsDrawing(false);
      event?.preventDefault();
    },
    [isDrawing]
  );

  const handleSignaturePointerDown = useCallback(
    (event) => {
      if (event.button !== undefined && event.button !== 0) return;
      const canvas = signatureCanvasRef.current;
      const context = signatureContextRef.current;
      if (!canvas || !context) return;

      const { x, y } = getCanvasCoordinates(event);
      context.beginPath();
      context.moveTo(x, y);
      setIsDrawing(true);

      if (typeof event.pointerId === 'number') {
        try {
          canvas.setPointerCapture(event.pointerId);
        } catch {
          // ignore if pointer capture not supported
        }
      }

      event.preventDefault();
    },
    [getCanvasCoordinates]
  );

  const handleSignaturePointerMove = useCallback(
    (event) => {
      if (!isDrawing) return;
      const context = signatureContextRef.current;
      if (!context) return;

      const { x, y } = getCanvasCoordinates(event);
      context.lineTo(x, y);
      context.stroke();
      event.preventDefault();
    },
    [getCanvasCoordinates, isDrawing]
  );

  const handleSignaturePointerUp = useCallback(
    (event) => {
      if (!isDrawing) return;
      const context = signatureContextRef.current;
      const canvas = signatureCanvasRef.current;
      if (context) {
        context.stroke();
      }
      finishDrawing(event);
      if (canvas) {
        const dataUrl = canvas.toDataURL('image/png');
        setSignatureDataUrl(dataUrl);
        setHasSignature(true);
      }
    },
    [finishDrawing, isDrawing]
  );

  const clearSignature = useCallback(() => {
    const canvas = signatureCanvasRef.current;
    const context = signatureContextRef.current;
    if (!canvas || !context) return;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
    context.beginPath();
    setIsDrawing(false);
    setSignatureDataUrl(null);
    setHasSignature(false);
  }, []);

  const selectedDeviceColumns = useMemo(
    () => [
      {
        key: 'order',
        title: 'T/r',
        horizontal: 'start',
        width: '4%',
        renderCell: (_, rowIndex) => <span>{rowIndex + 1}</span>,
      },
      {
        key: 'name',
        title: 'Model',
        horizontal: 'start',
        width: '18%',
      },
      {
        key: 'price',
        title: 'Narx',
        horizontal: 'start',
        width: '10%',
        renderCell: (row) => (
          <span className={styles['selected-device-price']}>{row.price}</span>
        ),
      },
      {
        key: 'rentPeriod',
        title: 'Ijara oyi',
        horizontal: 'start',
        width: '12%',
        renderCell: (row) => {
          const value =
            row.rentPeriod ?? rentPeriodOptions[0]?.value ?? undefined;
          return (
            <Input
              type="select"
              options={rentPeriodOptions}
              value={value}
              onChange={(nextValue) =>
                handleRentPeriodChange(row.id, nextValue)
              }
              disabled={!canEdit}
              width="100%"
              variant="outlined"
              hasIcon={true}
            />
          );
        },
      },
      {
        key: 'firstPayment',
        title: 'Birinchi tolov',
        horizontal: 'start',
        width: '15%',
        renderCell: (row) => (
          <Input
            type="text"
            value={formatNumberWithSeparators(row.firstPayment)}
            width="100%"
            variant="outlined"
            inputMode="numeric"
            onChange={(event) =>
              handleFirstPaymentChange(row.id, event?.target?.value ?? '')
            }
            hasIcon={false}
            disabled={!canEdit}
          />
        ),
      },
      {
        key: 'monthlyPayment',
        title: 'Oylik tolov',
        horizontal: 'start',
        width: '10%',
        renderCell: (row) => (
          <span className={styles['selected-device-price']}>
            {row.monthlyPayment}
          </span>
        ),
      },
    ],
    [
      canEdit,
      handleFirstPaymentChange,
      handleRentPeriodChange,
      rentPeriodOptions,
    ]
  );

  const selectedDeviceData = useMemo(
    () =>
      selectedDevices.map((device) => ({
        id: device.id ?? device.name,
        name: device.name,
        storage: device.storage,
        color: device.color,
        price: device.price,
        rentPeriod:
          Number(device.rentPeriod) ||
          rentPeriodOptions[0]?.value ||
          DEFAULT_RENT_PERIOD,
        firstPayment:
          device.firstPayment === '' || device.firstPayment === null
            ? ''
            : Number(device.firstPayment),
        monthlyPayment: (() => {
          const totalPrice = extractNumericValue(device.price);
          const period =
            Number(device.rentPeriod) ||
            rentPeriodOptions[0]?.value ||
            DEFAULT_RENT_PERIOD;
          const firstPaymentValue =
            device.firstPayment === '' || device.firstPayment === null
              ? 0
              : Number(device.firstPayment);
          if (!totalPrice || !period) {
            return '';
          }
          const sanitizedFirstPayment = Number.isFinite(firstPaymentValue)
            ? Math.max(0, firstPaymentValue)
            : 0;
          const remaining = Math.max(0, totalPrice - sanitizedFirstPayment);
          return formatCurrencyUZS(remaining / period);
        })(),
      })),
    [rentPeriodOptions, selectedDevices]
  );

  const totalSelectedPrice = useMemo(
    () =>
      selectedDeviceData.reduce(
        (acc, device) => acc + (extractNumericValue(device.price) || 0),
        0
      ),
    [selectedDeviceData]
  );

  const handleSearchInput = useCallback((event) => {
    const value = event?.target?.value ?? '';
    setSearchTerm(value);
    if (!value) {
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
    const deviceId = item.id ?? item.name;
    setSelectedDevices((prev) => {
      const exists = prev.some((device) => device.id === deviceId);
      if (exists) {
        return prev;
      }
      return [
        ...prev,
        {
          ...item,
          id: deviceId,
          rentPeriod: DEFAULT_RENT_PERIOD,
          firstPayment: '',
        },
      ];
    });
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
        {!leadData?.finalLimit &&
          fieldSellType === 'nasiya' &&
          canEdit &&
          !isAcceptedFinalPercentage &&
          !leadData?.acceptedReason && (
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
              !leadData.finalLimit &&
              fieldSellType === 'nasiya' &&
              !isAcceptedFinalPercentage &&
              !leadData?.acceptedReason
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
            type="passportId"
            disabled={!canEdit}
          />
          <FormField
            name="jshshir"
            label="JSHSHIR"
            control={control}
            type="jshshir"
            disabled={!canEdit}
          />
        </FieldGroup>
      </form>
      <FieldGroup title="Shartnoma ma'lumotlari">
        <Col span={{ xs: 24, md: 24 }} flexGrow fullWidth>
          <Row>
            <Col
              className={styles['search-field-wrapper']}
              fullWidth
              gutter={4}
            >
              <Input
                size="longer"
                variant="outlined"
                label="Qidirish"
                type="search"
                disabled={!canEdit}
                placeholder={
                  selectedDevices.length
                    ? `${selectedDevices.length} ta qurilma tanlangan`
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
                Maximum limit: 20 000 000 so'm
                {/* {formatCurrencyUZS(leadData?.finalLimit)} */}
              </span>

              {isSuggestionsOpen && searchTerm.trim() && canEdit && (
                <SearchField
                  renderItem={renderIphoneItem}
                  searchText={searchTerm}
                  onSearch={handleDeviceSearch}
                  onSelect={handleSelectDevice}
                />
              )}
            </Col>
            {!!selectedDevices.length && (
              <>
                <Col direction="column" fullWidth>
                  <span className={styles['selected-device-table-label']}>
                    Tanlangan qurilmalar
                  </span>
                  <Table
                    id="selected-device-table"
                    data={selectedDeviceData}
                    columns={selectedDeviceColumns}
                    containerHeight="auto"
                    scrollable={false}
                    uniqueKey="id"
                    onRowClick={() => {}}
                    getRowStyles={() => ({
                      cursor: 'default',
                    })}
                  />
                </Col>
                <Col>
                  <div className={styles['selected-device-table-total-price']}>
                    Umumiy narx: {formatCurrencyUZS(totalSelectedPrice)}
                  </div>
                </Col>
              </>
            )}

            <Col fullWidth className={styles['signature-wrapper']}>
              <div
                ref={signatureWrapperRef}
                className={`${styles['signature-area']} ${
                  hasSignature ? styles['signature-area-filled'] : ''
                }`}
              >
                <canvas
                  ref={signatureCanvasRef}
                  className={styles['signature-canvas']}
                  aria-label="Imzo chizish maydoni"
                  onPointerDown={handleSignaturePointerDown}
                  onPointerMove={handleSignaturePointerMove}
                  onPointerUp={handleSignaturePointerUp}
                  onPointerLeave={handleSignaturePointerUp}
                  onPointerCancel={handleSignaturePointerUp}
                />
              </div>
              <div className={styles['signature-buttons']}>
                <Button
                  variant="outlined"
                  type="button"
                  onClick={clearSignature}
                  disabled={!canEdit || !hasSignature}
                >
                  Cancel
                </Button>
              </div>
            </Col>
          </Row>
        </Col>
      </FieldGroup>

      {error && (
        <Row className={styles['error-message']}>
          Xatolik yuz berdi: {error.message}
        </Row>
      )}
    </Row>
  );
}

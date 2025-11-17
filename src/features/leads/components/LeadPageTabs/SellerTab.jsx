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
import useMutateContractTerms from '@/hooks/data/leads/useMutateContractTerms';
import useFetchItemSeries from '@/hooks/data/leads/useFetchItemSeries';
import useAlert from '@hooks/useAlert';

const DEFAULT_CONTRACT_CONDITION = 'Yangi';
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

  const { sellerOptions, sellTypeOptions, branchOptions } =
    useSelectOptions('seller');

  const { control, reset, watch, setValue } = form || {};
  const { isMobile } = useIsMobile();
  const { alert } = useAlert();
  const { mutateAsync: fetchItemSeries } = useFetchItemSeries();

  const branchCodeMap = useMemo(() => {
    if (!branchOptions?.length) return new Map();
    return branchOptions.reduce((map, option) => {
      const key = String(option.value ?? '');
      if (!key) return map;
      map.set(key, option.code ?? key);
      return map;
    }, new Map());
  }, [branchOptions]);

  const branchCodeToNameMap = useMemo(() => {
    if (!branchOptions?.length) return new Map();
    return branchOptions.reduce((map, option) => {
      const code = String(option.code ?? option.value ?? '');
      const name = option.label || option.name || '';
      if (code && name) {
        map.set(code, name);
      }
      return map;
    }, new Map());
  }, [branchOptions]);

  const fieldBranch = watch?.('branch2');
  const searchBranchFilter = watch?.('searchBranchFilter');
  const branchFilterInitializedRef = useRef(false);
  
  const normalizedBranchValue =
    fieldBranch && fieldBranch !== 'null' ? fieldBranch : '';
  const normalizedLeadBranch =
    leadData?.branch2 && leadData.branch2 !== 'null' ? leadData.branch2 : '';
  const selectedBranchValue =
    normalizedBranchValue || normalizedLeadBranch || '';
  const contractWhsCode =
    branchCodeMap.get(String(selectedBranchValue)) ??
    (selectedBranchValue ? String(selectedBranchValue) : '');
  const activeWhsCode = useMemo(() => {
    if (searchBranchFilter && searchBranchFilter !== 'all') {
      return searchBranchFilter;
    }
    return contractWhsCode || '';
  }, [contractWhsCode, searchBranchFilter]);

  const branchFilterOptions = useMemo(() => {
    const normalized =
      branchOptions?.map((branch) => ({
        value: branch.code ?? String(branch.value ?? ''),
        label: branch.label,
      })) ?? [];

    const uniqueByValue = normalized.reduce((acc, option) => {
      if (!option.value || acc.some((item) => item.value === option.value)) {
        return acc;
      }
      return [...acc, option];
    }, []);

    return [
      { value: 'all', label: 'Barcha filiallar' },
      ...uniqueByValue,
    ];
  }, [branchOptions]);

  useEffect(() => {
    branchFilterInitializedRef.current = false;
  }, [leadId]);

  // contractWhsCode ni ref da saqlash, o'zgarishni kuzatish uchun
  const contractWhsCodeRef = useRef(contractWhsCode);
  
  useEffect(() => {
    if (!form || !branchFilterOptions?.length || !setValue) return;
    
    // Automatic select qilish uchun qiymatni aniqlash
    const currentValue = watch?.('searchBranchFilter');
    const hasContractWhsCode = contractWhsCode && branchFilterOptions.some(
      (opt) => String(opt.value) === String(contractWhsCode)
    );
    const initialValue = hasContractWhsCode ? contractWhsCode : 'all';
    
    const contractWhsCodeChanged = contractWhsCodeRef.current !== contractWhsCode;
    contractWhsCodeRef.current = contractWhsCode;
    
    // Agar searchBranchFilter undefined bo'lsa yoki bo'sh bo'lsa, automatic select qilish
    if (!currentValue || currentValue === '' || !branchFilterInitializedRef.current) {
      setValue('searchBranchFilter', initialValue);
      branchFilterInitializedRef.current = true;
    } else if (hasContractWhsCode && contractWhsCodeChanged && contractWhsCode) {
      // Agar contractWhsCode o'zgarganda va mavjud bo'lsa, uni tanlash
      setValue('searchBranchFilter', contractWhsCode);
    }
  }, [contractWhsCode, form, setValue, watch, branchFilterOptions]);

  const { mutateAsync: mutateContractTerms } = useMutateContractTerms();

  // Reset form when leadData changes
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

  const normalizeContractItems = useCallback((items = []) => {
    return items.map((item, index) => {
      const priceValue = item?.PhonePrice ?? item?.phonePrice ?? null;
      const priceText =
        priceValue !== null && priceValue !== undefined && (priceValue || priceValue === 0)
          ? formatCurrencyUZS(priceValue)
          : '';

      const onHand = item?.OnHand ?? item?.onHand ?? 0;
      const onHandText = onHand > 0 ? `${onHand}ta bor` : '';

      const whsCode = item?.WhsCode ?? item?.whsCode ?? '';
      // Agar WhsName kelmasa, branchCodeToNameMap dan WhsCode orqali topish
      const whsName = item?.WhsName ?? item?.whsName ?? branchCodeToNameMap.get(String(whsCode)) ?? '';

      return {
        id:
          item?.id ??
          item?.itemCode ??
          item?.ItemCode ??
          `${item?.name ?? item?.ItemName ?? 'contract-item'}-${index}`,
        name: item?.ItemName ?? item?.name ?? "Noma'lum qurilma",
        storage: item?.U_Memory ?? item?.storage ?? item?.memory ?? item?.Storage ?? '',
        color: item?.U_Color ?? item?.color ?? item?.Color ?? '',
        price: priceText,
        imei: item?.IMEI ?? item?.imei ?? '',
        onHand: onHandText,
        whsCode: whsCode,
        whsName: whsName,
        raw: item,
      };
    });
  }, [branchCodeToNameMap]);

  const resolveItemCode = useCallback((item) => {
    if (!item) return '';
    return (
      item?.raw?.ItemCode ??
      item?.raw?.itemCode ??
      item?.ItemCode ??
      item?.itemCode ??
      item?.id ??
      ''
    );
  }, []);

  const fetchDeviceSeries = useCallback(
    async ({ deviceId, itemCode, whsCode, whsName }) => {
      if (!deviceId) return;

      // Agar whsName kelmasa, branchCodeToNameMap dan whsCode orqali topish
      const deviceWhsName = whsName || branchCodeToNameMap.get(String(whsCode || '')) || '';

      setSelectedDevices((prev) =>
        prev.map((device) =>
          device.id === deviceId
            ? { ...device, imeiLoading: true, imeiError: null }
            : device
        )
      );

      if (!itemCode || !whsCode) {
        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiLoading: false,
                  imeiOptions: [],
                  imeiValue: '',
                  imeiError: !whsCode
                    ? "Filial tanlanmagani uchun IMEI olinmadi"
                    : 'ItemCode topilmadi',
                }
              : device
          )
        );
        return;
      }

      try {
        const response = await fetchItemSeries({ whsCode, itemCode });
        const seriesItems = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : response?.data ?? [];
        
        // Options yaratishda faqat IMEI ko'rsatish
        const options = seriesItems.map((series) => {
          return {
            value: series.DistNumber,
            label: series.DistNumber,
            meta: series,
          };
        });

        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiOptions: options,
                  imeiValue:
                    options.length === 1
                      ? options[0].value
                      : device.imeiValue || '',
                  imeiLoading: false,
                  imeiError: null,
                  rawSeries: seriesItems,
                }
              : device
          )
        );
      } catch (err) {
        const errorMessage =
          err?.response?.data?.message ||
          err?.message ||
          "IMEI ma'lumotini olishda xatolik";
        setSelectedDevices((prev) =>
          prev.map((device) =>
            device.id === deviceId
              ? {
                  ...device,
                  imeiLoading: false,
                  imeiOptions: [],
                  imeiValue: '',
                  imeiError: errorMessage,
                }
              : device
          )
        );
      }
    },
    [fetchItemSeries, branchCodeToNameMap]
  );

  const handleImeiSelect = useCallback((deviceId, value) => {
    setSelectedDevices((prev) =>
      prev.map((device) =>
        device.id === deviceId ? { ...device, imeiValue: value } : device
      )
    );
  }, []);

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
        key: 'imei',
        title: 'IMEI/SN',
        horizontal: 'start',
        width: '18%',
        renderCell: (row) => {
          if (row.imeiLoading) {
            return (
              <span className={styles['selected-device-imei']}>
                IMEI yuklanmoqda...
              </span>
            );
          }

          if (row.imeiError) {
            return (
              <span className={styles['selected-device-imei-error']}>
                {row.imeiError}
              </span>
            );
          }

          if (!row?.imeiOptions?.length) {
            return (
              <span className={styles['selected-device-imei']}>
                IMEI topilmadi
              </span>
            );
          }

          if (row.imeiOptions.length === 1) {
            return (
              <div className={styles['selected-device-imei-wrapper']}>
                <span className={styles['selected-device-imei']}>
                  {row.imeiOptions[0].value}
                </span>
                
              </div>
            );
          }

          return (
            <div className={styles['selected-device-imei-wrapper']}>
              <Input
                type="select"
                options={row.imeiOptions}
                value={row.imeiValue || ''}
                placeholderOption={{ value: '', label: 'IMEI tanlang' }}
                onChange={(value) => handleImeiSelect(row.id, value)}
                disabled={!canEdit}
                width="100%"
                variant="outlined"
                hasIcon={true}
              />
              
            </div>
          );
        },
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
      handleImeiSelect,
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
        whsName: device.whsName || '',
        imeiOptions: device.imeiOptions ?? [],
        imeiValue:
          device.imeiValue ??
          (Array.isArray(device.imeiOptions) && device.imeiOptions.length === 1
            ? device.imeiOptions[0].value
            : ''),
        imeiLoading: Boolean(device.imeiLoading),
        imeiError:
          device.imeiError === undefined || device.imeiError === null
            ? ''
            : device.imeiError,
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
    const hasValue = Boolean(value.trim());
    setIsSuggestionsOpen(hasValue);
  }, []);

  const handleDeviceSearch = useCallback(
    async (text, page = 1) => {
      const query = text?.trim();
      
      if (!query) {
        return { data: [], total: 0, totalPages: 0 };
      }

      // Agar searchBranchFilter undefined bo'lsa va activeWhsCode ham bo'sh bo'lsa, "Barcha filiallar" deb qabul qilamiz
      // Yoki agar searchBranchFilter tanlanmagan bo'lsa, request yubormaslik
      const effectiveSearchBranchFilter = searchBranchFilter || (!activeWhsCode ? 'all' : null);
      
      if (!effectiveSearchBranchFilter) {
        return { data: [], total: 0, totalPages: 0 };
      }

      const isAllBranches = effectiveSearchBranchFilter === 'all';

      try {
        const params = {
          search: query,
          condition: DEFAULT_CONTRACT_CONDITION,
          page,
        };

        // Faqat "Barcha filiallar" tanlanmagan va activeWhsCode mavjud bo'lsa whsCode qo'shish
        // "Barcha filiallar" tanlanganida whsCode umuman yuborilmaydi
        if (!isAllBranches && activeWhsCode) {
          params.whsCode = activeWhsCode;
        }

        const response = await mutateContractTerms(params);

        const items = Array.isArray(response?.items)
          ? response.items
          : Array.isArray(response)
            ? response
            : response?.data || [];

        const normalizedItems = normalizeContractItems(items);

        return {
          data: normalizedItems,
          total: normalizedItems.length,
          totalPages: 1,
        };
      } catch (err) {
        return { data: [], total: 0, totalPages: 0 };
      }
    },
    [activeWhsCode, contractWhsCode, mutateContractTerms, normalizeContractItems, searchBranchFilter]
  );

  const handleSelectDevice = useCallback(
    (item) => {
      const deviceId = item.id ?? item.name;
      const itemCode = resolveItemCode(item);
      // Item ichida WhsCode bo'lsa, uni ishlatish, aks holda activeWhsCode dan foydalanish
      const itemWhsCode = item?.whsCode || item?.raw?.WhsCode || activeWhsCode;
      const itemWhsName = item?.whsName || item?.raw?.WhsName || '';
      let wasAdded = false;

      setSelectedDevices((prev) => {
        const exists = prev.some((device) => device.id === deviceId);
        if (exists) {
          return prev;
        }
        wasAdded = true;
        return [
          ...prev,
          {
            ...item,
            id: deviceId,
            rentPeriod: DEFAULT_RENT_PERIOD,
            firstPayment: '',
            imeiOptions: [],
            imeiValue: '',
            imeiLoading: true,
            imeiError: null,
            whsCode: itemWhsCode,
            whsName: itemWhsName,
          },
        ];
      });

      setSearchTerm('');
      setIsSuggestionsOpen(false);

      // Agar item ichida whsCode bo'lsa va u branchFilterOptions ichida bo'lsa, searchBranchFilter ni o'rnatish
      if (wasAdded && itemWhsCode && branchFilterOptions?.length && setValue) {
        const hasItemWhsCode = branchFilterOptions.some(
          (opt) => String(opt.value) === String(itemWhsCode)
        );
        if (hasItemWhsCode) {
          setValue('searchBranchFilter', itemWhsCode);
        }
        
        fetchDeviceSeries({
          deviceId,
          itemCode,
          whsCode: itemWhsCode,
          whsName: itemWhsName,
        });
      } else if (wasAdded && itemWhsCode) {
        fetchDeviceSeries({
          deviceId,
          itemCode,
          whsCode: itemWhsCode,
          whsName: itemWhsName,
        });
      }
    },
    [activeWhsCode, fetchDeviceSeries, resolveItemCode, branchFilterOptions, setValue]
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

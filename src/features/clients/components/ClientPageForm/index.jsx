import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Input, Row, Clipboard } from '@components/ui';
import { useForm } from 'react-hook-form';

import FilePreviewModal from './FilePreviewModal';
import InputGroup from './InputGroup';
import Label from './Label';

import useAuth from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';
import useIsMobile from '@hooks/useIsMobile';

import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useMutateClientImages from '@hooks/data/clients/useMutateClientImages';
import useMutateClientAddress from '@hooks/data/clients/useMutateClientAddress';
import useFetchInvoiceScore from '@hooks/data/clients/useFetchInvoiceScore';

import styles from './style.module.scss';

import selectOptionsCreator from '@utils/selectOptionsCreator';
import formatterCurrency from '@utils/formatterCurrency';
import YandexMap from '@components/ui/Map/YandexMap';
import { API_CLIENT_IMAGES } from '@utils/apiUtils';
import formatDate, { formatDateWithHour } from '@utils/formatDate';
import hasRole from '@utils/hasRole';
import { store } from '@store/store';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import { formatterPayment } from '@/utils/formatterPayment';
import { PaymentScoreGauge } from '@/features/leads/components/LeadPageSections';

function ClientPageForm({
  formId,
  onSubmit,
  setIsSaveButtonDisabled,
  isCompactLayout = false,
  ...props
}) {
  const currentClient = store.getState().page.clients.currentClient;
  const cardCode = currentClient?.['CardCode'] || currentClient?.['cardCode'];
  const { data: invoiceScoreData } = useFetchInvoiceScore({
    CardCode: cardCode,
  });
  const [userAddressCoords, setUserAddressCoords] = useState({});
  const [filePreviewModal, setFilePreviewModal] = useState(false);
  const [softDeletedFileIds, setSoftDeletedFileIds] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isFileSaveButtonDisabled, setFileSaveButtonDisabled] = useState(true);

  const { data: executors } = useFetchExecutors({
    include_role: ['Manager', 'Assistant'],
  });

  const { data: rate } = useFetchCurrency();
  const { user } = useAuth();
  const { alert } = useAlert();

  const updateMutation = useMutateClientImages('update');
  const deleteMutation = useMutateClientImages('delete');
  const updateAddressMutation = useMutateClientAddress();
  const isMobile = useIsMobile();
  const clientFilesWithAPI = useMemo(
    () =>
      Array.isArray(currentClient?.Images)
        ? currentClient.Images.map(
            (img) =>
              ({
                id: img._id,
                image: API_CLIENT_IMAGES + img?.image,
                type: 'server',
              }) || []
          )
        : [],
    [currentClient]
  );
  const [allFiles, setAllFiles] = useState([]);
  const executorsOptions = useMemo(
    () =>
      selectOptionsCreator(executors, {
        label: 'SlpName',
        value: 'SlpCode',
        includeEmpty: true,
        isEmptySelectable: false,
      }),
    [executors]
  );

  const {
    register,
    handleSubmit,
    control,
    reset,
    setValue,
    formState: { isDirty },
  } = useForm({
    defaultValues: {
      name: currentClient?.['CardName'] || 'Mavjud emas',
      executor: executorsOptions?.[0]?.value,
      photo: [],
      telephone: currentClient?.['Phone1'] || '+998 00 000 00 00',
      additional_telephone: currentClient?.['Phone2'] || '',
      code: currentClient?.['CardCode'] || '00000',
      debtClient: formatterCurrency(
        currentClient?.['MaxDocTotal'] || '0',
        'USD'
      ),
      passportSeries: currentClient?.['Cellular'] || 'Mavjud emas',
      product:
        currentClient?.['Dscription'] || 'iPhone 16 Pro max 256gb desert',
      deadline: formatDate(currentClient?.['DueDate']),
      agreementDate: currentClient?.['NewDueDate']
        ? formatDateWithHour(currentClient['NewDueDate'])
        : '',
      imei: currentClient?.['IntrSerial'] || '0000000000000000',
    },
  });
  const handleFileInputClick = useCallback(() => {
    setFilePreviewModal(true);
  }, []);

  const allowedTypes = [
    'image/png',
    'image/jpg',
    'image/jpeg',
    'image/webp',
    'image/svg+xml',
    'image/gif',
    'application/pdf',
    'application/vnd.ms-excel',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  ];

  const allowedExtensions = [
    'png',
    'jpg',
    'jpeg',
    'svg',
    'gif',
    'pdf',
    'xls',
    'xlsx',
    'webp',
  ];
  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    const validFiles = files.filter((file) => {
      const ext = file.name.split('.').pop().toLowerCase();
      return (
        allowedTypes.includes(file.type) && allowedExtensions.includes(ext)
      );
    });
    // Show error or ignore invalid files
    if (validFiles.length !== files.length) {
      alert('Faqat png, jpg, jpeg, webp, svg, pdf, excel fayllarni yuklang!', {
        type: 'info',
      });
    }
    // Continue with validFiles
    setUploadedFile((prev) => [
      ...prev,
      ...validFiles.map((file) => ({
        id: uuidv4(),
        image: URL.createObjectURL(file),
        originalFile: file,
        type: 'upload',
      })),
    ]);
  }, []);

  const handleFileUpload = useCallback(async () => {
    const commonPayload = {
      docEntry: currentClient?.['DocEntry'],
      installmentId: currentClient?.['InstlmntID'],
    };
    try {
      if (uploadedFile.length > 0) {
        const formDataFiles = new FormData();
        uploadedFile.forEach((file) => {
          formDataFiles.append('files', file.originalFile);
        });
        const updatePayload = {
          ...commonPayload,
          data: formDataFiles,
        };
        await updateMutation.mutateAsync(updatePayload);
        if (!updateMutation.isError) {
          setUploadedFile([]);
        }
      }
      if (softDeletedFileIds.length > 0) {
        await Promise.all(
          softDeletedFileIds.map((id) => {
            const deletePayload = {
              ...commonPayload,
              id,
            };
            return deleteMutation.mutateAsync(deletePayload);
          })
        );
        setSoftDeletedFileIds([]);
      }
    } catch (error) {
      console.log('Update/Delete Files error: ', error);
    } finally {
      setFilePreviewModal(false);
    }
  }, [uploadedFile, softDeletedFileIds, currentClient]);

  useEffect(() => {
    setAllFiles((prev) => {
      if (!prev || !Array.isArray(prev)) return [];
      const filteredFiles = uploadedFile.filter((file) =>
        prev.every((allFile) => allFile.id !== file.id)
      );
      return [...prev, ...filteredFiles];
    });
    if (uploadedFile.length > 0) setFileSaveButtonDisabled(false);
  }, [uploadedFile]);

  useEffect(() => {
    const foundExecutor = executors?.find(
      (executor) => Number(executor?.SlpCode) === Number(currentClient?.SlpCode)
    );

    if (foundExecutor) {
      setValue('executor', foundExecutor.SlpCode, { shouldDirty: false });
    }
  }, [executors]);

  useEffect(() => {
    setIsSaveButtonDisabled(!isDirty);
  }, [isDirty]);

  useEffect(() => {
    const filesWithApi = Array.isArray(currentClient?.Images)
      ? currentClient.Images.map(
          (file) =>
            ({
              id: file._id,
              image: API_CLIENT_IMAGES + file?.image,
              type: 'server',
            }) || []
        )
      : [];
    setAllFiles(() => filesWithApi);
  }, [currentClient]);

  useEffect(() => {
    if (rate) {
      const docCurrency = currentClient?.DocCur;
      let value = '';
      value = formatterPayment(
        currentClient?.[
          docCurrency === 'USD' ? 'MaxDocTotal' : 'MaxDocTotalFC'
        ],
        docCurrency,
        rate?.Rate
      );
      setValue('debtClient', value, { shouldDirty: false });
    }
  }, [rate]);

  // Reset form with current client data to ensure isDirty works correctly
  useEffect(() => {
    if (currentClient && executorsOptions.length > 0) {
      const foundExecutor = executorsOptions.find(
        (executor) => Number(executor?.value) === Number(currentClient?.SlpCode)
      );

      const formData = {
        name: currentClient?.['CardName'] || 'Mavjud emas',
        executor: foundExecutor?.value || executorsOptions?.[0]?.value,
        photo: [],
        telephone: currentClient?.['Phone1'] || '+998 00 000 00 00',
        additional_telephone: currentClient?.['Phone2'] || '',
        code: currentClient?.['CardCode'] || '00000',
        debtClient: formatterCurrency(
          currentClient?.['MaxDocTotal'] || '0',
          'USD'
        ),
        passportSeries: currentClient?.['Cellular'] || 'Mavjud emas',
        product:
          currentClient?.['Dscription'] || 'iPhone 16 Pro max 256gb desert',
        deadline: formatDate(currentClient?.['DueDate']),
        agreementDate: formatDateWithHour(currentClient?.['NewDueDate']) || '',
        imei: currentClient?.['IntrSerial'] || '0000000000000000',
      };

      reset(formData);
    }
  }, [currentClient, executorsOptions, reset]);

  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        const hasCoords =
          'lat' in userAddressCoords && 'long' in userAddressCoords;
        if (hasCoords) {
          await updateAddressMutation.mutateAsync({
            cardCode: currentClient?.['CardCode'],
            data: userAddressCoords,
          });
        }
        reset(data);
      })}
      {...props}
    >
      <FilePreviewModal
        inputId={'file'}
        images={allFiles}
        isOpen={filePreviewModal}
        isLoading={updateMutation.isPending || deleteMutation.isPending}
        isDisabled={isFileSaveButtonDisabled}
        onRemoveImage={(file) => {
          setFileSaveButtonDisabled(false);
          if (file.type === 'server') {
            setSoftDeletedFileIds((p) => [...p, file.id]);
          }
          if (file.type === 'upload') {
            setUploadedFile((p) =>
              p.filter((prevImg) => prevImg.id !== file.id)
            );
          }
          setAllFiles((prev) =>
            prev.filter((fileItem) => fileItem.id !== file.id)
          );
        }}
        onClose={() => {
          setAllFiles([...clientFilesWithAPI]);
          setFilePreviewModal(false);
          setUploadedFile([]);
        }}
        onApply={handleFileUpload}
      />
      <Row gutter={4} wrap>
        <Col fullWidth>
          <Row direction={{ xs: 'column', md: 'row' }} gutter={3}>
            <Col span={{ xs: 24, md: 12 }} fullWidth>
              <Row gutter={1}>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="avatarFilled">FIO</Label>
                    <Row direction={'row'} gutter={2} align="center">
                      <Col fullWidth>
                        <Input
                          type="text"
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          disabled={true}
                          dimOnDisabled={false}
                          {...register('name')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['CardName'] || ''}
                          size={18}
                          aria-label="FIO nusxalash"
                          title="FIO nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="avatarFilled">Ijrochi</Label>
                    <Input
                      type="select"
                      variant={'filled'}
                      options={executorsOptions}
                      canClickIcon={false}
                      size={isMobile ? 'full' : 'long'}
                      disabled={!hasRole(user, ['Manager'])}
                      control={control}
                      name={'executor'}
                    />
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="photo" htmlFor={'file'}>
                      Fayllar
                    </Label>
                    <Input
                      id={'file'}
                      type="file"
                      images={clientFilesWithAPI}
                      accept={`.${allowedExtensions.join(', .')}`}
                      multiple
                      variant={'filled'}
                      size={isMobile ? 'full' : 'long'}
                      className={styles.fileInput}
                      onClick={handleFileInputClick}
                      onChange={handleFileChange}
                      name={'files'}
                    />
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="telephoneFilled">Telefon raqami</Label>
                    <Row direction={'row'} gutter={2} align="center">
                      <Col flexGrow>
                        <Input
                          type="tel"
                          control={control}
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          hasIcon={false}
                          style={{ cursor: 'auto' }}
                          {...register('telephone')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['Phone1'] || ''}
                          size={18}
                          aria-label="Telefon raqami nusxalash"
                          title="Telefon raqami nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="telephoneFilled">Telefon raqami 2</Label>
                    <Row direction={'row'} gutter={2} align="center">
                      <Col flexGrow>
                        {' '}
                        <Input
                          type="text"
                          control={control}
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          hasIcon={false}
                          style={{ cursor: 'auto' }}
                          {...register('additional_telephone')}
                        />
                      </Col>
                      {currentClient?.['Phone2'] && (
                        <Col>
                          <Clipboard
                            text={currentClient?.['Phone2'] || ''}
                            size={18}
                            aria-label="Telefon raqami nusxalash"
                            title="Telefon raqami nusxalash"
                          />
                        </Col>
                      )}
                    </Row>
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="barCodeFilled">Mijoz kodi</Label>
                    <Row direction={'row'} gutter={2} align={'center'}>
                      <Col fullWidth>
                        <Input
                          type="text"
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          disabled={true}
                          dimOnDisabled={false}
                          {...register('code')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['CardCode']}
                          size={18}
                          aria-label="Mijoz kodi nusxalash"
                          title="Mijoz kodi nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
            <Col span={{ xs: 24, md: 12 }} fullWidth>
              <Row gutter={1}>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="expense">Jami qarzdorlik</Label>
                    <Input
                      type="text"
                      variant={'filled'}
                      size={isMobile ? 'full' : 'long'}
                      disabled={true}
                      {...register('debtClient')}
                    />
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="products">Mahsulot nomi</Label>
                    <Row direction={'row'} gutter={2} align={'center'}>
                      <Col fullWidth>
                        <Input
                          type="text"
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          disabled={true}
                          dimOnDisabled={false}
                          {...register('product')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['Dscription']}
                          size={18}
                          aria-label="Mahsulot nomi nusxalash"
                          title="Mahsulot nomi nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="calendar">To'lov muddati</Label>
                    <Input
                      type="date"
                      variant={'filled'}
                      size={isMobile ? 'full' : 'long'}
                      control={control}
                      hasIcon={false}
                      disabled={true}
                      {...register('deadline')}
                    />
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="calendar">Kelishilgan sana</Label>
                    <Input
                      name={'agreementDate'}
                      type="date"
                      includeTime
                      variant={'filled'}
                      size={isMobile ? 'full' : 'long'}
                      datePickerOptions={{
                        minuteIncrement: 60,
                        allowInput: false,
                      }}
                      hasIcon={false}
                      control={control}
                    />
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="barCodeFilled">IMEI</Label>
                    <Row direction={'row'} gutter={2} align={'center'}>
                      <Col fullWidth>
                        <Input
                          type="text"
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          disabled={true}
                          dimOnDisabled={false}
                          {...register('imei')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['IntrSerial'] || ''}
                          size={18}
                          aria-label="IMEI nusxalash"
                          title="IMEI nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
                <Col fullWidth>
                  <InputGroup>
                    <Label icon="barCodeFilled">Passport seriyasi</Label>
                    <Row direction={'row'} gutter={2} align={'center'}>
                      <Col fullWidth>
                        <Input
                          type="text"
                          variant={'filled'}
                          size={isMobile ? 'full' : 'long'}
                          disabled={true}
                          dimOnDisabled={false}
                          {...register('passportSeries')}
                        />
                      </Col>
                      <Col>
                        <Clipboard
                          text={currentClient?.['Cellular'] || ''}
                          size={18}
                          aria-label="Passport seriyasi nusxalash"
                          title="Passport seriyasi nusxalash"
                        />
                      </Col>
                    </Row>
                  </InputGroup>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* Payment Score Gauge */}
        <Col fullWidth>
          <PaymentScoreGauge
            limit={invoiceScoreData?.limit || 0}
            trustLabel={invoiceScoreData?.trustLabel || ''}
            paymentScore={invoiceScoreData?.score ?? null}
            totalSum={
              invoiceScoreData?.totalAmount && rate?.Rate
                ? invoiceScoreData.totalAmount * rate.Rate
                : 0
            }
            closedSum={
              invoiceScoreData?.totalPaid && rate?.Rate
                ? invoiceScoreData.totalPaid * rate.Rate
                : 0
            }
            overdueDebt={
              invoiceScoreData?.overdueDebt && rate?.Rate
                ? invoiceScoreData.overdueDebt * rate.Rate
                : 0
            }
            totalContracts={invoiceScoreData?.totalContracts ?? 0}
            openContracts={invoiceScoreData?.openContracts ?? 0}
            longestDelay={invoiceScoreData?.maxDelay ?? 0}
            averagePaymentDay={invoiceScoreData?.avgPaymentDelay ?? 0}
          />
        </Col>
        {hasRole(user, ['Manager', 'Agent', 'CEO']) && (
          <Col fullWidth>
            <YandexMap
              userCoords={currentClient.location}
              onChangeCoords={(coords) => {
                setUserAddressCoords({
                  lat: coords[0],
                  long: coords[1],
                });
                setIsSaveButtonDisabled(false);
              }}
              isCompactLayout={true}
            />
          </Col>
        )}
      </Row>
    </form>
  );
}

export default memo(ClientPageForm);

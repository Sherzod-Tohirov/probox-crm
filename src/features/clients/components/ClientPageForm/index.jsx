import { memo, useCallback, useEffect, useMemo, useState } from 'react';
import { Col, Input, Row } from '@components/ui';
import { useForm } from 'react-hook-form';

import FilePreviewModal from './FilePreviewModal';
import InputGroup from './InputGroup';
import Label from './Label';

import useAuth from '@hooks/useAuth';
import useAlert from '@hooks/useAlert';

import useFetchExecutors from '@hooks/data/useFetchExecutors';
import useMutateClientImages from '@hooks/data/clients/useMutateClientImages';
import useMutateClientAddress from '@hooks/data/clients/useMutateClientAddress';

import styles from './style.module.scss';

import selectOptionsCreator from '@utils/selectOptionsCreator';
import formatterCurrency from '@utils/formatterCurrency';
import YandexMap from '@components/ui/Map/YandexMap';
import { API_CLIENT_IMAGES } from '@utils/apiUtils';
import formatDate from '@utils/formatDate';
import hasRole from '@utils/hasRole';
import { store } from '@store/store';
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';

function ClientPageForm({
  formId,
  onSubmit,
  setIsSaveButtonDisabled,
  ...props
}) {
  const currentClient = store.getState().page.clients.currentClient;
  const [userAddressCoords, setUserAddressCoords] = useState({});
  const [filePreviewModal, setFilePreviewModal] = useState(false);
  const [softDeletedFileIds, setSoftDeletedFileIds] = useState([]);
  const [uploadedFile, setUploadedFile] = useState([]);
  const [isFileSaveButtonDisabled, setFileSaveButtonDisabled] = useState(true);
  const { data: executors } = useFetchExecutors();

  const { user } = useAuth();
  const { alert } = useAlert();

  const updateMutation = useMutateClientImages('update');
  const deleteMutation = useMutateClientImages('delete');
  const updateAddressMutation = useMutateClientAddress();

  const clientFilesWithAPI = useMemo(
    () =>
      currentClient?.Images?.map(
        (img) =>
          ({
            id: img._id,
            image: API_CLIENT_IMAGES + img?.image,
            type: 'server',
          }) || []
      ),
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
      agreementDate: formatDate(currentClient?.['NewDueDate']) || '',
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
      setValue('executor', foundExecutor.SlpCode);
    }
  }, [executors]);

  useEffect(() => {
    setIsSaveButtonDisabled(!isDirty);
  }, [isDirty]);

  useEffect(() => {
    const filesWithApi = currentClient?.Images?.map(
      (file) =>
        ({
          id: file._id,
          image: API_CLIENT_IMAGES + file?.image,
          type: 'server',
        }) || []
    );
    setAllFiles(() => filesWithApi);
  }, [currentClient]);

  return (
    <form
      className={styles.form}
      id={formId}
      onSubmit={handleSubmit(async (data) => {
        await onSubmit(data);
        console.log(userAddressCoords, 'coords');
        const hasCoords =
          'lat' in userAddressCoords && 'long' in userAddressCoords;
        console.log(hasCoords, 'has coords');
        if (hasCoords) {
          await updateAddressMutation.mutate({
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
      <Row direction={'row'} gutter={6} wrap>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">FIO</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  style={{ pointerEvents: 'all' }}
                  {...register('name')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="avatarFilled">Ijrochi</Label>
                <Input
                  type="select"
                  variant={'filled'}
                  options={executorsOptions}
                  canClickIcon={false}
                  size={'longer'}
                  disabled={!hasRole(user, ['Manager'])}
                  {...register('executor')}
                />
              </InputGroup>
            </Col>
            <Col>
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
                  size={'longer'}
                  className={styles.fileInput}
                  onClick={handleFileInputClick}
                  onChange={handleFileChange}
                  name={'files'}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telefon raqami</Label>
                <Input
                  type="tel"
                  control={control}
                  variant={'filled'}
                  size={'longer'}
                  hasIcon={false}
                  style={{ cursor: 'auto' }}
                  {...register('telephone')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="telephoneFilled">Telefon raqami 2</Label>
                <Input
                  type="text"
                  control={control}
                  variant={'filled'}
                  size={'longer'}
                  hasIcon={false}
                  style={{ cursor: 'auto' }}
                  {...register('additional_telephone')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Mijoz kodi</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  {...register('code')}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col>
          <Row gutter={1}>
            <Col>
              <InputGroup>
                <Label icon="expense">Jami qarzdorlik</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  {...register('debtClient')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="products">Mahsulot nomi</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  {...register('product')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="calendar">To'lov muddati</Label>
                <Input
                  type="date"
                  variant={'filled'}
                  size={'longer'}
                  control={control}
                  hasIcon={false}
                  disabled={true}
                  {...register('deadline')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="calendar">Kelishilgan sana</Label>
                <Input
                  type="date"
                  variant={'filled'}
                  size={'longer'}
                  control={control}
                  hasIcon={false}
                  {...register('agreementDate')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">IMEI</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  {...register('imei')}
                />
              </InputGroup>
            </Col>
            <Col>
              <InputGroup>
                <Label icon="barCodeFilled">Passport seriyasi</Label>
                <Input
                  type="text"
                  variant={'filled'}
                  size={'longer'}
                  disabled={true}
                  {...register('passportSeries')}
                />
              </InputGroup>
            </Col>
          </Row>
        </Col>
        <Col flexGrow>
          <YandexMap
            userCoords={currentClient.location}
            onChangeCoords={(coords) => {
              setUserAddressCoords({
                lat: coords[0],
                long: coords[1],
              });
              setIsSaveButtonDisabled(false);
            }}
          />
        </Col>
      </Row>
    </form>
  );
}

export default memo(ClientPageForm);

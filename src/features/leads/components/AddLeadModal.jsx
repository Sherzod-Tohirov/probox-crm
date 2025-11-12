import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Modal, Row, Col, Button, Input } from '@components/ui';
import useFetchBranches from '@hooks/data/useFetchBranches';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import { createLead } from '@services/leadsService';
import FieldGroup from './LeadPageForm/FieldGroup';
import useAuth from '@/hooks/useAuth';
import { formatUZPhone, isValidPhonenumber } from '@/utils/formatPhoneNumber';
import useAlert from '@/hooks/useAlert';

const category = {
  incomingCall: 'Kiruvchi qongiroq',
  community: 'Community',
  organika: 'Organika',
};

const CATEGORY_OPTIONS_OTHERS = [
  { value: category.incomingCall, label: "Kiruvchi qo'ng'iroq" },
  { value: category.community, label: 'Community' },
];

const CATEGORY_OPTIONS_SELLER = [
  { value: category.organika, label: 'Organika' },
];

const COMMUNITY_CHANNELS = [
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
  { value: 'Other', label: 'Boshqa' },
];

const getSourceOptions = (isSeller) => {
  if (isSeller) {
    return CATEGORY_OPTIONS_SELLER;
  }
  return CATEGORY_OPTIONS_OTHERS;
};

const getOperatorOptions = (operators) => {
  if (!operators) return [];

  const filteredOperators = operators.filter((operator) =>
    Boolean(operator.U_workDay)
  );

  return filteredOperators?.map((operator) => ({
    value: operator.SlpCode,
    label: operator.SlpName,
  }));
};

export default function AddLeadModal({ isOpen, onClose, onCreated }) {
  const { alert } = useAlert();
  const { data: branches = [], isLoading: isBranchesLoading } =
    useFetchBranches();

  const { user } = useAuth();

  const { data: operators = [], isLoading: isOperatorsLoading } =
    useFetchExecutors({ include_role: 'Operator1' });

  const isSeller = user?.U_role === 'Seller';

  const sourceOptions = getSourceOptions(isSeller);
  const operatorOptions = getOperatorOptions(operators);

  const { handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      sourceCategory: sourceOptions[0].value,
      clientName: '',
      clientPhone: '+998 ',
      branchId: '',
      seller: '',
      source2: '',
      comment: '',
      operator1: '',
    },
    mode: 'all',
  });

  const sourceCategory = watch('sourceCategory');
  const selectedBranchId = watch('branchId');

  const { data: sellers = [], isLoading: isSellersLoading } = useFetchExecutors(
    selectedBranchId
      ? { include_role: 'Seller', branch: selectedBranchId }
      : { include_role: 'Seller' }
  );

  const branchOptions = useMemo(
    () =>
      Array.isArray(branches) && branches.length > 0
        ? branches?.map((b) => ({ value: b.id, label: b.name }))
        : [],
    [branches]
  );

  const sellerOptions = useMemo(
    () => sellers?.map((s) => ({ value: s.SlpCode, label: s.SlpName })) ?? [],
    [sellers]
  );

  const mutation = useMutation({
    mutationFn: (payload) => createLead(payload),
    onError: (error) => {
      console.error('Error creating lead:', error);
      alert('Lead yaratishda xatolik yuz berdi', { type: 'error' });
    },
  });

  const canSubmit = () => {
    const name = watch('clientName');
    const phone = watch('clientPhone');

    if (!sourceCategory || !name || !phone || !isValidPhonenumber(phone))
      return false;

    if (sourceCategory === category.organika) {
      return Boolean(watch('branchId') && watch('seller'));
    }

    if (sourceCategory === category.incomingCall) {
      return Boolean(watch('operator1'));
    }

    return true;
  };

  const onSubmit = (values) => {
    const payload = {
      clientName: values.clientName,
      clientPhone: values.clientPhone,
      source: values.sourceCategory,
      comment: values.comment ?? '',
    };
    if (values.sourceCategory === category.incomingCall) {
      payload.operator1 = values.operator1;
    }

    if (values.sourceCategory === category.organika) {
      payload.branch2 = values.branchId;
      payload.seller = values.seller;
    } else {
      payload.source2 = values.source2; // optional extra metadata
    }

    mutation.mutate(payload, {
      onSuccess: (created) => {
        alert('Lead muvaffaqiyatli yaratildi', { type: 'success' });
        onCreated?.(created);
        reset();
        onClose?.();
      },
    });
  };

  const footer = (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-end',
        gap: 12,
        width: '100%',
      }}
    >
      <Button variant="outlined" color="danger" type="button" onClick={onClose}>
        Bekor qilish
      </Button>
      <Button
        variant="filled"
        onClick={handleSubmit(onSubmit)}
        disabled={!canSubmit() || mutation.isLoading}
      >
        {mutation.isLoading ? 'Yaratilmoqda...' : 'Lead yaratish'}
      </Button>
    </div>
  );

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={"Yangi lead qo'shish"}
      size="md"
      preventScroll
      footer={footer}
    >
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: '100%' }}>
        <Row direction="column" gutter={2}>
          <Col fullWidth>
            <Input
              size="full-grow"
              variant="outlined"
              label="Manba turi"
              type="select"
              options={sourceOptions}
              placeholderOption={true}
              value={watch('sourceCategory')}
              onChange={(val) => {
                setValue('sourceCategory', val?.target?.value ?? val);
                // reset dependent fields when category changes
                setValue('branchId', '');
                setValue('seller', '');
                setValue('source2', '');
                setValue('operator1', '');
              }}
            />
          </Col>

          {sourceCategory ? (
            <FieldGroup
              style={{ width: '100%' }}
              title={`${sourceCategory} maydonlari`}
            >
              <Col fullWidth>
                <Row gutter={4}>
                  <Col fullWidth>
                    <Row direction={'row'} gutter={2}>
                      <Col xs={12} md={6} flexGrow>
                        <Input
                          size="full-grow"
                          variant="outlined"
                          label="F.I.O"
                          placeholder="Ism Familiya"
                          value={watch('clientName')}
                          onChange={(e) =>
                            setValue('clientName', e.target.value)
                          }
                        />
                      </Col>
                      <Col xs={12} md={6} flexGrow>
                        <Input
                          size="full-grow"
                          variant="outlined"
                          label="Telefon raqami"
                          placeholder="+998 99 123 45 67"
                          value={watch('clientPhone')}
                          onChange={(e) =>
                            setValue(
                              'clientPhone',
                              formatUZPhone(e.target.value)
                            )
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col fullWidth>
                    <Row direction="row" gutter={2} wrap>
                      {sourceCategory === category.incomingCall ? (
                        <Col xs={12} md={6} flexGrow>
                          <Input
                            size="full-grow"
                            variant="outlined"
                            label="Operator"
                            type="select"
                            options={operatorOptions}
                            isLoading={isOperatorsLoading}
                            placeholderOption={true}
                            value={watch('operator1')}
                            onChange={(e) =>
                              setValue('operator1', e?.target?.value ?? e)
                            }
                          />
                        </Col>
                      ) : (
                        ''
                      )}
                      {sourceCategory === category.organika ? (
                        <>
                          <Col xs={12} md={6} flexGrow>
                            <Input
                              size="full-grow"
                              variant="outlined"
                              label="Filial"
                              type="select"
                              options={branchOptions}
                              isLoading={isBranchesLoading}
                              placeholderOption={true}
                              value={watch('branchId')}
                              onChange={(e) =>
                                setValue('branchId', e?.target?.value ?? e)
                              }
                            />
                          </Col>
                          <Col xs={12} md={6} flexGrow>
                            <Input
                              size="full-grow"
                              variant="outlined"
                              label="Sotuvchi"
                              type="select"
                              options={sellerOptions}
                              placeholderOption={true}
                              isLoading={isSellersLoading}
                              disabled={!selectedBranchId}
                              value={watch('seller')}
                              onChange={(e) =>
                                setValue('seller', e?.target?.value ?? e)
                              }
                            />
                          </Col>
                        </>
                      ) : (
                        <Col xs={12} md={6} flexGrow>
                          <Input
                            size="full-grow"
                            variant="outlined"
                            label="Source"
                            type="select"
                            options={COMMUNITY_CHANNELS}
                            placeholderOption={true}
                            value={watch('source2')}
                            onChange={(e) =>
                              setValue('source2', e?.target?.value ?? e)
                            }
                          />
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col fullWidth>
                <Input
                  value={watch('comment')}
                  onChange={(e) => setValue('comment', e.target.value)}
                  type="textarea"
                  variant="outlined"
                  label="Izoh qoldirish"
                />
              </Col>
            </FieldGroup>
          ) : null}
        </Row>
      </form>
    </Modal>
  );
}

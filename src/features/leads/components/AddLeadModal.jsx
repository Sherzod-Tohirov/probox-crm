import { useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { useMutation } from '@tanstack/react-query';
import { Modal, Row, Col, Button, Input } from '@components/ui';
import useFetchBranches from '@hooks/data/useFetchBranches';
import useFetchExecutors from '@hooks/data/useFetchExecutors';
import { createLead } from '@services/leadsService';
import FieldGroup from './LeadPageForm/FieldGroup';
import useAuth from '@/hooks/useAuth';
import FormField from './LeadPageForm/FormField';

const CATEGORY_OPTIONS_OTHERS = [
  { value: 'Organika', label: 'Organika' },
  { value: 'Kiruvchi qongiroq', label: "Kiruvchi qo'ng'iroq" },
  { value: 'Community', label: 'Community' },
];

const CATEGORY_OPTIONS_SELLER = [{ value: 'Organika', label: 'Organika' }];

const COMMUNITY_CHANNELS = [
  { value: 'Telegram', label: 'Telegram' },
  { value: 'Instagram', label: 'Instagram' },
  { value: 'Facebook', label: 'Facebook' },
];

export default function AddLeadModal({ isOpen, onClose, onCreated }) {
  const { data: branches = [], isLoading: isBranchesLoading } =
    useFetchBranches();
  const { user } = useAuth();
  const isSeller = user?.U_role === 'Seller';
  const { control, handleSubmit, reset, watch, setValue } = useForm({
    defaultValues: {
      sourceCategory: 'Organika',
      clientName: '',
      clientPhone: '',
      branchId: '',
      seller: '',
      platform: '',
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
    () => branches?.map((b) => ({ value: b.id, label: b.name })) ?? [],
    [branches]
  );

  const sellerOptions = useMemo(
    () => sellers?.map((s) => ({ value: s.SlpCode, label: s.SlpName })) ?? [],
    [sellers]
  );

  const mutation = useMutation({
    mutationFn: (payload) => createLead(payload),
  });

  const canSubmit = useMemo(() => {
    const name = watch('clientName');
    const phone = watch('clientPhone');
    if (!sourceCategory || !name || !phone) return false;
    if (sourceCategory === 'Organika') {
      return Boolean(watch('branchId') && watch('seller'));
    }
    return Boolean(watch('platform'));
  }, [sourceCategory, watch]);

  const onSubmit = (values) => {
    const payload = {
      clientName: values.clientName,
      clientPhone: values.clientPhone,
      source: values.sourceCategory,
    };

    if (values.sourceCategory === 'Organika') {
      payload.branch2 = values.branchId;
      payload.seller = values.seller;
    } else {
      payload.platform = values.platform; // optional extra metadata
    }

    mutation.mutate(payload, {
      onSuccess: (created) => {
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
        disabled={!canSubmit || mutation.isLoading}
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
              options={
                isSeller ? CATEGORY_OPTIONS_SELLER : CATEGORY_OPTIONS_OTHERS
              }
              value={watch('sourceCategory')}
              onChange={(val) => {
                setValue('sourceCategory', val?.target?.value ?? val);
                // reset dependent fields when category changes
                setValue('branchId', '');
                setValue('seller', '');
                setValue('platform', '');
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
                        <FormField
                          size="full-grow"
                          variant="outlined"
                          label="Telefon raqami"
                          placeholder="99 123 45 67"
                          value={watch('clientPhone')}
                          onChange={(e) =>
                            setValue('clientPhone', e.target.value)
                          }
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col fullWidth>
                    <Row direction="row" gutter={2} wrap>
                      {sourceCategory === 'Organika' ? (
                        <>
                          <Col xs={12} md={6} flexGrow>
                            <Input
                              size="full-grow"
                              variant="outlined"
                              label="Filial"
                              type="select"
                              options={branchOptions}
                              isLoading={isBranchesLoading}
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
                            value={watch('platform')}
                            onChange={(e) =>
                              setValue('platform', e?.target?.value ?? e)
                            }
                          />
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              </Col>
            </FieldGroup>
          ) : null}
        </Row>
      </form>
    </Modal>
  );
}

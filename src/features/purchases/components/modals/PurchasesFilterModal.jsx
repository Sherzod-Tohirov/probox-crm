import {
  Button,
  Card,
  Checkbox,
  Col,
  Input,
  Modal,
  Row,
  Typography,
} from '@/components/ui';
import { omit } from 'lodash';
import { useForm } from 'react-hook-form';
import { useSelector } from 'react-redux';

function ModalFooter({ onClose, formId }) {
  return (
    <Row direction="row" justify="space-between" align="center" gutter={2}>
      <Col>
        <Button onClick={onClose} color="danger">
          Bekor qilish
        </Button>
      </Col>
      <Col>
        <Button type="submit" form={formId}>
          Qo'llash
        </Button>
      </Col>
    </Row>
  );
}

const statusOptions = [
  { value: 'confirmed', label: 'Tasdiqlangan' },
  { value: 'waiting', label: 'Kutilmoqda' },
];

const categoryOptions = [
  { value: 'computers', label: 'Kompyuterlar' },
  { value: 'telehpones', label: 'Telefonlar' },
  { value: 'accessories', label: 'Akksessuarlar' },
];

const warehouseOptions = [
  { value: 'parkent', label: 'Parkent' },
  { value: 'sagbon', label: "Sag'bon" },
  { value: 'qoratosh', label: 'Qoratosh' },
];

export function PurchasesFilterModal({ isOpen, onClose, onApply, title }) {
  const filters = useSelector((state) => state.page.purchases.filter);
  const { watch, reset, setValue, control, handleSubmit } = useForm({
    defaultValues: {
      status: filters?.status ?? '',
      category: filters?.category ?? '',
      warehouse: filters?.warehouse ?? '',
    },
  });

  const statusField = watch('status');
  const filterFormId = 'purchase-filter-form';

  const handleStatusChange = (e) => {
    const { checked, value } = e.target ?? {};
    const parsedStatus = statusField
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const newStatus = checked
      ? [...new Set([...parsedStatus, value])]
      : parsedStatus.filter((status) => status !== value);

    setValue('status', newStatus.join(','));
  };

  const handleApplyFilter = (data) => {
    onApply(data);
  };

  const handleClearFilter = () => {
    reset({ ...omit(filters, ['search']) });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={title}
      size="sm"
      footer={<ModalFooter onClose={handleClearFilter} formId={filterFormId} />}
    >
      <form onSubmit={handleSubmit(handleApplyFilter)} id={filterFormId}>
        <Row gutter={4}>
          <Col fullWidth>
            <Card
              title={<Typography variant="body1">Status bo'yicha</Typography>}
            >
              <Row gutter={4}>
                <Col fullWidth>
                  <Row direction="row" gutter={3} align="center">
                    {statusOptions.map((status) => (
                      <Col flexGrow key={status?.value}>
                        <Checkbox
                          label={status.label}
                          checked={statusField?.includes(status.value)}
                          value={status.value}
                          onChange={handleStatusChange}
                        />
                      </Col>
                    ))}
                  </Row>
                </Col>
              </Row>
            </Card>
          </Col>
          <Col fullWidth>
            <Input
              name="category"
              label="Kategoriyalar"
              control={control}
              type="select"
              placeholderOption={true}
              variant="outlined"
              options={categoryOptions}
            />
          </Col>
          <Col fullWidth>
            <Input
              name="warehouse"
              label="Omborxona"
              control={control}
              type="select"
              placeholderOption={true}
              variant="outlined"
              options={warehouseOptions}
            />
          </Col>
        </Row>
      </form>
    </Modal>
  );
}

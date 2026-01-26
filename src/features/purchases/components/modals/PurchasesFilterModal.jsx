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
import {
  getMultiSelectOptions,
  getMultiSelectValue,
} from '@/utils/multiSelect';
import { omit } from 'lodash';
import moment from 'moment';
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
  { value: 'approve', label: 'Tasdiqlangan' },
  { value: 'pending', label: 'Kutilmoqda' },
  { value: 'draft', label: 'Qoralama' },
  { value: 'rejected', label: 'Rad etildi' },
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
  const startOfTheMonth = moment().startOf('month').format('DD.MM.YYYY');
  const endOfTheMonth = moment().endOf('month').format('DD.MM.YYYY');
  const { watch, reset, setValue, control, handleSubmit } = useForm({
    defaultValues: {
      status: filters?.status ?? '',
      category: getMultiSelectOptions(categoryOptions, filters?.category),
      warehouse: getMultiSelectOptions(warehouseOptions, filters?.warehouse),
      dateFrom: filters?.dateFrom || startOfTheMonth,
      dateTo: filters?.dateTo || endOfTheMonth,
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
    const category = getMultiSelectValue(data?.category);
    const warehouse = getMultiSelectValue(data?.warehouse);
    onApply({ ...data, category, warehouse });
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
                  <Row direction="row" gutter={3} align="center" wrap>
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
            <Row direction="row" gutter={3}>
              <Col flexGrow>
                <Input
                  name="dateFrom"
                  label="Boshlanish sanasi"
                  control={control}
                  type="date"
                  variant="outlined"
                />
              </Col>
              <Col flexGrow>
                <Input
                  name="dateTo"
                  label="Tugash sanasi"
                  control={control}
                  type="date"
                  variant="outlined"
                />
              </Col>
            </Row>
          </Col>
          <Col fullWidth>
            <Input
              multipleSelect
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
              multipleSelect
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

import {
  Col,
  Input,
  Navigation,
  Row,
  Typography,
  Badge,
  Button,
} from '@/components/ui';
import StatusBadge from './StatusBadge';
import { DownloadIcon } from 'lucide-react';
import SupplierSelect from './SupplierSelect';

function CourierField({ isEditable, value, onSelect, control }) {
  if (isEditable) {
    return (
      <Col span={6}>
        <SupplierSelect control={control} value={value} onSelect={onSelect} />
      </Col>
    );
  }

  return (
    <Col>
      <Row direction="row" gutter={2} align="center">
        <Col>
          <Typography color="secondary" variant="body2">
            Yetkazib beruvchi:
          </Typography>
        </Col>
        <Col>
          <Badge size="lg" color="secondary">
            {value || '-'}
          </Badge>
        </Col>
      </Row>
    </Col>
  );
}

function WarehouseField({ isEditable, value, control, options, onChange }) {
  if (isEditable) {
    return (
      <Col span={6}>
        <Input
          name="warehouse"
          variant="outlined"
          type="select"
          placeholder="Omborxona"
          options={options}
          control={control}
          onChange={onChange}
        />
      </Col>
    );
  }

  return (
    <Col>
      <Row direction="row" gutter={2} align="center">
        <Col>
          <Typography color="secondary" variant="body2">
            Omborxona:
          </Typography>
        </Col>
        <Col>
          <Badge size="lg" color="secondary">
            {value || '-'}
          </Badge>
        </Col>
      </Row>
    </Col>
  );
}

function StatusField({ status }) {
  return (
    <Col span={4}>
      <Row direction="row" gutter={2} align="center">
        <Col>
          <Typography color="secondary" variant="body2">
            Status:
          </Typography>
        </Col>
        <Col>
          <StatusBadge status={status} />
        </Col>
      </Row>
    </Col>
  );
}

function DownloadPDF({ status, isEditable, onDownloadPdf }) {
  if (isEditable || status !== 'approved') return null;
  return (
    <Col span={4}>
      <Button
        icon={<DownloadIcon color="#fff" size={16} />}
        iconSize={16}
        fullWidth
        onClick={onDownloadPdf}
      >
        Yuklab olish
      </Button>
    </Col>
  );
}

export default function PurchaseHeader({
  isEditable,
  status,
  courier,
  warehouse,
  warehouseOptions,
  control,
  onCourierSelect,
  onWarehouseChange,
  onDownloadPdf,
  backPath = '/purchases',
}) {
  return (
    <Row direction="row" justify="space-between">
      <Col flexGrow>
        <Navigation fallbackBackPath={backPath} />
      </Col>
      <Col span={16}>
        <Row direction="row" align="center" justify="end" gutter={4}>
          <CourierField
            isEditable={isEditable}
            value={courier}
            control={control}
            onSelect={onCourierSelect}
          />
          <WarehouseField
            isEditable={isEditable}
            value={warehouse}
            control={control}
            options={warehouseOptions}
            onChange={onWarehouseChange}
          />
          <StatusField status={status} />
          <DownloadPDF
            status={status}
            isEditable={isEditable}
            onDownloadPdf={onDownloadPdf}
          />
        </Row>
      </Col>
    </Row>
  );
}

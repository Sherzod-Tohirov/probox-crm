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
      <Col xs={24} sm={12} md={6}>
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
      <Col xs={24} sm={12} md={6}>
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
    <Col xs={12} sm={6} md={4}>
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
  if (isEditable || status !== 'approve') return null;
  return (
    <Col xs={12} sm={6} md={4}>
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
    <Row
      direction={{ xs: 'column', md: 'row' }}
      justify="space-between"
      gutter={4}
    >
      <Col xs={24} md="auto">
        <Navigation fallbackBackPath={backPath} />
      </Col>
      <Col xs={24} md={16}>
        <Row
          direction="row"
          align="center"
          justify={{ xs: 'start', md: 'end' }}
          gutter={4}
          wrap
        >
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

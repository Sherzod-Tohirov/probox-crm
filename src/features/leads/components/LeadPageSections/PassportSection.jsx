import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import PassportUpload from '@/features/leads/components/LeadPageForm/PassportUpload';

export default function PassportSection({
  canEdit,
  uploadValue,
  passportFiles,
  onFilesChange,
  onUpload,
  isUploading,
}) {
  return (
    <FieldGroup title="Pasport rasmlari">
      <PassportUpload
        disabled={!canEdit || isUploading}
        value={uploadValue}
        onChange={onFilesChange}
      />
      <Row gutter={2} style={{ marginTop: '8px' }}>
        <Col>
          <Button
            variant="filled"
            onClick={onUpload}
            disabled={!canEdit || passportFiles.length === 0 || isUploading}
          >
            Hujjatlarni saqlash
          </Button>
        </Col>
      </Row>
    </FieldGroup>
  );
}

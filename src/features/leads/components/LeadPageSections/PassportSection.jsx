import { Row, Col, Button } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import PassportUpload from '@/features/leads/components/LeadPageForm/PassportUpload';

export default function PassportSection({
  canEdit,
  uploadValue,
  passportFiles,
  onFilesChange,
  onUpload,
  onDelete,
  onUploadSingle,
  isUploading,
}) {
  // Check if there are files ready to upload (status 'tayyor' or no status)
  const hasFilesToUpload = passportFiles.some(
    (f) => f.source === 'local' && (!f.status || f.status === 'tayyor')
  );

  return (
    <FieldGroup title="Pasport rasmlari">
      <PassportUpload
        disabled={!canEdit || isUploading}
        value={uploadValue}
        onChange={onFilesChange}
        onDelete={onDelete}
        onUploadSingle={onUploadSingle}
      />
      <Row gutter={2} style={{ marginTop: '8px' }}>
        <Col>
          <Button
            variant="filled"
            onClick={onUpload}
            disabled={!canEdit || !hasFilesToUpload || isUploading}
          >
            Hujjatlarni saqlash
          </Button>
        </Col>
      </Row>
    </FieldGroup>
  );
}

import { Button, Col, Row, Modal } from '@components/ui';
import AdvancedFilters from './AdvancedFilters';

export default function MobileFiltersModal({
  isOpen,
  onClose,
  onApply,
  control,
  executorsOptions,
  isExecutorsLoading,
  watchedStartDate,
  watchedEndDate,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Qo'shimcha filterlar"
      size="md"
      footer={
        <div
          style={{
            display: 'flex',
            gap: 12,
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <Button variant="outlined" color="danger" onClick={onClose} fullWidth>
            Yopish
          </Button>
          <Button variant="filled" onClick={onApply} fullWidth>
            Qo'llash
          </Button>
        </div>
      }
    >
      <Row direction="column" gutter={6} wrap>
        <AdvancedFilters
          control={control}
          executorsOptions={executorsOptions}
          isExecutorsLoading={isExecutorsLoading}
          watchedStartDate={watchedStartDate}
          watchedEndDate={watchedEndDate}
        />
      </Row>
    </Modal>
  );
}

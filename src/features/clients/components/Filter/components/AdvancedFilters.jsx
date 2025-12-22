import { Col, Input } from '@components/ui';
import { productOptions, statusOptions } from '@utils/options';

export default function AdvancedFilters({
  control,
  executorsOptions,
  isExecutorsLoading,
  watchedStartDate,
  watchedEndDate,
}) {
  return (
    <>
      <Col xs={12} sm={6} md={3} lg={2}>
        <Input
          name="startDate"
          size="full-grow"
          variant="outlined"
          label="Boshlanish vaqti"
          canClickIcon={false}
          type="date"
          control={control}
        />
      </Col>
      <Col xs={12} sm={6} md={3} lg={2}>
        <Input
          name="endDate"
          size="full-grow"
          variant="outlined"
          label="Tugash vaqti"
          canClickIcon={false}
          type="date"
          control={control}
        />
      </Col>
      <Col xs={12} sm={6} md={3} lg={2}>
        <Input
          size="full-grow"
          canClickIcon={false}
          variant="outlined"
          label="Holati"
          type="select"
          control={control}
          options={statusOptions}
          multipleSelect={true}
          name="paymentStatus"
        />
      </Col>
      <Col xs={12} sm={6} md={3} lg={2}>
        <Input
          type="select"
          size="full-grow"
          canClickIcon={false}
          multipleSelect={true}
          options={executorsOptions}
          variant="outlined"
          showAvatars={true}
          avatarSize={20}
          label="Mas'ul ijrochi"
          isLoading={isExecutorsLoading}
          control={control}
          name="slpCode"
        />
      </Col>
      <Col xs={12} sm={6} md={3} lg={2}>
        <Input
          type="select"
          size="full-grow"
          canClickIcon={false}
          options={productOptions}
          variant="outlined"
          label="Buyum"
          control={control}
          name="phoneConfiscated"
        />
      </Col>
    </>
  );
}

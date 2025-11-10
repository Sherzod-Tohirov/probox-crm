import { Row, Col } from '@components/ui';
import FieldGroup from '@/features/leads/components/LeadPageForm/FieldGroup';
import FormField from '@/features/leads/components/LeadPageForm/FormField';
import { formatToReadablePhoneNumber } from '@/utils/formatPhoneNumber';
import formatterCurrency from '@/utils/formatterCurrency';

export default function ClientInfoSection({ lead }) {
  return (
    <FieldGroup title="Mijoz ma'lumotlari">
      <Row gutter={4}>
        <Col>
          <Row direction={'row'} gutter={4} wrap>
            <Col>
              <FormField
                name="clientName"
                label="Ismi"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 12 }}
                defaultValue={lead?.clientName}
              />
            </Col>
            <Col>
              <FormField
                name="clientPhone"
                label="Telefon"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 12 }}
                defaultValue={formatToReadablePhoneNumber(
                  lead?.clientPhone,
                  true
                )}
              />
            </Col>
            <Col>
              <FormField
                name="birthDate"
                label="Tug'ilgan sana"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 12 }}
                defaultValue={lead?.birthDate}
              />
            </Col>
            <Col>
              <FormField
                name="age"
                label="Yosh"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 12 }}
                defaultValue={lead?.age}
              />
            </Col>
          </Row>
        </Col>
        <Col>
          <Row direction={'row'} gutter={4} wrap>
            <Col>
              <FormField
                name="passportId"
                label="Pasport ID"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 8 }}
                defaultValue={lead?.passportId}
              />
            </Col>
            <Col>
              <FormField
                name="jshshir"
                label="JSHSHIR"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 8 }}
                defaultValue={lead?.jshshir}
              />
            </Col>
            <Col>
              <FormField
                name="finalLimit"
                label="Yakuniy limit"
                control={null}
                disabled={true}
                span={{ xs: 24, md: 8 }}
                defaultValue={
                  lead?.finalLimit ? formatterCurrency(lead?.finalLimit) : ''
                }
                iconText="so'm"
              />
            </Col>
          </Row>
        </Col>
      </Row>
    </FieldGroup>
  );
}

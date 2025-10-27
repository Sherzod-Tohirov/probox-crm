import { Row, Col, Input } from '@components/ui';
import SelectField from '../fields/SelectField';
import { booleanOptionsAll } from '../options';
import styles from '../style.module.scss';

export default function RoleFilters({ role, control, isMobile, register }) {
  if (!role) return null;

  return (
    <Row direction="row" gutter={isMobile ? 2 : 1} wrap align="flex-end">
      {role === 'Operator1' && (
        <>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <SelectField
              name="called"
              label="Called (Op1)"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <SelectField
              name="answered"
              label="Answered (Op1)"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <SelectField
              name="interested"
              label="Interested (Op1)"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
        </>
      )}

      {role === 'Operator2' && (
        <>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <SelectField
              name="called2"
              label="Telefon qilindimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <SelectField
              name="answered2"
              label="Javob berildimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
        </>
      )}

      {role === 'Scoring' && (
        <>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <Input
              size="full-grow"
              variant="outlined"
              label="Pasport ID"
              type="text"
              control={control}
              {...register('passportId')}
            />
          </Col>
          <Col xs={12} sm={6} md={2} lg={1.5} xl={1.2} className={isMobile ? styles['mobile-full-width'] : styles.compactCol}>
            <Input
              size="full-grow"
              variant="outlined"
              label="JSHSHIR"
              type="text"
              control={control}
              {...register('jshshir2')}
            />
          </Col>
        </>
      )}
    </Row>
  );
}

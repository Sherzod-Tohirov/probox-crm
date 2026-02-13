import { Col, Input } from '@components/ui';
import SelectField from '../fields/SelectField';
import MultiSelectField from '../fields/MultiSelectField';
import {
  booleanOptionsAll,
  callCountOptions,
  passportVisitOptions,
} from '../../../utils/options';
import styles from '../style.module.scss';
import hasRole from '@/utils/hasRole';

export default function RoleFilters({
  role,
  control,
  isMobile,
  register,
  sellerOptions = [],
  scoringOptions = [],
  isSellerLoading = false,
  isScoringLoading = false,
}) {
  if (!role) return null;

  return (
    <>
      {hasRole(role, ['Operator1', 'OperatorM', 'CEO']) && (
        <>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="called"
              label="Qo'ng'iroq qilindimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="answered"
              label="Javob berildimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="interested"
              label="Qiziqish bildirildimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="passportVisit"
              label="Passport/Tashrif"
              options={passportVisitOptions}
              control={control}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="callCount"
              label="Qo'ng'iroq soni"
              options={callCountOptions}
              control={control}
            />
          </Col>
        </>
      )}

      {hasRole(role, ['Operator1', 'Operator2', 'OperatorM', 'CEO']) && (
        <>
          {/* <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="called2"
              label="Qo'ng'iroq qilindimi 2"
              options={booleanOptionsAll}
              control={control}
            />
          </Col> */}
          {/* <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="answered2"
              label="Javob berildimi 2"
              options={booleanOptionsAll}
              control={control}
            />
          </Col> */}
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="meetingHappened"
              label="Uchrashuv bo'ldimi"
              options={booleanOptionsAll}
              control={control}
            />
          </Col>
          {/* <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <SelectField
              name="callCount2"
              label="Qo'ng'iroq soni 2"
              options={callCountOptions}
              control={control}
            />
          </Col> */}
        </>
      )}

      {hasRole(role, ['Operator1', 'Operator2', 'OperatorM', 'CEO']) && (
        <Col
          xs={12}
          sm={6}
          md={2}
          lg={1.5}
          xl={1.2}
          className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
        >
          <Input
            size="full-grow"
            variant="outlined"
            label="Pasport ID mavjudmi"
            type="select"
            options={booleanOptionsAll}
            control={control}
            {...register('passportId')}
          />
        </Col>
      )}
      {hasRole(role, ['Scoring']) && (
        <>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <Input
              size="full-grow"
              variant="outlined"
              label="Limit mavjudmi"
              type="select"
              options={booleanOptionsAll}
              control={control}
              {...register('finalLimit')}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <Input
              size="full-grow"
              variant="outlined"
              label="JSHSHIR mavjudmi"
              type="select"
              options={booleanOptionsAll}
              control={control}
              {...register('jshshir')}
            />
          </Col>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={
              isMobile ? styles['mobile-full-width'] : styles.compactCol
            }
          >
            <MultiSelectField
              name="scoring"
              label="Scoring xodim(lar)"
              options={scoringOptions}
              control={control}
              isLoading={isScoringLoading}
              showAvatars={true}
              avatarSize={22}
            />
          </Col>
        </>
      )}

      {hasRole(role, ['Seller', 'CEO']) && (
        <Col
          xs={12}
          sm={6}
          md={2}
          lg={1.5}
          xl={1.2}
          className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
        >
          <MultiSelectField
            name="seller"
            label="Sotuvchi(lar)"
            options={sellerOptions}
            control={control}
            isLoading={isSellerLoading}
            showAvatars={true}
            avatarSize={22}
          />
        </Col>
      )}
    </>
  );
}

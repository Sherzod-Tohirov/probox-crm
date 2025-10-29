import { Col, Input } from '@components/ui';
import SelectField from '../fields/SelectField';
import MultiSelectField from '../fields/MultiSelectField';
import { sourceOptions } from '../options';
import styles from '../style.module.scss';

export default function HeaderFilters({
  control,
  register,
  isMobile,
  branchOptions,
  operator1Options,
  operator2Options,
  isBranchesLoading,
  isOperator1Loading,
  isOperator2Loading,
}) {
  return (
    <div className={styles.gridRow}>
      <Col
        xs={12}
        sm={6}
        md={2}
        lg={2}
        xl={2}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <Input
          size="full-grow"
          variant="outlined"
          label="Qidiruv"
          type="search"
          placeholder="Ismi | Telefon"
          placeholderColor="secondary"
          control={control}
          {...register('search')}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.2}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <SelectField
          name="source"
          label="Manba"
          options={sourceOptions}
          control={control}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.2}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <MultiSelectField
          name="branch"
          label="Filial"
          options={branchOptions}
          isLoading={isBranchesLoading}
          control={control}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.2}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <MultiSelectField
          name="operator"
          label="Operator 1"
          options={operator1Options}
          isLoading={isOperator1Loading}
          control={control}
          showAvatars={true}
          avatarSize={22}
        />
      </Col>

      <Col
        xs={12}
        sm={6}
        md={2}
        lg={1.5}
        xl={1.2}
        className={isMobile ? styles['mobile-full-width'] : styles.compactCol}
      >
        <MultiSelectField
          name="operator2"
          label="Operator 2"
          options={operator2Options}
          isLoading={isOperator2Loading}
          control={control}
          showAvatars={true}
          avatarSize={22}
        />
      </Col>
    </div>
  );
}

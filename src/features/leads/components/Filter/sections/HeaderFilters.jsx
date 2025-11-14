import { Col, Input, Row } from '@components/ui';
import SelectField from '../fields/SelectField';
import MultiSelectField from '../fields/MultiSelectField';
import { sourceOptions } from '../../../utils/options';
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
  minimal = false,
  onSearchSubmit,
}) {
  return (
    <Row direction="row" gutter={2} wrap>
      <Col
        fullWidth
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
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault();
              onSearchSubmit?.();
            }
          }}
          {...register('search')}
        />
      </Col>
      {!isMobile && (
        <>
          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.5}
            className={styles.compactCol}
          >
            <MultiSelectField
              name="source"
              label="Manba"
              options={sourceOptions}
              control={control}
              isSearchable={false}
            />
          </Col>

          <Col
            xs={12}
            sm={6}
            md={2}
            lg={1.5}
            xl={1.2}
            className={styles.compactCol}
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
            className={styles.compactCol}
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
            className={styles.compactCol}
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
        </>
      )}
    </Row>
  );
}

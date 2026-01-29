import { Controller } from 'react-hook-form';
import { Input, Col, Row } from '@components/ui';
import formatterCurrency from '@utils/formatterCurrency';
import { omit } from 'lodash';
import moment from 'moment';

export default function FormField({
  name,
  label,
  control,
  options,
  dateOptions = {},
  placeholderOption,
  type = 'text',
  disabled = false,
  dimOnDisabled = true,
  span = { xs: 24, md: 8 },
  prefix,
  rules = {},
  defaultValue = '',
  icon = '',
  iconText = '',
  canClickIcon = false,
  onIconClick = () => {
    console.log('clicked');
  },
}) {
  const commonProps = {
    label,
    size: 'large',
    variant: 'filled',
    disabled,
    dimOnDisabled,
    prefix,
    icon,
    iconText,
    canClickIcon,
    onIconClick,
  };

  const booleanOptions = [
    { value: true, label: 'Ha ✔️' },
    { value: false, label: "Yo'q" },
  ];

  const confirmOptions = [
    { value: 'null', label: '-' },
    { value: 'true', label: 'Ha ✔️' },
    { value: 'false', label: "Yo'q" },
  ];

  const confirmOnlyFalseOptions = [
    { value: 'null', label: '-' },
    { value: 'false', label: "Yo'q" },
  ];

  const renderField = ({ field, fieldState }) => {
    const fieldProps = {
      ...commonProps,
      ...field,
      control,
      error: fieldState?.error?.message,
    };
    switch (type) {
      case 'boolean':
        return (
          <Input
            {...fieldProps}
            type="select"
            placeholder={`${label} tanlang`}
            options={booleanOptions}
            placeholderOption={placeholderOption}
          />
        );
      case 'textarea':
        return <Input {...fieldProps} type="textarea" />;
      case 'confirm':
        return (
          <Input
            {...omit(fieldProps, ['control', 'onChange', 'value'])}
            type="select"
            placeholder={`${label} tanlang`}
            options={confirmOptions}
            value={
              field.value === true
                ? 'true'
                : field.value === false
                  ? 'false'
                  : 'null'
            }
            onChange={(val) => {
              // Handle both event objects and direct values
              const rawVal = val?.target?.value ?? val;
              const out =
                rawVal === 'true' ? true : rawVal === 'false' ? false : null;
              field.onChange(out);
            }}
            placeholderOption={false}
          />
        );
      case 'confirmOnlyFalse':
        return (
          <Input
            {...omit(fieldProps, ['control', 'onChange', 'value'])}
            type="select"
            placeholder={`${label} tanlang`}
            options={confirmOnlyFalseOptions}
            value={field.value === false ? 'false' : 'null'}
            onChange={(val) => {
              // Handle both event objects and direct values
              const rawVal = val?.target?.value ?? val;
              const out =
                rawVal === 'true' ? true : rawVal === 'false' ? false : null;
              field.onChange(out);
            }}
            placeholderOption={false}
          />
        );
      case 'number':
        return <Input {...fieldProps} type="number" min={0} />;
      case 'tel':
        return <Input {...fieldProps} type="tel" />;
      case 'currency':
        return (
          <Input
            {...fieldProps}
            type="text"
            value={field.value === '' ? '' : String(field.value)}
            inputMode="numeric"
            iconText="so'm"
            canClickIcon={false}
            onChange={(e) => {
              const raw = e?.target?.value ?? '';
              const digits = String(raw).replace(/[^0-9]/g, '');
              const formatted = formatterCurrency(Number(digits));
              field.onChange(formatted);
            }}
          />
        );

      case 'date':
        return (
          <Input
            {...omit(fieldProps, ['onChange', 'value'])}
            value={
              field.value
                ? moment(field.value, 'DD.MM.YYYY').format('DD.MM.YYYY')
                : ''
            }
            type="date"
            datePickerOptions={dateOptions}
          />
        );
      case 'datetime':
        return <Input {...fieldProps} type="date" includeTime />;

      case 'datetime-local':
        return <Input {...fieldProps} type="datetime-local" />;

      case 'jshshir':
        return (
          <Input
            {...fieldProps}
            type="text"
            inputMode="numeric"
            maxLength={14}
            onChange={(e) => {
              const raw = e?.target?.value ?? '';
              const digits = String(raw).replace(/[^0-9]/g, '');
              field.onChange(digits.slice(0, 14));
            }}
          />
        );

      case 'passportId':
        return (
          <Input
            {...fieldProps}
            type="text"
            maxLength={9}
            onChange={(e) => {
              const raw = e?.target?.value ?? '';
              // Allow only 2 capital letters followed by up to 7 digits
              const formatted = String(raw)
                .toUpperCase()
                .replace(/[^A-Z0-9]/g, '')
                .replace(/^([A-Z]{0,2})([0-9]{0,7}).*/, '$1$2');
              field.onChange(formatted);
            }}
          />
        );

      case 'select':
        return (
          <Input
            {...fieldProps}
            type="select"
            placeholder={`${label} tanlang`}
            options={options ?? []}
            placeholderOption={placeholderOption}
          />
        );

      default:
        return <Input {...fieldProps} type="text" />;
    }
  };

  // If no control provided (for disabled common fields), render input directly
  if (!control) {
    const directProps = {
      ...commonProps,
      value: defaultValue,
    };

    switch (type) {
      case 'boolean':
        return (
          <Row>
            {/* {info ? <Col span={span}>{info}</Col> : null} */}
            <Col>
              <Input
                {...directProps}
                type="select"
                placeholder={`${label} tanlang`}
                options={booleanOptions}
                placeholderOption={placeholderOption}
              />
            </Col>
          </Row>
        );
      case 'textarea':
        return (
          <Col span={span}>
            <Input {...directProps} type="textarea" />
          </Col>
        );
      case 'confirm':
        return (
          <Col span={span}>
            <Input
              {...directProps}
              type="select"
              options={confirmOptions}
              value={
                directProps.value === true
                  ? 'true'
                  : directProps.value === false
                    ? 'false'
                    : 'null'
              }
              onChange={(val) => {
                const out =
                  val === 'true' ? true : val === 'false' ? false : null;
                directProps.onChange?.(out);
              }}
              placeholder={`${label} tanlang`}
              placeholderOption={false}
            />
          </Col>
        );
      case 'confirmOnlyFalse':
        return (
          <Col span={span}>
            <Input
              {...directProps}
              type="select"
              options={confirmOnlyFalseOptions}
              value={directProps.value === false ? 'false' : 'null'}
              onChange={(val) => {
                const out =
                  val === 'true' ? true : val === 'false' ? false : null;
                directProps.onChange?.(out);
              }}
              placeholder={`${label} tanlang`}
              placeholderOption={false}
            />
          </Col>
        );
      case 'number':
        return (
          <Col span={span}>
            <Input {...directProps} type="number" min={0} />
          </Col>
        );
      case 'tel':
        return (
          <Col span={span}>
            <Input {...directProps} type="tel" />
          </Col>
        );
      case 'date':
        return (
          <Col span={span}>
            <Input
              {...{ ...omit(directProps, ['onChange', 'value']) }}
              value={
                directProps.value
                  ? moment(directProps.value, 'DD.MM.YYYY').format('DD.MM.YYYY')
                  : ''
              }
              type="date"
            />
          </Col>
        );

      case 'datetime':
        return (
          <Col span={span}>
            <Input {...directProps} type="date" includeTime />
          </Col>
        );

      case 'datetime-local':
        return (
          <Col span={span}>
            <Input {...directProps} type="datetime-local" />
          </Col>
        );

      case 'jshshir':
        return (
          <Col span={span}>
            <Input
              {...directProps}
              type="text"
              inputMode="numeric"
              maxLength={14}
            />
          </Col>
        );

      case 'passportId':
        return (
          <Col span={span}>
            <Input {...directProps} type="text" maxLength={9} />
          </Col>
        );

      default:
        return (
          <Col span={span}>
            <Input {...directProps} type="text" />
          </Col>
        );
    }
  }

  return (
    <Col span={span}>
      <Controller
        name={name}
        control={control}
        rules={rules}
        render={renderField}
      />
    </Col>
  );
}

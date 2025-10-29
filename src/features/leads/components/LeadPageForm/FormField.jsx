import { Controller } from 'react-hook-form';
import { Input, Col, Row } from '@components/ui';
import formatterCurrency from '@utils/formatterCurrency';

export default function FormField({
  name,
  label,
  control,
  options,
  dateOptions = {},
  placeholderOption,
  type = 'text',
  disabled = false,
  span = { xs: 24, md: 8 },
  prefix,
  rules = {},
  defaultValue = '',
}) {
  const commonProps = {
    label,
    size: 'large',
    variant: 'filled',
    disabled,
    prefix,
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
      case 'confirm':
        return (
          <Input
            {...fieldProps}
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
              const out = val === 'true' ? true : val === 'false' ? false : null;
              field.onChange(out);
            }}
            placeholderOption={false}
          />
        );

      case 'number':
        return <Input {...fieldProps} type="number" min={0} />;

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
          <Input {...fieldProps} type="date" datePickerOptions={dateOptions} />
        );

      case 'datetime':
        return <Input {...fieldProps} type="date" includeTime />;

      case 'datetime-local':
        return <Input {...fieldProps} type="datetime-local" />;

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
      defaultValue,
      value: defaultValue,
    };

    switch (type) {
      case 'boolean':
        return (
          <Row>
            {info ? <Col span={span}>{info}</Col> : null}
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
                const out = val === 'true' ? true : val === 'false' ? false : null;
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

      case 'date':
        return (
          <Col span={span}>
            <Input {...directProps} type="date" />
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

import { Controller } from 'react-hook-form';
import { Input, Col } from '@components/ui';

export default function FormField({
  name,
  label,
  control,
  options,
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

  const confirmOptions = [
    { value: true, label: 'Ha ✔️' },
    { value: false, label: "Yo'q ❌" },
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
            options={confirmOptions}
          />
        );
      case 'number':
        return <Input {...fieldProps} type="number" min={0} />;

      case 'date':
        return <Input {...fieldProps} type="date" />;

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
          <Col span={span}>
            <Input
              {...directProps}
              type="select"
              placeholder={`${label} tanlang`}
              options={confirmOptions}
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

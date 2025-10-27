import { Input } from '@components/ui';

export default function MultiSelectField({
  name,
  label,
  options,
  control,
  isLoading = false,
  ...props
}) {
  return (
    <Input
      name={name}
      size="full-grow"
      variant="outlined"
      label={label}
      type="select"
      options={options}
      canClickIcon={false}
      multipleSelect={true}
      isLoading={isLoading}
      control={control}
      {...props}
    />
  );
}

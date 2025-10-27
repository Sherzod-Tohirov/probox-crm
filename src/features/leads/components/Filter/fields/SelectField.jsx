import { Controller } from 'react-hook-form';
import { Input } from '@components/ui';

export default function SelectField({ name, label, options, control, ...props }) {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <Input
          size="full-grow"
          variant="outlined"
          label={label}
          type="select"
          options={options}
          canClickIcon={false}
          {...props}
          {...field}
        />
      )}
    />
  );
}

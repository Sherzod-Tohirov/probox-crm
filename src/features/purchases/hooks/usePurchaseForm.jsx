import { useState } from 'react';
import { useForm } from 'react-hook-form';

export function usePurchaseForm() {
  const { control, watch, setValue } = useForm({
    defaultValues: {
      courier: '',
      warehouse: '',
    },
  });
  const [supplier, setSupplier] = useState(false);
  const courierValue = watch('courier');
  const warehouseValue = watch('warehouse');

  const handleCourierSelect = (value) => {
    setSupplier(value);
    setValue('courier', value?.name ?? value?.code, { shouldValidate: true });
    // Handle courier change logic here (e.g., API call, state update)
  };

  const handleWarehouseChange = (value) => {
    setValue('warehouse', value, { shouldValidate: true });
    // Handle warehouse change logic here (e.g., API call, state update)
  };

  return {
    control,
    supplier,
    courierValue,
    warehouseValue,
    handleCourierSelect,
    handleWarehouseChange,
  };
}

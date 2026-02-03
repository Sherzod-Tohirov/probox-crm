import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import useFetchSuppliers from '@/hooks/data/purchases/useFetchSuppliers';

export function usePurchaseForm({ supplier: courier, warehouse }) {
  const { data: suppliers } = useFetchSuppliers({
    params: {
      search: courier,
    },
    enabled: !!courier,
  });
  const foundSupplier =
    suppliers?.suppliers?.length > 0 ? suppliers.suppliers[0] : null;
  const { control, watch, setValue } = useForm({
    defaultValues: {
      courier: foundSupplier?.name,
      warehouse: warehouse,
    },
  });

  useEffect(() => {
    setValue('courier', foundSupplier?.name);
    setValue('warehouse', warehouse);
  }, [warehouse, setValue, foundSupplier]);

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

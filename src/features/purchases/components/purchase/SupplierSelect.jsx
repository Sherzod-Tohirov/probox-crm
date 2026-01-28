import { useState, useEffect } from 'react';
import { Input, Typography, Box } from '@/components/ui';
import { getSuppliers } from '@/services/purchasesService';

export default function SupplierSelect({ value, onSelect, disabled }) {
  const [searchValue, setSearchValue] = useState(value || '');

  useEffect(() => {
    if (value) {
      setSearchValue(value);
    }
  }, [value]);

  const handleSearch = async (searchTerm, page = 1) => {
    try {
      const response = await getSuppliers({
        search: searchTerm,
        limit: 20,
        offset: (page - 1) * 20,
      });

      return {
        data: response.suppliers || [],
        totalPages: Math.ceil((response.total || 0) / 20),
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Supplier search error:', error);
      return { data: [], totalPages: 0, total: 0 };
    }
  };

  const handleSelectSupplier = (supplier) => {
    console.log(supplier, 'supplier');
    setSearchValue(supplier.name);
    onSelect(supplier);
  };

  const renderSearchItem = (supplier) => {
    return (
      <Box dir="row">
        <Typography wrap="wrap" variant="base">
          {supplier.name}
        </Typography>
      </Box>
    );
  };

  return (
    <Input
      name="courier"
      type="search"
      variant="outlined"
      value={searchValue}
      searchText={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Yetkazib beruvchini qidiring..."
      disabled={disabled}
      searchable
      onSearch={handleSearch}
      renderSearchItem={renderSearchItem}
      onSearchSelect={handleSelectSupplier}
    />
  );
}

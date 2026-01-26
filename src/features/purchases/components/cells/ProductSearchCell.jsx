import { useState, useEffect } from 'react';
import { Input, Typography, Box } from '@/components/ui';
import { getProducts } from '@/services/productsService';

export default function ProductSearchCell({ value, onSelect, disabled }) {
  const [searchValue, setSearchValue] = useState(value || '');

  useEffect(() => {
    if (value) {
      setSearchValue(value);
    }
  }, [value]);

  const handleSearch = async (searchTerm, page = 1) => {
    try {
      const response = await getProducts({
        search: searchTerm,
        limit: 20,
        offset: (page - 1) * 20,
      });

      return {
        data: response.items || [],
        totalPages: Math.ceil((response.total || 0) / 20),
        total: response.total || 0,
      };
    } catch (error) {
      console.error('Product search error:', error);
      return { data: [], totalPages: 0, total: 0 };
    }
  };

  const handleSelectProduct = (product) => {
    setSearchValue(product.ItemName);
    onSelect({ _isEmptyRow: true }, product);
  };

  const renderSearchItem = (product) => {
    return (
      <Box dir="column" gap={0.5}>
        <Typography wrap="wrap" variant="base">
          {product.ItemName}
        </Typography>
        <Typography variant="caption" color="secondary">
          {product.ItemCode}
        </Typography>
      </Box>
    );
  };

  return (
    <Input
      type="search"
      variant="outlined"
      value={searchValue}
      searchText={searchValue}
      onChange={(e) => setSearchValue(e.target.value)}
      placeholder="Mahsulotni qidiring..."
      disabled={disabled}
      searchable
      onSearch={handleSearch}
      renderSearchItem={renderSearchItem}
      onSearchSelect={handleSelectProduct}
    />
  );
}

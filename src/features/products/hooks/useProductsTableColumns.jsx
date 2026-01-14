import { Button, Badge, Col, Row } from '@/components/ui';
import useFetchBranches from '@/hooks/data/useFetchBranches';
import useFetchCurrency from '@/hooks/data/useFetchCurrency';
import formatterCurrency from '@/utils/formatterCurrency';
import { useMemo } from 'react';
import calculateProductPrice from '../utils/calculateProductPrice';

export const useProductsTableColumns = (currentProduct) => {
  const { data: branches } = useFetchBranches();
  const { data: rate } = useFetchCurrency();
  const productsTableColumns = useMemo(() => {
    return [
      {
        key: 'ItemName',
        title: 'Mahsulot Nomi',
        icon: 'products',
        width: '30%',
      },
      {
        key: 'OnHand',
        title: 'Miqdori',
        icon: 'products',
        renderCell: (row) => {
          return <span>{row?.OnHand > 0 ? row.OnHand + ' ta' : "Yo'q"}</span>;
        },
      },
      {
        key: 'SalePrice',
        title: 'Narxi',
        icon: 'income',
        renderCell: (row) => {
          const conditionItem =
            currentProduct?.U_PROD_CONDITION ?? row.U_PROD_CONDITION ?? null;
          if (conditionItem === 'Yangi' || conditionItem === null) {
            if (!row.SalePrice) return '-';
            return formatterCurrency(row.SalePrice, 'uzs');
          }
          if (row?.PurchasePrice === null) return '-';
          const salePriceOldUZS = formatterCurrency(
            (
              parseInt(calculateProductPrice(row.PurchasePrice)) *
              parseInt(rate?.Rate)
            ).toFixed(2),
            'uzs'
          );
          return salePriceOldUZS;
        },
      },
      {
        key: 'actions',
        title: 'Hodisalar',
        icon: 'editFilled',
        renderCell: (row) => {
          return (
            <Row direction="row" gutter={3} align="center">
              <Col>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled
                  icon="edit"
                  variant="text"
                ></Button>
              </Col>
              <Col>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled
                  icon="delete"
                  variant="text"
                ></Button>
              </Col>
            </Row>
          );
        },
      },
    ];
  }, []);
  const productTableColumns = useMemo(() => {
    return [
      {
        key: 'ItemCode',
        title: 'Mahsulot kodi',
        icon: 'products',
        width: '30%',
      },
      {
        key: 'Battery',
        title: 'Batareya foizi',
        icon: 'barCodeFilled',
        renderCell: (row) => {
          const getColor = (battery) => {
            if (battery > 85) return 'success';
            if (battery > 80) return 'warning';
            else return 'danger';
          };
          return (
            <Badge color={getColor(row?.battery)}>
              {row?.battery ? row?.battery + '%' : '-'}
            </Badge>
          );
        },
      },
      {
        key: 'WhsCode',
        title: 'Filial',
        icon: 'presentationChart',
        renderCell: (row) => {
          const foundBranch = branches?.find((br) => {
            return br.code == row?.WhsCode;
          });
          return foundBranch?.name || '-';
        },
      },
      {
        key: 'SalePrice',
        title: 'Narxi',
        icon: 'income',
        renderCell: (row) => {
          const conditionItem =
            currentProduct?.U_PROD_CONDITION ?? row.U_PROD_CONDITION ?? null;
          if (conditionItem === 'Yangi' || conditionItem === null) {
            if (!row.SalePrice) return '-';
            return formatterCurrency(row.SalePrice, 'uzs');
          }
          if (row?.PurchasePrice === null) return '-';
          const salePriceOldUZS = formatterCurrency(
            (
              parseInt(calculateProductPrice(row.PurchasePrice)) *
              parseInt(rate?.Rate)
            ).toFixed(2),
            'uzs'
          );
          return salePriceOldUZS;
        },
      },
      {
        key: 'actions',
        title: 'Hodisalar',
        icon: 'editFilled',
        renderCell: (row) => {
          return (
            <Row direction="row" gutter={3} align="center">
              <Col>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled
                  icon="edit"
                  variant="text"
                ></Button>
              </Col>
              <Col>
                <Button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                  }}
                  disabled
                  icon="delete"
                  variant="text"
                ></Button>
              </Col>
            </Row>
          );
        },
      },
    ];
  }, []);

  return { productsTableColumns, productTableColumns };
};

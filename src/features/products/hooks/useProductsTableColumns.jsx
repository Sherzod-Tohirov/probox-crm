import { Button, Badge, Col, Row } from '@/components/ui';
import formatterCurrency from '@/utils/formatterCurrency';
import { useMemo } from 'react';

export const useProductsTableColumns = () => {
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
          return (
            <span>
              {row?.SalePrice ? formatterCurrency(row.SalePrice, 'uzs') : '-'}
            </span>
          );
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
        key: 'ItemName',
        title: 'Mahsulot Nomi',
        icon: 'products',
        width: '30%',
      },
      {
        key: 'U_Condition',
        title: 'Holati',
        icon: 'calendarFact',
        renderCell: (row) => {
          const dict = {
            new: 'Yangi',
            old: 'B/U',
          };
          return <span>{dict[row?.status] || '-'}</span>;
        },
      },
      {
        key: 'battery',
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
        key: 'WhsName',
        title: 'Filial',
        icon: 'presentationChart',
      },
      {
        key: 'SalePrice',
        title: 'Narxi',
        icon: 'income',
        renderCell: (row) => {
          return (
            <span>
              {row?.SalePrice ? formatterCurrency(row.SalePrice, 'uzs') : '-'}
            </span>
          );
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

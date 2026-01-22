import { Button, Col, Divider, Input, Row, Typography } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function PurchasesHeader({
  pageTitle,
  onOpenFilter,
  onSearch,
  searchValue,
}) {
  const navigate = useNavigate();
  return (
    <Row direction="row" justify="space-between">
      <Col fullWidth flexGrow>
        <Typography variant="h5">{pageTitle}</Typography>
      </Col>
      <Col fullWidth>
        <Row direction="row" align="center" justify="end" gutter={2}>
          <Col span={8}>
            <Input
              variant="outlined"
              type="search"
              placeholder="Qidirish"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Col>
          <Col>
            <Divider height="16px" color="primary" orientation="vertical" />
          </Col>
          <Col span={3}>
            <Button
              fullWidth
              variant="outlined"
              icon="settings"
              iconColor="primary"
              iconSize={14}
              onClick={onOpenFilter}
            >
              Filter
            </Button>
          </Col>
          <Col>
            <Divider height="16px" color="primary" orientation="vertical" />
          </Col>
          <Col span={4}>
            <Button
              fullWidth
              variant="filled"
              onClick={() => navigate('/purchases/new')}
            >
              Yangi qo'shish
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

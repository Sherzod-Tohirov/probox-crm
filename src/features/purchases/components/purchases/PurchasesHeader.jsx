import { Button, Col, Divider, Input, Row, Typography } from '@/components/ui';
import { useNavigate } from 'react-router-dom';

export default function PurchasesHeader({
  pageTitle,
  onOpenFilter,
  onSearch,
  searchValue,
  canAdd,
}) {
  const navigate = useNavigate();
  return (
    <Row
      direction={{ xs: 'column', md: 'row' }}
      justify="space-between"
      gutter={3}
    >
      <Col xs={24} md={6}>
        <Typography variant="h5">{pageTitle}</Typography>
      </Col>
      <Col xs={24} md={18}>
        <Row
          direction="row"
          align="center"
          justify={{ xs: 'start', md: 'end' }}
          gutter={2}
          wrap
        >
          <Col xs={24} sm={12} md={12}>
            <Input
              variant="outlined"
              type="search"
              placeholder="Qidirish"
              value={searchValue}
              onChange={(e) => onSearch(e.target.value)}
            />
          </Col>
          <Col xs={0} sm={0} md="auto">
            <Divider height="16px" color="primary" orientation="vertical" />
          </Col>
          <Col xs={12} sm={6} md={6}>
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
          <Col xs={0} sm={0} md="auto">
            <Divider height="16px" color="primary" orientation="vertical" />
          </Col>
          {!!canAdd && (
            <Col xs={12} sm={6} md={6}>
              <Button
                fullWidth
                variant="filled"
                onClick={() => navigate('/purchases/new')}
              >
                Yangi qo'shish
              </Button>
            </Col>
          )}
        </Row>
      </Col>
    </Row>
  );
}

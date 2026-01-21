import { Button, Col, Divider, Input, Row, Typography } from '@/components/ui';
import { useRef } from 'react';

export default function PurchasesHeader({ pageTitle, onOpenFilter, onSearch }) {
  const searchRef = useRef(null);
  return (
    <Row direction="row" justify="space-between">
      <Col fullWidth flexGrow>
        <Typography variant="h5">{pageTitle}</Typography>
      </Col>
      <Col fullWidth>
        <Row direction="row" align="center" justify="end" gutter={2}>
          <Col span={8}>
            <Input
              ref={searchRef}
              variant="outlined"
              type="search"
              placeholder="Qidirish"
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
            <Button fullWidth variant="filled">
              Yangi qo'shish
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

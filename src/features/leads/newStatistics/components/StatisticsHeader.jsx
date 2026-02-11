import { Col, Row, Typography } from '@/components/ui';
import { Button } from '@/components/shadcn/ui/button';
import { SlidersHorizontal } from 'lucide-react';

export default function StatisticsHeader({ onDateFilterModalOpen }) {
  return (
    <div
      className="sticky w-full border-b border-[var(--primary-border-color)] bg-[var(--primary-bg)]/95 pt-[4px] pb-[10px] backdrop-blur"
      style={{ top: 'var(--app-header-height, 0px)', zIndex: 50 }}
    >
      <Row direction="row" gutter={2} align="center" justify="space-between">
        <Col>
          <Typography variant="h5" element="h1">
            Statistika
          </Typography>
        </Col>
        <Col>
          <Button
            onClick={onDateFilterModalOpen}
            variant="outline"
            size="lg"
            className="h-[42px] w-full rounded-[12px] px-[14px] md:w-auto"
          >
            <SlidersHorizontal className="h-[16px] w-[16px]" />
            Statistikalarni ko'rish
          </Button>
        </Col>
      </Row>
    </div>
  );
}

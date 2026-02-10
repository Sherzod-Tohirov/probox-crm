import { Col, Row, Typography } from '@/components/ui';
import { Button } from '@/components/shadcn/ui/button';
import { SlidersHorizontal } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function StatisticsHeader({ onDateFilterModalOpen }) {
  const [headerOffset, setHeaderOffset] = useState(0);

  useEffect(() => {
    const syncHeaderOffset = () => {
      const appHeader = document.getElementById('app-header');
      setHeaderOffset(appHeader?.getBoundingClientRect().height ?? 0);
    };

    syncHeaderOffset();
    window.addEventListener('resize', syncHeaderOffset);
    return () => window.removeEventListener('resize', syncHeaderOffset);
  }, []);

  return (
    <div
      className="sticky w-full border-b border-[var(--primary-border-color)] bg-[var(--primary-bg)]/95 pt-[4px] pb-[10px] backdrop-blur"
      style={{ top: `${headerOffset}px`, zIndex: 50 }}
    >
      <Row direction="row" gutter={4} align="center" justify="space-between">
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
            className="h-[42px] rounded-[12px] px-[14px]"
          >
            <SlidersHorizontal className="h-[16px] w-[16px]" />
            Statistikalarni ko'rish
          </Button>
        </Col>
      </Row>
    </div>
  );
}

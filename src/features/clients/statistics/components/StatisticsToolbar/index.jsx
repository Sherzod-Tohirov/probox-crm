import { Button, Col, Row, Navigation } from '@components/ui';
import styles from './toolbar.module.scss';

/**
 * Toolbar component for Statistics page with filter toggle
 */
export default function StatisticsToolbar({
  onToggleFilter,
  isMobile = false,
}) {
  return (
    <Row
      direction="row"
      justify="space-between"
      align="center"
      gutter={4}
      wrap={isMobile}
    >
      <Col>
        <Navigation fallbackBackPath="/statistics" />
      </Col>
      {isMobile && (
        <Col>
          <div className={styles.controls}>
            {/* Filter Toggle */}
            <Button
              variant="text"
              color="secondary"
              onClick={onToggleFilter}
              icon="filter"
              iconSize={20}
              aria-label="Toggle filter"
              className={styles['filter-button']}
            />
          </div>
        </Col>
      )}
    </Row>
  );
}

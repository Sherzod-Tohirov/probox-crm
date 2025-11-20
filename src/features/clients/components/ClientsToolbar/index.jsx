import { Button, Col, Row, Navigation } from '@components/ui';
import styles from './toolbar.module.scss';

/**
 * Toolbar component for Clients page with zoom and density controls
 */
export default function ClientsToolbar({
  uiScale,
  tableDensity,
  onIncreaseUIScale,
  onDecreaseUIScale,
  onResetUIScale,
  onIncreaseDensity,
  onDecreaseDensity,
  onResetDensity,
  onToggleFilter,
  isMobile = false,
  canIncreaseUI = true,
  canDecreaseUI = true,
  isDefaultUI = true,
  isMinDensity = false,
  isMaxDensity = false,
  isDefaultDensity = true,
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
        <Navigation fallbackBackPath="/clients" />
      </Col>
      <Col>
        <div className={styles.controls}>
          {/* Global UI Scale Controls */}
          <div className={styles['control-group']}>
            <Button
              variant="text"
              color="secondary"
              aria-label="Global zoom out"
              onClick={onDecreaseUIScale}
              disabled={!canDecreaseUI}
            >
              -
            </Button>
            <Button
              variant="text"
              color="secondary"
              aria-label="Reset global zoom"
              onClick={onResetUIScale}
              disabled={isDefaultUI}
            >
              100%
            </Button>
            <Button
              variant="text"
              color="secondary"
              aria-label="Global zoom in"
              onClick={onIncreaseUIScale}
              disabled={!canIncreaseUI}
            >
              +
            </Button>
          </div>

          <span className={styles.divider} />

          {/* Table Density Controls */}
          <div className={styles['control-group']}>
            <Button
              variant="text"
              color="secondary"
              aria-label="Decrease table density"
              onClick={onDecreaseDensity}
              disabled={isMinDensity}
            >
              A-
            </Button>
            <Button
              variant="text"
              color="secondary"
              aria-label="Reset table density"
              onClick={onResetDensity}
              disabled={isDefaultDensity}
            >
              A
            </Button>
            <Button
              variant="text"
              color="secondary"
              aria-label="Increase table density"
              onClick={onIncreaseDensity}
              disabled={isMaxDensity}
            >
              A+
            </Button>
          </div>

          <span className={styles.divider} />
          <Button
            variant="text"
            color="secondary"
            onClick={onToggleFilter}
            icon="filter"
            iconSize={20}
            aria-label="Toggle filter"
            className={styles['filter-button']}
          />

          <span className={styles.divider} />
        </div>
      </Col>
    </Row>
  );
}

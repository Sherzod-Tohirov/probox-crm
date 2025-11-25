import { Button, Col, Row, ContextMenu } from '@components/ui';
import { AnimatePresence } from 'framer-motion';
import styles from '../filter.module.scss';

export default function FilterActions({
  isMobileOnly,
  showFilterMenu,
  setShowFilterMenu,
  setShowMobileFiltersModal,
  onClear,
  onRollback,
  refs,
  floatingStyles,
  strategy,
  x,
  y,
}) {
  return (
    <Col style={isMobileOnly ? { width: '100%' } : { marginLeft: 'auto' }}>
      <Row
        direction="row"
        gutter={isMobileOnly ? 3 : 2}
        wrap={isMobileOnly}
        align="end"
      >
        {isMobileOnly && (
          <Col flexGrow>
            <Button
              fullWidth
              className={styles['filter-btn']}
              icon={'sliders'}
              iconSize={18}
              variant={'outlined'}
              onClick={(e) => {
                e.preventDefault();
                setShowMobileFiltersModal(true);
              }}
            >
              Filterlar
            </Button>
          </Col>
        )}
        <Col flexGrow={isMobileOnly}>
          <Button
            ref={refs.setReference}
            fullWidth={isMobileOnly}
            className={styles['filter-btn']}
            icon={'filter'}
            iconSize={18}
            animated={false}
            variant={'filled'}
            onClick={(e) => {
              e.preventDefault();
              setShowFilterMenu((p) => !p);
            }}
          >
            Filter
          </Button>
          <AnimatePresence initial={false}>
            {showFilterMenu ? (
              <ContextMenu
                ref={refs.setFloating}
                floatingStyles={{
                  ...floatingStyles,
                  position: strategy,
                  top: y ?? 0,
                  left: x ?? 0,
                }}
                onClose={() => setShowFilterMenu(false)}
                menuItems={[
                  {
                    key: 'clear',
                    label: 'Tozalash',
                    icon: 'delete',
                    onClick: () => {
                      onClear();
                      setShowFilterMenu(false);
                    },
                  },
                  {
                    key: 'rollback',
                    label: 'Eski holatiga qaytarish',
                    icon: 'refresh',
                    onClick: () => {
                      onRollback();
                      setShowFilterMenu(false);
                    },
                  },
                ]}
              />
            ) : null}
          </AnimatePresence>
        </Col>
        <Col flexGrow={isMobileOnly}>
          <Button
            fullWidth={isMobileOnly}
            className={styles['filter-btn']}
            icon="search"
            iconSize={18}
            variant="filled"
            type="submit"
          >
            Qidiruv
          </Button>
        </Col>
      </Row>
    </Col>
  );
}

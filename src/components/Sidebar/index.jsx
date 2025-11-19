import Logo from '../Logo';
import styles from './sidebar.module.scss';
import { Row, Col, Typography, Button } from '@components/ui';
import useToggle from '@hooks/useToggle';
import sidebarLinks from '@utils/sidebarLinks';
import filterSidebarLinks from '@utils/filterSidebarLinks';
import iconsMap from '@utils/iconsMap';
import { useCallback, useLayoutEffect, useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';
import useIsMobile from '@hooks/useIsMobile';
import useAuth from '@hooks/useAuth';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isOpen, toggle } = useToggle('sidebar');
  const isMobile = useIsMobile();
  const location = useLocation();
  const { user } = useAuth();

  // Filter sidebar links based on user role
  const filteredLinks = useMemo(
    () => filterSidebarLinks(sidebarLinks, user),
    [user]
  );

  // Local open state per parent path (fallbacks to active route)
  const [openMap, setOpenMap] = useState({});
  const toggleSection = useCallback((path) => {
    setOpenMap((prev) => ({ ...prev, [path]: !prev[path] }));
  }, []);

  useLayoutEffect(() => {
    if (isMobile && isOpen) {
      toggle();
    }
  }, [location.pathname, isMobile]);

  const renderNavItem = useCallback(
    (link, depth = 0) => {
      const hasChildren =
        Array.isArray(link.children) && link.children.length > 0;
      const hasEnabledChildren =
        hasChildren && link.children.some((child) => !child.disabled);
      const isActive = pathname.startsWith(link.path);
      const isSectionOpen = isOpen ? (openMap[link.path] ?? isActive) : false;

      return (
        <div
          key={`${link.path}-${depth}`}
          className={styles['nav-item-wrapper']}
        >
          <div
            className={classNames(styles['nav-item'], {
              [styles['has-children']]: hasEnabledChildren,
              [styles['disabled']]: link.disabled,
            })}
            data-depth={depth}
          >
            <div className={styles['nav-link-container']}>
              {link.disabled ? (
                <div
                  className={classNames(
                    styles[`sidebar-link`],
                    styles['disabled'],
                    !isOpen && styles['minified']
                  )}
                  title="Tez orada"
                >
                  {iconsMap[link.icon]}
                  <Typography
                    element="span"
                    className={classNames(styles['sidebar-link-title'], {
                      [styles['minified']]: !isOpen,
                      [styles['mobile']]: isMobile,
                    })}
                  >
                    {link.title}
                  </Typography>
                </div>
              ) : (
                <Link
                  className={classNames(
                    styles[`sidebar-link`],
                    styles[isActive ? 'active' : ''],
                    link.color && styles[link.color],
                    !isOpen && styles['minified']
                  )}
                  to={link.path}
                >
                  {iconsMap[link.icon]}
                  <Typography
                    element="span"
                    className={classNames(styles['sidebar-link-title'], {
                      [styles['minified']]: !isOpen,
                      [styles['mobile']]: isMobile,
                    })}
                  >
                    {link.title}
                  </Typography>
                </Link>
              )}
            </div>
            {hasEnabledChildren && isOpen ? (
              <Button
                variant={'text'}
                icon={isSectionOpen ? 'arrowDown' : 'arrowRight'}
                iconSize={16}
                className={styles['toggle-btn']}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleSection(link.path);
                }}
              />
            ) : null}
          </div>
          <div
            className={classNames(styles.children, {
              [styles['children-open']]: hasEnabledChildren && isSectionOpen,
              [styles['children-closed']]: hasEnabledChildren && !isSectionOpen,
            })}
          >
            {hasEnabledChildren && isSectionOpen
              ? link.children.map((child) => renderNavItem(child, depth + 1))
              : null}
          </div>
        </div>
      );
    },
    [pathname, isOpen, isMobile, openMap, toggleSection]
  );
  return (
    <Row className={styles.sidebar} wrap gutter={8}>
      <Col fullWidth>
        <Row direction={'row'} justify={'space-between'} align={'center'}>
          <Col>
            <Logo isMinified={!isOpen && !isMobile} />
          </Col>
          <Col>
            <Button
              className={styles['close-btn']}
              variant={'text'}
              icon={'close'}
              onClick={toggle}
            ></Button>
          </Col>
        </Row>
      </Col>
      <Col>
        <Row gutter={3} align={!isOpen && !isMobile ? 'center' : 'start'}>
          <Col>
            <Typography
              element="span"
              className={classNames(
                styles['sidebar-text'],
                !isOpen && styles['minified'],
                isMobile && styles['mobile']
              )}
            >
              MAIN
            </Typography>
          </Col>
          <Col className={styles['nav-tree-root']}>
            {filteredLinks.map((link) => renderNavItem(link))}
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

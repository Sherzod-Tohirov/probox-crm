import Logo from '../Logo';
import styles from './sidebar.module.scss';
import { Row, Col, List, Typography, Button } from '@components/ui';
import useToggle from '@hooks/useToggle';
import sidebarLinks from '@utils/sidebarLinks';
import iconsMap from '@utils/iconsMap';
import { useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import classNames from 'classnames';

export default function Sidebar() {
  const { pathname } = useLocation();
  const { isOpen, toggle } = useToggle('sidebar');
  const renderLinks = useCallback(
    (link) => {
      return (
        <Link
          className={classNames(
            styles[`sidebar-link`],
            styles[pathname.startsWith(link.path) ? 'active' : ''],
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
            })}
          >
            {link.title}
          </Typography>
        </Link>
      );
    },
    [pathname, isOpen]
  );
  return (
    <Row className={styles.sidebar} wrap gutter={8}>
      <Col fullWidth>
        <Row direction={'row'} justify={'space-between'} align={'center'}>
          <Col>
            <Logo isMinified={!isOpen} />
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
        <Row gutter={3} align={!isOpen ? 'center' : 'start'}>
          <Col>
            <Typography
              element="span"
              className={classNames(
                styles['sidebar-text'],
                !isOpen && styles['minified']
              )}
            >
              MAIN
            </Typography>
          </Col>
          <Col>
            <List
              gutter={1}
              items={sidebarLinks}
              itemProps={{
                animated: true,
              }}
              renderItem={renderLinks}
            />
          </Col>
        </Row>
      </Col>
    </Row>
  );
}

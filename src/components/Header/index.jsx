import { useLocation } from 'react-router-dom';
import { Col, Row, Button, Divider, Input } from '../ui';

import useToggle from '@hooks/useToggle';
import useAuth from '@hooks/useAuth';
import useFetchCurrency from '@hooks/data/useFetchCurrency';
import ThemeSelector from '@components/ThemeSelector';

import { isMessengerRoute } from '@utils/routesConfig';
import formatterCurrency from '@utils/formatterCurrency';
import styles from './header.module.scss';

function Header() {
  const { sidebar, messenger } = useToggle(['sidebar', 'messenger']);
  const { user } = useAuth();
  const { pathname } = useLocation();
  const { data: currency } = useFetchCurrency();
  return (
    <header className={styles['site-header']}>
      <Row direction="row" justify="space-between">
        <Col align={"center"} justify={"center"}>
          <Row direction="row" gutter={6} align="center" justify="start">
            <Col align="center" justify="center">
              <Button
                variant="text"
                color="secondary"
                icon={sidebar.isOpen ? 'toggleClose' : 'toggleOpen'}
                onClick={sidebar.toggle}
              ></Button>
            </Col>
            <Col align="stretch">
              <Divider />
            </Col>
            {/* <Col>
              <Input type="search" variant={"search"} placeholder="Search" />
            </Col> */}
          </Row>
        </Col>
        <Col>
          <Row direction="row" justify={'center'} align={'center'} gutter={6}>
            <Col>
              <ThemeSelector />
            </Col>
            <Col>
              <Button variant={'text'} icon={'expense'} iconColor={'primary'}>
                {formatterCurrency(currency?.Rate, currency?.Currency)}
              </Button>
            </Col>
            <Col>
              <Button
                icon={'avatarFilled'}
                variant={'text'}
                iconColor={'primary'}
              >
                {user.SlpName}
              </Button>
            </Col>
            {isMessengerRoute(pathname) ? (
              <Col>
                <Button
                  icon={'toggleClose'}
                  variant={'text'}
                  iconSize={24}
                  onClick={messenger.toggle}
                />
              </Col>
            ) : null}
          </Row>
        </Col>
      </Row>
    </header>
  );
}

export default Header;

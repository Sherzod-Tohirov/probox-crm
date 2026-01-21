import { tableColumns, tableData } from '../../../mockData';
import { Button, Table, Box, Col, Row, Modal } from '@components/ui';
import useAlert from '@hooks/useAlert';
import {
  DashboardStatisticDate,
  DashboardStatistics,
  DashboardChart,
} from '@features/dashboard/components';

import { useState } from 'react';

export default function Dashboard() {
  const { alert } = useAlert();
  const [modal, setModal] = useState(false);
  return (
    <Row direction="column" gutter={8}>
      <Col fullWidth>
        <DashboardStatistics>
          <Row>
            <Col>
              <DashboardStatisticDate />
            </Col>
            <Col fullWidth>
              <Row direction={{ xs: 'column', md: 'row' }} gutter={2}>
                <Col fullWidth span={{ xs: 12, md: 6 }}>
                  <DashboardChart />
                </Col>
                <Col fullWidth span={{ xs: 12, md: 6 }}>
                  <DashboardChart />
                </Col>
              </Row>
            </Col>
          </Row>
        </DashboardStatistics>
      </Col>
      <Col fullWidth>
        <Table scrollable columns={tableColumns} data={tableData} />
      </Col>
      <Col align="center" justify="center" wrap gutter={3}>
        <Button
          variant="filled"
          onClick={() => {
            alert('This is success message', {
              type: 'success',
            });
          }}
        >
          Alert Success
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            alert('This is a warning message', {
              type: 'info',
            });
          }}
        >
          Alert Warning
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            alert('This is an error message', {
              type: 'error',
            });
          }}
        >
          Alert Error
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            alert('This is default message', {
              type: 'default',
            });
          }}
        >
          Alert Default
        </Button>
        <Button
          variant="filled"
          onClick={() => {
            alert(
              'This is a long toast message lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet a long toast message lorem ipsum dolor sit amet lorem ipsum dolor sit amet lorem ipsum dolor sit amet',
              {
                type: 'error',
              }
            );
          }}
        >
          Long Toast
        </Button>
        <Button variant="filled" onClick={() => setModal(true)}>
          Open Modal
        </Button>
      </Col>
      <Modal isOpen={modal} onClose={() => setModal(false)}>
        Hello
      </Modal>
    </Row>
  );
}

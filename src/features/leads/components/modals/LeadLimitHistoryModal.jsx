import {
  Badge,
  Card,
  Col,
  Divider,
  Modal,
  Row,
  Typography,
} from '@/components/ui';
import useFetchLeadLimitHistory from '@/hooks/data/leads/useFetchLeadLimitHistory';
import formatDate from '@/utils/formatDate';
import moment from 'moment';
import { formatCurrencyUZS } from '../../utils/deviceUtils';

function HistoryCard({ item }) {
  const createdAt = moment(item?.createdAt);
  const dueDate = moment(createdAt).add(10, 'days');
  const diffInDays = dueDate.diff(moment(), 'days') + 1;

  const formattedCreatedDate = formatDate(createdAt);
  const formattedDueDate = formatDate(dueDate);

  const formatAmount = (amount) => {
    return formatCurrencyUZS(amount ?? 0);
  };

  const finalLimit = formatAmount(item?.snapshot?.finalLimit);
  const internalLimit = formatAmount(item?.snapshot?.internalLimit);
  const percentage = (item?.snapshot?.percentage ?? 0) + '%';
  const usedAmount = formatAmount(item?.usedAmount);
  const rentalMonth = (item?.month ?? 0) + ' oy';
  const firstPayment = formatAmount(item?.firstPayment);

  return (
    <Card>
      <Row gutter={3}>
        <Col fullWidth flexGrow>
          <Row direction="row" align="center" justify={'center'} gutter={4}>
            <Col>
              <Typography variant="body1">{formattedCreatedDate}</Typography>
              <Typography variant="body1"> - </Typography>
              <Typography variant="body1">{formattedDueDate}</Typography>
            </Col>
            <Col>
              <Badge color="info">{diffInDays} kun qoldi</Badge>
            </Col>
          </Row>
        </Col>
        <Col fullWidth>
          <Row direction={'row'} gutter={4}>
            <Col flexGrow fullWidth>
              <Row gutter={2}>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Limit
                      </Typography>
                    </Col>
                    <Col>
                      <Badge color="extrasuccess">{finalLimit}</Badge>
                    </Col>
                  </Row>
                </Col>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Ichki limit
                      </Typography>
                    </Col>
                    <Col>
                      <Badge color="black">{internalLimit}</Badge>
                    </Col>
                  </Row>
                </Col>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Foiz
                      </Typography>
                    </Col>
                    <Col>
                      <Badge color="black">{percentage}</Badge>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
            <Col fullHeight>
              <Divider color="primary" />
            </Col>
            <Col flexGrow fullWidth>
              <Row gutter={2}>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Foydalanilgan
                      </Typography>
                    </Col>
                    <Col>
                      <Badge color="extrasuccess">{usedAmount}</Badge>
                    </Col>
                  </Row>
                </Col>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Ijara oyi
                      </Typography>
                    </Col>
                    <Col>
                      <Typography variant="body2">{rentalMonth}</Typography>
                    </Col>
                  </Row>
                </Col>
                <Col fullWidth>
                  <Row
                    direction={'row'}
                    align="center"
                    justify={'space-between'}
                  >
                    <Col>
                      <Typography color="secondary" variant="body2">
                        Boshlang'ich to'lov
                      </Typography>
                    </Col>
                    <Col>
                      <Typography variant="body2">{firstPayment}</Typography>
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
}

export function LeadLimitHistoryModal({ isOpen, onClose, cardCode }) {
  const { data, isLoading } = useFetchLeadLimitHistory({ CardCode: cardCode });
  return (
    <Modal
      isLoading={isLoading}
      isEmpty={data?.length === 0}
      isOpen={isOpen}
      onClose={onClose}
      title="Yakuniy limitlar haqida"
    >
      <Row gutter={4}>
        {data?.map((item) => {
          return (
            <>
              <Col fullWidth>
                <Row gutter={4}>
                  <Col fullWidth>
                    <HistoryCard item={item} />
                  </Col>
                  <Col flexGrow fullWidth>
                    <Divider
                      style={{ width: '100%' }}
                      height={'1px'}
                      color="primary"
                    />
                  </Col>
                </Row>
              </Col>
            </>
          );
        })}
      </Row>
    </Modal>
  );
}

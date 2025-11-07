import { Row, Col, Card, Space, List } from 'antd';
import { useUserHomeTicket } from '../contexts/useUserHomeTicket';
import { Tickets } from '../types/Tickets';

function dateFormat(date: Date) {
  const newDate = new Date(date);
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };

  return newDate.toLocaleDateString('en-US', options);
}

function UserHome() {
  const {
    activeTickets,
    overDueTickets,
    upcomingDeadlines,
    isFetchingTicketsById,
    ticketsByIdError,
  } = useUserHomeTicket();

  if (ticketsByIdError) return <div>Error fetching tickets</div>;

  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title='My Active Tickets' loading={isFetchingTicketsById}>
          <List
            dataSource={activeTickets}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`${item.description} (Due: ${dateFormat(
                    item.dueDate
                  )})`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Overdue Tickets' loading={isFetchingTicketsById}>
          <List
            dataSource={overDueTickets}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`${item.description} (Due: ${dateFormat(
                    item.dueDate
                  )})`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Upcoming Deadlines' loading={isFetchingTicketsById}>
          <List
            dataSource={upcomingDeadlines}
            renderItem={(item) => (
              <List.Item>
                <List.Item.Meta
                  title={item.title}
                  description={`${item.description} (Due: ${dateFormat(
                    item.dueDate
                  )})`}
                />
              </List.Item>
            )}
          />
        </Card>
      </Col>
      <Col span={12}>
        <Card title='Recent Activity'>...</Card>
      </Col>
    </Row>
  );
}

export default UserHome;

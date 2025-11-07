import { Row, Col, Card } from 'antd';

function UserHome() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={12}>
        <Card title='My Active Tickets'>...</Card>
      </Col>
      <Col span={12}>
        <Card title='Overdue Tickets'>...</Card>
      </Col>
      <Col span={12}>
        <Card title='Upcoming Deadlines'>...</Card>
      </Col>
      <Col span={12}>
        <Card title='Recent Activity'>...</Card>
      </Col>
    </Row>
  );
}

export default UserHome;

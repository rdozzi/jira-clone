import { Row, Col, Card } from 'antd';

function UserHome() {
  return (
    <Row gutter={[16, 16]}>
      <Col span={16}>
        <Card title='My Active Tickets'>...</Card>
      </Col>
      <Col span={8}>
        <Card title='Recent Activity'>...</Card>
      </Col>
      <Col span={16}>
        <Card title='Upcoming Deadlines'>...</Card>
      </Col>
    </Row>
  );
}

export default UserHome;

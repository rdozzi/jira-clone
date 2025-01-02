import { Layout } from 'antd';

const { Header } = Layout;

type StyleObject = React.CSSProperties;

const headerStyle: StyleObject = {
  backgroundColor: 'blue',
  color: 'white',
};

function HeaderComp() {
  return <Header style={headerStyle}>Header</Header>;
}

export default HeaderComp;

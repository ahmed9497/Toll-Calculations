import './App.css';
import { Fragment, useState } from 'react';
import { Tabs } from 'antd';
import Entry from './components/entry';
import Exit from './components/exit';
import { Layout, Menu, Breadcrumb } from 'antd';

const { Header, Content } = Layout;
const { TabPane } = Tabs;


const entryPoints = [
  { name: 'zeroPoint', value: 0 },
  { name: 'NS', value: 5 },
  { name: 'Ph4', value: 10 },
  { name: 'Ferozpur', value: 17 },
  { name: 'Lake City', value: 24 },
  { name: 'Raiwand', value: 29 },
  { name: 'Bahria', value: 34 }
]


const App = () => {
  const [data, setData] = useState({});
  const [activeKey,setActiveKey] =useState('1')
  const getData = (value) => {
    setData(value);
    setActiveKey('2');
  }
  return (
    <Fragment>
      <Layout className="layout">
        <Header>
          <div className="logo" />
          <Menu theme="dark" mode="horizontal" >
            <Menu.Item key={'1'}>Smash Cloud Assignment</Menu.Item>
          </Menu>
        </Header>
        <Content style={{ padding: '0 50px', minHeight: '100vh' }}>
          <Breadcrumb style={{ margin: '16px 0' }}>
            <Breadcrumb.Item>App</Breadcrumb.Item>
            <Breadcrumb.Item>Home</Breadcrumb.Item>
          </Breadcrumb>
          <div className="site-layout-content">
            <Tabs defaultActiveKey="1"  activeKey={activeKey} onTabClick={(e)=>setActiveKey(e)}>
              <TabPane tab="Entry Point" key="1" >
                <Entry entryPoints={entryPoints} getData={getData} />
              </TabPane>
              <TabPane tab="Exit Point" key="2" >
                <Exit entryPoints={entryPoints} data={data}               
                  />
              </TabPane>

            </Tabs>
          </div>
        </Content>
      
      </Layout>
    </Fragment>
  );
}

export default App;


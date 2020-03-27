import React from "react";
import { Layout, Menu,Card,Button,Avatar,Row,Col } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./student.less"
import {connect} from 'react-redux'
import Constant from "../../utils/constant";
const { Header, Content, Footer, Sider } = Layout;
class Student extends React.Component{
    render() {
        const student = this.props.student;
        return (
            <Layout className="student">
                <Header className="header" >
                    <div className="logo">辅助学习平台</div>
                    <Menu theme="light" mode="horizontal" className="menu" >
                        <Menu.SubMenu  className="subMenu" title={<span>
                            <Avatar size={32} src={Constant.BaseAvatar+student.avatar}/>
                            <span style={{marginLeft:10}}>{student.realName}</span>
                        </span>}>
                            <Menu.Item>退出登录</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Header>
                <Layout>
                    <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                        <Menu theme="light" mode="inline" defaultSelectedKeys={['4']} className="menu">
                            <Menu.Item key="1">
                                <UserOutlined />
                                <span className="nav-text">我的课程</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <VideoCameraOutlined />
                                <span className="nav-text">nav 2</span>
                            </Menu.Item>
                        </Menu>
                    </Sider>
                    <Content className="body">
                        <Card title="我学的课" extra={<Button>加入班级</Button>} className="card">
                            <Row gutter={16}>
                                <Col span={8}>
                                    <Card
                                        hoverable
                                        style={{ width: 240 }}
                                        cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                                    >
                                        <Card.Meta title="Europe Street beat" description="www.instagram.com" />
                                    </Card>
                                </Col>
                            </Row>
                        </Card>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
export default connect(state=>({student:state.student}))(Student)
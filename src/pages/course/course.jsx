import React from "react";
import { Layout, Menu,List,Card,Button,Avatar,Row,Col } from 'antd';
import "./course.less"
import {UploadOutlined, UserOutlined, VideoCameraOutlined} from "@ant-design/icons";
const { Header, Content, Footer, Sider } = Layout;

export default class Course extends React.Component{
    render() {
        return (
            <Layout className="course" >
                <Header className="header">
                    <div className="course-name">课程名</div>
                    <Menu theme="light" mode="horizontal" defaultSelectedKeys={['1']} className="menu">
                        <Menu.Item key="1">首页</Menu.Item>
                        <Menu.Item key="2">资料</Menu.Item>
                        <Menu.Item key="3">通知</Menu.Item>
                        <Menu.Item key="4">作业</Menu.Item>
                        <Menu.Item key="5">考试</Menu.Item>
                        <Menu.Item key="6">讨论</Menu.Item>
                    </Menu>
                </Header>
                <Layout>
                    <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} className="menu">
                            <Menu.Item key="1">
                                <span className="nav-text">我的课程</span>
                            </Menu.Item>
                            <Menu.Item key="2">
                                <span className="nav-text">nav 2</span>
                            </Menu.Item>
                            <Menu.Item key="3">
                                <span className="nav-text">nav 3</span>
                            </Menu.Item>
                            <Menu.Item key="4">
                                <span className="nav-text">nav 4</span>
                            </Menu.Item>

                        </Menu>
                    </Sider>
                    <Content className="body">

                    </Content>
                </Layout>
            </Layout>

        )
    }
}
import React from "react";
import {Menu,Layout} from "antd";
const Sider= Layout.Sider;
export default class Home extends React.Component{
    render() {
        return (
            <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                <Menu theme="light" mode="inline" defaultSelectedKeys={['1']} className="menu"

                >
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
        )
    }
}
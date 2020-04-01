import React from "react";
import { Layout, Menu,Card,Button,Avatar,Row,Col } from 'antd';
import { UploadOutlined, UserOutlined, VideoCameraOutlined } from '@ant-design/icons';
import "./user.less"
import {connect} from 'react-redux';
import Constant from "../../utils/constant";
import {Switch,Route,Link,Redirect} from 'react-router-dom';
import CourseInfo from "./course-info";
import PersonalInfo from "./personal-info";
const { Header, Content, Footer, Sider } = Layout;
class User extends React.Component{
    logout=()=>{
        window.localStorage.removeItem("student_token");
        this.props.history.push("/login");
    };
    onUserMenuClick=(config)=>{
        let {key} = config;
        if(key==="logout"){
            this.logout();
        }
    };
    componentDidMount() {
        // let token = window.localStorage.getItem("token");
        // if(token !=="" || token!==undefined){
        //     this.props.getUser();
        // }
    }
    onSiderMenuClick=(config)=>{
        let {key} = config;
        this.menuData.forEach((item)=>{
            if(item.key===key){
                this.props.history.push(item.path);
            }
        })
    };
    menuData=[
        {key:"1", path:"/user/course-info", text:"我的课程", icon:<UserOutlined />},
        {key:"2",path:"/user/personal-info", text:"我的信息",icon:<VideoCameraOutlined />},
    ];
    //输入路径名或点击返回时能正确显示菜单选中状态
    getSelectedKey=()=> {
        const path = this.props.location.pathname;
        let selectedKey=[];
        this.menuData.forEach((item)=>{
            if(item.path===path){
                selectedKey=[item.key];
            }
        });
        return selectedKey;
    };
    render() {
        let selectedKey = this.getSelectedKey();
        if(selectedKey.length===0){
            selectedKey=['1'];
        }
        const user = this.props.user;
        return (
            <Layout className="student">
                <Header className="header" >
                    <div className="logo">辅助学习平台</div>
                    <Menu theme="light" mode="horizontal" className="menu" onClick={this.onUserMenuClick}>
                        <Menu.SubMenu  className="subMenu" title={<span>
                            <Avatar size={32} src={Constant.BaseAvatar+user.avatar}/>
                            <span style={{marginLeft:10}}>{user.realName}</span>
                        </span>}>
                            <Menu.Item key="logout">退出登录</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Header>
                <Layout>
                    <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                        <Menu theme="light" mode="inline" defaultSelectedKeys={['1']}
                              selectedKeys={selectedKey} className="menu" onClick={this.onSiderMenuClick}
                        >
                            {
                                this.menuData.map((item)=>{
                                    return (
                                        <Menu.Item key={item.key}>
                                            {item.icon}
                                            <span className="nav-text">{item.text}</span>
                                        </Menu.Item>
                                    )
                                })
                            }
                        </Menu>
                    </Sider>
                    <Content className="body">
                        <Switch>
                            <Redirect from="/user" exact to="/user/course-info"/>
                            <Route path="/user/course-info" component={CourseInfo}/>
                            <Route path="/user/personal-info" component={PersonalInfo}/>
                        </Switch>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
export default connect(state=>({user:state.user}))(User)
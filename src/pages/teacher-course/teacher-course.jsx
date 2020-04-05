import React from "react";
import {Layout, Menu} from "antd";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import Home from "./home";
import Classes from "./class";
import Resource from "./resource";
import Notify from "./notify";
import Homework from "./homework";
import Discuss from "./discuss";
import Exam from "./exam";
const { Header, Content,Sider } = Layout;
export default class TeacherCourse extends React.Component{
    constructor(props) {
        super(props);
        this.parentPath="/teacher-course/"+props.match.params.id;
    }
    menuData=[
        {key:"home", path:"/home", text:"首页"},
        {key:"class",path:"/class", text:"班级"},
        {key:"resource",path:"/resource", text:"资料"},
        {key:"notify",path:"/notify", text:"通知"},
        {key:"homework",path:"/homework", text:"作业"},
        {key:"exam",path:"/exam", text:"考试"},
        {key:"discuss",path:"/discuss", text:"讨论"},
    ];
    //输入路径名或点击返回时能正确显示菜单选中状态
    getSelectedKey=()=> {
        const path = this.props.location.pathname;
        let selectedKey=[];
        this.menuData.forEach((item)=>{
            if(this.parentPath+item.path===path){
                selectedKey=[item.key];
            }
        });
        return selectedKey;
    };
    onMenuClick=(config)=>{
        let {key} = config;
        this.menuData.forEach((item)=>{
            if(item.key===key){
                this.props.history.push(item.path);
            }
        })
    };
    render() {
        let selectedKey = this.getSelectedKey();
        if(selectedKey.length===0){
            selectedKey=['home'];
        }
        return (
            <Layout className="course" >
                <Header className="header">
                    <div className="course-name">课程名</div>
                    <Menu theme="light" mode="horizontal" selectedKeys={selectedKey}
                          defaultSelectedKeys={['home']} className="menu">
                        {
                            this.menuData.map((item)=>{
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={this.parentPath+item.path}>
                                            <span className="nav-text">{item.text}</span>
                                        </Link>
                                    </Menu.Item>
                                )
                            })
                        }
                    </Menu>
                </Header>
                <Layout>
                    <Switch>
                        <Redirect from="/teacher-course/:id" exact to="/teacher-course/:id/home"/>
                        <Route path="/teacher-course/:id/home" component={Home}/>
                        <Route path="/teacher-course/:id/class" component={Classes}/>
                        <Route path="/teacher-course/:id/resource" component={Resource}/>
                        <Route path="/teacher-course/:id/notify" component={Notify}/>
                        <Route path="/teacher-course/:id/homework" component={Homework}/>
                        <Route path="/teacher-course/:id/exam" component={Exam}/>
                        <Route path="/teacher-course/:id/discuss" component={Discuss}/>
                    </Switch>
                </Layout>
            </Layout>
        )
    }
}
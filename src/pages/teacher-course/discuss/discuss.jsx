import React from "react";
import {Layout, Menu} from "antd";
import {Redirect, Route, Switch} from "react-router-dom";
import CourseComment from "./course-comment";
import {MyComment} from "./my-comment";
import {ReplyToMe} from "./replyToMe";
const {Content,Sider } = Layout;
export default class Discuss extends React.Component {
    constructor(props) {
        super(props);
        this.parentPath="/teacher-course/"+props.match.params.id+"/discuss";
    }
    menuData=[
        {key:"1", path:"/course-comment", text:"课程讨论"},
        {key:"2",path:"/my-comment", text:"我发表的"},
        {key:"3",path:"/replyToMe", text:"回复我的"},
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
    onSiderMenuClick=(config)=>{
        let {key} = config;
        for(let i=0;i<this.menuData.length;i++){
            if(this.menuData[i].key===key){
                this.props.history.push(this.parentPath+this.menuData[i].path);
                break;
            }
        }
    };
    render() {
        let selectedKey = this.getSelectedKey();
        if(selectedKey.length===0){
            selectedKey=['1'];
        }
        const parentPath = "/teacher-course/:id/discuss";
        return(
            <React.Fragment>
                <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                    <Menu theme="light" mode="inline" onClick={this.onSiderMenuClick}
                          selectedKeys={selectedKey} defaultSelectedKeys={['1']}>
                        {this.menuData.map((item)=>{return (
                            <Menu.Item key={item.key}>
                                <span>{item.text}</span>
                            </Menu.Item>
                        )})}
                    </Menu>
                </Sider>
                <Content>
                    <Switch>
                        <Redirect from={`${parentPath}`} exact to={`${parentPath}/course-comment`}/>
                        <Route path={`${parentPath}/course-comment`} component={CourseComment}/>
                        <Route path={`${parentPath}/my-comment`} component={MyComment}/>
                        <Route path={`${parentPath}/replyToMe`} component={ReplyToMe}/>
                    </Switch>
                </Content>
            </React.Fragment>
        )
    }
}
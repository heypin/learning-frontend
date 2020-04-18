import React from "react";
import {Layout, Menu} from "antd";
import CourseComment from "./course-comment";
import MyComment from "./my-comment";
import ReplyToMe from "./replyToMe";
const {Content,Sider } = Layout;
export default class Discuss extends React.Component {
    constructor(props) {
        super(props);
        this.menuData=[
            {key:"1", text:"课程讨论"},
            {key:"2", text:"我发表的"},
            {key:"3",text:"回复我的"},
        ];
        this.state={
            key:"1",
        }

    }
    onMenuClick=({key})=> {
        this.setState({key:key})
    };
    render() {
        return(
            <React.Fragment>
                <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                    <Menu theme="light" mode="inline" onClick={this.onMenuClick}
                          selectedKeys={[this.state.key]} >
                        {this.menuData.map((item)=>{return (
                            <Menu.Item key={item.key}>
                                <span>{item.text}</span>
                            </Menu.Item>
                        )})}
                    </Menu>
                </Sider>
                <Content>
                    {this.state.key==='1'?<CourseComment/>:null}
                    {this.state.key==='2'?<MyComment/>:null}
                    {this.state.key==='3'?<ReplyToMe/>:null}
                </Content>
            </React.Fragment>
        )
    }
}
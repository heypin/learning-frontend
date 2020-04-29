import React from "react";
import {Layout, Menu} from "antd";
import {Link, Redirect, Route, Switch} from "react-router-dom";
import Request from '../../api'
import Home from "./home";
import Classes from "./class";
import Resource from "./resource";
import Notify from "./notify";
import Homework from "./homework/homework";
import Discuss from "./discuss/discuss";
import Exam from "./exam/exam";
import Constant from "../../utils/constant";
import github from "../../assets/github.svg";
const { Header } = Layout;
export default class TeacherCourse extends React.Component{
    constructor(props) {
        super(props);
        this.parentPath="/teacher-course/"+props.match.params.id;
        this.state={
          courseName:"",
        };
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
    componentDidMount() {
        this.loadCourseData();
    }
    loadCourseData=async ()=>{
        try{
           const result= await Request.getCourseById(this.props.match.params.id);
           this.setState({courseName:result.name});
        }catch (e) {
            console.log(e);
        }
    };
    render() {
        return (
            <Layout className="teacher-course" >
                <Header className="header" style={{marginBottom:1}}>
                    <div className="course-name">{this.state.courseName}</div>
                    <a style={{marginLeft:20}} href={Constant.Github}><img alt="github" src={github}/></a>
                    <Menu theme="light" mode="horizontal"
                           className="menu">
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
import React from "react";
import {Layout, Menu} from "antd";
import {Link,Route, Switch} from "react-router-dom";
import "./student-course.less";
import Home from "./home";
import Resource from "./resource";
import Notify from "./notify";
import Homework from "./homework";
import Exam from "./exam";
import Discuss from "./discuss/discuss";
import queryString from 'querystring'
import Request from "../../api";
import github from "../../assets/github.svg"
import Constant from "../../utils/constant";
const { Header } = Layout;
export default class StudentCourse extends React.Component{
    constructor(props) {
        super(props);
        this.parentPath="/student-course";
        this.query=queryString.parse(props.location.search.slice(1));
        this.state={
          courseName:"",
        };
    }
    menuData=[
        {key:"home", path:"/home", text:"首页"},
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
            const result= await Request.getCourseById(parseInt(this.query.courseId.toString()));
            this.setState({courseName:result.name});
        }catch (e) {
            console.log(e);
        }
    };
    render() {

        return (
            <Layout className="student-course" >
                <Header className="header" style={{marginBottom:1}}>
                    <div className="course-name">{this.state.courseName}</div>
                    <a style={{marginLeft:20}} href={Constant.Github}><img alt="github" src={github}/></a>
                    <Menu theme="light" mode="horizontal"
                          className="menu">
                        {
                            this.menuData.map((item)=>{
                                return (
                                    <Menu.Item key={item.key}>
                                        <Link to={{pathname:this.parentPath+item.path,search:`courseId=${this.query.courseId}&classId=${this.query.classId}`}}>
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
                        <Route path="/student-course/home" component={Home}/>
                        <Route path="/student-course/resource" component={Resource}/>
                        <Route path="/student-course/notify" component={Notify}/>
                        <Route path="/student-course/homework" component={Homework}/>
                        <Route path="/student-course/exam" component={Exam}/>
                        <Route path="/student-course/discuss" component={Discuss}/>
                    </Switch>
                </Layout>
            </Layout>
        )
    }
}
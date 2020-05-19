import React from 'react';
import {HashRouter} from "react-router-dom";
import {Route,Switch,Redirect} from "react-router"
import Login from './pages/login-register/login';
import Register from "./pages/login-register/register";
import User from "./pages/user/user";
import StudentCourse from "./pages/student-course/student-course";
import TeacherCourse from "./pages/teacher-course/teacher-course";
import {connect} from 'react-redux';
import {getUser} from "./store/actions";
import Editor from "./pages/editor/editor";
import DoHomework from "./pages/homework/do-homework";
import MarkHomework from "./pages/homework/mark-homework";
import ViewHomework from "./pages/homework/view-homework";
import DoExam from "./pages/exam/do-exam";
import MarkExam from "./pages/exam/mark-exam";
import ForgetPassword from "./pages/login-register/forget-password";


class App extends React.Component{
    componentDidMount(){
        let token = window.localStorage.getItem("token");
        if(token){
            this.props.getUser();
        }
    }
    render() {
        return (
            <div className="App" style={{width:"100%",height:"100%"}}>
                <HashRouter>
                    <Switch>
                        <Redirect from='/' exact to='/login'/>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/user' component={User}/>
                        <Route path='/student-course' component={StudentCourse}/>
                        <Route path='/teacher-course/:id' component={TeacherCourse}/>
                        <Route path="/editor" component={Editor}/>
                        <Route path="/doHomework" component={DoHomework}/>
                        <Route path="/markHomework" component={MarkHomework}/>
                        <Route path="/viewHomework" component={ViewHomework}/>
                        <Route path="/doExam" component={DoExam}/>
                        <Route path="/markExam" component={MarkExam}/>
                        <Route path="/forget-password" component={ForgetPassword}/>
                        {/*<Route path='/account'  render={(props)=>{*/}
                        {/*  return <Account user={this.state.user} {...props}/>*/}
                        {/*}}/>*/}
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}
export default connect(()=>({}),{getUser})(App);

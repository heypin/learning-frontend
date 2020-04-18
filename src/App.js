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


class App extends React.Component{
    getUserInfoByToken(){
        let token = window.localStorage.getItem("token");
        if(token !=="" || token!==undefined){
            this.props.getUser();
        }
    }
    componentDidMount(){
        this.getUserInfoByToken();
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

import React from 'react';
import {HashRouter} from "react-router-dom";
import {Route,Switch,Redirect} from "react-router"
import Login from './pages/login-register/login';
import Register from "./pages/login-register/register";
import Student from "./pages/student/student";
import Course from "./pages/course/course";
import {connect} from 'react-redux'
import {getStudent} from "./store/actions"
class App extends React.Component{
    componentDidMount(){
        this.props.getStudent(window.localStorage.getItem("student_token"))
    }
    render() {
        return (
            <div className="App" style={{width:"100%",height:"100%"}}>
                <HashRouter>
                    <Switch>
                        <Redirect from='/' exact to='/login'/>
                        <Route path='/login' component={Login}/>
                        <Route path='/register' component={Register}/>
                        <Route path='/student' component={Student}/>
                        <Route path='/course' component={Course}/>
                        {/*<Route path='/account'  render={(props)=>{*/}
                        {/*  return <Account user={this.state.user} {...props}/>*/}
                        {/*}}/>*/}
                    </Switch>
                </HashRouter>
            </div>
        );
    }
}
export default connect(()=>({}),{getStudent})(App);

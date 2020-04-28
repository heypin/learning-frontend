
import React from "react";
import LoginRegister from "./loginRegister";
import { Form, Input, Button, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import request from '../../api';
class Login extends React.Component{
    userLogin=async (user)=>{
        try{
            const result=await request.userLogin(user);
            message.success("登录成功!");
            window.localStorage.setItem("token",result.token);
            this.props.history.push("/user");
        }catch (e) {
            if(e.response.status===400){
                message.error("参数错误！")
            }else {
                message.error("用户名或密码错误！");
            }
        }
    };
    onFinish=(values)=>{
        this.userLogin(values);
    };
    render() {
        return (
            <LoginRegister type='login'>
                <Form initialValues={{email:"2244306600@qq.com",password:"12345678"}} name="login" className="login-form" onFinish={this.onFinish}>
                    <Form.Item name="email"  rules={[
                            {required: true,message: '请输入邮箱!'},
                            {type:'email',message: '格式不正确！'}
                        ]}
                    >
                        <Input prefix={<UserOutlined className="site-form-item-icon" />}  />
                    </Form.Item>
                    <Form.Item name="password" rules={[
                            {required: true, message: '请输入密码!'},
                            {min:8,message: '密码最短8位！'}
                        ]}
                    >
                        <Input prefix={<LockOutlined className="site-form-item-icon" />}
                            type="password"
                        />
                    </Form.Item>

                    <Form.Item>
                        <Button type="primary" htmlType="submit" className="login-form-button" style={{width:"100%"}}>
                            登录
                        </Button>
                        <div style={{fontSize:20,marginTop:20}}>
                            或 <Link to="/register" >注册</Link>
                        </div>
                    </Form.Item>
                </Form>
            </LoginRegister>
        )
    }
}
export default Login;
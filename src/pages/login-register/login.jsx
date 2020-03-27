
import React from "react";
import LoginRegister from "./loginRegister";
import { Form, Input, Button,Radio, message } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import {Link} from "react-router-dom";
import request from '../../api'

class Login extends React.Component{
    userLogin=async (user)=>{
        try{
            const result=await request.userLogin(user);
            message.success("登录成功!");
            if(user.role===1){
                window.localStorage.setItem("student_token",result.token);
                this.props.history.push("/student");
            }else if(user.role===2){
                window.localStorage.setItem("teacher_token",result.token);
                this.props.history.push("/teacher");
            }
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
                <Form name="normal_login" className="login-form"
                      ref={this.formRef}
                      onFinish={this.onFinish}
                      initialValues={{role:1}} >
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

                    <Form.Item name="role">
                        <Radio.Group>
                            <Radio value={1}>学生</Radio>
                            <Radio value={2}>教师</Radio>
                        </Radio.Group>
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
import React from "react";
import {Form, Input, Row, Col, Button, message,} from 'antd';
import LoginRegister from "./loginRegister";
import Request from "../../api";
import Timer from "../../components/Timer";

export default class Register extends React.Component{
    userRegister = async (user)=>{
        try{
            await Request.userRegister(user);
            message.success("注册成功!");
            this.props.history.push("/login");
        }catch (e) {
            let err="";
            if(e.response.data.err){
                err=e.response.data.err;
            }
            message.error("注册失败!"+err)
        }
    };
    onFinish=(values)=>{
        this.userRegister(values);
    };
    constructor(props) {
        super(props);
        this.state={
            getCaptchaVisible:true,
        };
        this.formRef=React.createRef();
    }
    onTimerFinish=()=>{
      this.setState({getCaptchaVisible:true});
    };

    getCaptcha=async ()=>{
        try{
            let email=this.formRef.current.getFieldValue("email");
            if(email){
                await Request.getRegisterCode(email);
                message.success("获取验证码成功");
                this.setState({getCaptchaVisible:false});
            }else{
                message.error("请先填邮箱");
            }
        }catch (e) {
            message.error("获取验证码失败");
        }
    };
    render() {
        const formItemLayout = {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 8 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 16 },
            },
        };
        const tailFormItemLayout = {
            wrapperCol: {
                xs: {
                    span: 24,
                    offset: 0,
                },
                sm: {
                    span: 16,
                    offset: 8,
                },
            },
        };
        return (
            <LoginRegister type='register'>
                <Form ref={this.formRef} {...formItemLayout} name="register"
                      onFinish={this.onFinish} scrollToFirstError
                >
                    <Form.Item name="email" label="邮箱"
                        rules={[
                            {type: 'email', message: '邮箱格式不正确!',},
                            {required: true, message: '请输入邮箱!',},
                        ]}
                    >
                        <Input />
                    </Form.Item>

                    <Form.Item name="password" label="密码"
                        rules={[{required: true,  message: '请输入密码!'}]}
                        hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="confirm" label="确认密码" dependencies={['password']} hasFeedback
                        rules={[{required: true,message: '请确认密码!'},
                            ({ getFieldValue }) => ({
                                validator(rule, value) {
                                    if (!value || getFieldValue('password') === value) {
                                        return Promise.resolve();
                                    }
                                    return Promise.reject('两次密码不一致!');
                                },
                            }),
                        ]}
                    >
                        <Input.Password />
                    </Form.Item>

                    <Form.Item name="realName" label="姓名"
                        rules={[{ required: true, message: '请输入姓名!', whitespace: true }]}
                    >
                        <Input />
                    </Form.Item>
                    <Form.Item label="验证码">
                        <Row gutter={8}>
                            <Col span={12}>
                                <Form.Item name="captcha"
                                    rules={[{ required: true, message: '请输入获得的验证码!' }]}
                                >
                                    <Input />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                {this.state.getCaptchaVisible?
                                    <Button style={{float:"right"}} onClick={this.getCaptcha}>获取邮箱验证码</Button>:
                                    <Button style={{float:"right"}} disabled={true}><Timer onlySecond={true} onFinish={this.onTimerFinish} seconds={60}/>后获取</Button>
                                }

                            </Col>
                        </Row>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit" style={{width:"100%"}}>注册</Button>
                    </Form.Item>
                </Form>
            </LoginRegister>
        )
    }
}
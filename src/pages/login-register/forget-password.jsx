import React from "react";
import {Form, Input, Row, Col, Button, message,} from 'antd';
import LoginRegister from "./loginRegister";
import Request from "../../api";
import Timer from "../../components/Timer";

export default class ForgetPassword extends React.Component{
    onFinish=async (values)=>{
        try{
            await Request.userForgetPassword(values);
            message.success("修改密码成功!");
            this.props.history.push("/login");
        }catch (e) {
            let err="";
            if(e.response.data.err){
                err=e.response.data.err;
            }
            message.error("修改密码失败!"+err)
        }
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
                await Request.getCaptcha(email);
                message.success("获取验证码成功");
                this.setState({getCaptchaVisible:false});
            }else{
                message.error("请先填邮箱");
            }
        }catch (e) {
            let err="";
            if(e.response.data.err){
                err=e.response.data.err;
            }
            message.error("获取验证码失败!"+err);
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
            <LoginRegister>
                <Form ref={this.formRef} {...formItemLayout} name="forget-password"
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
                               rules={[{required: true,  message: '请输入密码!'},
                                   {min:8,message: '密码最短8位！'}]}
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
                        <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认修改</Button>
                    </Form.Item>
                </Form>
            </LoginRegister>
        )
    }
}
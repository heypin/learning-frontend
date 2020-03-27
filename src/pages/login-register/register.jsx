import React from "react";
import {Form, Input, Row, Col,  Button, } from 'antd';

import LoginRegister from "./loginRegister";

export default class Register extends React.Component{

    onFinish=()=>{

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
                <Form
                    {...formItemLayout}
                    ref={this.formRef}
                    name="register"
                    onFinish={this.onFinish}
                    scrollToFirstError
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
                                <Button style={{float:"right"}}>获取邮箱验证码</Button>
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
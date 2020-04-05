import React from "react";
import {Button, Form, Input, Radio, Row, Col, Card, message} from "antd";
import {connect} from 'react-redux';
import request from "../../api";
import {PlusOutlined} from "@ant-design/icons";
import PictureUpload from "../../components/PictureUpload";
class PersonalInfo extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            key: 'info',
        };
        this.formRef = React.createRef();
        this.hasInitForm =false;
        this.getFileList=()=>{};
    }

    initPersonalInfoForm=()=>{
        const user = this.props.user;
        this.formRef.current.setFieldsValue({
            email:user.email,
            sex:user.sex,
            number:user.number,
            realName:user.realName
        });
    };
    onTabChange = (key) => {
        this.setState({ key: key });
    };
    handleUpdateInfo = async (values)=>{
        const fileList = this.getFileList();
        const formData = new FormData();
        if(fileList.length!==0){
            formData.append('avatar', fileList[0].originFileObj);
        }
        for(let i in values){
            formData.append(i,values[i]);
        }
        try{
            await request.updateUserById(formData);
            message.success("修改成功");

        }catch (e) {
            message.error("修改失败");
        }

    };
    handleUpdatePassword = async (values)=>{
        try{
            await request.updateUserPassword(values);
            message.success("修改成功!");
        }catch (e) {
            if(e.response.status===400){
                message.error("参数错误！")
            }else {
                message.error("修改失败！");
            }
        }
    };
    componentDidMount() {
        this.initPersonalInfoForm();
    }
    componentDidUpdate(prevProps,prevState, snapshot) {
        if(this.state.key==='info'){
            // if(this.hasInitForm===false){
            // }
            // this.hasInitForm=true;
            this.initPersonalInfoForm();
        }
    }

    render() {
        const tabList = [
            {key: 'info', tab: '我的信息',},
            {key: 'password', tab: '修改密码',},
        ];
        const formItemLayout = {
            labelCol: {span:4},
            wrapperCol: {span:16},
        };
        const tailFormItemLayout = {
            wrapperCol: {span:16,offset:4},
        };
        const uploadButton = (
            <div>
                <PlusOutlined />
                <div className="ant-upload-text">Upload</div>
            </div>
        );
        const contentList = {
            info: (
                <Form name="info" onFinish={this.handleUpdateInfo}
                      {...formItemLayout} ref={this.formRef}
                >
                        <Form.Item label="头像" name="avatar">
                            <PictureUpload fileList={(callback)=>{
                                this.getFileList=callback;
                            }} />
                        </Form.Item>
                        <Form.Item name="email" label="邮箱"  rules={[
                            {required: true,message: '请输入邮箱!'},
                            {type:'email',message: '格式不正确！'}
                        ]}
                        >
                            <Input  />
                        </Form.Item>
                        <Form.Item name="realName" label="姓名"
                                   rules={[{ required: true, message: '请输入姓名!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="number" label="学号">
                            <Input />
                        </Form.Item>
                        <Form.Item name="sex" label="性别">
                            <Radio.Group>
                                <Radio value={1}>男</Radio>
                                <Radio value={2}>女</Radio>
                            </Radio.Group>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit"
                                    className="login-form-button" style={{width:"100%"}}>
                                确认修改
                            </Button>
                        </Form.Item>
                    </Form>
            ),
            password:(
                <Form name="password" {...formItemLayout} onFinish={this.handleUpdatePassword}>
                    <Form.Item name="oldPassword" label="旧密码"
                               rules={[{required: true,  message: '请输入旧密码!'}]}
                               hasFeedback
                    >
                        <Input.Password />
                    </Form.Item>
                    <Form.Item name="password" label="新密码"
                               rules={[{required: true,  message: '请输入新密码!'}]}
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
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit"
                                className="login-form-button" style={{width:"100%"}}>
                            确认修改
                        </Button>
                    </Form.Item>
                </Form>
            ),
        };
        return (
            <Card
                style={{ width: '100%',height:"100%"}}
                tabList={tabList}
                activeTabKey={this.state.key}
                onTabChange={this.onTabChange}
            >
                <Row>
                    <Col span={12}>
                        {contentList[this.state.key]}
                    </Col>
                </Row>
            </Card>

        )
    }
}
export default connect(state=>({user:state.user}))(PersonalInfo)
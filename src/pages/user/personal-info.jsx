import React from "react";
import {Button, Form, Input, Radio, Tabs, Row, Col, Card, message,Upload,Modal} from "antd";
import Constant from "../../utils/constant";
import {connect} from 'react-redux';
import request from "../../api";
import {LoadingOutlined, PlusOutlined,UploadOutlined} from "@ant-design/icons";
class PersonalInfo extends React.Component{
    state = {
        key: 'info',
        avatarUrl:'',
        fileList:[],
        previewVisible: false,
        previewImage: '',
    };
    getBase64(file) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onload = () => resolve(reader.result);
            reader.onerror = error => reject(error);
        });
    };
    handleCancel = () => this.setState({ previewVisible: false });

    handlePreview = async file => {
        if (!file.url && !file.preview) {
            file.preview = await this.getBase64(file.originFileObj);
        }

        this.setState({
            previewImage: file.url || file.preview,
            previewVisible: true,
        });
    };

    handleChange = ({ fileList }) => this.setState({ fileList });
    formRef = React.createRef();
    hasInitForm =false;
    beforeUpload=(file)=>{
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png';
        if (!isJpgOrPng) {
            message.error('只能上传JPG/PNG文件!');
            this.setState({fileList:[]})
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error('图片必须小于2MB!');
            this.setState({fileList:[]})
        }
        this.setState(state => ({
            fileList: [file],
        }));
        return false;
    };
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
        console.log(this.state.fileList[0])
        // const formData = new FormData();
        // if(this.state.fileList.length!==0){
        //     formData.append('avatar', this.state.fileList[0]);
        // }
        // for(let i in values){
        //     formData.append(i,values[i]);
        // }
        // console.log(formData);
        // try{
        //     const result = await request.updateUserById(formData);
        //     this.setState({avatarUrl:result.avatar});
        //     message.success("修改成功");
        //
        // }catch (e) {
        //     message.error("修改失败");
        // }

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

    }

    componentDidUpdate(prevProps,prevState, snapshot) {
        if(this.state.key==='info'){
            if(this.hasInitForm===false){
                this.initPersonalInfoForm();
                console.log("init form")
            }
            this.hasInitForm=true;
        }
        console.log("update")
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
        const { previewVisible, previewImage, fileList } = this.state;
        const contentList = {
            info: (
                <Form name="info" onFinish={this.handleUpdateInfo}
                      {...formItemLayout} ref={this.formRef}
                >
                        <Form.Item label="头像" name="avatar">
                                <Upload listType="picture-card"
                                        fileList={fileList}
                                        beforeUpload={this.beforeUpload}
                                        onPreview={this.handlePreview}
                                        onChange={this.handleChange}
                                >
                                {fileList.length >= 1 ? null : uploadButton}
                                </Upload>
                                <Modal visible={previewVisible} footer={null} onCancel={this.handleCancel}>
                                    <img alt="example" style={{ width: '100%' }} src={previewImage} />
                                </Modal>
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
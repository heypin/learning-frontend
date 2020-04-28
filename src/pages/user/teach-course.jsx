import React from "react";
import {Button, Card, Col, Row, Modal, Form, Input,  message} from "antd";
import PictureUpload from "../../components/PictureUpload";
import Request from "../../api";
import {Link} from "react-router-dom";
import Constant from "../../utils/constant";

export default class TeachCourse extends React.Component{
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            courses:[],
        };
        this.formRef= React.createRef();
        this.getFileList=()=>{};
    }
    showModal = () => {
        this.setState({
            visible: true,
        });
    };
    handleCancel = () => {
        this.setState({
            visible: false,
        });
    };
    handleCreateCourse = async (values)=>{
        const fileList = this.getFileList();
        const formData = new FormData();
        if(fileList.length!==0){
            formData.append('cover', fileList[0].originFileObj);
        }
        for(let i in values){
            formData.append(i,values[i]);
        }
        try{
            await Request.createCourse(formData);
            this.handleCancel();
            message.success("创建成功");
            this.getTeachCourse();
        }catch (e) {
            message.error("创建失败");
        }
    };

    getTeachCourse = async ()=>{
        try{
            const result = await Request.getTeachCourse();
            this.setState({courses:result});
        }catch (e) {
            message.error("获取课程信息失败");
        }
    };
    componentDidMount() {
        this.getTeachCourse();
    }

    render() {
        const formItemLayout = {
            labelCol: {span:4},
            wrapperCol: {span:16},
        };
        const tailFormItemLayout = {
            wrapperCol: {span:16,offset:4},
        };

        const createCourseForm=(
            <div>
                <Button type="primary" onClick={this.showModal}>
                    创建课程
                </Button>
                <Modal title="创建课程" onCancel={this.handleCancel}
                    visible={this.state.visible} footer={null}
                >
                    <Form name="create-course" onFinish={this.handleCreateCourse}
                          {...formItemLayout} ref={this.formRef}
                    >
                        <Form.Item name="cover" label="封面" >
                            <PictureUpload fileList={(callback)=>{
                                this.getFileList=callback;
                            }}/>
                        </Form.Item>
                        <Form.Item name="name" label="课程名"  rules={[
                            {required: true,message: '请输入邮箱!'},
                        ]}
                        >
                            <Input  />
                        </Form.Item>
                        <Form.Item name="teacher" label="教师"
                                   rules={[{ required: true, message: '请输入姓名!' }]}
                        >
                            <Input />
                        </Form.Item>
                        <Form.Item name="description" label="说明">
                            <Input />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit"
                                    className="login-form-button" style={{width:"100%"}}>
                                创建课程
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
        return (
            <Card style={{height:"100%"}} title="我教的课" extra={createCourseForm}>
                <Row gutter={16}>
                    {
                        this.state.courses.map((item)=>{
                            return (
                                <Col span={8} key={item.ID} style={{marginTop:20}}>
                                    <Link to={{pathname:"/teacher-course/"+item.ID}} >
                                        <Card hoverable style={{ width: 270 }} bodyStyle={{padding:10}}
                                            cover={<img alt="cover" style={{width:270,height:180}}
                                                        src={Constant.BaseCover+item.cover}/>}
                                        >
                                            <Card.Meta title={item.name} description={
                                                <div>
                                                    <div>{item.teacher}</div>
                                                    <div>{item.description}</div>
                                                </div>
                                            } />
                                        </Card>
                                    </Link>
                                </Col>
                            )
                        })
                    }
                </Row>
            </Card>
        )
    }
}
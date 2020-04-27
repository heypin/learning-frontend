import React from "react";
import {Button, Card, Col, Form, Input, message, Modal, Row} from "antd";
import {Link} from "react-router-dom";
import Constant from "../../utils/constant";
import Request from "../../api"
export default class StudyCourse extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            joinClassModal:false,
            classes:[],
        };
    }
    showJoinClassModal=()=>{
      this.setState({joinClassModal:true});
    };
    cancelJoinClassModal=()=>{
        this.setState({joinClassModal:false});
    };
    joinClass=async (values)=>{
        try{
            await Request.joinClass(values);
            message.success("已加入");
            this.cancelJoinClassModal();
            this.getStudyCourse();
        }catch (e) {
            message.error("加入失败");
        }
    };
    getStudyCourse = async ()=>{
        try{
            const result = await Request.getClassesByUserId();
            console.log(result);
            this.setState({classes:result});
        }catch (e) {

            message.error("获取课程信息失败");
        }
    };
    componentDidMount() {
        this.getStudyCourse();
    }

    render() {
        const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:16}};
        const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
        return (
            <Card style={{height:"100%"}} title="我学的课" extra={<Button
                type="primary" onClick={this.showJoinClassModal}>加入班级</Button>}
            >
                <Modal title="加入班级" onCancel={this.cancelJoinClassModal}
                       visible={this.state.joinClassModal} footer={null}>
                    <Form name="join-class" onFinish={this.joinClass} {...formItemLayout}>
                        <Form.Item name="classCode" label="班级代码"  rules={[{required: true,message: '请输入班级代码!'},]}>
                            <Input  />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Row gutter={16}>
                    {
                        this.state.classes.map((item,index)=>{
                            return (
                                <Col span={8} key={index+1} style={{marginTop:20}}>
                                    <Link to={{pathname:"/student-course/home",search:`?courseId=${item.course.ID}&classId=${item.ID}`}} >
                                        <Card hoverable style={{ width: 270 }} bodyStyle={{padding:10}}
                                              cover={<img alt="cover" style={{width:270,height:180}}
                                                          src={Constant.BaseCover+item.course.cover}/>}
                                        >
                                            <Card.Meta title={item.course.name} description={
                                                <div>
                                                    <div>{item.course.teacher}</div>
                                                    <div>班级:{item.className}</div>
                                                    <div>{item.course.description}</div>
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
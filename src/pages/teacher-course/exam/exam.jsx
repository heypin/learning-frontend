import React from "react";
import {Button, Card, Form, Input, message, Modal} from "antd";
import Request from "../../../api";
import ExamComponent from "./examComponent";
import ExamLibComponent from "./examLibComponent";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
export default class Exam extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.state={
            createLibModal:false,
            tabKey:'exam',
        };
    };
    showCreateLibModal=()=>{
        this.setState({createLibModal:true});
    };
    cancelCreateLibModal=()=>{
        this.setState({createLibModal:false});
    };
    createExamLib = async (values)=>{
        try{
            await Request.createExamLib({courseId:this.courseId,name:values.name});
            message.success("已创建");
            this.cancelCreateLibModal();
        }catch (e) {
            message.error("操作失败");
        }
    };

    onTabChange=(key)=>{
        this.setState({tabKey:key});
    };
    render() {
        const tabList = [{key: 'exam', tab: '考试'}, {key: 'examLib', tab: '试题库'}];
        const contentList = {
            exam: <ExamComponent/>,
            examLib: <ExamLibComponent/>,
        };
        let tabBarExtraContent=this.state.tabKey!=="examLib"?null:
            <Button type='link' onClick={this.showCreateLibModal}>新建试题库</Button>;
        return (
            <Card  bodyStyle={{padding:20}} style={{width:"80%",height:"100%",marginLeft:"auto",marginRight:"auto"}}
                   tabList={tabList} activeTabKey={this.state.tabKey} onTabChange={this.onTabChange}
                   tabBarExtraContent={tabBarExtraContent}
            >
                <Modal title="新建" onCancel={this.cancelCreateLibModal}
                       visible={this.state.createLibModal} footer={null}>
                    <Form name="create-lib" onFinish={this.createExamLib} {...formItemLayout}>
                        <Form.Item name="name" label="名称"  rules={[{required: true,message: '请输入名称!'},]}>
                            <Input  />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
                </Modal>
                {contentList[this.state.tabKey]}
            </Card>
        )
    }
}
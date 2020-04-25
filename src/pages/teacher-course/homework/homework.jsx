import React from "react";
import {Button, Card, Form, Input, message, Modal} from "antd";
import Request from "../../../api";
import HomeworkLibComponent from "./homeworkLibComponent";
import HomeworkComponent from "./homeworkComponent";

const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
export default class Homework extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.state={
            createLibModal:false,
            tabKey:'homework',
        };
    };
    showCreateLibModal=()=>{
        this.setState({createLibModal:true});
    };
    cancelCreateLibModal=()=>{
        this.setState({createLibModal:false});
    };
    createHomeworkLib = async (values)=>{
        try{
            await Request.createHomeworkLib({courseId:this.courseId,name:values.name});
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
        const tabList = [{key: 'homework', tab: '作业'}, {key: 'homeworkLib', tab: '作业库'}];
        const contentList = {
            homework: <HomeworkComponent/>,
            homeworkLib: <HomeworkLibComponent/>,
        };
        let tabBarExtraContent=this.state.tabKey!=="homeworkLib"?null:
            <Button type='link' onClick={this.showCreateLibModal}>新建作业库</Button>;
        return (
            <Card  bodyStyle={{padding:20}} style={{width:"80%",height:"100%",marginLeft:"auto",marginRight:"auto"}}
                  tabList={tabList} activeTabKey={this.state.tabKey} onTabChange={this.onTabChange}
                   tabBarExtraContent={tabBarExtraContent}
            >
                <Modal title="新建" onCancel={this.cancelCreateLibModal}
                       visible={this.state.createLibModal} footer={null}>
                    <Form name="create-lib" onFinish={this.createHomeworkLib} {...formItemLayout}>
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
import React from "react";
import {List, Button, message, Modal, Form, Input, Card, Popconfirm} from 'antd';
import Request from '../../api';
import moment from "moment";

const formItemLayout = {
    labelCol: {span:4},
    wrapperCol: {span:16},
};
const tailFormItemLayout = {
    wrapperCol: {span:16,offset:4},
};

export default class Notify extends React.Component{
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.formRef = React.createRef();
        this.updatedNotify={title:"",content:"",ID:0};//要更新的通知,设置表单初始值
        this.state = {
            notifyData:[],
            addNotifyModal:false,
            updateNotifyModal:false,
        };

    };
    updateNotify=async (values)=>{
        try{
            let notify={
                id:this.updatedNotify.ID,
                title:values.title,
                content:values.content,
            };
            await Request.updateNotifyById(notify);
            this.cancelUpdateNotifyModal();
            message.success("已更新");
            this.loadNotifyData();
        }catch (e) {
            message.error("更新失败");
        }
    };
    deleteNotify=async (id)=>{
      try{
          await Request.deleteNotifyById(id);
          this.loadNotifyData();
      }catch (e) {
          message.error("删除失败");
      }
    };
    addNotify=async (values)=>{
        try{
            let notify = {
              courseId:this.courseId,
              title:values.title,
              content:values.content,
            };
            await Request.createNotify(notify);
            this.cancelAddNotifyModal();
            this.loadNotifyData();
        }catch (e) {
            message.error("创建失败");
        }
    };
    showAddNotifyModal=()=>{this.setState({addNotifyModal:true})};
    cancelAddNotifyModal=()=>{this.setState({addNotifyModal:false})};
    showUpdateNotifyModal=(item)=>{
        this.setState({updateNotifyModal:true,});
        this.updatedNotify=item;
    };
    cancelUpdateNotifyModal=()=>{this.setState({updateNotifyModal:false})};

    loadNotifyData=async ()=>{
        try{
            const result = await Request.getNotifyByCourseId(this.courseId);
            this.setState({notifyData:result});
        }catch (e) {
            message.error("获取通知失败");
        }
    };
    componentDidMount() {
        this.loadNotifyData();
    };
    render() {
        const addNotify=(
            <div>
                <Button type="primary" onClick={this.showAddNotifyModal}>
                    添加通知
                </Button>
                <Modal title="添加通知" onCancel={this.cancelAddNotifyModal}
                       visible={this.state.addNotifyModal} footer={null}>
                    <Form name="add-notify" onFinish={this.addNotify}{...formItemLayout}>
                        <Form.Item name="title" label="标题"  rules={[{required: true,message: '请输入标题!'},]}>
                            <Input />
                        </Form.Item>
                        <Form.Item name="content" label="内容" rules={[{required: true,message: '请输入内容!'}]}>
                            <Input.TextArea rows={8}/>
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                                确认创建
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
            </div>
        );
        return (
            <Card title="通知" extra={addNotify} bodyStyle={{padding:20}}
                  style={{width:"80%",marginLeft:"auto",marginRight:"auto"}}>
                <List itemLayout="horizontal" dataSource={this.state.notifyData}
                    renderItem={item => (
                        <List.Item
                            actions={[(
                            <div>
                                <Button type="link"  style={{padding:0}} onClick={()=>{this.showUpdateNotifyModal(item)}}>
                                    编辑
                                </Button>
                                <Modal title="修改通知"  destroyOnClose={true}//加上才会每次打开时初始化表单值
                                       visible={this.state.updateNotifyModal} footer={null}
                                       onCancel={this.cancelUpdateNotifyModal}>
                                    <Form onFinish={this.updateNotify} initialValues={{
                                            title:this.updatedNotify.title,
                                            content:this.updatedNotify.content,
                                        }} name="update-notify" {...formItemLayout}
                                    >
                                        <Form.Item name="title" label="标题"  rules={[{required: true,message: '请输入标题!'},]}>
                                            <Input />
                                        </Form.Item>
                                        <Form.Item name="content" label="内容" rules={[{required: true,message: '请输入内容!'}]}>
                                            <Input.TextArea rows={8}/>
                                        </Form.Item>
                                        <Form.Item {...tailFormItemLayout}>
                                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                                                确认修改
                                            </Button>
                                        </Form.Item>
                                    </Form>
                                </Modal>
                            </div>
                        ),(
                            <Popconfirm title="确定删除通知" onConfirm={() => {this.deleteNotify(item.ID)}}>
                                <Button type="link" style={{padding:0}}>删除</Button>
                            </Popconfirm>
                        )]} extra={moment(item.CreatedAt).format('YYYY-MM-DD HH:mm:ss')}>
                            <List.Item.Meta title={item.title} description={item.content}/>
                        </List.Item>
                    )}
                />
            </Card>
        )
    }
}
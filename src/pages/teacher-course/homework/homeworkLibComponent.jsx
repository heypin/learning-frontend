import React from "react";
import moment from "moment";
import {Button, Card, Divider, Form, Input, message, Modal, Space, Table} from "antd";
import Request from "../../../api";
import {withRouter} from "react-router";
import PublishHomeworkForm from "./publish-homework-form";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
class HomeworkLibComponent extends React.Component{
    columns=[
        {title: '作业标题', dataIndex: 'name',width:"40%"},
        {title: '创建时间', dataIndex: 'CreatedAt',width:"20%",align:'center',
            render:(text)=>{
                return moment(text).format('YYYY-MM-DD HH:mm:ss');
            }
        },
        {title:'题目数量',dataIndex:'subjectCount',width:"10%",align:'center'},
        {title:'总分',dataIndex:'totalScore',width:"10%",align:'center'},
        {title:'操作',key:'action',width:"20%",align:'center',
            render: (text,record) => {
                return (
                    <Space size={2}>
                        <Button style={{padding:0}} type="link"
                                onClick={()=>this.showRenameModal(record)}>
                            重命名
                        </Button>
                        <Divider type="vertical" />
                        <Button style={{padding:0}} type='link'
                                onClick={()=>this.goToEditHomeworkLib(record)}>
                            编辑
                        </Button>
                        <Divider type="vertical" />
                        <Button style={{padding:0}} disabled={record.subjectCount===0} type='link'
                                onClick={()=>this.showPublishLibModal(record)}>
                            发布作业
                        </Button>
                    </Space>
                )
            },
        }
    ];
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.updatedLib={name:""};//要更新的库
        this.state={
            homeworkLibData:[],
            renameModal:false,
            createLibModal:false,
            publishLibModal:false,
            tabKey:'homework',
        };
    }
    componentDidMount() {
        this.loadHomeworkLibData();
    }
    goToEditHomeworkLib=(record)=>{
        let query = `courseId=${this.courseId}&homeworkLibId=${record.ID}`;
        this.props.history.push({pathname:"/editor",search:query});
    };
    showRenameModal=(record)=>{
        this.setState({renameModal:true});
        this.updatedLib=record;
    };
    cancelRenameModal=()=>{
        this.setState({renameModal:false});
    };
    renameHomeworkLib=async (values)=>{
        try{
            await Request.updateHomeworkLibNameById({id:this.updatedLib.ID,name:values.name});
            message.success("已更新");
            this.cancelRenameModal();
            this.loadHomeworkLibData();
        }catch (e) {
            message.error("操作失败");
        }
    };

    showPublishLibModal=(record)=>{
        this.publishedhomeworkLibId=record.ID;
        this.setState({publishLibModal:true})
    };
    cancelPublishLibModal=()=>{
        this.setState({publishLibModal:false})
    };
    publishHomework=async (values)=>{
        values={...values,homeworkLibId:this.publishedhomeworkLibId};
        console.log(values);
        try{
            const result = await Request.publishHomework(values);
            if(result.code===202){
                message.info("该班级已发布过,不能重复发布")
            }else{
                message.success("发布成功");
            }
        }catch (e) {
            message.error("发布失败");
        }
    };
    loadHomeworkLibData=async ()=>{
        try{
            const result = await Request.getHomeworkLibsByCourseId(this.courseId);
            this.setState({homeworkLibData:result})
        }catch (e) {
            message.error("获取数据失败");
        }
    };
    render() {
        return (
            <div>
                <Modal title="重命名" destroyOnClose={true} onCancel={this.cancelRenameModal}
                       visible={this.state.renameModal} footer={null}>
                    <Form name="rename-lib" onFinish={this.renameHomeworkLib} {...formItemLayout}>
                        <Form.Item name="name" label="名称"  rules={[{required: true,message: '请输入名称!'},]}>
                            <Input  />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                        </Form.Item>
                    </Form>
                </Modal>

                <Modal title="发布作业" onCancel={this.cancelPublishLibModal}
                       visible={this.state.publishLibModal} footer={null}>
                    <PublishHomeworkForm courseId={this.courseId} onFinish={this.publishHomework}/>
                </Modal>
                <Table bordered  columns={this.columns} dataSource={this.state.homeworkLibData}
                       pagination={false} rowKey={record=>record.ID}
                />
            </div>
        )
    }
}
export default withRouter(HomeworkLibComponent)
import React from "react";
import {Button, Card, Form, Input, message, Modal, Table, Space, Divider, Select, DatePicker, Switch} from "antd";
import Request from "../../api";
import moment from "moment";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};

class PublishHomeworkForm extends React.Component{
    constructor(props) {
        super(props);
        this.formRef=React.createRef();
        this.state={
            classes:[],
        }
    }
    loadClassesInfo=async ()=>{
      try{
          const result = await Request.getClassesByCourseId(this.props.courseId);
          let classes = [];
          result.forEach((item)=>{
              classes.push({value:item.ID,name:item.className});
          });
          this.setState({classes:classes});
      }catch (e) {
          console.log(e);
      }
    };
    componentDidMount() {
        this.loadClassesInfo();
    }

    onFinish = (values) => {
        let resubmit = values.resubmit === true ? 1 : 0;
        const form = {
            ...values,
            resubmit: resubmit,
            beginTime: values.range[0].format(),
            endTime: values.range[1].format(),
        };
        this.props.onFinish(form);
    };
    render() {
        return (
            <Form ref={this.formRef} name="publish-homeworkLib" onFinish={this.onFinish} {...formItemLayout}>
                <Form.Item name="resubmit" label="重复提交" valuePropName="checked">
                    <Switch/>
                </Form.Item>
                <Form.Item label="班级" name="classId" hasFeedback rules={[{required: true,message: '请选择班级!'},]}>
                    <Select placeholder="请选择班级">
                        {
                            this.state.classes.map((item)=>{
                                return (
                                    <Select.Option key={item.value} value={item.value}>{item.name}</Select.Option>
                                )
                            })
                        }
                    </Select>
                </Form.Item>
                <Form.Item label="起止时间" name="range" rules={[{ type: 'array', required: true, message: '请选择时间'}]}>
                    <DatePicker.RangePicker showTime format="YYYY-MM-DD HH:mm:ss" />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                </Form.Item>
            </Form>
        )
    }
}
export default class Homework extends React.Component{
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
        this.columns=[
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
    };

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
    componentDidMount() {
        this.loadHomeworkLibData();
    }
    onTabChange=(key)=>{
        this.setState({tabKey:key});
    };
    render() {
        const tabList = [{key: 'homework', tab: '作业'}, {key: 'homeworkLib', tab: '作业库'}];
        const homeworkLibComponent = (
            <Table bordered  columns={this.columns} dataSource={this.state.homeworkLibData}
                   components={this.components} pagination={false}
                   rowKey={record=>record.ID}
            />
        );
        const homeworkComponent = (
          <div>123</div>
        );
        const contentList = {
            homework: homeworkComponent,
            homeworkLib: homeworkLibComponent,
        };
        let tabBarExtraContent=this.state.tabKey!=="homeworkLib"?null:
            <Button type='link' onClick={this.showCreateLibModal}>新建作业库</Button>;
        return (
            <Card  bodyStyle={{padding:20}} style={{width:"80%",height:"100%",marginLeft:"auto",marginRight:"auto"}}
                  tabList={tabList} activeTabKey={this.state.tabKey} onTabChange={this.onTabChange}
                   tabBarExtraContent={tabBarExtraContent}
            >
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
                <Modal title="发布作业" onCancel={this.cancelPublishLibModal}
                       visible={this.state.publishLibModal} footer={null}>
                    <PublishHomeworkForm courseId={this.courseId} onFinish={this.publishHomework}/>
                </Modal>
                {contentList[this.state.tabKey]}
            </Card>
        )
    }
}
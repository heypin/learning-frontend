import React from "react";
import {Card, Layout, Menu, Button, Table, message, Space, Popconfirm, Form, Input, Modal} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import Request from "../../api";
const {Sider,Content}= Layout;
export default class Classes extends React.Component{
    columns=[
        {title: '帐号', dataIndex:'email',width:"20%",align:'center'},
        {title: '姓名', dataIndex:'realName',width:"10%",align:'center'},
        {title:'学号',dataIndex:'number',width:"10%",align:'center'},
        {title:'性别',dataIndex:'sex',width:"10%",align:'center',
            render:(text)=>{
                if(text===1) return '男';
                else if(text===2) return '女';
            }
        },
        {title:'操作',key:'action',width:"20%",align:'center',
            render: (text,record) => {
                return (
                    <Popconfirm title="确定删除" onConfirm={() => {this.deleteClassMember(record)}}>
                        <Button style={{padding:0}} type="link">
                            移除
                        </Button>
                    </Popconfirm>
                )
            },
        }
    ];
    constructor(props) {
        super(props);
        this.courseId = parseInt(props.match.params.id);
        this.state={
            selectedClass:{ID:0,className:"",classCode:""},
            classes:[],
            users:[],
            createClassModal:false,
        }
    }
    deleteClassMember=async (record)=>{
        try{
            let classId=this.state.selectedClass.ID;
            await Request.deleteClassMember({
                userId:record.ID,
                classId:classId
            });
            message.success("已删除");
            this.loadClassMemberData(classId);
        } catch (e) {
            message.error("删除失败");
        }
    };
    loadClassMemberData=async (classId)=>{
        try{
            const result=await Request.getUsersByClassId(classId);
            this.setState({users:result});
        }catch (e) {
            console.log(e);
        }
    };
    loadClassData=async ()=>{
        try{
            const result=await Request.getClassesByCourseId(this.courseId);
            if(result.length!==0){
                this.setState({selectedClass:result[0]});
                this.loadClassMemberData(result[0].ID);
            }
            this.setState({classes:result});
        }catch (e) {
            console.log(e);
        }
    };
    onMenuItemClick=({item})=>{
        this.setState({selectedClass:item.props.record});
        this.loadClassMemberData(item.props.record.ID);
    };
    showCreateClassModal=()=>{
      this.setState({createClassModal:true});
    };
    cancelCreateClassModal=()=>{
        this.setState({createClassModal:false});
    };
    createClass=async (values)=>{
        try{
            await Request.createClass({courseId:this.courseId,className:values.className});
            this.cancelCreateClassModal();
            message.success("创建成功");
            this.loadClassData();
        }catch (e) {
            message.error("创建失败");
        }
    };
    componentDidMount() {
        this.loadClassData();
    }

    render() {
        const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:16}};
        const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
        const cardTitle=(
            <span>
                {this.state.selectedClass.ID===0?null:
                    <Space size={"large"}>
                        <span>
                            班级名称:{this.state.selectedClass.className}
                        </span>
                        <span>
                            班级代码:{this.state.selectedClass.classCode}
                        </span>
                    </Space>
                }
            </span>
        );
        const cardExtra=(
            <Button icon={<PlusOutlined />}  onClick={this.showCreateClassModal}>
                创建班级
            </Button>
        );
        return (
            <React.Fragment>
                <Modal title="创建班级" onCancel={this.cancelCreateClassModal}
                       visible={this.state.createClassModal} footer={null}>
                    <Form name="update-chapter" onFinish={this.createClass}{...formItemLayout}>
                        <Form.Item name="className" label="名称"  rules={[{required: true,message: '请输入班级名'},]}>
                            <Input  />
                        </Form.Item>
                        <Form.Item {...tailFormItemLayout}>
                            <Button type="primary" htmlType="submit" style={{width:"100%"}}>
                                确认创建
                            </Button>
                        </Form.Item>
                    </Form>
                </Modal>
                <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="250">
                    <Menu theme="light" mode="inline" onClick={this.onMenuItemClick}
                          selectedKeys={[this.state.selectedClass.ID.toString()]}>
                        {this.state.classes.map((item)=>{return (
                            <Menu.Item key={item.ID} record={item}>
                                <span className="nav-text">{item.className}</span>
                            </Menu.Item>
                        )})}
                    </Menu>
                </Sider>
                <Content className="content">
                    <Card title={cardTitle} style={{height:"100%"}} extra={cardExtra}>
                        <Table bordered  columns={this.columns} dataSource={this.state.users}
                               pagination={false} rowKey={record=>record.ID}
                        />
                    </Card>
                </Content>
            </React.Fragment>
        )
    }
}
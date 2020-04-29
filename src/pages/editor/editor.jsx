import React from 'react';
import {Button, Layout, Menu, message, Popconfirm, Space} from "antd";
import {PlusOutlined,DeleteOutlined} from "@ant-design/icons";
import SubjectEditor from "./subject-editor";
import './editor.less';
import Request from "../../api"
import queryString from "querystring";
const {Sider,Content,Header}= Layout;
export default class Editor extends React.Component{
    constructor(props) {
        super(props);
        let query = queryString.parse(props.location.search.slice(1));
        if(query.homeworkLibId){
            this.homeworkLibId=parseInt(query.homeworkLibId.toString());
        }
        if(query.examLibId){
            this.examLibId=parseInt(query.examLibId.toString());
        }
        this.editingSujectId=0;
        this.state={
            subjects:[],
            editingStatus:'create',
            editingSubject:{type:''},
        };
    };
    createSubjectEditor=(type)=>{
        this.editingSujectId=0;
        this.setState({editingSubject:{type:type},editingStatus:'create'});
    };
    onMenuItemClick=({item})=>{
        this.editingSujectId=item.props.record.ID;
        this.setState({editingSubject:item.props.record,editingStatus:'modify'});
    };
    loadSubjectData=async ()=>{
        try {
            if(this.homeworkLibId){//代表编辑作业库，否则是试题库
                const result = await Request.getHomeworkLibItemsByLibId(this.homeworkLibId);
                this.setState({subjects:result});
            }else{
                const result = await Request.getExamLibItemsByLibId(this.examLibId);
                this.setState({subjects:result});
            }

        }catch (e) {
            message.error("获取数据失败");
        }
    };
    componentDidMount() {
        this.loadSubjectData();
    }
    createSubject=async (values)=>{
        try{
            if(this.homeworkLibId){
                await Request.createHomeworkLibItem(values);
            }else{
                await Request.createExamLibItemAndOptions(values);
            }
            message.success("创建成功");
            this.loadSubjectData();
        }catch (e) {
            message.error("创建失败");
        }
    };
    modifySubject=async (values)=>{
      try{
          if(this.homeworkLibId){
              await Request.updateHomeworkLibItemAndOptions(values);
          }else{
              await Request.updateExamLibItemAndOptions(values);
          }
          message.success("修改成功");
          this.loadSubjectData();
      }catch (e) {
          message.error("修改失败");
      }
    };
    deleteSubject=async (record)=>{
      try{
          if(this.homeworkLibId){
              await Request.deleteHomeworkLibItemById(record.ID);
          }else{
              await Request.deleteExamLibItemById(record.ID);
          }
          this.createSubjectEditor('');
          message.success("删除成功");
          this.loadSubjectData();
      }catch (e) {
          message.error("删除失败");
      }
    };
    onFinish=(values)=>{
        if(this.state.editingStatus==='create'){
            if(this.homeworkLibId){
                this.createSubject({homeworkLibId:this.homeworkLibId,...values});
            }else{
                this.createSubject({examLibId:this.examLibId,...values});
            }
        }else if(this.state.editingStatus==='modify'){
            if(this.homeworkLibId){
                this.modifySubject({
                    Id:this.editingSujectId,
                    homeworkLibId:this.homeworkLibId,
                    ...values
                });
            }else{
                this.modifySubject({
                    Id:this.editingSujectId,
                    examLibId:this.examLibId,
                    ...values
                })
            }
        }
    };

    render() {
        return (
            <Layout className="editor" >
                <Header className="header" style={{marginBottom:1}}>
                    <div className="lib-name">编辑器</div>
                    <Space  className="create-button">
                        <Button type='primary' icon={<PlusOutlined/>}  onClick={()=>this.createSubjectEditor('单选题')}>单选题</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>this.createSubjectEditor('判断题')}>判断题</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>this.createSubjectEditor('多选题')}>多选题</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>this.createSubjectEditor('填空题')}>填空题</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>this.createSubjectEditor('简答题')}>简答题</Button>
                        <Button type='primary' icon={<PlusOutlined />} onClick={()=>this.createSubjectEditor('编程题')}>编程题</Button>
                    </Space>
                </Header>
                <Layout className="body">
                    <Sider className="sider" theme="light" breakpoint="lg" collapsedWidth="0" width="300">
                        <Menu theme="light" mode="inline" onClick={this.onMenuItemClick}>
                            {this.state.subjects.map((item,index)=>{return (
                                <Menu.Item key={item.ID} record={item} >
                                    <Popconfirm title="确定删除题目" onConfirm={() => this.deleteSubject(item)}>
                                        <Button icon={<DeleteOutlined />} type='link'/>
                                    </Popconfirm>
                                    <span className="nav-text">{index+1}.[{item.type}]({item.score}分){item.question}</span>
                                </Menu.Item>
                            )})}
                        </Menu>
                    </Sider>
                    <Content className="content">
                        <div style={{padding:20}}>
                            {this.state.editingStatus==='create'?
                                <SubjectEditor type={this.state.editingSubject.type}
                                               onFinish={this.onFinish}/>:null
                            }
                            {this.state.editingStatus==='modify'?
                                <SubjectEditor type={this.state.editingSubject.type}
                                               dataSource={this.state.editingSubject}
                                               onFinish={this.onFinish}/>:null
                            }
                        </div>
                    </Content>
                </Layout>
            </Layout>
        )
    }
}
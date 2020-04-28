import React from "react";
import Request from "../../../api";
import {Button, DatePicker, Form, InputNumber, message, Select} from "antd";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
export default class PublishExamForm extends React.Component{
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
        if(values.range[1].diff(values.range[0],'minute')> values.duration){
            let form = {
                ...values,
                beginTime: values.range[0].format(),
                endTime: values.range[1].format(),
            };
            this.props.onFinish(form);
        }else{
            message.error("起止时间差应大于考试持续时间");
        }
    };
    render() {
        return (
            <Form ref={this.formRef} name="publish-homeworkLib" onFinish={this.onFinish} {...formItemLayout}>
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
                <Form.Item name="duration" label="考试时间" rules={[{required: true,message: '请输入时间'},]}>
                    <InputNumber min={10} />
                </Form.Item>
                <Form.Item {...tailFormItemLayout}>
                    <Button type="primary" htmlType="submit" style={{width:"100%"}}>确认</Button>
                </Form.Item>
            </Form>
        )
    }
}
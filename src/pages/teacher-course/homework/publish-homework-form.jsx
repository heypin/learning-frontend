import React from "react";
import Request from "../../../api";
import {Button, DatePicker, Form, Select, Switch} from "antd";
const formItemLayout = {labelCol: {span:4}, wrapperCol: {span:20}};
const tailFormItemLayout = {wrapperCol: {span:16,offset:4}};
export default class PublishHomeworkForm extends React.Component{
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
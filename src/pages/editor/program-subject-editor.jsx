import React from "react";
import {Button, Form, Input, InputNumber} from "antd";
const formItemLayout = {
    labelCol: {span:2},
    wrapperCol: {span:16},
};
const tailFormItemLayout = {
    wrapperCol: {offset:2},
};
export default class ProgramSubjectEditor extends React.Component{
    onFinish=(values)=>{
        if(this.props.onFinish !== undefined && this.props.onFinish!==null) {
            this.props.onFinish({type: "编程题", ...values});
        }
    };
    render() {
        return (
            <div >
                <Form onFinish={this.onFinish} initialValues={this.props.dataSource} name="create-single" {...formItemLayout}>
                    <Form.Item name="score" label="分值" rules={[{required: true,message: '请输入分值'},]}>
                        <InputNumber min={1} max={100}/>
                    </Form.Item>
                    <Form.Item name="question" label="题干"
                               rules={[{required: true,message: '请输入题干'},]}>
                        <Input.TextArea  rows={5}/>
                    </Form.Item>
                    <Form.Item name="answer" label="正确答案" rules={[{required: true,message: '请输入程序输出结果'},]}>
                        <Input.TextArea  rows={1}/>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
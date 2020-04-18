import React from "react";
import {Button, Form, Input, InputNumber, Radio} from "antd";
const formItemLayout = {
    labelCol: {span:2},
    wrapperCol: {span:8},
};
const tailFormItemLayout = {
    wrapperCol: {offset:2},
};
export default class JudgementSubjectEditor extends React.Component{
    onFinish=(values)=>{
        if(this.props.onFinish !== undefined && this.props.onFinish!==null) {
            this.props.onFinish({type: "判断题", ...values});
        }
    };
    render() {
        return (
            <div >
                <Form onFinish={this.onFinish} name="create-judgement" {...formItemLayout}>
                    <Form.Item name="score" label="分值" rules={[{required: true,message: '请输入分值'},]}>
                        <InputNumber min={1} max={100}/>
                    </Form.Item>
                    <Form.Item name="question" label="题干"
                               rules={[{required: true,message: '请输入题干'},]}>
                        <Input.TextArea  rows={5}/>
                    </Form.Item>
                    <Form.Item name="answer" label="正确答案" rules={[{required: true,message: '请输入正确答案'},]}>
                        <Radio.Group>
                            <Radio value={'1'}>对</Radio>
                            <Radio value={'0'}>错</Radio>
                        </Radio.Group>
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
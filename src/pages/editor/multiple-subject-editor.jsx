import React from "react";
import {Radio, Input, Form, Button, InputNumber,Checkbox} from 'antd';
const formItemLayout = {
    labelCol: {span:2},
    wrapperCol: {span:8},
};
const tailFormItemLayout = {
    wrapperCol: {offset:2},
};
export default class MultipleSubjectEditor extends React.Component{
    constructor(props) {
        super(props);
        this.allOptions=[
            {name:"OptionA",label:"选项A"},
            {name:"OptionB",label:"选项B"},
            {name:"OptionC",label:"选项C"},
            {name:"OptionD",label:"选项D"},
            {name:"OptionE",label:"选项E"},
            {name:"OptionF",label:"选项F"},
            {name:"OptionG",label:"选项G"},
        ];
        this.allCheckBox=[
            {value:'A',text:'A'},
            {value:'B',text:'B'},
            {value:'C',text:'C'},
            {value:'D',text:'D'},
            {value:'E',text:'E'},
            {value:'F',text:'F'},
            {value:'G',text:'G'},
        ];
        this.state = {
            options:this.allOptions.slice(0,4),
            checkBox:this.allCheckBox.slice(0,4),
        };

    };
    addOption=()=>{
        let optionLength=this.state.options.length;
        let checkBoxLength=this.state.checkBox.length;
        this.state.options.push(this.allOptions[optionLength]);
        this.state.checkBox.push(this.allCheckBox[checkBoxLength]);
        this.setState({
            options:this.state.options,
            checkBox:this.state.checkBox,
        });
    };
    deleteOption=()=>{
        this.state.options.pop();
        this.state.checkBox.pop();
        this.setState({
            options:this.state.options,
            checkBox:this.state.checkBox,
        });
    };
    onFinish=(values)=>{
        let answer=values.answer.toString();//将数组[1,2]变为字符串1,2
        if(this.props.onFinish !== undefined && this.props.onFinish!==null) {
            this.props.onFinish({type: "多选题", ...values,answer:answer});
        }
    };
    render() {
        let answer = this.props.dataSource.answer;
        if(answer!==undefined&&answer!=null&&answer!==''){
            answer = answer.split(',');//将1,2变为数组[1,2]
        }
        let initialValues={...this.props.dataSource,answer:answer};
        return (
            <div >
                <Form initialValues={initialValues} onFinish={this.onFinish} name="create-multiple" {...formItemLayout}>
                    <Form.Item name="score" label="分值" rules={[{required: true,message: '请输入分值'},]}>
                        <InputNumber min={1} max={100}/>
                    </Form.Item>
                    <Form.Item name="question" label="题干"
                               rules={[{required: true,message: '请输入题干'},]}>
                        <Input.TextArea />
                    </Form.Item>
                    {
                        this.state.options.map((item)=>{
                            return (
                                <Form.Item rules={[{required: true,message: '请输入内容'},]}
                                           name={item.name} label={item.label} key={item.name}>
                                    <Input.TextArea />
                                </Form.Item>
                            )
                        })
                    }
                    <Form.Item name="answer" label="正确答案"
                               rules={[{required: true,message: '请输入正确答案'},]}>
                        <Checkbox.Group>
                            {
                                this.state.checkBox.map((item)=>{
                                    return (
                                        <Checkbox value={item.value} key={item.value}>{item.text}</Checkbox>
                                    )
                                })
                            }
                        </Checkbox.Group>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button disabled={this.state.options.length===7} onClick={this.addOption} style={{marginRight:10}}>添加选项</Button>
                        <Button disabled={this.state.options.length===2} onClick={this.deleteOption} style={{marginRight:10}}>删除选项</Button>
                        <Button type="primary" htmlType="submit">
                            确定
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        )
    }
}
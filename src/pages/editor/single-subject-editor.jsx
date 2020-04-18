import React from "react";
import {Radio, Input, Form, Button, InputNumber} from 'antd';
const formItemLayout = {
    labelCol: {span:2},
    wrapperCol: {span:8},
};
const tailFormItemLayout = {
    wrapperCol: {offset:2},
};
export default class SingleSubjectEditor extends React.Component{
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
        this.allRadios=[
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
            radios:this.allRadios.slice(0,4),
        };

    };
    componentDidMount() {
        console.log("mount");
    }

    addOption=()=>{
        let optionLength=this.state.options.length;
        let radioLength=this.state.radios.length;
        this.state.options.push(this.allOptions[optionLength]);
        this.state.radios.push(this.allRadios[radioLength]);
        this.setState({
           options:this.state.options,
           radios:this.state.radios,
        });
    };
    deleteOption=()=>{
        this.state.options.pop();
        this.state.radios.pop();
        this.setState({
            options:this.state.options,
            radios:this.state.radios
        });
    };
    onFinish=(values)=>{
        if(this.props.onFinish !== undefined && this.props.onFinish!==null){
            this.props.onFinish({type:"单选题",...values});
        }
    };
    render() {
        return (
            <div >
                <Form initialValues={this.props.dataSource} onFinish={this.onFinish} name="create-single" {...formItemLayout}>
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
                        <Radio.Group>
                            {
                                this.state.radios.map((item)=>{
                                    return (
                                        <Radio value={item.value} key={item.value}>{item.text}</Radio>
                                    )
                                })
                            }
                        </Radio.Group>
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
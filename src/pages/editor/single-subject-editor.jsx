import React from "react";
import {Radio, Input, Form, Button, InputNumber} from 'antd';
const formItemLayout = {
    labelCol: {span:2},
    wrapperCol: {span:16},
};
const tailFormItemLayout = {
    wrapperCol: {offset:2},
};
export default class SingleSubjectEditor extends React.Component{
    constructor(props) {
        super(props);
        this.formRef=React.createRef();
        this.allOptions=['A','B','C','D','E','F','G','H','I'];
        let options=this.allOptions.slice(0,4);
        if (props.dataSource){
            options=this.allOptions.slice(0,props.dataSource.options.length);
        }
        this.state = {
            options:options,
        };

    };
    setFormOptionsInitialValues=()=>{
        if(!this.props.dataSource) return;
        let values={...this.props.dataSource};
        this.props.dataSource.options.forEach((item)=>{
           values={...values,[item.sequence]:item.content};
        });
        this.formRef.current.setFieldsValue(values);
    };
    componentDidMount() {
        this.setFormOptionsInitialValues();
    }
    addOption=()=>{
        let optionLength=this.state.options.length;
        this.state.options.push(this.allOptions[optionLength]);
        this.setState({
            options:this.state.options,
        });
    };
    deleteOption=()=>{
        this.state.options.pop();
        this.setState({
            options:this.state.options,
        });
    };
    onFinish=(values)=>{
        if(!this.props.onFinish)return;
        let options=[];
        this.state.options.forEach((item)=>{
            options.push({sequence:item,content:values[item]});
        });
        this.props.onFinish({type:"单选题",options:options,...values});
    };
    render() {
        return (
            <div >
                <Form ref={this.formRef}  onFinish={this.onFinish} name="create-single" {...formItemLayout}>
                    <Form.Item name="score" label="分值" rules={[{required: true,message: '请输入分值'},]}>
                        <InputNumber min={1} max={100}/>
                    </Form.Item>
                    <Form.Item name="question" label="题干"
                               rules={[{required: true,message: '请输入题干'},]}>
                        <Input.TextArea rows={4}/>
                    </Form.Item>
                    {
                        this.state.options.map((item)=>{
                          return (
                              <Form.Item rules={[{required: true,message: '请输入内容'},]}
                                  name={item} label={`选项${item}`} key={item}>
                                  <Input.TextArea rows={1}/>
                              </Form.Item>
                          )
                        })
                    }
                    <Form.Item name="answer" label="正确答案"
                               rules={[{required: true,message: '请输入正确答案'},]}>
                        <Radio.Group>
                            {
                                this.state.options.map((item)=>{
                                    return (
                                        <Radio value={item} key={item}>{item}</Radio>
                                    )
                                })
                            }
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item {...tailFormItemLayout}>
                        <Button disabled={this.state.options.length===this.allOptions.length} onClick={this.addOption} style={{marginRight:10}}>添加选项</Button>
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
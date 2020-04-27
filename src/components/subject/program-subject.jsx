import React from "react";
import {Input, Button, Select, Space, message, InputNumber} from "antd";
import Request from "../../api"
export default class ProgramSubject extends React.Component{
    constructor(props) {
        super(props);
        this.language="go";
        this.state={
            value:props.record.answer,
            inputValue:props.record.score,
            output:"",
            exampleVisible:false
        }
    }
    componentDidMount() {
        let values={
            record:this.props.record,
            sequenceNumber:this.props.sequenceNumber,
            dataSource:this.props.dataSource,
        };
        if(this.props.getValues) {
            this.props.getValues(values);
        }
        if(this.props.getInputValue){
            this.props.getInputValue(values);
        }
    }
    onInputChange=(value)=>{
        this.setState({inputValue:value});
        let values={
            record:{...this.props.record,score:value},
            dataSource:this.props.dataSource,
            sequenceNumber:this.props.sequenceNumber,
        };
        this.props.getInputValue(values);
    };
    showExample=()=>{
        let visible = !this.state.exampleVisible;
        this.setState({exampleVisible:visible})
    };
    onChange=(e)=>{
        let value = e.target.value;
        this.setState({value:value});
        let values={
            record:{...this.props.record,answer:value},
            dataSource:this.props.dataSource,
            sequenceNumber:this.props.sequenceNumber,
        };
        if(this.props.getValues) {
            this.props.getValues(values);
        }
    };

    onSelectChange=(value)=>{
      this.language=value;
    };
    executeProgram=async ()=>{
        try{
            const result=await Request.executeProgram({
                language:this.language,
                input:this.state.value
            });
            this.setState({output:result});
        }catch (e) {
            message.error("服务器错误,运行失败");
        }
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[编程题]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Input.TextArea rows={8} value={this.state.value} onChange={this.onChange}/>
                </div>
                <div style={{marginTop:10}}>
                    <Space>
                        <Select onChange={this.onSelectChange} style={{ width: 120 }} defaultValue="go">
                            <Select.Option value={"go"}>Go</Select.Option>
                            <Select.Option value={"javascript"}>JavaScript</Select.Option>
                        </Select>
                        <Button onClick={this.executeProgram}>运行</Button>
                        <Button onClick={this.showExample}>代码示例</Button>
                    </Space>
                    {this.state.exampleVisible?<div>
                        <span>Go:</span><br/>
                        <div dangerouslySetInnerHTML={{__html:
                                `package main<br/>
                                 import "fmt"<br/>
                                 func main() {<br/>
                                    &nbsp;&nbsp;fmt.Println("Hello, 世界")<br/>
                                 }`
                        }}/>
                        <span>JavaScript：console.log("hello world");</span>
                    </div>:null}
                    <p style={{color:"black"}}>{this.state.output}</p>
                </div>
                <div style={{width:"100%",height:40}}>
                    {this.props.answerVisible?<span style={{float:"left",color:"black",fontSize:15}}>正确答案:{this.props.dataSource.answer}</span>:null}
                    {this.props.inputVisible?<span style={{float:"right",color:"black",fontSize:14}}>得分: <InputNumber onChange={this.onInputChange} value={this.state.inputValue}  min={0} max={this.props.dataSource.score}/></span>:null}
                </div>
            </div>
        )
    }
}
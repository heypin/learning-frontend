import React from "react";
import {Input, Button, Select, Space, message} from "antd";
import Request from "../../api"
export default class ProgramSubject extends React.Component{
    constructor(props) {
        super(props);
        this.language="go";
        this.state={
            value:props.record.answer,
            output:"",
        }
    }
    onChange=(e)=>{
        let value = e.target.value;
        this.setState({value:value});
        let values={...this.props.record,answer:value};
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
                    </Space>
                    <p>{this.state.output}</p>
                </div>
            </div>
        )
    }
}
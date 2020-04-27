import React from "react";
import {Input, InputNumber} from "antd";
export default class ShortSubject extends React.Component{
    constructor(props) {
        super(props);
        this.state={
            value:props.record.answer,
            inputValue:props.record.score,
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
    onChange=(e)=>{
        let value=e.target.value;
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
    onInputChange=(value)=>{
        this.setState({inputValue:value});
        let values={
            record:{...this.props.record,score:value},
            dataSource:this.props.dataSource,
            sequenceNumber:this.props.sequenceNumber,
        };
        this.props.getInputValue(values);
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[简答题]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%",marginBottom:10}}>
                    <Input.TextArea rows={8} value={this.state.value} onChange={this.onChange}/>
                </div>
                <div style={{width:"100%",height:40}}>
                    {this.props.answerVisible?<span style={{float:"left",color:"black",fontSize:15}}>正确答案:{this.props.dataSource.answer}</span>:null}
                    {this.props.inputVisible?<span style={{float:"right",color:"black",fontSize:14}}>得分: <InputNumber onChange={this.onInputChange} value={this.state.inputValue}  min={0} max={this.props.dataSource.score}/></span>:null}
                </div>
            </div>
        )
    }
}
import React from "react";
import {Checkbox} from "antd";
export default class MultipleSubject extends React.Component{
    constructor(props) {
        super(props);
        this.options=this.getOptions();
        let answer = props.dataSource.answer;
        if(answer!==undefined&&answer!=null&&answer!==''){
            answer = answer.split(',');//将1,2变为数组[1,2]
        }
        this.state={
            value:answer,
        }
    }
    getOptions=()=>{
        let options=[];
        let dataSource=this.props.dataSource;
        if(dataSource.optionA!==undefined) options.push({option:'A',value:'A',content:dataSource.optionA});
        if(dataSource.optionB!==undefined) options.push({option:'B',value:'B',content:dataSource.optionB});
        if(dataSource.optionC!==undefined) options.push({option:'C',value:'C',content:dataSource.optionC});
        if(dataSource.optionD!==undefined) options.push({option:'D',value:'D',content:dataSource.optionD});
        if(dataSource.optionE!==undefined) options.push({option:'E',value:'E',content:dataSource.optionE});
        if(dataSource.optionF!==undefined) options.push({option:'F',value:'F',content:dataSource.optionF});
        if(dataSource.optionG!==undefined) options.push({option:'G',value:'G',content:dataSource.optionG});
        return options;
    };
    onChange=(value)=>{
        this.setState({value:value});
        let answer=value.toString();//将数值变为字符串
        let values={...this.props.dataSource,answer:answer};
        if(this.props.getValues !== undefined && this.props.getValues!==null) {
            this.props.getValues(values);
        }
    };
    render() {
        const {sequenceNumber,dataSource}=this.props;
        const checkBoxStyle = {
            lineHeight: '40px',
            marginBottom:'10px',
            width:"100%",
            border:"1px solid #eaeaea",
            borderRadius:4,
            paddingLeft:10,
            fontSize:16,
            wordBreak:"break-all",
        };
        return (
            <div style={{paddingLeft:10,paddingRight:10}}>
                <p style={{fontSize:17,marginBottom:5,wordBreak:"break-all"}}>
                    <span style={{color:"#36aafd"}}>{sequenceNumber}.</span>
                    <span style={{color:"#36aafd"}}>[{dataSource.type}]</span>
                    <span style={{color:"#aeaeae"}}>({dataSource.score}分)</span>
                    <span style={{color:"#333"}}>{dataSource.question}</span>
                </p>
                <div style={{width:"100%"}}>
                    <Checkbox.Group style={{width:"100%"}} onChange={this.onChange} value={this.state.value}>
                        {
                            this.options.map((item)=>{
                                return (
                                    <React.Fragment key={item.option}>
                                        <Checkbox  style={checkBoxStyle} value={item.value}>
                                            <span>{item.option}.</span>
                                            <span>{item.content}</span>
                                        </Checkbox>
                                        <br/>
                                    </React.Fragment>

                                )
                            })
                        }
                    </Checkbox.Group>
                </div>
            </div>
        )
    }
}
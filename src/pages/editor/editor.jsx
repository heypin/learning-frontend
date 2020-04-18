import React from 'react';
import {Button} from "antd";
import SubjectEditor from "./subject-editor";
import Subject from "../../components/subject/subject";
export default class Editor extends React.Component{
    constructor(props) {
        super(props);
        this.dataSource1={type:'判断题',question:'12334fssdfffffffffffffffffffffffffffffffffffffff',answer:'1',score:8,
            optionA:"12222222233233333333333333fffffffffffffff",optionB:"sssssssssss",optionC:"sffjlsfj",optionD:"we"};
        this.dataSource=this.dataSource1;
        this.sequenceNumber=1;
        this.values={};
    }
    render() {
        return (
            <div>
                <Subject sequenceNumber={this.sequenceNumber} dataSource={this.dataSource} getValues={(values)=>{this.values=values}}/>
            </div>
        )
    }
}
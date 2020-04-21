import React from 'react';
import SingleSubjectEditor from "./single-subject-editor";
import MultipleSubjectEditor from "./multiple-subject-editor";
import JudgementSubjectEditor from "./judgement-subject-editor";
import BlankSubjectEditor from "./blank-subject-editor";
import ShortSubjectEditor from "./short-subject-editor";
import ProgramSubjectEditor from "./program-subject-editor";
export default class SubjectEditor extends React.Component{
    render() {
        let {type,dataSource,onFinish} = this.props;
        let component;
        switch(type){
            case '单选题':
                component=<SingleSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            case '多选题':
                component=<MultipleSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            case '判断题':
                component=<JudgementSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            case '填空题':
                component=<BlankSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            case '简答题':
                component=<ShortSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            case '编程题':
                component=<ProgramSubjectEditor dataSource={dataSource} onFinish={onFinish}/>;
                break;
            default:
                component=null;
                break;
        }
        return component;
    }
}
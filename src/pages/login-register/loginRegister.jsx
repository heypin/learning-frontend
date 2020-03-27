import React from "react";
import bgImg from '../../assets/home.png';
import {Row,Col} from "antd";

export default class LoginRegister extends React.Component{
    render() {
        if(this.props.type==='login'){
            this.layout={md:{span:6,offset:9},xs:{span:16,offset:4}}
        }else {
            this.layout={md:{span:9,offset:6},xs:{span:14,offset:5}}
        }
        return (
                <div className="home" style={{height:'100%',width:'100%',backgroundSize:"1200px 600px",
                        backgroundImage:`url(${bgImg})`,backgroundRepeat:"no-repeat",paddingTop:50}} >
                    <Row >
                        <Col md={{span:12,offset:6}} xs={{span:16,offset:4}}
                            style={{fontSize:30,textAlign:"center"}} >
                            辅助学习平台
                        </Col>
                    </Row>
                    <Row style={{marginTop:100}}>
                        <Col {...this.layout}>
                            {this.props.children}
                        </Col>
                    </Row>

                </div>
        )
    }
}
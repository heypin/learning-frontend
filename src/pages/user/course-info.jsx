import React from "react";
import {Button, Card, Col, Row} from "antd";
export default class CourseInfo extends React.Component{
    render() {
        return (
            <Card title="我学的课" extra={<Button>加入班级</Button>} className="card">
                <Row gutter={16}>
                    <Col span={8}>
                        <Card
                            hoverable
                            style={{ width: 240 }}
                            cover={<img alt="example" src="https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" />}
                        >
                            <Card.Meta title="Europe Street beat" description="www.instagram.com" />
                        </Card>
                    </Col>
                </Row>
            </Card>
        )
    }
}
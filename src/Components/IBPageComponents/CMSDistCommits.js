import React, {Component} from 'react';
import {Col, Grid, Panel, Row, Tab, Tabs} from "react-bootstrap";
import {getDisplayName, getPreviousIbTag} from "../../Utils/processing";
import uuid from 'uuid';
import _ from 'underscore';

function isFromMergedCommit(pr) {
    if (pr.from_merge_commit === true) {
        return <span className={"glyphicon glyphicon-transfer"}/>
    }
}

class CMSDistCommits extends Component {

    constructor(props) {
        super(props);
        this.state = props;
        this.state = {
            commitPanelProps: props.commitPanelProps,
            ibComparison: props.data
        }
    }

    render() {
        const {commitPanelProps, ibComparison} = this.state;

        return (
            <Panel {...commitPanelProps}  header={"CMS Dist commits"}>
                <Grid>
                    <Row className="show-grid">
                        <Col xs={12} md={8}>
                            <code>{'<Col xs={12} md={8} />'};</code>
                        </Col>
                        <Col xs={6} md={4}>
                            <code>{'<Col xs={6} md={4} />'}</code>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={6} md={4}>
                            <code>{'<Col xs={6} md={4} />'}</code>
                        </Col>
                        <Col xs={6} md={4}>
                            <code>{'<Col xs={6} md={4} />'}</code>
                        </Col>
                        <Col xsHidden md={4}>
                            <code>{'<Col xsHidden md={4} />'}</code>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col xs={6} xsOffset={6}>
                            <code>{'<Col xs={6} xsOffset={6} />'}</code>
                        </Col>
                    </Row>

                    <Row className="show-grid">
                        <Col md={6} mdPush={6}>
                            <code>{'<Col md={6} mdPush={6} />'}</code>
                        </Col>
                        <Col md={6} mdPull={6}>
                            <code>{'<Col md={6} mdPull={6} />'}</code>
                        </Col>
                    </Row>
                </Grid>
            </Panel>
        )
    }

}

export default CMSDistCommits;

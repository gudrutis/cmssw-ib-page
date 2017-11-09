import React, {Component} from 'react';
import Commits from "./Commits";
import StatusLabels from "./StatusLabels";
import ComparisonTable from "./ComparisonTable";
import {Panel} from "react-bootstrap";

// TODO
class IBGroupFrame extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <Panel collapsible
                   defaultExpanded
                   header={'test'}>
                <StatusLabels/>
                <ComparisonTable
                    data={[]}
                    architectures={[]}/>
                <Commits/>
            </Panel>
        )
    }
}

export default IBGroupFrame;

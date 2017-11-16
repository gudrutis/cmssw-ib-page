import React, {Component} from 'react';
import uuid from 'uuid'
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Panel, PanelGroup} from "react-bootstrap";
import RenderTable from "../RenderTable";
import {getAllArchitecturesFromIBGroup} from '../../processing';

class ComparisonTable extends Component {
    static propTypes = {
        data: PropTypes.array,
        architectures: PropTypes.array,
    };

    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data,
            architectures: getAllArchitecturesFromIBGroup(props.data)
        };
    }

    // render() {
    //     return (
    //         <div>
    //             <JSONPretty json={this.state.architectures} />
    //             <PanelGroup>
    //                 {this.state.ibComparison.map(item => {
    //                     return (
    //                         <Panel collapsible header={item.release_name} key={uuid.v4()}>
    //                             <JSONPretty json={item}/>
    //                         </Panel>
    //                     )
    //                 })}
    //             </PanelGroup>
    //             <hr/>
    //         </div>
    //     )
    // }

    render() {
        return (
            <RenderTable/>
        )

    }
}

export default ComparisonTable;

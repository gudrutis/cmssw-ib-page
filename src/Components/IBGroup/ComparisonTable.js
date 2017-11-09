import React, {Component} from 'react';
import uuid from 'uuid'
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Panel, PanelGroup} from "react-bootstrap";
import RenderTable from "../RenderTable";

class ComparisonTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data,
            architectures: props.architectures
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

ComparisonTable.propTypes = {
    data: PropTypes.array,
    architectures: PropTypes.array,
};

export default ComparisonTable;

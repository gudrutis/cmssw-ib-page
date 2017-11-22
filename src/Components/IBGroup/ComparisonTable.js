import React, {Component} from 'react';
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Label, OverlayTrigger, Panel, PanelGroup, Table, Tooltip, Badge} from "react-bootstrap";
import RenderTable from "../RenderTable";
import { getAllArchitecturesFromIBGroupByFlavor} from '../../processing';
import _ from 'underscore';
import uuid from 'uuid';


class ComparisonTable extends Component {
    static propTypes = {
        data: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data,
            archsByIb: getAllArchitecturesFromIBGroupByFlavor(props.data)
            // architectures: getAllArchitecturesFromIBGroup(props.data)
        };
    }

    render() {
        const {archsByIb, ibComparison} = this.state
        return (
            <div className="table-responsive">
                <Table striped={true} bordered={true} condensed={true} hover>
                    <thead>
                    <tr>
                        <th rowSpan={2}></th>
                        {archsByIb.map(item => {
                            return <th colSpan={item.archs.length}>{item.flavor.replace(/_/g, ' ')}</th>
                        })}
                    </tr>
                    <tr>
                        {archsByIb.map(item => {
                            return item.archs.map(arch => <th>{arch.replace(/_/g, ' ')}</th>)
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><b>Builds</b></td>
                        {ibComparison.map((ib, pos) => {

                            const el = archsByIb[pos];
                            return el.archs.map(arch => {
                                const buildResults = _.findWhere(ib.builds, {"arch": arch})

                                if (buildResults === undefined) {
                                    // there was no build for this arch
                                    return (
                                        <th key={uuid.v4()}>No build</th>
                                    )
                                }
                                let cellInfo, tooltip;
                                const {details} = buildResults;
                                if (!_.isEmpty(details)) {
                                    cellInfo = (
                                        <a href="#" class="btn label label-danger">
                                            <span class="glyphicon  glyphicon-remove-circle"/>
                                        </a>
                                    )
                                    tooltip = (
                                        <Tooltip>{`compWarning: ${details.compWarning}, ignoreWarning: ${details.ignoreWarning}`}</Tooltip>)

                                } else {
                                    cellInfo = (
                                        <a href="#" class="btn label label-success">
                                            <span class="glyphicon glyphicon-ok-circle"/>
                                        </a>
                                    )
                                    tooltip = <Tooltip><strong>All good!</strong> More info.</Tooltip>
                                }

                                return (
                                    <th key={uuid.v4()}>
                                        <OverlayTrigger placement="top" overlay={tooltip}>
                                            {cellInfo}
                                        </OverlayTrigger>
                                    </th>);
                            })
                        })}
                    </tr>
                    <tr>
                        <td><b>Unit Tests</b></td>
                        <th>

                        </th>
                    </tr>
                    <tr>
                        <td><b>RelVals</b></td>
                        <th>

                        </th>
                    </tr>
                    <tr>
                        <td><b>Other Tests</b></td>
                        <th>

                        </th>
                    </tr>
                    <tr>
                        <td><b>FWLite</b></td>
                        <th></th>
                    </tr>
                    <tr>
                        <td><b>Q/A</b></td>
                        <th></th>
                    </tr>

                    </tbody>
                </Table>
            </div>
        )

    }

}

export default ComparisonTable;

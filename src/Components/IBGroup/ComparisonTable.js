import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Badge, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {getAllArchitecturesFromIBGroupByFlavor} from '../../processing';
import _ from 'underscore';
import uuid from 'uuid';
import {tooltipDelayInMs,archShowCodes} from '../../config.json'

class ComparisonTable extends Component {
    static propTypes = {
        data: PropTypes.array
    };

    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data,
            archsByIb: getAllArchitecturesFromIBGroupByFlavor(props.data)
        };
    }

    static renderCell(cellInfo, tooltipContent) {
        if (tooltipContent != undefined) {
            return (
                <td key={uuid.v4()}>
                    <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipContent}</Tooltip>}
                                    delay={tooltipDelayInMs}>
                        {cellInfo}
                    </OverlayTrigger>
                </td>
            )
        } else {
            return (
                <td key={uuid.v4()}>
                    {cellInfo}
                </td>
            )
        }
    }

    static renderLabel({colorType, value, glyphicon, link} = {}) {
        return (
            <a href={link} className={`btn label label-${colorType}`}>
                {glyphicon ? <span className={`glyphicon ${glyphicon}`}/> : value}
            </a>
        );
    }

    renderBuildRowCells() {
        const {archsByIb, ibComparison} = this.state;

        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => {
                const buildResults = _.findWhere(ib.builds, {"arch": arch});

                let cellInfo, tooltipContent = undefined;
                const {details} = buildResults;
                if (!_.isEmpty(details) && (details.compWarning !== undefined && details.compWarning > 0)) {
                    cellInfo = ComparisonTable.renderLabel(
                        {colorType: 'danger', value: details.compWarning}
                    );
                    tooltipContent = `compWarning: ${details.compWarning}, ignoreWarning: ${details.ignoreWarning}`;

                } else {
                    cellInfo = ComparisonTable.renderLabel(
                        {colorType: 'success', glyphicon: 'glyphicon-ok-circle'}
                    );
                    tooltipContent = <p><strong>All good!</strong> More info.</p>
                }

                return ComparisonTable.renderCell(cellInfo, tooltipContent);
            })
        })
    }

    renderUnitTestsRowCells() {
        const {archsByIb, ibComparison} = this.state;

        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];

        })
    }

    render() {
        const {archsByIb} = this.state;
        return (
            <div className="table-responsive">
                <Table striped={true} bordered={true} condensed={true} hover>
                    <thead>
                    <tr>
                        <th rowSpan={2}/>
                        {archsByIb.map(item => {
                            return <th colSpan={item.archs.length}>{item.flavor.replace(/_/g, ' ')}</th>
                        })}
                    </tr>
                    <tr>
                        {archsByIb.map(item => {
                            return item.archs.map(arch => {
                                return (
                                    <th>
                                        {arch.split("_").map(str => {
                                            const {color} = archShowCodes;

                                            return <div><span style={{backgroundColor: color[str]}} >{str}</span></div>
                                        })}
                                    </th>
                                )
                            })
                        })}
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td>
                            <b>Builds</b>
                        </td>
                        {this.renderBuildRowCells()}
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

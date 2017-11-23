import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Badge, OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {getAllArchitecturesFromIBGroupByFlavor} from '../../processing';
import _ from 'underscore';
import uuid from 'uuid';
import {tooltipDelayInMs, archShowCodes} from '../../config.json'
import RenderTable from "../RenderTable";

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

    static renderCell(cellInfo) {
        return (
            <td key={uuid.v4()}>
                {cellInfo}
            </td>
        )
    }

    static renderLabel({colorType, value, glyphicon, link, tooltipContent} = {}) {
        if (tooltipContent !== undefined) {
            return (
                <OverlayTrigger placement="top" overlay={<Tooltip>{tooltipContent}</Tooltip>}
                                delay={tooltipDelayInMs}>
                    <a href={link} className={`btn label label-${colorType}`}>
                        {glyphicon ? <span className={`glyphicon ${glyphicon}`}/> : value}
                    </a>
                </OverlayTrigger>

            );
        } else {
            return (
                <a href={link} className={`btn label label-${colorType}`}>
                    {glyphicon ? <span className={`glyphicon ${glyphicon}`}/> : value}
                </a>
            );
        }
    }

    renderRowCells(iterationFunction){
        const {archsByIb, ibComparison} = this.state;
        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => iterationFunction(arch, ib))
        })
    }

    renderBuildRowCells() {

        const iterationFunction = function (arch, ib) {
            const buildResults = _.findWhere(ib.builds, {"arch": arch});

            let cellInfo, tooltipContent = undefined;
            const {details} = buildResults;
            if (!_.isEmpty(details) && (details.compWarning !== undefined && details.compWarning > 0)) {
                tooltipContent = `compWarning: ${details.compWarning}, ignoreWarning: ${details.ignoreWarning}`;
                cellInfo = ComparisonTable.renderLabel(
                    {colorType: 'danger', value: details.compWarning, tooltipContent}
                );

            } else {
                tooltipContent = <p><strong>All good!</strong> More info.</p>
                cellInfo = ComparisonTable.renderLabel(
                    {colorType: 'success', glyphicon: 'glyphicon-ok-circle', tooltipContent}
                );
            }

            return ComparisonTable.renderCell(cellInfo);
        };
        return this.renderRowCells(iterationFunction);
    }

    renderUnitTestsRowCells() {
        const {archsByIb, ibComparison} = this.state;

        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => {
                const buildResults = _.findWhere(ib.builds, {"arch": arch});
                let cellInfo, tooltipContent = undefined;
                const {details} = buildResults;

                // if (!_.isEmpty(details) && (details.compWarning !== undefined && details.compWarning > 0)) {
                //     tooltipContent = `compWarning: ${details.compWarning}, ignoreWarning: ${details.ignoreWarning}`;
                //     cellInfo = ComparisonTable.renderLabel(
                //         {colorType: 'danger', value: details.compWarning, tooltipContent}
                //     );
                //
                // } else {
                //     tooltipContent = <p><strong>All good!</strong> More info.</p>
                //     cellInfo = ComparisonTable.renderLabel(
                //         {colorType: 'success', glyphicon: 'glyphicon-ok-circle', tooltipContent}
                //     );
                // }

                return ComparisonTable.renderCell(cellInfo);

            })
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

                                            return <div><span style={{backgroundColor: color[str]}}>{str}</span></div>
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
                        <th>TODO goes to labels</th>
                    </tr>

                    </tbody>
                </Table>
            </div>
        )

    }

}

export default ComparisonTable;

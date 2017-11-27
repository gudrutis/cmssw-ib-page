import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {OverlayTrigger, Table, Tooltip} from "react-bootstrap";
import {getAllArchitecturesFromIBGroupByFlavor} from '../../processing';
import _ from 'underscore';
import uuid from 'uuid';
import config from '../../config'

const {archShowCodes, tooltipDelayInMs, urls} = config;

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

    static renderLabel({colorType = "default", value, glyphicon, link, tooltipContent} = {}) {
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

    renderRowCells(iterationFunction) {
        const {archsByIb, ibComparison} = this.state;
        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => iterationFunction(arch, ib))
        })
    }


    renderRowCells2({resultType, ifWarning, ifError, ifFailed, ifPassed, ifUnknown}) {
        const {archsByIb, ibComparison} = this.state;
        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => {
                const results = _.findWhere(ib[resultType], {"arch": arch});
                if (!results) {
                    return ComparisonTable.renderCell();
                }

                let tooltipContent, cellInfo = undefined;
                switch (results.passed) {
                    case "passed":
                        tooltipContent = <p>All good!</p>;
                        cellInfo = ComparisonTable.renderLabel(
                            {colorType: 'success', glyphicon: 'glyphicon-ok-circle', tooltipContent}
                        );
                        return ifPassed ? ifPassed(results) : ComparisonTable.renderCell(cellInfo);

                    case "error":
                        return ifError ? ifError(results) : ComparisonTable.renderCell();

                    case "failed":
                        return ifFailed ? ifFailed(results) : ComparisonTable.renderCell();

                    case "warning":
                        return ifWarning ? ifWarning(results) : ComparisonTable.renderCell();

                    case "uknown":
                        tooltipContent = <p>Results are unknown</p>
                        cellInfo = ComparisonTable.renderLabel(
                            {glyphicon: 'glyphicon-question-sign', tooltipContent}
                        );
                        return ifUnknown ? ifUnknown(arch, ib) : ComparisonTable.renderCell(cellInfo);

                    default:
                        console.error("Look like test 'passed' field value is new")
                        return ComparisonTable.renderCell();
                }
            })
        })
    }

    renderBuildRowCells() {
        const linkFunction = function (file) {
            if (!file) {
                return
            }
            let link_parts = file.split('/');
            const si = 4;
            link_parts = link_parts.slice(si, si + 5);

            return urls.buildOrUnitTestUrl + link_parts.join('/');
        };

        const showResults = function (result, ib, arch) {
            // TODO ib| arch needed for link generation
            const {details} = result;
            const resultKeys = Object.keys(details);

            const showLabelConfig = {
                compWarning: {
                    color: "warning"
                },
                ignoreWarning: {
                    hide: true
                }
            };

            let cellInfoArray = resultKeys.map(key => {
                let color, hide;
                if (!showLabelConfig[key]) {
                    color = key.includes("Error") ? "danger" : "default";
                }
                else {
                    ({color, hide} = showLabelConfig[key]);
                }

                if (hide) {
                    return;
                }
                const tooltipContent = <p><strong>{key}</strong></p>;
                return ComparisonTable.renderLabel(
                    {colorType: color, value: details[key], tooltipContent, link: linkFunction(result.file)}
                );

            });

            return ComparisonTable.renderCell(cellInfoArray);
        };

        const config = {
            resultType: 'builds',
            ifPassed: function (details) {
                let tooltipContent = <p><strong>All good!</strong> More info.</p>;
                let cellInfo = ComparisonTable.renderLabel(
                    {
                        colorType: 'success',
                        glyphicon: 'glyphicon-ok-circle',
                        tooltipContent,
                        link: linkFunction(details.file)
                    }
                );
                return ComparisonTable.renderCell(cellInfo);
            },
            ifError: showResults,
            ifFailed: showResults,
            ifWarning: showResults
        };
        return this.renderRowCells2(config);
    }

    renderUnitTestsRowCells() {
        const iterationFunction = function (arch, ib) {
            const utestsResults = _.findWhere(ib.utests, {"arch": arch});
            if (!utestsResults) {
                return ComparisonTable.renderCell();
            }

            let cellInfo, tooltipContent = undefined;
            const {details} = utestsResults;
            if (!_.isEmpty(details) && (details.num_fails !== undefined && details.num_fails > 0)) {
                const testStr = details.num_fails === 1 ? "test" : "tests";
                tooltipContent = `${details.num_fails} unit ${testStr} failing`;
                cellInfo = ComparisonTable.renderLabel(
                    {
                        colorType: 'danger',
                        value: details.num_fails,
                        tooltipContent,
                        link: "http://www.stackoverflow.com"
                    }
                );
            } else if (utestsResults.passed === "passed") {
                tooltipContent = <p><strong>All good!</strong> More info.</p>;
                cellInfo = ComparisonTable.renderLabel(
                    {colorType: 'success', glyphicon: 'glyphicon-ok-circle', tooltipContent}
                );
            } else {
                tooltipContent = <p>Results are unknown</p>
                cellInfo = ComparisonTable.renderLabel(
                    {colorType: 'default', glyphicon: 'glyphicon-question-sign', tooltipContent}
                );
            }
            return ComparisonTable.renderCell(cellInfo);
        };

        return this.renderRowCells(iterationFunction);
    }

    renderRelValsRowCells() {
        const linkFunction = function (file,) {
            if (!file) {
                return
            }
            let link_parts = file.split('/');
            const si = 4;
            link_parts = link_parts.slice(si, si + 5);

            return urls.relvalLogDetailUrl + link_parts.join('/');
        };

        const showResults = function (result) {
            const {details} = result;
            const resultKeys = Object.keys(details);

            const showLabelConfig = {
                compWarning: {
                    color: "warning"
                },
                ignoreWarning: {
                    hide: true
                }
            };

            let cellInfoArray = resultKeys.map(key => {
                let color, hide;
                if (!showLabelConfig[key]) {
                    color = key.includes("Error") ? "danger" : "default";
                } else {
                    ({color, hide} = showLabelConfig[key]);
                }

                if (hide) {
                    return;
                }
                const tooltipContent = <p><strong>{key}</strong></p>;
                return ComparisonTable.renderLabel(
                    {colorType: color, value: details[key], tooltipContent, link: linkFunction(result.file)}
                );

            });

            return ComparisonTable.renderCell(cellInfoArray);
        };

        const config = {
            resultType: 'builds',
            ifPassed: function (details) {
                let tooltipContent = <p><strong>All good!</strong> More info.</p>;
                let cellInfo = ComparisonTable.renderLabel(
                    {
                        colorType: 'success',
                        glyphicon: 'glyphicon-ok-circle',
                        tooltipContent,
                        link: linkFunction(details.file)
                    }
                );
                return ComparisonTable.renderCell(cellInfo);
            },
            ifError: showResults,
            ifFailed: showResults,
            ifWarning: showResults
        };
        return this.renderRowCells2(config);
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
                        {this.renderUnitTestsRowCells()}
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

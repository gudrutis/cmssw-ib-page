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
                <OverlayTrigger key={uuid.v4()} placement="top"
                                overlay={<Tooltip id={uuid.v4()}>{tooltipContent}</Tooltip>}
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

    renderRowCells_old(iterationFunction) {
        // TODO delete
        const {archsByIb, ibComparison} = this.state;
        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            return el.archs.map(arch => iterationFunction(arch, ib))
        })
    }

    renderRowCells({resultType, ifWarning, ifError, ifFailed, ifPassed, ifUnknown}) {
        /**
         * General purpose function, it will re-render row according to given config
         * */
        const {archsByIb, ibComparison} = this.state;
        return ibComparison.map((ib, pos) => {
            const el = archsByIb[pos];
            // generate cell for each arch
            return el.archs.map(arch => {
                const results = _.findWhere(ib[resultType], {"arch": arch});
                if (!results) {
                    return ComparisonTable.renderCell();
                }

                let defaultTooltipContent, defaultCellInfo = undefined;
                if (_.isEmpty(results)) {
                    defaultTooltipContent = <p>Results are unknown</p>;
                    defaultCellInfo = ComparisonTable.renderLabel({
                        colorType: 'default',
                        glyphicon: 'glyphicon-question-sign',
                        defaultTooltipContent
                    });
                    return ComparisonTable.renderCell(defaultCellInfo);
                }
                switch (results.passed) {
                    case "passed":
                        defaultTooltipContent = <p>All good!</p>;
                        defaultCellInfo = ComparisonTable.renderLabel(
                            {
                                colorType: 'success',
                                glyphicon: 'glyphicon-ok-circle',
                                tooltipContent: defaultTooltipContent
                            }
                        );
                        return ifPassed ? ifPassed(results, ib.release_name) : ComparisonTable.renderCell(defaultCellInfo);
                    case "error":
                        return ifError ? ifError(results, ib.release_name) : ComparisonTable.renderCell();
                    case "failed":
                        return ifFailed ? ifFailed(results, ib.release_name) : ComparisonTable.renderCell();
                    case "warning":
                        return ifWarning ? ifWarning(results, ib.release_name) : ComparisonTable.renderCell();
                    case "unknown":
                        defaultTooltipContent = <p>Results are unknown</p>;
                        defaultCellInfo = ComparisonTable.renderLabel(
                            {glyphicon: 'glyphicon-question-sign', tooltipContent: defaultTooltipContent}
                        );
                        return ifUnknown ? ifUnknown(arch, ib) : ComparisonTable.renderCell(defaultCellInfo);
                    default:
                        console.error("There is new value: " + results.passed);
                        return ComparisonTable.renderCell();
                }
            })
        })
    }

    renderRowCellsWithDefaultPreConfig({resultType, getUrl, showLabelConfig}) {
        const customShowLabelConfig = showLabelConfig ? showLabelConfig : undefined;

        const showGeneralResults = function (result, ib) {
            const {details} = result;
            const resultKeys = Object.keys(details); //get all object properties name

            const showLabelConfig = Object.assign({
                compWarning: {
                    color: "warning"
                },
                ignoreWarning: {
                    hide: true
                }
            }, customShowLabelConfig);


            /**
             * Generates labels for each cell
             * */
                // TODO aggregate error results, if no errors show warnings
            let cellInfoArray = resultKeys.map(key => {
                    let color, hide;
                    if (!showLabelConfig[key]) {
                        // if the key includes word error, set color to danger
                        color = key.includes("Error") ? "danger" : "default";
                    } else {
                        ({color, hide} = showLabelConfig[key]);
                    }
                    if (hide) {
                        // if property is to be hidden, return nothing
                        return;
                    }
                    const tooltipContent = <p><strong>{key}</strong></p>;
                    return ComparisonTable.renderLabel(
                        {
                            colorType: color, value: details[key], tooltipContent, link: getUrl(
                            {"file": result.file, "arch": result.arch, "ibName": ib})
                        }
                    );
                });
            return ComparisonTable.renderCell(cellInfoArray);
        };

        const config = {
            resultType: resultType,
            ifPassed: function (details, ib) {
                let tooltipContent = <p><strong>All good!</strong> Click for more info.</p>;
                let cellInfo = ComparisonTable.renderLabel(
                    {
                        colorType: 'success',
                        glyphicon: 'glyphicon-ok-circle',
                        tooltipContent,
                        link: getUrl({"file": details.file, "arch": details.arch, "ibName": ib})
                    }
                );
                return ComparisonTable.renderCell(cellInfo);
            },
            ifError: showGeneralResults,
            ifFailed: showGeneralResults,
            ifWarning: showGeneralResults
        };
        return this.renderRowCells(config);
    }

    renderUnitTestsRowCells() {
        // TODO perrasyti
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
                cellInfo = ComparisonTable.renderLabel({
                    colorType: 'danger',
                    value: details.num_fails,
                    tooltipContent,
                    link: "http://www.stackoverflow.com"
                });
            } else if (utestsResults.passed === "passed") {
                tooltipContent = <p><strong>All good!</strong> More info.</p>;
                cellInfo = ComparisonTable.renderLabel({
                    colorType: 'success', glyphicon: 'glyphicon-ok-circle', tooltipContent
                });
            } else {
                tooltipContent = <p>Results are unknown</p>;
                cellInfo = ComparisonTable.renderLabel({
                    colorType: 'default', glyphicon: 'glyphicon-question-sign', tooltipContent
                });
            }
            return ComparisonTable.renderCell(cellInfo);
        };
        return this.renderRowCells_old(iterationFunction);
    }

    renderRelValsRowCells() {
        // TODO, just a copy off renderBuildRow()
        const linkFunction = function (file) {
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
        return this.renderRowCells(config);
    }

    render() {
        const {archsByIb} = this.state;

        // TODO palikt cia, ziuret kaip bus su kitais testais - gal galima iskelt
        const getBuildOrUnitUrl = function (params) {
            const {file, arch, ibName} = params;
            if (!file) {
                // do nothing
            } else if (file === 'not-ready') {
                return "http://cms-sw.github.io/scramDetail.html#" + arch + ";" + ibName
            } else {
                let link_parts = file.split('/');
                const si = 4;
                link_parts = link_parts.slice(si, si + 5);
                return urls.buildOrUnitTestUrl + link_parts.join('/');
            }
        };

        return (
            <div className="table-responsive">
                <Table striped={true} bordered={true} condensed={true} hover>
                    <thead>
                    <tr>
                        <th rowSpan={2}/>
                        {/* IB flavors row*/}
                        {archsByIb.map(item => {
                            return <th key={uuid.v4()} colSpan={item.archs.length}>{item.flavor.replace(/_/g, ' ')}</th>
                        })}
                    </tr>
                    <tr>
                        {/* Arch names row */}
                        {archsByIb.map(item => {
                            return item.archs.map(arch => {
                                return (
                                    <th key={uuid.v4()}>
                                        <a href={urls.q_a(arch, item.name)} style={{color: 'black'}}>
                                            {arch.split("_").map(str => {
                                                const {color} = archShowCodes;
                                                return (
                                                    <div key={uuid.v4()}>
                                                        <span style={{backgroundColor: color[str]}}>{str}</span>
                                                    </div>
                                                )
                                            })}
                                        </a>
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
                        {this.renderRowCellsWithDefaultPreConfig({
                                resultType: 'builds',
                                getUrl: getBuildOrUnitUrl
                            }
                        )}
                    </tr>
                    <tr>
                        <td><b>Unit Tests</b></td>
                        {this.renderUnitTestsRowCells()}
                    </tr>
                    <tr>
                        <td><b>Unit Tests2</b></td>
                        {this.renderRowCellsWithDefaultPreConfig({
                                resultType: 'utests',
                                getUrl: getBuildOrUnitUrl,
                                showLabelConfig: {
                                    num_fails: {
                                        color: "danger"
                                    }
                                }
                            }
                        )}
                    </tr>
                    <tr>
                        <td><b>RelVals</b></td>
                        {this.renderRelValsRowCells()}
                    </tr>
                    <tr>
                        <td><b>Other Tests</b></td>
                        <th>
                            {/* TODO */}
                        </th>
                    </tr>
                    <tr>
                        <td><b>FWLite</b></td>
                        <th>
                            {/* TODO */}
                        </th>
                    </tr>

                    </tbody>
                </Table>
            </div>
        )

    }

}

export default ComparisonTable;

import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ExitCodeStore from "../../Stores/ExitCodeStore";
import {LABEL_COLOR, LABELS_TEXT, RELVAL_STATUS_ENUM} from "../../relValConfig";
import uuid from 'uuid';
import Button from "react-bootstrap/es/Button";
import {Modal, OverlayTrigger, Popover} from "react-bootstrap";
import CommandStore from "../../Stores/CommandStore";
import {filterNameList, filterRelValStructure, getDisplayName, getObjectKeys} from "../../Utils/processing";
import {CopyToClipboard} from 'react-copy-to-clipboard';
import ShowArchStore from '../../Stores/ShowArchStore';

/**
 * returns the link address for a given Ib and an arch
 */
function getLogAddress(arch, ib, step, workflowName, workflowID, wasDASErr) {
    let filename = '';
    if (!wasDASErr) {
        filename = 'step' + step + '_' + workflowName + '.log'
    } else {
        filename = 'step1_dasquery.log';
    }
    return 'http://cmssdt.cern.ch/SDT/cgi-bin/buildlogs/' + arch + '/' + ib + '/pyRelValMatrixLogs/run/' + workflowID + '_' + workflowName + '/' + filename;
}

function getLabelName(name) {
    return LABELS_TEXT[name] ? LABELS_TEXT[name] : name;
}

function getIb(date, que, flavor) {
    // CMSSW_10_1_X_2018-03-21-2300
    return `${que}_${flavor}_${date}`;
}

function getReleaseQue(ibQue) {
    return ibQue + '_X';
}

class ResultTableWithSteps extends Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        this.state = {
            show: false,
            workFlowsToShow: [],
        };
    }

    componentWillMount() {
        CommandStore.on("change", this.loadData);
        ShowArchStore.on("change", this.forceUpdate);
    }

    componentWillUnmount() {
        CommandStore.removeListener("change", this.loadData);
        ShowArchStore.removeListener("change", this.forceUpdate);
    }

    handleClose() {
        this.setState({show: false});
    }

    loadData() {
        let workflowHashes = this.state.workflowHashes;
        this.setState({
            workFlowsToShow: CommandStore.getWorkFlowList(workflowHashes),
        })
    }

    handleShow(steps) {
        return () => {
            this.setState({
                show: true,
                workflowHashes: steps.map(i => i.workflowHash),
                workFlowsToShow: CommandStore.getWorkFlowList(steps.map(i => i.workflowHash))
            });
        }
    }

    rowWithLabel(text, number, logUrl, steps, backgroundColor) {
        let logComponent;
        if (logUrl) {
            logComponent = (
                <a target="_blank" href={logUrl}>
                    <span style={{backgroundColor: backgroundColor}} className="btn label">
                        {text}
                    </span>
                </a>
            )
        } else {
            logComponent = (
                <span style={{backgroundColor: backgroundColor}} className="btn label disabled">
                        {text}
                    </span>
            )
        }
        return (
            <div key={uuid.v4()}>
                <span className="btn label label-default" onClick={this.handleShow(steps).bind(this)}>
                    {number}
                </span>
                {logComponent}
            </div>
        )
    }


    renderSteps({isExpanded, ib, archKey, data}) {
        /**
         * Return rendered content for the cell
         */
        let render_step = [];
        const {id, name, steps} = data;
        for (let i = steps.length; i > 0; i--) {
            let logUrl, label;
            let step = steps[i - 1];
            const {status, errors, warnings} = step;
            // if (!(status === RELVAL_STATUS_ENUM.NOTRUN)) {
            // }

            if (status === RELVAL_STATUS_ENUM.PASSED) {
                let labelColor;
                if (errors > 0) {
                    labelColor = LABEL_COLOR.PASSED_ERRORS_COLOR
                } else if (warnings > 0) {
                    labelColor = LABEL_COLOR.PASSED_WARNINGS_COLOR
                } else {
                    labelColor = LABEL_COLOR.PASSED_COLOR
                }
                logUrl = getLogAddress(archKey, ib, i, name, id, false);
                label = this.rowWithLabel(getLabelName(step.status), i, logUrl, steps, labelColor)
            } else if (status === RELVAL_STATUS_ENUM.FAILED) {
                logUrl = getLogAddress(archKey, ib, i, name, id, false);
                label = this.rowWithLabel(getLabelName(step.status), i, logUrl, steps, LABEL_COLOR.FAILED_COLOR)
            } else if (status === RELVAL_STATUS_ENUM.DAS_ERROR) {
                logUrl = getLogAddress(archKey, ib, i, name, id, true);
                label = this.rowWithLabel(getLabelName(step.status), i, logUrl, steps, LABEL_COLOR.DAS_ERROR_COLOR)
            } else if (status === RELVAL_STATUS_ENUM.NOTRUN) {
                logUrl = getLogAddress(archKey, ib, i, name, id, false);
                label = this.rowWithLabel(getLabelName(step.status), i, logUrl, steps, LABEL_COLOR.NOT_RUN_COLOR)
            } else if (status === RELVAL_STATUS_ENUM.TIMEOUT) {
                logUrl = getLogAddress(archKey, ib, i, name, id, false);
                label = this.rowWithLabel(getLabelName(step.status), i, logUrl, steps, LABEL_COLOR.TIMEOUT_COLOR)
            } else {
                console.error('Unknown status')
            }

            render_step.push(label);
            if (!isExpanded) {
                // if row is not expanded
                break;
            }
        }
        return render_step;
    }

    render() {
        let tableConfig = [];
        let allRelValsStatus;
        const {selectedArchs, selectedFlavors, selectedStatus, style} = this.props;
        const {structure = {}, ibDate, ibQue} = this.props;
        const archColorScheme = ShowArchStore.getColorsSchemeForQue(
            getReleaseQue(ibQue)
        );

        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close">
                Copied!
            </Popover>
        );
        const modalCmd = (
            <Modal show={this.state.show} onHide={this.handleClose.bind(this)} bsSize="lg">
                <Modal.Header closeButton>
                    <Modal.Title> TODO CMD name </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <div style={{overflow: 'auto'}}>
                        {this.state.workFlowsToShow.map((i, index) => {
                            return (
                                <p>
                                    <b>Step {index + 1}  </b>
                                    <CopyToClipboard text={i.command}>
                                        <OverlayTrigger
                                            trigger="click"
                                            rootClose
                                            placement="bottom"
                                            overlay={popoverClickRootClose}
                                        >
                                            <Button bsStyle="primary" bsSize="small">
                                                Copy to clipboard
                                            </Button>
                                        </OverlayTrigger>
                                    </CopyToClipboard>
                                    <br/>
                                    <code>{i.command}</code>
                                </p>
                            )
                        })}
                    </div>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.handleClose.bind(this)}>Close</Button>
                </Modal.Footer>
            </Modal>
        );

        if (structure.dataLoaded) {
            allRelValsStatus = filterRelValStructure({structure, selectedArchs, selectedFlavors, selectedStatus});
            let flavorKeys = getObjectKeys(structure.flavors);
            filterNameList(flavorKeys, selectedFlavors).map(flavorKey => {
                let configObject = {
                    Header: () => <div>{getDisplayName(flavorKey)}</div>,
                    columns: []
                };
                let archsConfig = structure.flavors[flavorKey];
                let archKeys = getObjectKeys(archsConfig);
                filterNameList(archKeys, selectedArchs).map(archKey => {
                    configObject.columns.push({
                        Header: () => {
                            return (
                                archKey.split("_").map(str => {
                                    const color = archColorScheme[str];
                                    return (
                                        <div style={{backgroundColor: color, paddingLeft: 6.3}}
                                             key={uuid.v4()}>
                                            <span style={{color: "white"}}>{" " + str}</span>
                                        </div>
                                    )
                                })
                            )
                        },
                        accessor: relVal => {
                            let data;
                            if (structure.flavors[flavorKey][archKey]) {
                                data = structure.flavors[flavorKey][archKey][relVal.id];
                            }
                            if (data) {
                                let {exitcode} = data;
                                return getLabelName(
                                    ExitCodeStore.getExitCodeName(exitcode)
                                );
                            } else {
                                return null
                            }
                        },
                        id: flavorKey + "-" + archKey,
                        filterable: true,
                        Cell: props => {
                            // const id = props.value;
                            const id = props.row.id;
                            const {isExpanded} = props;
                            let data;
                            if (structure.flavors[flavorKey][archKey]) {
                                data = structure.flavors[flavorKey][archKey][id];
                            }
                            if (data) {
                                const ib = getIb(ibDate, ibQue, flavorKey);
                                let renderedStep = this.renderSteps({isExpanded, ib, archKey, data});
                                return <div style={{
                                    // backgroundColor: 'red',
                                    width: `${props.value}%`,
                                    height: '100%',
                                    padding: '2px 20px',
                                }}>{renderedStep}</div>;
                            } else {
                                // Render empty div
                                return <div style={{
                                    // width: `${props.value}%`,
                                    // height: '100%',
                                    textAlign: 'center',
                                    // margin: 'auto',
                                }}> --- </div>
                            }
                        },
                    })
                });
                tableConfig.push(configObject)
            })
        } else {
            allRelValsStatus = [];
        }
        const columns = [
            {
                columns: [
                    {
                        expander: true,
                    },
                    {
                        // expander: true,
                        Header: "#",
                        accessor: "index",
                        maxWidth: 100,
                        // Cell: props => <b>{props.value}</b>, // shows index in unfiltered list
                        Cell: props => <b>{props.index + 1}</b>, // Shows index in table
                        filterable: true
                    },
                    {
                        Header: "Workflow #",
                        accessor: "id",
                        maxWidth: 100,
                        filterable: true,
                        sortMethod: (a, b) => parseFloat(a) > parseFloat(b) ? 1 : -1,
                    },
                ]
            },
            ...tableConfig
        ];
        return (
            [modalCmd,
                <ReactTable
                    data={allRelValsStatus}
                    columns={columns}
                    defaultPageSize={50}
                    style={style}
                    className={'-striped -highlight'}
                />
            ]
        )
    }
}

export default ResultTableWithSteps;

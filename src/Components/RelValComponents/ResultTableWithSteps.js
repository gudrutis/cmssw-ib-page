import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ExitCodeStore from "../../Stores/ExitCodeStore";
import {LABEL_COLOR, LABELS_TEXT} from "../../relValConfig";
import uuid from 'uuid';
import Button from "react-bootstrap/es/Button";
import {Modal, OverlayTrigger, Popover} from "react-bootstrap";
import CommandStore from "../../Stores/CommandStore";
import {filterNameList, getDisplayName, getObjectKeys} from "../../Utils/processing";
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

class ResultTableWithSteps extends Component {
    constructor(props) {
        super(props);
        this.loadData = this.loadData.bind(this);
        const {ibQue} = props;
        const releaseQue = ibQue + '_X';
        this.state = {
            show: false,
            workFlowsToShow: [],
            releaseQue,
            archColorScheme: ShowArchStore.getColorsSchemeForQue(releaseQue)
        }
    }

    componentWillMount() {
        CommandStore.on("change", this.loadData);
        ShowArchStore.on("change", this.loadData);
    }

    componentWillUnmount() {
        CommandStore.removeListener("change", this.loadData);
        ShowArchStore.removeListener("change", this.loadData);
    }

    handleClose() {
        this.setState({show: false});
    }

    loadData() {
        const {releaseQue} = this.state;
        let workflowHashes = this.state.workflowHashes;
        this.setState({
            workFlowsToShow: CommandStore.getWorkFlowList(workflowHashes),
            archColorScheme: ShowArchStore.getColorsSchemeForQue(releaseQue)
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

    rowWithLabel(text, number, logUrl, steps) {
        let logComponent;
        if (logUrl) {
            logComponent = (
                <a target="_blank" href={logUrl}>
                    <span style={{backgroundColor: LABEL_COLOR.PASSED_COLOR}} className="btn label">
                        {text}
                    </span>
                </a>
            )
        } else {
            logComponent = (
                <span style={{backgroundColor: LABEL_COLOR.PASSED_COLOR}} className="btn label disabled">
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

    render() {
        const popoverClickRootClose = (
            <Popover id="popover-trigger-click-root-close">
                Copied!
            </Popover>
        );

        const modalCmd = (
            <Modal show={this.state.show} onHide={this.handleClose.bind(this)} bsSize="lg">
                <Modal.Header closeButton>
                    <Modal.Title>Legend</Modal.Title>
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
        let tableConfig = [];
        let allRelValsStatus;
        const {allArchs = [], allFlavors = [], style} = this.props;
        const {selectedArchs, selectedFlavors, selectedStatus} = this.props;
        const {structure = {}, ibDate, ibQue} = this.props;
        const {archColorScheme} = this.state;
        if (structure.dataLoaded) {
            allRelValsStatus = structure.allRelvals;
            // TODO filter flavors
            // TODO similary filter archs
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
                                const {id, name, steps} = data;
                                // const exitName = props.value;
                                let render_step = [];
                                for (let i = steps.length; i > 0; i--) {
                                    let logUrl;
                                    let step = steps[i - 1];
                                    if (!(step.status === "NOTRUN")) {
                                        logUrl = getLogAddress(
                                            archKey, ib, i, name, id, false // TODO wasDasErr? fix it
                                        );
                                    }
                                    render_step.push(
                                        this.rowWithLabel(getLabelName(step.status), i, logUrl, steps)
                                    );
                                    if (!isExpanded) { // if not expanded
                                        break;
                                    }
                                }
                                return render_step;
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
                        Cell: props => <b>{props.value}</b>,
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
            <div>
                {modalCmd}
                <ReactTable
                    data={allRelValsStatus}
                    columns={columns}
                    defaultPageSize={50}
                    style={style}
                />
            </div>
        )
    }
}

export default ResultTableWithSteps;

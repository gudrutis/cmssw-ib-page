import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ExitCodeStore from "../Stores/ExitCodeStore";
import {LABEL_COLOR, LABELS_TEXT} from "../relValConfig";
import uuid from 'uuid';


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


function rowWithLabel(text, number, logUrl) {
    // TODO modal window to code
    return <div key={uuid.v4()}>
        <span className="label label-default">
            {number}
        </span>
        <a target="_blank" href={logUrl}>
        <span style={{backgroundColor: LABEL_COLOR.PASSED_COLOR}} className="label">
            {text}
        </span>
        </a>
    </div>
}

function getIb(date, que, flavor) {
    // CMSSW_10_1_X_2018-03-21-2300
    return `${que}_${flavor}_${date}`;
}

class ResultTableWithSteps extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let tableConfig = [];
        let allRelValsStatus;
        const {allArchs = [], allFlavors = [], style} = this.props;
        const {selectedArchs, selectedFlavors, selectedStatus} = this.props;
        const {structure = {}, ibDate, ibQue} = this.props;

        if (structure.dataLoaded) {
            allRelValsStatus = structure.allRelvals;
            // TODO filter flavors
            // TODO similary filter archs
            let flavorKeys = Object.keys(structure.flavors);
            flavorKeys.map(flavorKey => {
                let configObject = {
                    Header: flavorKey,
                    columns: []
                };
                let archsConfig = structure.flavors[flavorKey];
                let archKeys = Object.keys(archsConfig);
                archKeys.map(archKey => {
                    configObject.columns.push({
                        Header: archKey,
                        // accessor: "id",
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
                                const ib = getIb(ibDate,ibQue,flavorKey);
                                const {id, name, steps} = data;
                                const exitName = props.value;
                                if (isExpanded) {
                                    let render_step = [];
                                    for (let i = steps.length; i > 0; i--) {
                                        let logUrl = getLogAddress(
                                            archKey, ib, i, name, id, false // TODO wasDasErr fix it
                                        );
                                        if (i === steps.length) {
                                            render_step.push(
                                                rowWithLabel(exitName, steps.length, logUrl)
                                            )
                                        } else {
                                            let step = steps[i - 1];
                                            render_step.push(
                                                rowWithLabel(getLabelName(step.status), i, logUrl)
                                            )
                                        }
                                    }
                                    return render_step;
                                } else {
                                    let logUrl = getLogAddress(
                                        archKey, ib, steps.length, name, id, false // TODO wasDasErr fix it
                                    );
                                    return rowWithLabel(exitName, steps.length, logUrl);
                                }
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
            <ReactTable
                data={allRelValsStatus}
                columns={columns}
                defaultPageSize={50}
                style={style}
            />
        )

    }
}

export default ResultTableWithSteps;

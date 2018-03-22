import React, {Component} from 'react';
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import ExitCodeStore from "../Stores/ExitCodeStore";

class ResultTableWithSteps extends Component {

    constructor(props) {
        super(props);
    }

    render() {
        let tableConfig = [];
        let allRelValsStatus;
        const {allArchs = [], allFlavors = [], style, data} = this.props;
        const {selectedArchs, selectedFlavors, selectedStatus} = this.props;
        const {structure = {}} = this.props;

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
                    // TODO since columns access the same field,
                    // there is glitch with resizing
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
                                return ExitCodeStore.getExitCodeName(exitcode);
                            } else {
                                return null
                            }
                        },
                        id: flavorKey + "-" + archKey,
                        // sortable: false,
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
                                const {steps, exitcode} = data;
                                if (isExpanded) {
                                    let render_step = steps.map((step, index) => <div>{index}</div>);
                                    return render_step
                                } else {
                                    let exitName = ExitCodeStore.getExitCodeName(exitcode);
                                    return exitName + " " + exitcode + " " + steps.length;
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

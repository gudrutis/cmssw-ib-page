import React, {Component} from 'react';
import RelValNavigation from "./RelValNavigation";
import RelValStore from "../Stores/RelValStore";
import queryString from 'query-string';
import TogglesShowRow from "./TogglesShowRow";
import {goToLinkWithoutHistoryUpdate, partiallyUpdateLocationQuery} from "../Utils/commons";
import ReactTable from 'react-table';
import 'react-table/react-table.css';
import JSONPretty from 'react-json-pretty';

const NAV_CONTROLS_ENUM = {
    SELECTED_ARCHS: "selectedArchs",
    SELECTED_FLAVORS: "selectedFlavors",
    SELECTED_STATUS: "selectedStatus",
};

const STATUS_ENUM = {
    PASSED: 'passed',
    FAILED: 'failed'
};

const STATUS_ENUM_LIST = [
    STATUS_ENUM.FAILED, STATUS_ENUM.PASSED
];

// Smart component tracking data change and laying basic layout
class RelValLayout extends Component {
    constructor(props) {
        super(props);
        this.doUpdateData = this.doUpdateData.bind(this);
        this.state = {
            navigationHeight: 62,
        };
    }

    componentWillMount() {
        RelValStore.on("change", this.doUpdateData);
    }

    doUpdateData() {
        const {date, que} = this.props.match.params;
        const allArchs = RelValStore.getAllArchsForQue({date, que});
        const allFlavors = RelValStore.getAllFlavorsForQue({date, que});
        const structure = RelValStore.getFlavorStructure({date, que});
        this.setState({structure, allArchs, allFlavors, date, que});

        const {location, history} = this.props;
        if (location.search === "") {
            partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_ARCHS, allArchs);
            partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_FLAVORS, allFlavors);
            partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_STATUS, [STATUS_ENUM.FAILED]);
            goToLinkWithoutHistoryUpdate(history, location);
        }

    }

    componentWillReceiveProps(newProps) {
        const {date, que} = newProps.match.params;
        const oldDate = this.props.match.params.date;
        const oldQue = this.props.match.params.que;
        if (date !== oldDate || que !== oldQue) {
            const allArchs = RelValStore.getAllArchsForQue({date, que});
            const allFlavors = RelValStore.getAllFlavorsForQue({date, que});
            const structure = RelValStore.getFlavorStructure({date, que});
            this.setState({structure, allArchs, allFlavors, date, que});

            const {location, history} = newProps;
            partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_ARCHS, allArchs);
            partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_FLAVORS, allFlavors);
            goToLinkWithoutHistoryUpdate(history, location);
        }
    }

    getNavigationHeight() {
        const navigationHeight = document.getElementById('navigation').clientHeight;
        this.setState({navigationHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.getNavigationHeight.bind(this));
        this.doUpdateData();
        this.getNavigationHeight();
    }

    componentWillUnmount() {
        RelValStore.removeListener("change", this.doUpdateData);
        window.removeEventListener('resize', this.getNavigationHeight.bind(this));
    }

    getTopPadding() {
        return this.state.navigationHeight + 20;
    }

    getSizeForTable() {
        return document.documentElement.clientHeight - this.getTopPadding() - 20
    }

    render() {
        const {allArchs = [], allFlavors = []} = this.state;
        const {selectedArchs, selectedFlavors, selectedStatus} = queryString.parse(this.props.location.search);
        let allRelValsStatus;
        const {structure = {}} = this.state;
        let tableConfig = [];

        if (structure.dataLoaded) {
            allRelValsStatus = this.state.structure.allRelvals;
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
                        accessor: "id",
                        sortable: false,
                        Cell: props => {
                            let id = props.value;
                            let data ;
                            if (structure.flavors[flavorKey][archKey]){
                                data = structure.flavors[flavorKey][archKey][id];
                            }
                            // return <JSONPretty json={data}/>
                            return data ? data.name : ""
                        },
                        resizable: false
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


        const controlList = [
            <TogglesShowRow
                rowName={'Flavors'}
                nameList={allFlavors}
                initSelections={selectedFlavors}
                callbackToParent={(v) => {
                    const {location, history} = this.props;
                    partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_FLAVORS, v);
                    goToLinkWithoutHistoryUpdate(history, location);
                }}/>,
            <TogglesShowRow
                rowName={'Architectures'}
                nameList={allArchs}
                initSelections={selectedArchs}
                callbackToParent={(v) => {
                    const {location, history} = this.props;
                    partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_ARCHS, v);
                    goToLinkWithoutHistoryUpdate(history, location);
                }}/>,
            <TogglesShowRow
                rowName={'Status'}
                nameList={STATUS_ENUM_LIST}
                initSelections={selectedStatus}
                callbackToParent={(v) => {
                    const {location, history} = this.props;
                    partiallyUpdateLocationQuery(location, NAV_CONTROLS_ENUM.SELECTED_STATUS, v);
                    goToLinkWithoutHistoryUpdate(history, location);
                }}/>
        ];

        return (
            <div className={'container'} style={{paddingTop: this.getTopPadding()}}>
                <RelValNavigation controlList={controlList}/>
                <ReactTable
                    data={allRelValsStatus}
                    columns={columns}
                    defaultPageSize={50}
                    style={{
                        height: this.getSizeForTable()
                    }}
                />
            </div>
        );
    }
}

export default RelValLayout;

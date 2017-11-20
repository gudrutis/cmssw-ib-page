import React, {Component} from 'react';
import Commits from "./Commits";
import StatusLabels from "./StatusLabels";
import ComparisonTable from "./ComparisonTable";
import {Panel} from "react-bootstrap";
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';

/*
* ib_date - field grouped by
* isIB - true(IB)/ false(next realise, integration build)
* next_ib - is the record next IB build
* */

class IBGroupFrame extends Component {
    static propTypes = {
        IBGroup: PropTypes.arrayOf(PropTypes)
    };

    constructor(props) {
        super(props);
        this.state = {
            IBGroup: props.IBGroup
        };
    }

    getIbGroupType() {
        const firstIbFromList = this.state.IBGroup[0];
        const {isIB, next_ib} = firstIbFromList;

        if (isIB === true) {
            return 'IB'
        } else if (isIB === false && next_ib === true) {
            return 'nextIB'
        } else {
            return 'fullBuild'
        }

    }

    // getHeader() {
    //     const firstIbFromList = this.state.IBGroup[0];
    //     const {isIB, next_ib,} = firstIbFromList;
    //
    //     switch (this.getIbGroupType()) {
    //         case 'IB':
    //             return 'IB';
    //         case 'nextIB':
    //             return 'nextIB';
    //         case 'fullBuild':
    //             return 'fullBuild';
    //     }
    //     return 'Error: IB group is empty'
    // }

    render() {
        // TODO check if {ib - comparison + hidden commits, nextIB - commits of first flavor, release - commits}
        const firstIbFromList = this.state.IBGroup[0];

        if (!firstIbFromList) {
            return (<div><h1>Error: IB group is empty</h1></div>)
        }

        const {isIB, next_ib} = firstIbFromList;
        let statusLabels, comparisonTable, commitPanelProps = null;
        let panelHeader;

        switch (this.getIbGroupType()) {
            case 'IB':
                panelHeader = firstIbFromList.ib_date;
                statusLabels = <StatusLabels/>;
                comparisonTable = <ComparisonTable data={this.state.IBGroup}/>;
                commitPanelProps = {
                    defaultExpanded: false,
                    collapsible: true,
                };
                break;
            case 'nextIB':
                panelHeader = 'nextIB';
                commitPanelProps = {
                    collapsible: false,
                };

                break;
            case 'fullBuild':
                panelHeader = firstIbFromList.release_name;
                commitPanelProps = {
                    collapsible: false,
                };
        }

        return (
            <Panel collapsible
                   defaultExpanded
                   header={panelHeader}>
                <Panel collapsible /* TODO delete it */
                       header={'DEVELOPMENT real data'}>
                    <JSONPretty json={this.state.IBGroup}/>
                </Panel>
                {statusLabels}
                {comparisonTable}
                <Commits commitPanelProps={commitPanelProps}/>
            </Panel>
        )

    }

}

export default IBGroupFrame;

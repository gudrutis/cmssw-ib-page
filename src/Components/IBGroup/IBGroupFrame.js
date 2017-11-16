import React, {Component} from 'react';
import Commits from "./Commits";
import StatusLabels from "./StatusLabels";
import ComparisonTable from "./ComparisonTable";
import {Panel} from "react-bootstrap";
import PropTypes from 'prop-types';

class IBGroupFrame extends Component {
    // TODO
    // static propTypes = {
    //     IBGroup: PropTypes.shape({
    //         base_branch: PropTypes.string.isRequired,
    //         release_name: PropTypes.string.isRequired,
    //         comparisons: PropTypes.arrayOf(PropTypes.object)
    //     })
    // };

    constructor(props) {
        super(props);
        this.state = {
            IBGroup: props.IBGroup
        };
    }

    render() {
        return (
            <Panel collapsible
                   defaultExpanded
                   header={'test'}>
                <StatusLabels/>
                <ComparisonTable
                    data={this.state.IBGroup}/>
                <Commits/>
            </Panel>
        )
    }

}

export default IBGroupFrame;

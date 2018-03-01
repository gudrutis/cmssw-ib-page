import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import IBGroupFrame from './IBGroup/IBGroupFrame';
import {groupAndTransformIBDataList} from '../Utils/processing';
import PropTypes from 'prop-types';

// This class prepossess data before giving to following components
class IBGroups extends Component {
    static propTypes = {
        data: PropTypes.arrayOf(
            PropTypes.shape({
                base_branch: PropTypes.string.isRequired,
                release_name: PropTypes.string.isRequired,
                comparisons: PropTypes.arrayOf(PropTypes.object),
            })
        )
    };

    constructor(props) {
        super(props);
        const {releaseQue, data} = props;
        this.state = {
            data: groupAndTransformIBDataList(data),
            releaseQue
        };
    }

    componentWillReceiveProps(newProps) {
        const {releaseQue, data} = newProps;
        this.setState({
            data: groupAndTransformIBDataList(data),
            releaseQue
        });
    }

    render() {
        const {releaseQue} = this.state;
        return (
            <div>
                <div>
                    {_.map(this.state.data, function (IBGroup) {
                        return <IBGroupFrame key={uuid.v4()} IBGroup={IBGroup} releaseQue={releaseQue}/>
                    })}
                </div>
            </div>
        );
    }

}

export default IBGroups;

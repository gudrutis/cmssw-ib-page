import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import IBGroupFrame from './IBGroup/IBGroupFrame';
import RenderTable from './RenderTable';

function transformDataList(data) {
    // TODO-prep: could be done in python
    let x = _.map(data, getComparisons)
    x = _.flatten(x, true);
    x = _.groupBy(x, 'next_ib')
    let grouped = _.map(_.groupBy(x['false'], 'ib_date'), function (item, key) {
        return {dateKey: key, data: item};
    });
    let result = x['true'] !== undefined ? [x['true']] : [];
    let groupedArray = _.map(_.sortBy(grouped, 'dateKey').reverse(), function (item) {
        return item.data;
    });
    result = result.concat(groupedArray);
    return result;
}

function getComparisons(listEl) {
    return _.map(listEl.comparisons, function (comparison) {
        return comparison;
    });
}

function getAllArchitecturesFromIBGroup(data) {
    let a = _.map(data, function (item) {
        return item.tests_archs;
    });
    a = _.flatten(a, true);
    a = _.uniq(a);
    return a;
}

// This class prepossess data before giving to following components
class IBGroups extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data: transformDataList(props.data)
        };
    }

    componentWillReceiveProps(newProps) {
        this.setState({data: transformDataList(newProps.data)});
    }

    render() {
        return (
            <div>
                {/*<RenderTable/>*/}
                <div>
                    {_.map(this.state.data, function (ibGroup) {
                        return <IBGroupFrame key={uuid.v4()} data={ibGroup}
                                             architectures={getAllArchitecturesFromIBGroup(ibGroup)}/>
                    })}
                </div>
            </div>
        );

    }
}

export default IBGroups;

import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import ShowTable from './ShowTable'
import RenderTable from './RenderTable'

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

class ShowTableWrapper extends Component {
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
                <RenderTable/>
                <div>
                    {_.map(this.state.data, function (item) {
                        return <ShowTable key={uuid.v4()} data={item}/>
                    })}
                </div>
            </div>
        );

        // return (
        //     <div>
        //         {_.map(this.state.data, function (item) {
        //             return <ShowTable key={uuid.v4()} data={item}/>
        //         })}
        //     </div>
        // );

    }
}

export default ShowTableWrapper;

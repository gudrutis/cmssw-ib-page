import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import ShowTable from './ShowTable'
import JSONPretty from 'react-json-pretty';
import $ from 'jquery';

// TODO-PREP preprocesing could be done by python in backend
function transformDataList(data) {
    let x = _.map(data, transformDataListElement)
    x = _.flatten(x, true);
    console.log(x);
    return _.map(_.groupBy(x, 'ib_date'), function (item) {
        return item;
    });
}

function transformDataListElement(listEl) {
    let release_name = listEl.release_name;
    // TODO-PREP, if default page can read reversed order, can be moved
    let reversedComparisons = listEl.comparisons.slice().reverse();
    let position = 0;
    return _.map(reversedComparisons, function (comparison) {
        // TODO-PREP will be fixed in python
        comparison['release_flavor'] = release_name;
        comparison['position'] = position;
        position++;

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
                {_.map(this.state.data, function (item) {
                    return <ShowTable key={uuid.v4()} data={item}/>
                })}
            </div>
        );
    }
}

export default ShowTableWrapper;

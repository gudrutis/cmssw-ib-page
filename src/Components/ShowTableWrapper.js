import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import ShowTable from './ShowTable'
import JSONPretty from 'react-json-pretty';


// TODO preprocesing could be done by python in backend
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
    // let reversedComparisons = listEl.comparisons.reverse();
    let reversedComparisons = listEl.comparisons;
    let x = 0;
    return _.map(reversedComparisons, function (comparison) {
        comparison['release_name'] = release_name;
        comparison['position'] = x;
        x++;
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

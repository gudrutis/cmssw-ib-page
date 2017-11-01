import React, {Component} from 'react';
import uuid from 'uuid';
import _ from 'underscore';
import JSONPretty from 'react-json-pretty';


function transformDataList(data) {
    let x = _.map(data, transformDataListElement)
    x = _.flatten(x, true);
    return _.groupBy(x, 'ib_date') || [];
}

function transformDataListElement(listEl) {
    let release_name = listEl.release_name;
    return _.map(listEl.comparisons, function (comparison) {
        comparison['release_name'] = release_name;
        return comparison;
    })
}

class ShowTable extends Component {
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
        console.log(this.state);
        return (
            <div>
                {_.map(this.state.data, function (item) {
                    return <div key={uuid.v4()}><JSONPretty json={item}/></div>
                })}
            </div>
        );
    }
}

export default ShowTable;

import React, {Component} from 'react';
import uuid from 'uuid'
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Table} from "react-bootstrap";

class ShowTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data
        };
    }

    render() {
        return (
            <Table responsive>
                <thead>
                </thead>
                <tbody>
                <tr>
                    {this.state.ibComparison.map(item => {
                        return (
                            <td key={uuid.v4()}>
                                {/*{item.compared_tags}*/}
                                <JSONPretty json={item}/>
                            </td>)
                    })}
                </tr>
                </tbody>
            </Table>
        );
    }
}

ShowTable.propTypes = {
    data: PropTypes.array,
};

export default ShowTable;

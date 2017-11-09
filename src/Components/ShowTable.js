import React, {Component} from 'react';
import uuid from 'uuid'
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Panel, PanelGroup, Table} from "react-bootstrap";
import _ from 'underscore';

// TODO something wrong with architectures.
// TODO json does not have this info, have no idea where it takes it from
function getAllArchs(data) {
    let a = _.map(data, function (item) {
        return item.tests_archs;
    });
    a = _.flatten(a, true);
    a = _.uniq(a);
    return a;
}

class ShowTable extends Component {
    constructor(props) {
        super(props);
        this.state = {
            ibComparison: props.data,
            archs: getAllArchs(props.data)
        };
    }

    // render() {
    //     return (
    //         <Table responsive>
    //             <thead>
    //             </thead>
    //             <tbody>
    //             <tr>
    //                 {this.state.ibComparison.map(item => {
    //                     return (
    //                         <td key={uuid.v4()}>
    //                             {/*{item.compared_tags}*/}
    //                             <JSONPretty json={[item.release_name, item.ib_date]}/>
    //                         </td>)
    //                 })}
    //             </tr>
    //             </tbody>
    //         </Table>
    //     );
    // }

    render() {
        return (
            <div>
                <JSONPretty json={this.state.archs} />
                <PanelGroup>
                    {this.state.ibComparison.map(item => {
                        return (
                            <Panel collapsible header={item.release_name} key={uuid.v4()}>
                                <JSONPretty json={item}/>
                            </Panel>
                        )
                    })}
                </PanelGroup>
                <hr/>
            </div>
        )
    }
}

ShowTable.propTypes = {
    data: PropTypes.array,
};

export default ShowTable;

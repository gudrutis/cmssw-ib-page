import React, {Component} from 'react';
import uuid from 'uuid'
import PropTypes from 'prop-types';
import JSONPretty from 'react-json-pretty';
import {Label, Panel, PanelGroup, Table} from "react-bootstrap";
import _ from 'underscore';
import $ from 'jquery';

// TODO For test purposes
class RenderTable extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="table-responsive">
                {/*<h1><b>EXAMPLE LAYOUT</b></h1>*/}
                <Table id="#Table1" striped={true} bordered={true} condensed={true} hover>
                    <thead>
                    <tr>
                        <th rowSpan={2}></th>
                        <th colSpan={4}>CMSSW_10_0_X</th>
                        <th colSpan={4}>CMSSW_10_0_ROOT6_X</th>
                        <th colSpan={4}>CMSSW_10_0_DEVEL_X</th>
                        <th colSpan={4}>CMSSW_10_0_CLANG_X</th>
                        <th colSpan={4}>CMSSW_10_0_ASAN_X</th>
                    </tr>
                    <tr>
                        <th class="rotate">slc7 amd64 gcc630</th>
                        <th class="rotate">slc7 arch64 gcc700</th>
                        <th class="rotate">slc6 amd64 gcc630</th>
                        <th class="rotate">slc6 amd64 gcc700</th>
                        <th class="rotate">slc7 amd64 gcc630</th>
                        <th class="rotate">slc7 arch64 gcc700</th>
                        <th class="rotate">slc6 amd64 gcc630</th>
                        <th class="rotate">slc6 amd64 gcc700</th>
                        <th class="rotate">slc7 amd64 gcc630</th>
                        <th class="rotate">slc7 arch64 gcc700</th>
                        <th class="rotate">slc6 amd64 gcc630</th>
                        <th class="rotate">slc6 amd64 gcc700</th>
                        <th class="rotate">slc7 amd64 gcc630</th>
                        <th class="rotate">slc7 arch64 gcc700</th>
                        <th class="rotate">slc6 amd64 gcc630</th>
                        <th class="rotate">slc6 amd64 gcc700</th>
                        <th class="rotate">slc7 amd64 gcc630</th>
                        <th class="rotate">slc7 arch64 gcc700</th>
                        <th class="rotate">slc6 amd64 gcc630</th>
                        <th class="rotate">slc6 amd64 gcc700</th>
                    </tr>
                    </thead>
                    <tbody>
                    <tr>
                        <td><b>Builds</b></td>
                        <td><Label bsStyle="default">5000</Label></td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                    </tr>
                    <tr>
                        <td><b>Unit Tests</b></td>
                        <td><Label bsStyle="default">5000</Label></td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                    </tr>
                    <tr>
                        <td><b>RelVals</b></td>
                        <td><Label bsStyle="default">5000</Label></td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                    </tr>
                    <tr>
                        <td><b>Recall</b></td>
                        <td><Label bsStyle="warning">5000</Label></td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                        <td>5000</td>
                    </tr>
                    </tbody>
                </Table>
            </div>
        )
    }

}

export default RenderTable;



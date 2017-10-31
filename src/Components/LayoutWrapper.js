import React, {Component} from 'react';
import _ from 'underscore';
import JSONPretty from 'react-json-pretty';
import axios from 'axios'
import wrapper from 'axios-cache-plugin'
import uuid from 'uuid'
import SearchBar from './SearchBar'
import ToggleButtonGroupControlled from "./ToggleButtonGroupControlled";
import {Row} from "react-bootstrap";
import FormGroup from "react-bootstrap/es/FormGroup";

// TODO if speed is annoying, try to solve it by
// TODO move to different service
let httpWrapper = wrapper(axios, {
    maxCacheSize: 15,
    ttl: 3 * 60 * 1000
});
httpWrapper.__addFilter(/\.json/);

class LayoutWrapper extends Component {
    constructor(props) {
        super(props);
        console.log(props);
        this.state = {
            nameList: [],
            nameListToShow: [],
            dataList: [],
            all_release_queues: props.structure.all_release_queues
        }
    }

    componentWillMount() {
        this.updateState(this.props);
    }

    componentWillReceiveProps(newProps) {
        if (this.props.match.params.prefix === newProps.match.params.prefix) {
            return 0;
        }
        this.updateState(newProps);
    }

    updateState(props) {
        let pathname = props.match.params.prefix;
        let structure = props.structure;
        let IbFlavorList = _.find(structure, function (val, key) {
            return key === pathname;
        });
        this.setState({nameList: IbFlavorList});
        this.getData(IbFlavorList);
    }

    getData(ibList) {
        this.setState({dataList: []});
        // TODO move to different service
        ibList.map(name => {
            httpWrapper.get(process.env.PUBLIC_URL + '/data/' + name + '.json')
                .then(function (data) {
                    this.setState({dataList: this.state.dataList.concat(data.data)}, function () {
                    })
                }.bind(this))
                .catch(function (error) {
                    console.log(error);
                });
        })
    }

    updateNameListToShow(newNameList) {
        this.setState({nameListToShow: newNameList});
    }

    filterListToShow() {
        console.log(this.state);
        let nameListToShow = this.state.nameListToShow;
        return _.filter(this.state.dataList, function (item) {
            return _.contains(nameListToShow, item.release_name)
        })
    }

    render() {
        return (
            // TODO searcher viewbar
            // TODO viewbar returns selections
            // TODO view get filtered selection
            <div className={'container'}>
                {/*<SearchBar/>*/}
                <ToggleButtonGroupControlled nameList={this.state.nameList}
                                             initSelections={this.state.all_release_queues}
                                             callbackToParent={this.updateNameListToShow.bind(this)}/>
                {this.filterListToShow().map(item => {
                    return <div key={uuid.v4()}><JSONPretty json={item}/></div>
                })}
            </div>
        );
    }

}

export default LayoutWrapper;

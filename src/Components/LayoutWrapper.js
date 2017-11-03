import React, {Component} from 'react';
import _ from 'underscore';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
import ToggleButtonGroupControlled from "./TogglesShowIBFlawors";
import ShowTable from './ShowTableWrapper';

// TODO if speed is an issue, try to solve it by
// TODO move to different service
let httpWrapper = wrapper(axios, {
    maxCacheSize: 15,
    ttl: 3 * 60 * 1000
});
httpWrapper.__addFilter(/\.json/);

class LayoutWrapper extends Component {
    constructor(props) {
        super(props);
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
        // this.setState({dataList: []});
        let callbacks = ibList.map(name => {
            return httpWrapper.get(process.env.PUBLIC_URL + '/data/' + name + '.json');
        });

        // when all callbaks are done, set data
        axios.all(callbacks).then(function (allData) {
            let data = allData.map(response => {
                return response.data;
            });

            // TODO solved
            // let data = allData.map(response => {
            //     // TODO-PREP reversing order, reversing in other please will reverse back and forth the original array.
            //     // TODO .reverse() mutates the original array. So on each request you keep getting flipped array.
            //     let x = $.extend(true, {}, response.data) ;
            //     x.comparisons = response.data.comparisons.slice().reverse();
            //     return x;
            // })

            this.setState({dataList: data});


        }.bind(this));
    }

    updateNameListToShow(newNameList) {
        this.setState({nameListToShow: newNameList});
    }

    filterListToShow() {
        let nameListToShow = this.state.nameListToShow;
        return _.filter(this.state.dataList, function (item) {
            return _.contains(nameListToShow, item.release_name)
        })
    }

    render() {
        return (
            <div className={'container'}>
                <ToggleButtonGroupControlled nameList={this.state.nameList}
                                             initSelections={this.state.all_release_queues}
                                             callbackToParent={this.updateNameListToShow.bind(this)}/>

                <ShowTable data={this.filterListToShow()}/>
            </div>
        );
    }

}

export default LayoutWrapper;

import React, {Component} from 'react';
import _ from 'underscore';
import axios from 'axios';
import wrapper from 'axios-cache-plugin';
import ToggleButtonGroupControlled from "./TogglesShowIBFlawors";
import IBGroups from './IBGroups';
import config from '../config';
import Navigation from "./Navigation";

const {urls} = config;
// TODO if speed is an issue, try to solve it by
// TODO move to different service
let httpWrapper = wrapper(axios, {
    maxCacheSize: 15,
    ttl: 3 * 60 * 1000
});
httpWrapper.__addFilter(/\.json/);

// This class gets data
class LayoutWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameList: [],
            nameListToShow: [],
            dataList: [],
            all_release_queues: props.structure.all_release_queues,
            toLinks: props.toLinks,
            navigationHeight: 50
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
            return httpWrapper.get(urls.dataDir + name + '.json');
        });

        // when all callbacks are done, set data
        axios.all(callbacks).then(function (allData) {
            let data = allData.map(response => {
                return response.data;
            });
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

    getNavigationHeight() {
        const navigationHeight = document.getElementById('navigation').clientHeight;
        this.setState({navigationHeight});
    }

    componentDidMount() {
        window.addEventListener('resize', this.getNavigationHeight.bind(this));
        this.getNavigationHeight();
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.getNavigationHeight.bind(this));
    }

    render() {
        return (
            <div className={'container'} style={{paddingTop: this.state.navigationHeight + 20}}>
                <Navigation toLinks={this.state.toLinks} buttons={
                    <ToggleButtonGroupControlled nameList={this.state.nameList}
                                                 initSelections={this.state.all_release_queues}
                                                 callbackToParent={this.updateNameListToShow.bind(this)}
                    />
                }/>
                <IBGroups data={this.filterListToShow()}/>
            </div>
        );
    }
}

export default LayoutWrapper;

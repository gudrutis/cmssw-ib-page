import React, {Component} from 'react';
import _ from 'underscore';
import ToggleButtonGroupControlled from "./TogglesShowIBFlawors";
import IBGroups from './IBPageComponents/IBGroups';
import { config } from '../config';
import Navigation from "./Navigation";
import TogglesShowIBFlawors from "./TogglesShowArchs";
import {getMultipleFiles} from "../Utils/ajax";

const {urls} = config;

// This class gets data
class IBLayout extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameList: [],
            nameListToShow: [],
            dataList: [],
            all_release_queues: props.structure.all_release_queues,
            toLinks: props.toLinks,
            navigationHeight: 50,
            releaseQue: props.match.params.prefix
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
        let releaseQue = props.match.params.prefix;
        let structure = props.structure;
        let IbFlavorList = _.find(structure, function (val, key) {
            return key === releaseQue;
        });
        this.setState({nameList: IbFlavorList, releaseQue});
        this.getData(IbFlavorList);
    }

    getData(ibList) {
        getMultipleFiles({
            fileUrlList: ibList.map(name => urls.dataDir + name + '.json'),
            onSuccessCallback: function (responsesList) {
                let data = responsesList.map(response => {
                    return response.data;
                });
                this.setState({dataList: data});
            }.bind(this)
        });
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

    getTopPadding() {
        return this.state.navigationHeight + 20
    }

    render() {
        const {releaseQue, toLinks, nameList, all_release_queues} = this.state;
        return (
            <div className={'container'} style={{paddingTop: this.getTopPadding()}}>
                <Navigation toLinks={toLinks}
                            flaworControl={
                                <ToggleButtonGroupControlled nameList={nameList}
                                                             initSelections={all_release_queues}
                                                             callbackToParent={this.updateNameListToShow.bind(this)}
                                />
                            }
                            archControl={
                                <TogglesShowIBFlawors releaseQue={releaseQue}/>
                            }
                />
                <IBGroups data={this.filterListToShow()} releaseQue={releaseQue}/>
            </div>
        );
    }
}

export default IBLayout;

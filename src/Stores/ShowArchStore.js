import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import ShowArchActionTypes from "../Actions/ShowArchActionTypes";
import config from "../config";
import {extractInfoFromArchs} from "../Utils/processing";
import {getMultipleFiles, getSingleFile} from "../Utils/ajax";

const {urls} = config;

class ShowArchStore extends EventEmitter {
    constructor() {
        super();
        this.emptyConfig = {
            'os': [], 'cpu': [], 'compiler': []
        };
        this.allArchs = {
            'os': [], 'cpu': [], 'compiler': []
        };
        this.activeArchs = {
            'os': [], 'cpu': [], 'compiler': []
        };
        this.queConfig = {};
        this.getData();
    }


    toggleArch(archName) {
        // const index = _.findIndex(this.archs, (i) => {
        //     return i.id === archName
        // });
        // this.archs[index].toggle = !this.archs[index].toggle;
        // this.emit("change");
    }

    getData() {
        getMultipleFiles({
            fileUrlList: [urls.releaseStructure, urls.latestIBSummary],
            onSuccessCallback: function (responseList) {
                // console.log(responseList[0].data, responseList[1].data)
                const structureData = responseList[0].data;
                const ibSummary = responseList[1].data;
                const {all_prefixes, all_release_queues} = structureData;
                const {prod_archs} = ibSummary; // TODO
                let archListByRealise = {}, config = {};
                all_release_queues.map((que) => {
                    if (!ibSummary[que]) {
                        return
                    }
                    archListByRealise[que] = Object.keys(ibSummary[que]);
                });
                all_prefixes.map((prefix) => {
                    const realeaseFlavors = structureData[prefix];
                    realeaseFlavors.map((flavor) => {
                        if (!config[prefix]) {
                            config[prefix] = [];
                        }
                        config[prefix] = config[prefix].concat(
                            archListByRealise[flavor]
                        );
                    })
                });
                all_prefixes.map(que => {
                    if (!config[que]) {
                        return
                    }
                    let results = extractInfoFromArchs(config[que]);
                    config[que] = {
                        allArchs: results,
                        activeArchs: Object.assign({}, results)
                    }
                });
                this.queConfig = config;
            }.bind(this)
        });
        getSingleFile({
            fileUrl: urls.latestIBSummary,
            onSuccessCallback: function (response) {
                this.allArchs = extractInfoFromArchs(response.data.all_archs);
                this.activeArchs = Object.assign({}, this.allArchs);
                this.emit("change");
            }.bind(this)
        });
    }

    getAll() {
        return this.allArchs;
    }

    getActive() {
        return this.activeArchs;
    }

    getAllArchsForQue(releaseQue) {
        const archsConfig = this.queConfig[releaseQue];
        if (archsConfig) {
            return archsConfig['allArchs'];
        } else {
            return this.emptyConfig;
        }
    }

    getActiveArchsForQue(releaseQue) {
        const archsConfig = this.queConfig[releaseQue];
        if (archsConfig) {
            return archsConfig['activeArchs'];
        } else {
            return this.emptyConfig;
        }
    }

    setActiveArchs(values) {
        const {field, activeValues, releaseQue} = values;
        this.queConfig[releaseQue]['activeArchs'][field] = activeValues;
        this.emit("change");
    }

    handleActions(action) {
        switch (action.type) {
            case ShowArchActionTypes.TOGGLE_ARCH: {
                this.toggleArch(action.id);
                break;
            }
            case ShowArchActionTypes.LOAD_ARCHS: {
                // TODO
                // this.arch = action.todos;
                this.emit("change");
                break;
            }
            case ShowArchActionTypes.LOAD_ACTIVE_ARCHS: {
                // TODO
                this.emit("change");
                break;
            }
            case ShowArchActionTypes.SET_ACTIVE_ARCHS: {
                this.setActiveArchs(action.values);
                break;
            }
        }
    }
}

const showArchStore = new ShowArchStore;
dispatcher.register(showArchStore.handleActions.bind(showArchStore));
export default showArchStore;

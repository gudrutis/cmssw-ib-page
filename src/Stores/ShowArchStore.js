import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import ShowArchActionTypes from "../Actions/ShowArchActionTypes";
import config from "../config";
import * as axios from "axios";
import wrapper from 'axios-cache-plugin';
import {extractInfoFromArchs} from "../Utils/processing";
import {getMultipleFiles, getSingleFile} from "../Utils/ajax";

const {urls} = config;
// TODO if speed is an issue, try to solve it by
// TODO move to different service
let httpWrapper = wrapper(axios, {
    maxCacheSize: 15,
    ttl: 3 * 60 * 1000
});
httpWrapper.__addFilter(/\.json/);

class ShowArchStore extends EventEmitter {
    constructor() {
        super();
        this.allArchs = {
            'os': [],
            'cpu': [],
            'compiler': []
        };
        this.activeArchs = {
            'os': [],
            'cpu': [],
            'compiler': []
        };
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
            fileUrlList: [urls.latestIBSummary, urls.releaseStructure],
            onSuccessCallback: function (responseList) {
                // console.log(proces(responseList[0].allArchs, responseList[1].allArchs))
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

    setActiveArchs(values) {
        const {field, activeValues} = values;
        this.activeArchs[field] = activeValues;
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

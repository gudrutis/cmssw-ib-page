import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import ShowArchActionTypes from "../actions/ShowArchActionTypes";
import _ from 'underscore';

class ShowArchStore extends EventEmitter {
    constructor() {
        super();
        // TODO should be loaded , not hardcoded
        this.allArchs = [
            'slc6',
            'slc7',
            'aarch64',
            'amd64'
        ];
        this.activeArchs = this.allArchs;
    }

    toggleArch(archName) {
        // const index = _.findIndex(this.archs, (i) => {
        //     return i.id === archName
        // });
        // this.archs[index].toggle = !this.archs[index].toggle;
        // this.emit("change");
    }

    getAll() {
        return this.allArchs;
    }

    getActive() {
        return this.activeArchs;
    }

    setActiveArchs(values){
        this.activeArchs = values;
        this.emit("change")
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

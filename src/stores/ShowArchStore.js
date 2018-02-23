import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import ShowArchActionTypes from "../actions/ShowArchActionTypes";
import _ from 'underscore';

class ShowArchStore extends EventEmitter {
    constructor() {
        super();
        this.archs = [
            {id: 'slc6', toggle: true},
            {id: 'slc7', toggle: true},
            {id: 'aarch64', toggle: true},
            {id: 'amd64', toggle: true}
        ];
    }
    toggleArch(archName) {
        const index = _.findIndex(this.archs, (i) => {
            return i.id === archName
        });
        this.archs[index].toggle = !this.archs[index].toggle;
        this.emit("change");
    }
    getAll() {
        return this.archs;
    }
    getActive() {
        // return this.archs.map(
        //     (arch) =>
        // );
    }
    handleActions(action) {
        switch (action.type) {
            case ShowArchActionTypes.TOGGLE_ARCH: {
                this.toggleArch(action.id);
                break;
            }
            case ShowArchActionTypes.LOAD_ARCHS: {
                this.todos = action.todos;
                this.emit("change");
                break;
            }
        }
    }
}

const showArchStore = new ShowArchStore;
dispatcher.register(showArchStore.handleActions.bind(showArchStore));
export default showArchStore;

import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as config from "../relValConfig";
import {getMultipleFiles} from "../Utils/ajax";

const {urls} = config;

/**
 * Store keeps mapping of RelVal exitcode to its name
 */
class ExitCodeStore extends EventEmitter {
    // TODO show statistics can be calculated here
    constructor() {
        super();
        this.setMaxListeners(50); // The more tables in the page are, the more listeners I need. Looks like its cleaning up properly on unmount, but this was not the right approach
        this._getData();
    }

    _getData() {
        getMultipleFiles({
            fileUrlList: [urls.exitcodes],
            onSuccessCallback: function (responseList) {
                const exitCodes = responseList[0].data;
                this.exitCodes = exitCodes;
                this.emit("change");
            }.bind(this)
        });
    }

    getExitCodeName(exitCode){
        const exitCodeName = this.exitCodes[exitCode];
        if ( exitCode === 0) {
            return "Passed"
        } else if (exitCodeName) {
            return exitCodeName;
        } else {
            return exitCode
        }
    }

    handleActions(action) {
        switch (action.type) {
            // TODO
        }
    }

}

const exitCodeStore = new ExitCodeStore();
dispatcher.register(exitCodeStore.handleActions.bind(exitCodeStore));
export default exitCodeStore;

import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as config from "../relValConfig";
import {getMultipleFiles} from "../Utils/ajax";

const {urls} = config;

class ExitCodeStore extends EventEmitter {
    constructor() {
        console.log("called");
        super();
        this._getData()
    }

    _getData() {
        getMultipleFiles({
            fileUrlList: [urls.exitcodes],
            onSuccessCallback: function (responseList) {
                const exitCodes = responseList[0].data;
                console.log(exitCodes);
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

const exitCodeStore = new ExitCodeStore;
dispatcher.register(exitCodeStore.handleActions.bind(exitCodeStore));
export default exitCodeStore;

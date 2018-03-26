import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import {getMultipleFiles} from "../Utils/ajax";
import * as config from "../relValConfig";

const { urls} = config;

/**
 * Store keeps mapping of RelVal exitcode to its name
 */
class CommandStore extends EventEmitter {
    // TODO show statistics can be calculated here
    constructor(props) {
        super(props);
        this.commandMap = {}
    }

    _getData(hashCodeList) {
        const cmdUrlList = hashCodeList.map(i => {
                const digit1 = i.charAt(0);
                const digitRest = i.substring(1, i.length);
                return urls.relValCmd(digit1, digitRest)
            })
        ;
        getMultipleFiles({
            fileUrlList: cmdUrlList,
            onSuccessCallback: function (responseList) {
                for (let i = 0; i < hashCodeList.length; i++) {
                    const workflow = responseList[i].data;
                    this.commandMap[hashCodeList[i]] = workflow;
                }
                this.emit("change");
            }.bind(this)
        });
    }

    getWorkFlow(hashcode) {
        return this.getWorkFlowList([hashcode])
    }

    getWorkFlowList(hashCodeList) {
        let loadedCmd = [];
        let notLoadedCmd = [];
        for (let i = 0; i < hashCodeList.length; i++) {
            const hashcode = hashCodeList[i];
            if (!(hashcode in this.commandMap)) {
                notLoadedCmd.push(hashcode);
                loadedCmd[i] = i;
            } else {
                loadedCmd[i] = this.commandMap[hashcode];
            }
        }
        if (notLoadedCmd.length > 0) {
            this._getData(notLoadedCmd)
        }
        return loadedCmd;
    }

    handleActions(action) {
        switch (action.type) {
            // TODO
        }
    }

}

const commandStore = new CommandStore;
dispatcher.register(commandStore.handleActions.bind(commandStore));
export default commandStore;

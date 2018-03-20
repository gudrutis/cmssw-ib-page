import {EventEmitter} from "events";
import dispatcher from "../dispatcher";
import * as config from "../relValConfig";
import {getMultipleFiles} from "../Utils/ajax";
import {getStructureFromAvalableRelVals, transforListToObject} from "../Utils/processing";

const {urls} = config;

class RelValStore extends EventEmitter {
    constructor() {
        super();
        this._getStructure()
    }

    _getStructure() {
        getMultipleFiles({
            fileUrlList: [urls.RelvalsAvailableResults, urls.exitcodes],
            onSuccessCallback: function (responseList) {
                const relvalsAvailableResults = responseList[0].data;
                const exitCodes = responseList[1].data;
                this.structure = getStructureFromAvalableRelVals(relvalsAvailableResults);
                this.emit("change");
            }.bind(this)
        });
    }

    _getQueData({date, que}) {
        if (this.structure) {
            try {
                return this.structure[date][que];
            } catch (ex) {
                console.error('Wrong params: ' + date + " | " + que + ' ;', ex);
            }
        }
    }

    getAllArchsForQue({date, que}) {
        const allQueInfo = this._getQueData({date, que});
        if (allQueInfo) {
            return allQueInfo.allArchs
        }
    }

    getAllFlavorsForQue({date, que}) {
        const allQueInfo = this._getQueData({date, que});
        if (allQueInfo) {
            return Object.keys(allQueInfo.flavors);
        }
    }

    getFlavorStructure({date, que}) {
        if (this.structure) {
            try {

                if (!this.structure[date][que].dataLoaded) {
                    let archsToLoad = [];
                    let allRelValIDObject = {};
                    const {flavors} = this.structure[date][que];
                    const allFlavors = this.getAllFlavorsForQue({date, que});
                    allFlavors.map(flavorName => {
                        const archs = Object.keys(flavors[flavorName]);
                        archs.map(arch => {
                            archsToLoad.push(flavors[flavorName][arch]);
                        })
                    });
                    getMultipleFiles({
                        fileUrlList: archsToLoad.map(i => urls.relValsResult(i.arch, i.date, i.que, i.flavor)),
                        onSuccessCallback: function (responseList) {
                            for (let i = 0; i < archsToLoad.length; i++) {
                                const {data} = responseList[i];
                                const {que, date, arch, flavor} = archsToLoad[i];
                                let relValObject = transforListToObject(data);
                                this.structure[date][que].flavors[flavor][arch] = relValObject;
                                const keys = Object.keys(relValObject);
                                keys.map((id) => {
                                    const exitCode = relValObject[id].exitcode;
                                    if (exitCode !== 0) {
                                        allRelValIDObject[id] = {
                                            id,
                                            passed: false,
                                        }
                                    } else if (!allRelValIDObject[id]) {
                                        allRelValIDObject[id] = {
                                            id,
                                            passed: true,
                                        }
                                    }
                                })
                            }
                            let relValKeyList = Object.keys(allRelValIDObject).sort((a, b) => a - b);
                            this.structure[date][que].allRelvals = relValKeyList.map((i, index) => {
                                allRelValIDObject[i]['index'] = index + 1;
                                return allRelValIDObject[i];
                            });
                            this.structure[date][que].dataLoaded = true; //set that data is loaded
                            this.emit("change");
                        }.bind(this)
                    });
                }
                return this.structure[date][que];
            }
            catch (ex) {
                console.error('Wrong params: ' + date + " | " + que + ' ;', ex);
            }
        }
    }

    handleActions(action) {
        switch (action.type) {
            // TODO
        }
    }

}

const relValStore = new RelValStore;
dispatcher.register(relValStore.handleActions.bind(relValStore));
export default relValStore;

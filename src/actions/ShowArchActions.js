import dispatcher from "../dispatcher";
import ShowArchActionTypes from "./ShowArchActionTypes"

export function loadArchs() {
    dispatcher.dispatch({
        type: ShowArchActionTypes.LOAD_ARCHS,
    })
}

export function toggleArch(id) {
    dispatcher.dispatch({
        type: ShowArchActionTypes.TOGGLE_ARCH,
        id: id
    })
}

// TODO action to load data from backend

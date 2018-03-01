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

export function setActiveArchs(values, field, releaseQue) {
    dispatcher.dispatch({
        type: ShowArchActionTypes.SET_ACTIVE_ARCHS,
        values: {
            activeValues: values,
            field,
            releaseQue
        },
    })
}

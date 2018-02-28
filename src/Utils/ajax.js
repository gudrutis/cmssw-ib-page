import * as axios from "axios";
import wrapper from 'axios-cache-plugin';

let httpWrapper = wrapper(axios, {
    maxCacheSize: 50,
    ttl: 5 * 60 * 1000
});
httpWrapper.__addFilter(/\.json/);

export function getSingleFile({fileUrl, onSuccessCallback}) {
    axios.get(fileUrl)
        .then(onSuccessCallback)
        .catch(function (error) {
            console.log(error);
        });
}

export function getMultipleFiles({fileUrlList, onSuccessCallback}) {
    let callbacks = fileUrlList.map(fileUrl => {
        return httpWrapper.get(fileUrl);
    });
    // when all callbacks are done, do something
    axios.all(callbacks)
        .then(onSuccessCallback)
        .catch(function (error) {
            console.log(error);
        });
}

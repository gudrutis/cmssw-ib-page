import * as React from "react";

export const LABEL_COLOR = {
    PASSED_COLOR: 'rgb(92, 184, 92)',
    PASSED_WARNINGS_COLOR: 'rgb(92, 145, 92)',
    PASSED_ERRORS_COLOR: 'rgb(230, 188, 99)',
    FAILED_COLOR: 'rgb(217, 83, 79)',
    NOT_RUN_COLOR: 'rgb(153, 153, 153)',
    DAS_ERROR_COLOR: 'rgb(255, 153, 204)',
    TIMEOUT_COLOR: 'rgb(0, 128, 255)'
};
export const LABELS_TEXT = {
    PASSED: 'Passed',
    FAILED: 'Failed ',
    NOTRUN: 'NotRun',
    DAS_ERROR: 'DAS-Err',
    TIMEOUT: 'TimeOut',
    STARTED: 'Started'
};
export const urls = {
    exitcodes: "https://cms-sw.github.io/exitcodes.json",
    RelvalsAvailableResults: "https://cms-sw.github.io/data/RelvalsAvailableResults.json",
    relValsResult:
        (arch, date, que, flavor) => `https://cms-sw.github.io/data/relvals/${arch}/${date}/${que}_${flavor}.json`
};
export const tooltipDelayInMs = 200;

const _legendConf = [
    {color: LABEL_COLOR.PASSED_COLOR, code: LABELS_TEXT.PASSED, text: 'Passed without error or warning messages'},
    {color: LABEL_COLOR.PASSED_ERRORS_COLOR, code: LABELS_TEXT['PASSED'], text: 'Passed with error messages'},
    {color: LABEL_COLOR.NOT_RUN_COLOR, code: LABELS_TEXT['NOTRUN'], text: 'Not run'},
    {color: LABEL_COLOR.PASSED_WARNINGS_COLOR, code: LABELS_TEXT['PASSED'], text: 'Passed with warning messages'},
    {color: LABEL_COLOR.FAILED_COLOR, code: LABELS_TEXT['FAILED'], text: 'Failed'},
    {color: LABEL_COLOR.DAS_ERROR_COLOR, code: LABELS_TEXT['DAS_ERROR'], text: 'DAS error'},
    {color: LABEL_COLOR.TIMEOUT_COLOR, code: LABELS_TEXT['TIMEOUT'], text: 'Timed Out'}
];
// TODO could be made better
export const legend = [_legendConf.map(i => (
    <p>
        <span style={{backgroundColor: i.color}}
              className="label"><samp>{i.code} </samp></span> {i.text}

    </p>
)),
    <hr/>,
    <p>TODO additional help comes here</p>
];

// Color coding
// Help message config
// Default hidden archs



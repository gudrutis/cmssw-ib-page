import React, {Component} from 'react';
import config from '../../config';
import uuid from 'uuid';
import {getCurrentIbTag} from "../../processing";

const {statusLabelsConfigs} = config;

class StatusLabels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            ib: props.ib,
            ibGroupType: props.ibGroupType,
            showOnlyIbTag: props.showOnlyIbTag
        }
    }

    static formatLabel({glyphicon, name, url}) {
        if (url) {
            return (
                <a href={url} key={uuid.v4()}>
                    <span className={`glyphicon ${glyphicon}`}/>
                    <span> {name} </span>
                </a>
            )
        } else {
            return [
                <span key={uuid.v4()} className={`glyphicon ${glyphicon}`}/>,
                <span key={uuid.v4()}> {name} </span>
            ]
        }
    };

    static defaultFound(config, ib) {
        return {
            name: config.name,
            glyphicon: config.glyphicon ? config.glyphicon : "glyphicon-list-alt",
            url: config.getUrl ? config.getUrl(ib) : undefined
        }
    };

    static defaultInProgress(config) {
        return {
            glyphicon: "glyphicon-refresh",
            name: config.name
        }
    };

    static renderLabel(config, ib) {
        const {key} = config;
        let result = ib[key];
        // if result variable does not follow standard and needs custom interpretation
        if (config.customResultInterpretation) {
            result = config.customResultInterpretation(result);
        }
        let outputConfig;
        if (result === "found") {
            outputConfig = config.ifFound ? config.ifFound(ib) : StatusLabels.defaultFound(config, ib);
        } else if (result === "not-found") {
            outputConfig = config.ifNotFound ? config.ifNotFound : undefined;
        } else if (result === "inprogress" || result === "inProgress") {
            outputConfig = config.ifInProgress ? config.ifInProgress(ib) : StatusLabels.defaultInProgress(config);
        }
        if (outputConfig) {
            return StatusLabels.formatLabel(outputConfig);
        }
    }

    static renderIBTag(ib, ibGroupType) {
        /**
         * non-standart function to show IB tag
         */
        let config = {};
        switch (ibGroupType) {
            case 'IB':
                config = {
                    name: "IB Tag",
                    glyphicon: "glyphicon-tag",
                    url: 'https://github.com/cms-sw/cmssw/tree/' + getCurrentIbTag(ib)
                };
                break;
            case 'nextIB':
                config = {
                    name: "See Branch",
                    glyphicon: "glyphicon-list",
                    url: 'https://github.com/cms-sw/cmssw/commits/' + getCurrentIbTag(ib)
                };
                break;
            case 'fullBuild':
                config = {
                    name: "Release",
                    glyphicon: "glyphicon-tag",
                    url: 'https://github.com/cms-sw/cmssw/releases/tag/' + getCurrentIbTag(ib)
                };
        }
        return StatusLabels.formatLabel(config);
    }

    render() {
        const {ib, showOnlyIbTag, ibGroupType} = this.state;
        if (showOnlyIbTag) {
            return <p>{StatusLabels.renderIBTag(ib, ibGroupType)}</p>
        } else {
            return (
                <p>{[StatusLabels.renderIBTag(ib, ibGroupType), statusLabelsConfigs.map(conf => StatusLabels.renderLabel(conf, ib))]}
                </p>)
        }
    }
}

export default StatusLabels;

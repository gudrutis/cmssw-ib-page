import React, {Component} from 'react';
import config from '../../config';
import uuid from 'uuid';
import MenuItem from "react-bootstrap/es/MenuItem";
import {Dropdown, Glyphicon} from "react-bootstrap";
import {getCurrentIbTag, getDisplayName} from "../../Utils/processing";

const {statusLabelsConfigs} = config;

class StatusLabels extends Component {

    constructor(props) {
        super(props);
        this.state = {
            IBGroup: props.IBGroup,
            ib: props.IBGroup[0],
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

    static defaultFound(config, ib, result) {
        return {
            name: config.name,
            glyphicon: config.glyphicon ? config.glyphicon : "glyphicon-list-alt",
            url: config.getUrl ? config.getUrl(ib, result) : undefined
        }
    };

    static defaultInProgress(config) {
        return {
            glyphicon: "glyphicon-refresh",
            name: config.name
        }
    };

    static renderLabel(config, ib) {
        let status;
        const {key} = config;
        const result = ib[key];
        if (result !== null && typeof result === 'object') {
            status = result.status;
        } else {
            status = result;
        }
        // if result variable does not follow standard and needs custom interpretation
        if (config.customResultInterpretation) {
            status = config.customResultInterpretation(status);
        }
        let outputConfig;
        if (status === "found" || status === "passed") {
            if (result.iterable) {
                let count = 1;
                let configSeperatedByIterable = result.iterable.map(item => {
                    let newConfig = Object.assign({}, config);
                    newConfig.iterateItem = item;
                    newConfig.name = config.name + " " + count;
                    count += 1;
                    return newConfig;
                });
                return configSeperatedByIterable.map((config) => {
                    let outputConfig = config.ifFound ? config.ifFound(ib, result) : StatusLabels.defaultFound(config, ib, result);
                    return StatusLabels.formatLabel(outputConfig);
                })
            } else {
                outputConfig = config.ifFound ? config.ifFound(ib, result) : StatusLabels.defaultFound(config, ib, result);
            }
        } else if (status === "not-found") {
            outputConfig = config.ifNotFound ? config.ifNotFound(ib, result) : undefined;
        } else if (status === "inprogress" || status === "inProgress") {
            outputConfig = config.ifInProgress ? config.ifInProgress(ib, result) : StatusLabels.defaultInProgress(config);
        }
        if (outputConfig) {
            return StatusLabels.formatLabel(outputConfig);
        }
    }

    static renderIBTag(IBGroup, ibGroupType) {
        /**
         * non-standart function to show IB tag
         */
        let config = {};
        switch (ibGroupType) {
            case 'IB':
                config = {
                    name: "IB Tag",
                    glyphicon: "tag",
                    url: 'https://github.com/cms-sw/cmssw/tree/'
                };
                break;
            case 'nextIB':
                config = {
                    name: "See Branch",
                    glyphicon: "list",
                    url: 'https://github.com/cms-sw/cmssw/commits/'
                };
                break;
            case 'fullBuild':
                config = {
                    name: "Release",
                    glyphicon: "tag",
                    url: 'https://github.com/cms-sw/cmssw/releases/tag/'
                };
        }

        if (IBGroup.length > 1) {
            return ([
                <Dropdown id="dropdown-custom-1" bsSize="small">
                    <Dropdown.Toggle>
                        <Glyphicon glyph={config.glyphicon}/>
                        {" " + config.name}
                    </Dropdown.Toggle>
                    <Dropdown.Menu className="super-colors">
                        {IBGroup.map((ib) => {
                            return <MenuItem key={uuid.v4()}
                                href={config.url + getCurrentIbTag(ib)}>{getDisplayName(ib.release_queue)}</MenuItem>
                        })}
                    </Dropdown.Menu>
                </Dropdown>,
                <span>   </span>
            ])
        } else {
            config['glyphicon'] = "glyphicon-" + config['glyphicon'];
            config['url'] = config['url'] + getCurrentIbTag(IBGroup[0]);
            return StatusLabels.formatLabel(config);
        }
    }

    render() {
        const {IBGroup, showOnlyIbTag, ibGroupType, ib} = this.state;
        if (showOnlyIbTag) {
            return <p>{StatusLabels.renderIBTag(IBGroup, ibGroupType)}</p>
        } else {
            return (
                <p>{[StatusLabels.renderIBTag(IBGroup, ibGroupType),
                    statusLabelsConfigs.map(conf => StatusLabels.renderLabel(conf, ib))]}
                </p>)
        }
    }
}

export default StatusLabels;

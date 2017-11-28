import React, {Component} from 'react';
import config from '../../config';

const {statusLabelsConfigs} = config;

class StatusLabels extends Component {

    constructor(props) {
        super(props);
        this.status = {
            ib: props.ib,
        }
    }

    static renderLabel(config, ib) {
        const formatLabel = function ({glyphicon, name, url}) {
            if (url) {
                return (
                    <a href={url}>
                        <span class={`glyphicon ${glyphicon}`}></span>
                        <span> {name} </span>
                    </a>
                )
            } else {
                return [
                    <span class={`glyphicon ${glyphicon}`}></span>,
                    <span> {name} </span>
                ]

            }
        };

        const defaultFound = function (config, ib) {
            return {
                name: config.name,
                glyphicon: config.glyphicon ? config.glyphicon : "glyphicon-list-alt",
                url: config.getUrl ? config.getUrl(ib) : undefined
            }
        };

        const defaultInProgress = function (config) {
            return {
                glyphicon: "glyphicon-refresh",
                name: config.name
            }
        };

        const {key} = config;
        let result = ib[key];

        // if result variable does not follow standard and needs custom interpretation
        if (config.customResultInterpretation) {
            result = config.customResultInterpretation(result);
        }

        let output;
        if (result === "found") {
            output = config.ifFound ? config.ifFound(ib) : defaultFound(config, ib);
        } else if (result === "not-found") {
            output = config.ifNotFound ? config.ifNotFound : undefined;
        } else if (result === "inprogress" || result === "inProgress") {
            output = config.ifInProgress ? config.ifInProgress(ib) : defaultInProgress(config);
        }

        ////  if non standard function
        // if (config.customConfFunction) {
        //     output = config.customConfFunction(ib);
        // }

        if (output) {
            return formatLabel(output);
        }

    }

    render() {
        const {ib} = this.status;
        return <p>{statusLabelsConfigs.map(conf => StatusLabels.renderLabel(conf, ib))}</p>
    }

}

export default StatusLabels;

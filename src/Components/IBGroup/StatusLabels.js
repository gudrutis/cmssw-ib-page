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
                url: config.getUrl? config.getUrl(ib) : undefined
            }
        };

        const defaultInProgress = function (config) {
            return {
                glyphicon: "glyphicon-refresh",
                name: config.name
            }
        };

        const {key} = config;
        const result = ib[key];
        let output;
        if (result === "found") {
            output = config.ifFound ? config.ifFound(ib) : defaultFound(config, ib);
            return formatLabel(output);
        } else if (result === "not-found") {
            return config.ifNotFound ? formatLabel(config.ifNotFound(ib)) : undefined;
        } else if (result === "inprogress") {
            output = config.ifInProgress ? config.ifInProgress(ib) : defaultInProgress(config);
            return formatLabel(output)
        }

        // if not found, return empty
        return output;
    }

    render() {
        const {ib} = this.status;
        return <p>{statusLabelsConfigs.map(conf => StatusLabels.renderLabel(conf, ib))}</p>
    }

}

export default StatusLabels;

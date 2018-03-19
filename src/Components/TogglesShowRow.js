import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import {getDisplayName} from '../Utils/processing';

class TogglesShowRow extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            nameList: props.nameList,
            initSelections: props.initSelections,
            rowName: props.rowName
        };
        this.props.callbackToParent(props.initSelections);
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    onChange = (value) => {
        this.props.callbackToParent(value);
    };

    render() {
        const {initSelections, nameList, rowName} = this.state;
        return (
            <FormGroup>
                <span>{rowName}: </span>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={initSelections} onChange={this.onChange}>
                    {nameList.map(item => {
                        return <ToggleButton key={uuid.v4()} value={item}> {getDisplayName(item)} </ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default TogglesShowRow;

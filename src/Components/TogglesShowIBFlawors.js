import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import {getDisplayName} from '../Utils/processing';

class TogglesShowIBFlawors extends Component {
    constructor(props, context) {
        super(props, context);
        this.state = {
            nameList: props.nameList,
            value: props.initSelections
        };
        this.props.callbackToParent(props.initSelections);
    }

    componentWillReceiveProps(newProps) {
        this.setState(newProps);
    }

    onChange = (value) => {
        this.setState({value});
        this.props.callbackToParent(value);
    };

    render() {
        return (
            <FormGroup>
                <span>Flavor: </span>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.value} onChange={this.onChange}>
                    {this.state.nameList.map(item => {
                        return <ToggleButton key={uuid.v4()} value={item}> {getDisplayName(item)} </ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default TogglesShowIBFlawors;

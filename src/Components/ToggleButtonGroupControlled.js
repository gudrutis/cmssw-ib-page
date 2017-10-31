import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";

class ToggleButtonGroupControlled extends Component {
    constructor(props, context) {
        super(props, context);
        console.log("sitas")
        console.log(props)
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
        console.log(this.state);
        return (
            <FormGroup>
                <ToggleButtonGroup type="checkbox" value={this.state.value} onChange={this.onChange}>
                    {this.state.nameList.map(item => {
                        return <ToggleButton key={uuid.v4()} value={item}> {item} </ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default ToggleButtonGroupControlled;

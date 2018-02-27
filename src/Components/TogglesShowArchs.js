import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import ShowArchStore from "../Stores/ShowArchStore";
import * as  ShowArchActions from "../Actions/ShowArchActions";

class TogglesShowIBFlawors extends Component {
    constructor() {
        super();
        this.getData = this.getData.bind(this);
        this.state = {
            archs: ShowArchStore.getAll(),
            activeArchs: ShowArchStore.getActive()
        }
    }

    componentWillMount() {
        ShowArchStore.on("change", this.getData);
    }

    componentWillUnmount() {
        ShowArchStore.removeListener("change", this.getData);
    }

    getData() {
        this.setState({
            archs: ShowArchStore.getAll(),
            activeArchs: ShowArchStore.getActive()
        })
    }

    onChange = (field) => {
        return (activeArchs) => {
            ShowArchActions.setActiveArchs(activeArchs, field);
        };
    };

    render() {
        return (
            <FormGroup>
                <span> OS: </span>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.activeArchs.os}
                                   onChange={this.onChange('os')}>
                    {this.state.archs.os.map(item => {
                        return <ToggleButton key={uuid.v4()}
                                             value={item}> {item}</ToggleButton>
                    })}
                </ToggleButtonGroup>
                <span> CPU: </span>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.activeArchs.cpu}
                                   onChange={this.onChange('cpu')}>
                    {this.state.archs.cpu.map(item => {
                        return <ToggleButton key={uuid.v4()}
                                             value={item}> {item}</ToggleButton>
                    })}
                </ToggleButtonGroup>
                <span> Compiler: </span>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.activeArchs.compiler}
                                   onChange={this.onChange('compiler')}>
                    {this.state.archs.compiler.map(item => {
                        return <ToggleButton key={uuid.v4()}
                                             value={item}> {item}</ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default TogglesShowIBFlawors;

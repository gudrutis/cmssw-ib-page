import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import ShowArchStore from "../Stores/ShowArchStore";
import * as  ShowArchActions from "../Actions/ShowArchActions";

class TogglesShowArchs extends Component {
    constructor(props) {
        super(props);
        this.doUpdateData = this.doUpdateData.bind(this);
        const {releaseQue} = props;
        this.state = {
            releaseQue: props.releaseQue,
            archs: ShowArchStore.getAllArchsForQue(releaseQue),
            activeArchs: ShowArchStore.getActiveArchsForQue(releaseQue)
        }
    }

    onChange = (field) => {
        const {releaseQue} = this.state;
        return (activeArchs) => {
            ShowArchActions.setActiveArchs(activeArchs, field, releaseQue);
        };
    };

    doUpdateData() {
        const {releaseQue} = this.state;
        this.getData(releaseQue);
    }

    getData(releaseQue) {
        this.setState({
            archs: ShowArchStore.getAllArchsForQue(releaseQue),
            activeArchs: ShowArchStore.getActiveArchsForQue(releaseQue)
        })
    }

    componentWillMount() {
        ShowArchStore.on("change", this.doUpdateData);
    }

    componentWillUnmount() {
        ShowArchStore.removeListener("change", this.doUpdateData);
    }

    componentWillReceiveProps(newProps) {
        this.getData(newProps.releaseQue);
        this.setState(newProps);
    }

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

export default TogglesShowArchs;

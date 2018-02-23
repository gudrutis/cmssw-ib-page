import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import ShowArchStore from "../stores/ShowArchStore";
import * as  ShowArchActions from "../actions/ShowArchActions"

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

    onChange = (activeArchs) => {
        ShowArchActions.setActiveArchs(activeArchs);
    };

    render() {
        return (
            <FormGroup>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.activeArchs} onChange={this.onChange}>
                    {this.state.archs.map(item => {
                        return <ToggleButton key={uuid.v4()}
                                             value={item}> {item}</ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default TogglesShowIBFlawors;

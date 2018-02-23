import {ToggleButton} from "react-bootstrap";
import ToggleButtonGroup from "react-bootstrap/es/ToggleButtonGroup";
import React, {Component} from 'react';
import uuid from 'uuid';
import FormGroup from "react-bootstrap/es/FormGroup";
import ShowArchStore from "../stores/ShowArchStore";

class TogglesShowIBFlawors extends Component {
    constructor() {
        super();
        this.getData = this.getData.bind(this);
        this.state = {
            archs: ShowArchStore.getAll(),
            value: ShowArchStore.getActive()
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

        })
    }

    onChange = (value) => {
        console.log(value);
        this.setState({value});
    };

    render() {
        return (
            <FormGroup>
                <ToggleButtonGroup bsSize="xsmall" type="checkbox" value={this.state.value} onChange={this.onChange}>
                    {this.state.archs.map(item => {
                        return <ToggleButton key={uuid.v4()}
                                             value={item}>{item.id}: {item.toggle.toString()}</ToggleButton>
                    })}
                </ToggleButtonGroup>
            </FormGroup>
        );
    }
}

export default TogglesShowIBFlawors;

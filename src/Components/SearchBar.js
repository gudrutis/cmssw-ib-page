import React, {Component} from 'react';
import {Checkbox, FormGroup} from "react-bootstrap";
import uuid from 'uuid'

class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            checkboxList: [1, 2, 3],
            checkedList: {}
        };
    }

    render() {
        console.log(this.state);
        return (
            <div className={'container'}>
                <FormGroup>
                    {this.state.checkboxList.map(item => {
                        return (<Checkbox key={uuid.v4()}  inline inputRef={ref => {
                            console.log(ref);
                            this.toggleCheckbox(ref) ;
                        } }>{item}{' '}</Checkbox>)
                    })}
                </FormGroup>
            </div>
        );
    }

}

export default SearchBar;

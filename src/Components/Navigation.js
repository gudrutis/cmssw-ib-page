import React, {Component} from 'react';
import Navbar from "react-bootstrap/es/Navbar";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from 'react-router-bootstrap';

class Navigation extends Component {
    constructor() {
        super();
        console.log(this.props)
        this.links = [
            {key:1 ,name: 'IB_1'},
            {key:2 ,name: 'IB_2'},
            {key:3 ,name: 'IB_3'},
            {key:4 ,name: 'IB_4'},
            {key:5 ,name: 'IB_5'},
            {key:6 ,name: 'IB_6'},
            {key:7 ,name: 'IB_7'},
            {key:8 ,name: 'IB_8'},
            {key:9 ,name: 'IB_9'},
            {key:10 ,name: 'IB_10'},
            {key:11 ,name: 'IB_11'},
            {key:12 ,name: 'IB_12'},
            {key:13 ,name: 'IB_13'},
        ]
    }

    render() {
        let renderLinks = this.links.map(item => {
            return (
                <LinkContainer to={'/'+item.name} activeClassName="active">
                    <NavItem>{item.name}</NavItem>
                </LinkContainer>
            )
        });

        return (
            <Navbar inverse fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <p >CMSSW Dashboard</p>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Nav>
                        {renderLinks}
                    </Nav>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default Navigation;

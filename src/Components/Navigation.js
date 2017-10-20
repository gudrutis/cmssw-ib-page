import React, {Component} from 'react';
import Navbar from "react-bootstrap/es/Navbar";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from 'react-router-bootstrap';

class Navigation extends Component {
    constructor() {
        super();
        console.log(process.env.PUBLIC_URL + '/aaaa')
        this.links = [
            {id: 1, name: 'IB_1'},
            {id: 2, name: 'IB_2'},
            {id: 3, name: 'IB_3'},
            {id: 4, name: 'IB_4'},
            {id: 5, name: 'IB_5'},
            {id: 6, name: 'IB_6'},
            {id: 7, name: 'IB_7'},
            {id: 8, name: 'IB_8'},
            {id: 9, name: 'IB_9'},
            {id: 10, name: 'IB_10'},
            {id: 11, name: 'IB_11'},
            {id: 12, name: 'IB_12'},
            {id: 13, name: 'IB_13'},
        ]
    }

    render() {
        let renderLinks = this.links.map(item => {
            return (
                <LinkContainer key={item.id} to={'/' + item.name} activeClassName="active">
                    <NavItem>{item.name}</NavItem>
                </LinkContainer>
            )
        });

        return (
            <Navbar inverse fixedTop={true}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <p>CMSSW Dashboard</p>
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

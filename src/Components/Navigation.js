import React, {Component} from 'react';
import Navbar from "react-bootstrap/es/Navbar";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from 'react-router-bootstrap';
import uuid from 'uuid'

class Navigation extends Component {

    render() {
        let renderLinks = [];
        if (this.props.toLinks) {
            renderLinks = this.props.toLinks.map(item => {
                return (
                    <LinkContainer key={uuid.v4()} to={'/' + item} activeClassName="active">
                        <NavItem>{item}</NavItem>
                    </LinkContainer>
                )
            });
        }

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

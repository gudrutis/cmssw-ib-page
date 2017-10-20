import React, {Component} from 'react';
import Navbar from "react-bootstrap/es/Navbar";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from 'react-router-bootstrap';
import $ from 'jquery'
import uuid from 'uuid'

class Navigation extends Component {
    constructor() {
        super();
        this.state = {
            structure: {},
        }
    }

    componentWillMount() {
        $.ajax({
            //problema su certificatu
            url: process.env.PUBLIC_URL + '/data/structure.json',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({structure: data}, function () {
                    // console.log(this.state)
                })
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }

    render() {
        // console.log('ig');
        let renderLinks = [];
        if (this.state.structure.all_prefixes) {
            // console.log('if');
            renderLinks = this.state.structure.all_prefixes.map(item => {
                return (
                    <LinkContainer key={uuid.v4()} to={'/' + item} activeClassName="active">
                        <NavItem>{item}</NavItem>
                    </LinkContainer>
                )
            });

        }
        console.log(renderLinks)
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

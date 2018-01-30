import React, {Component} from 'react';
import Navbar from "react-bootstrap/es/Navbar";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from 'react-router-bootstrap';
import uuid from 'uuid'
import {Col, Panel, Row} from "react-bootstrap";

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
            <Navbar fixedTop id={'navigation'}>
                <Navbar.Header>
                    <Navbar.Brand>
                        <p>CMSSW IB page</p>
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                </Navbar.Header>
                <Navbar.Collapse>
                    <Row>
                        <Col xs={12}>
                            <Nav>
                                {renderLinks}
                            </Nav>
                        </Col>
                    </Row>
                    <Row>
                        <Col xs={12}>
                            <Nav>
                                {this.props.buttons}
                            </Nav>
                        </Col>
                    </Row>
                </Navbar.Collapse>
            </Navbar>
        );
    }

}

export default Navigation;

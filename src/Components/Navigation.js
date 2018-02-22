import React, {Component} from "react";
import Navbar from "react-bootstrap/es/Navbar";
import NavDropdown from "react-bootstrap/es/NavDropdown";
import Nav from "react-bootstrap/es/Nav";
import NavItem from "react-bootstrap/es/NavItem";
import {LinkContainer} from "react-router-bootstrap";
import uuid from "uuid";
import {Col, Row} from "react-bootstrap";

class Navigation extends Component {

    render() {
        let importantLinks = [];
        let olderLinks = [];

        if (this.props.toLinks) {
            let reversed = this.props.toLinks.slice(0).reverse();
            let renderedLinks = reversed.map(item => {
                return (
                    <LinkContainer key={uuid.v4()} to={'/' + item} activeClassName="active">
                        <NavItem>{item}</NavItem>
                    </LinkContainer>
                )
            });
            importantLinks = renderedLinks.slice(0, 3);
            olderLinks = renderedLinks.slice(3);
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
                    <Nav>
                        {importantLinks}
                        <NavDropdown eventKey={3} title="Older releases" id="basic-nav-dropdown">
                            {olderLinks}
                        </NavDropdown>
                    </Nav>
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

import React, {Component} from 'react';

import './App.css';
import $ from 'jquery'
import {Route, Switch, Redirect} from "react-router-dom";
// import { StickyContainer, Sticky } from 'react-sticky';
// import Sticky from 'react-stickynode';
// import Sticky from 'react-sticky-el';
// TODO: go through imports and check which ones we do not need

//------------------------
// TODO-project set most visited IB-flavor in cookie in then show in the future
// TODO-project create layout .json where layout is defined
// TODO-project {ib - comparison + hidden commits, nextIB - commits of first flavor, release - commits }
// TODO-project from structure.json select which ib flavors show by default

// TODO-architecturu custom icons
// TODO-color coding results with with pop-ups for explanation
// TODO-relvals expanding explation on click

// TODO-project old IB without build data will be cleaned,
// TODO-project if there is no arch, display only commits (that is if it is commits)
// TODO-project color code archs with images
// TODO-project flavors should have name map
// TODO-project collor code builds/test stats

// Componenets
import Navigation from './Components/Navigation'
import Layout from './Components/Layout'

//------------------------------------------
//      Main entry component
//------------------------------------------
class App extends Component {

    constructor() {
        super();
        this.state = {
            structure: {
                all_prefixes: []
            },
        }
    }

    componentWillMount() {
        $.ajax({
            url: process.env.PUBLIC_URL + '/data/structure.json',
            dataType: 'json',
            cache: false,
            success: function (data) {
                this.setState({structure: data}, function () {
                })
            }.bind(this),
            error: function (xhr, status, err) {
                console.log(err);
            }
        });
    }

    defaultPage() {
        if (this.state.structure.default_release) {
            return this.state.structure.default_release;
        } else if (this.state.structure.all_prefixes.length > 0) {
            let lastPrefix = this.state.structure.all_prefixes.length - 1;
            return this.state.structure.all_prefixes[lastPrefix];
        } else {
            return '/'
        }
    }

    render() {
        if (this.state.structure.all_prefixes.length === 0) {
            return (<div/>);
        }
        return (
            /* TODO sticky bibliotekos 'iskisa' pasislepusius inputus, todel nelabai galiui naudoti */
            <div>
                <Navigation toLinks={this.state.structure.all_prefixes}/>
                <Switch>
                    <Redirect exact from="/" to={this.defaultPage()} push/>
                    <Route path="/:prefix"
                           render={(props) => ( <Layout {...props} structure={this.state.structure}/> )}/>
                </Switch>
            </div>
        );
    }
}

export default App;

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

// Componenets
import Navigation from './Components/Navigation'
import LayoutWrapper from './Components/LayoutWrapper'

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
            /* TODO sticky bibliotekos 'iskisa' pasislepusius inputus */
            <div>
                <Navigation toLinks={this.state.structure.all_prefixes}/>
                <Switch>
                    <Redirect exact from="/" to={this.defaultPage()} push/>
                    <Route path="/:prefix"
                           render={(props) => ( <LayoutWrapper {...props} structure={this.state.structure}/> )}/>
                </Switch>
            </div>
        );
    }
}

export default App;

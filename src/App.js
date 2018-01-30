import React, {Component} from 'react';

import './App.css';
import $ from 'jquery'
import {Route, Switch, Redirect} from "react-router-dom";


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

import config from './config';

const {urls} = config;
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
            url: urls.dataDir + 'structure.json',
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
            <div>
                <Switch>
                    <Redirect exact from="/" to={this.defaultPage()} push/>
                    <Route path="/:prefix"
                           render={(props) => (
                               <Layout {...props}
                                       toLinks={this.state.structure.all_prefixes}
                                       structure={this.state.structure}/>)}
                    />
                </Switch>
            </div>
        );
    }
}

export default App;

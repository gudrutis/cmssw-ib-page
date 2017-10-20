import React, {Component} from 'react';

import './App.css';
import $ from 'jquery'
import {Route, Switch, Redirect} from "react-router-dom";

// Componenets
import Navigation from './Components/Navigation'
import LayoutWrapper from './Components/LayoutWrapper'

//------------------------------------------
//      Main entry component
//------------------------------------------

const index = "/CMSSW_9_4_X" ;

class App extends Component {

    constructor() {
        super();
        this.state = {
            structure: {
                all_prefixes: []
            },
        }
    }

    componentDidMount() {
        $.ajax({
            //problema su certificatu
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

    render() {
        // console.log(this.state.structure);
        return (
            <div>
                <Navigation toLinks={this.state.structure.all_prefixes}/>
                <Switch>
                    <Redirect exact from="/" to={index} push/>
                    <Route path="/:prefix" render={(props) => ( <LayoutWrapper {...props} structure={this.state.structure}/> )} />
                </Switch>
            </div>
        );
    }
}

export default App;

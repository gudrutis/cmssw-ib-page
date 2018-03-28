import React, {Component} from 'react';
import './App.css';
import {Redirect, Route, Switch} from "react-router-dom";
import IBLayout from './Components/IBLayout'
import RelValLayout from './Components/RelValLayout'
import config from './config';
import {getSingleFile} from "./Utils/ajax";
import Jumbotron from "react-bootstrap/es/Jumbotron";

//------------------------
// TODO-project set most visited IB-flavor in cookie in then show in the future
// project create layout .json where layout is defined
// project {ib - comparison + hidden commits, nextIB - commits of first flavor, release - commits }

//------------------------------------------
//      Main entry component
//------------------------------------------
const {urls} = config;

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
        getSingleFile({
            fileUrl: urls.releaseStructure,
            onSuccessCallback: function (response) {
                this.setState({structure: response.data})
            }.bind(this)
        });
    }

    defaultPage() {
        const ib = "/ib/";
        if (this.state.structure.default_release) {
            return ib + this.state.structure.default_release;
        } else if (this.state.structure.all_prefixes.length > 0) {
            let lastPrefix = this.state.structure.all_prefixes.length - 1;
            return ib + this.state.structure.all_prefixes[lastPrefix];
        } else {
            return ib
        }
    }

    static errorWrongRoute = (
        <Jumbotron>
            <h1>Incorrect route specified</h1>
            <p>The route needs to be "/release_date/release_que"</p>
        </Jumbotron>
    );

    static containerWraper(content) {
        return (
            <div className={'container'}>{content}</div>
        )
    }

    render() {
        if (this.state.structure.all_prefixes.length === 0) {
            return (<div/>);
        }
        return (
            <div>
                <Switch>
                    <Redirect exact from="/" to={this.defaultPage()} push/>
                    <Route path="/ib/:prefix"
                           render={(props) => (
                               <IBLayout {...props}
                                         toLinks={this.state.structure.all_prefixes}
                                         structure={this.state.structure}/>)}
                    />
                    <Route path="/relVal/:que/:date"
                           render={(props) => (<RelValLayout {...props}/>)}
                    />
                    <Route>
                        {App.containerWraper(App.errorWrongRoute)}
                    </Route>
                </Switch>
            </div>
        );
    }
}

export default App;

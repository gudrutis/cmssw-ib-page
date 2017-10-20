import React, {Component} from 'react';

import './App.css';


// Componenets
import Navigation from './Components/Navigation'
import Layout from './Components/Layout'

//------------------------------------------
//      Main entry component
//------------------------------------------


class App extends Component {

    


    render() {
        return (
            <div>
                <Navigation/>
                <Layout/>
            </div>
        );
    }
}

export default App;

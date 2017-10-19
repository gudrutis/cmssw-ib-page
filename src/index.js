// --- default stylesheets,
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './index.css';
import {HashRouter} from "react-router-dom";

import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
    <HashRouter>
        <App/>
    </HashRouter>, document.getElementById('root'));
registerServiceWorker();

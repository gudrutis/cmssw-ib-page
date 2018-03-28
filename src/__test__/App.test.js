import React from 'react';
import {filterNameList} from "../Utils/processing";
// import App from '../App';

//// problem with models that are not correctly transpiled

// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App/>, div);
// });

it('filterNameList() works', () => {
    const list = ['aaa', 'bbb', 'ccc'];
    expect(filterNameList(list, 'ccc').length).toEqual(1);
    expect(filterNameList(list, ['ccc', 'bbb']).length).toEqual(2);
});

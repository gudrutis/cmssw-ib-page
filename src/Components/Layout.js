import React, {Component} from 'react';
import {Row} from 'react-bootstrap'


class Layout extends Component {
    constructor() {
        super();
    }

    render() {
        let pathname = this.props.match.params.prefix;
        return (
            <div className={'container'}>
                <Row>
                    {pathname}
                    {/*{this.props.route.structure}*/}
                </Row>
            </div>
        );
    }

}

export default Layout;

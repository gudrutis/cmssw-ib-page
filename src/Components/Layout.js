import React, {Component} from 'react';



class Layout extends Component {
    constructor() {
        super();
    }

    render() {
        return (
            <div>
                {this.props.name}
            </div>
        );
    }

}

export default Layout;

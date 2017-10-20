import React, {Component} from 'react';
import _ from 'underscore';
import $ from 'jquery'
import JSONPretty from 'react-json-pretty';

class LayoutWrapper extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nameList: [],
            dataList: []
        }
    }

    componentWillReceiveProps(newProps) {
        let pathname = newProps.match.params.prefix;
        let structure = newProps.structure;
        let tempName = _.find(structure, function (val, key) {
            return key == pathname;
        });

        this.setState({nameList: tempName});
        this.getData(tempName);
    }

    getData(ibList) {
        this.setState({dataList: []});
        ibList.map(name => {
            $.ajax({
                url: process.env.PUBLIC_URL + '/data/' + name + '.json',
                dataType: 'json',
                cache: true,
                success: function (data) {
                    this.setState({dataList: this.state.dataList.concat(data)}, function () {
                    })
                }.bind(this),
                error: function (xhr, status, err) {
                    console.log(err);
                }
            });
        })


    }

    render() {
        return (
            <div className={'container'}>
                {this.state.dataList.map(item => {
                    return <div><JSONPretty json={item}></JSONPretty>
                    </div>
                })}
            </div>
        );
    }

}

export default LayoutWrapper;

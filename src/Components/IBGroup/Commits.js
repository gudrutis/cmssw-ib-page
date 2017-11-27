import React, {Component} from 'react';
import {Panel, Tab, Tabs} from "react-bootstrap";
import {getPreviousIbTag} from "../../processing";

class Commits extends Component {
    // TODO - prop types

    constructor(props) {
        super(props);
        this.state = props;
        this.state = {
            commitPanelProps: props.commitPanelProps,
            ibComparison: props.data
        }
    }

    render() {
        const {commitPanelProps, ibComparison} = this.state;

        return (
            <Panel {...commitPanelProps}
                   header={'Commits'}>
                <Tabs defaultActiveKey={0} animation={false}>
                    {ibComparison.map((ib, pos) => {
                        let commits;
                        if (ib.merged_prs.length === 0) {
                            commits = <p>No new pull requests since {getPreviousIbTag(ib)}</p>
                        } else {
                            commits = (
                                <ul>
                                    {ib.merged_prs.map(pr => {
                                        return (
                                            <li>
                                                <a href={pr.url}>#{pr.number}</a> from
                                                <b> {pr.author_login}</b>: {pr.title}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )
                        }
                        return (
                            <Tab eventKey={pos} title={ib.release_queue}>
                                <br/>
                                {commits}
                            </Tab>
                        )
                    })}
                </Tabs>
            </Panel>
        )
    }

}

export default Commits;

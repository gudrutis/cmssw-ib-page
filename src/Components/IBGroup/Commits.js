import React, {Component} from 'react';
import {Panel, Tab, Tabs} from "react-bootstrap";
import {getDisplayName, getPreviousIbTag} from "../../Utils/processing";
import uuid from 'uuid';

class Commits extends Component {

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
                <Tabs id={uuid.v4()} defaultActiveKey={0} animation={false}>
                    {ibComparison.map((ib, pos) => {
                        let commits;
                        if (ib.merged_prs.length === 0) {
                            commits = <p key={uuid.v4()}>No new pull requests since {getPreviousIbTag(ib)}</p>
                        } else {
                            commits = (
                                <ul>
                                    {ib.merged_prs.map(pr => {
                                        return (
                                            <li key={uuid.v4()}>
                                                <a href={pr.url}>#{pr.number}</a> from
                                                <b> {pr.author_login}</b>: {pr.title}
                                            </li>
                                        )
                                    })}
                                </ul>
                            )
                        }
                        return (
                            <Tab key={uuid.v4()} eventKey={pos} title={getDisplayName(ib.release_queue)}>
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

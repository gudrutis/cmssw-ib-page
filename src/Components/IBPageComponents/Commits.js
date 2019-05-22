import React, {Component} from 'react';
import {Col, MenuItem, Nav, NavDropdown, NavItem, Panel, Row, Tab} from "react-bootstrap";
import {getCurrentIbTag, getDisplayName, getPreviousIbTag} from "../../Utils/processing";
import uuid from 'uuid';
import _ from 'underscore';
import { config } from "../../config";

let {githubCompareTags} = config.urls;

function isFromMergedCommit(pr) {
    if (pr.from_merge_commit === true) {
        return <span className={"glyphicon glyphicon-transfer"}/>
    }
}

function renderCommits(mergedPrs, previousIBTag) {
    let commits;
    if (mergedPrs.length === 0) {
        commits = <p key={uuid.v4()}>No new pull requests since {previousIBTag}</p>
    } else {
        commits = (
            <ul>
                {mergedPrs.map(pr => {
                    return (
                        <li key={uuid.v4()}>
                            <a href={pr.url}>#{pr.number}</a> {isFromMergedCommit(pr)} from<b> {pr.author_login}</b>: {pr.title}
                        </li>
                    )
                })}
            </ul>
        )
    }
    return commits;
}

function renderComparisonLink(repo, startTag, endTag){
        return <p>Compared {repo} between <a href={githubCompareTags(repo, startTag, endTag)}> {startTag} and {endTag}</a></p>;
}

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
        let cmsswTabList = [];
        let cmsswTabPaneList = [];
        let cmsDistDropdownList = [];
        let cmsDistTabPaneList = [];
        _.each(ibComparison, (ib, pos) =>{
            cmsswTabPaneList.push(
                <Tab.Pane key={uuid.v4()} eventKey={pos}>
                    <br/>
                    {renderComparisonLink('cms-sw/cmssw',getPreviousIbTag(ib), getCurrentIbTag(ib))}
                    {renderCommits(ib.merged_prs, getPreviousIbTag(ib))}
                </Tab.Pane>
            );
            cmsswTabList.push(
                <NavItem eventKey={pos}>{getDisplayName(ib.release_queue)}</NavItem>
            );
            // ----
            if (!_.isEmpty(ib.cmsdist_merged_prs)){
                cmsDistDropdownList.push(
                    <MenuItem key={uuid.v4()} header>{getDisplayName(ib.release_queue)}</MenuItem>
                );
                _.each(ib.cmsdist_merged_prs, (pr_list_by_arch, key) => {
                    let tabKey = getDisplayName(ib.release_queue) + key;
                    let [previousCompTag, currentCompTagAfter] =  ib.cmsdist_compared_tags[key].split('..');
                    cmsDistDropdownList.push(
                        <MenuItem key={uuid.v4()} eventKey={tabKey}>{key}</MenuItem>
                    );
                    cmsDistTabPaneList.push(
                        <Tab.Pane key={uuid.v4()} eventKey={tabKey}>
                            <br/>
                            {renderComparisonLink('cms-sw/cmsdist',previousCompTag, currentCompTagAfter)}
                            {/* TODO getPreviousIbTag should be chab */}
                            {renderCommits(pr_list_by_arch, previousCompTag)}
                        </Tab.Pane>
                    );
                })
            }
        });
        return (
            <Panel {...commitPanelProps} header={'Commits'}>
                    <Tab.Container id={uuid.v4()} defaultActiveKey={0} >
                        <Row className="clearfix">
                            <Col sm={12}>
                                <Nav bsStyle="tabs">
                                    {cmsswTabList}
                                    <NavDropdown title="CMS Dist" key={uuid.v4()}>
                                        {cmsDistDropdownList}
                                    </NavDropdown>
                                </Nav>
                            </Col>
                            <Col sm={12}>
                                <Tab.Content animation={false}>
                                    {cmsswTabPaneList}
                                    {cmsDistTabPaneList}
                                </Tab.Content>
                            </Col>
                        </Row>
                    </Tab.Container>
            </Panel>
        )
    }
}

export default Commits;
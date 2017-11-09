import React, {Component} from 'react';

class StatusLabels extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a href="https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-baseline-tests/CMSSW_10_0_X_2017-11-07-1100/slc6_amd64_gcc630/-GenuineIntel/matrix-results"><span
                    class="glyphicon glyphicon-ok-sign"></span><span> Comparison Baseline</span>  </a>
                <a href="https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-dqm-tests/CMSSW_10_0_X_2017-11-07-1100"><span class="glyphicon glyphicon-list-alt"></span><span> DQM Tests</span></a>
            </div>
        )
    }
}

export default StatusLabels;

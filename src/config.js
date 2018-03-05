import {getCurrentIbTag} from "./Utils/processing";

export default {
    tooltipDelayInMs: 200,
    urls: {
        issues: [
            {name: 'CMSSW', url: 'https://github.com/cms-sw/cmssw/issues'},
            {name: 'CMSDIST', url: 'https://github.com/cms-sw/cmsdist/issues'},
            {name: 'CMSSW IB page ', url: 'https://github.com/cms-sw/cmssdt-ib/issues'}
        ],
        q_a: (arch, release_name) => '/SDT/cgi-bin/newQA.py?arch=' + arch + '&release=' + release_name,
        dataDir: "/SDT/html/data/",
        releaseStructure: "/SDT/html/data/structure.json",
        latestIBSummary: "/SDT/html/data/LatestIBsSummary.json",
        buildOrUnitTestUrl: "/SDT/cgi-bin/showBuildLogs.py/",
        scramDetailUrl: "http://cms-sw.github.io/scramDetail.html#",
        relvalLogDetailUrl: "https://cms-sw.github.io/relvalLogDetail.html#",
        fwliteUrl: "/SDT/cgi-bin/showBuildLogs.py/fwlite/",
        showAddOnLogsUrls: "/SDT/cgi-bin//showAddOnLogs.py/",
        relVals: "https://cms-sw.github.io/relvalLogDetail.html#",
        commits: "https://github.com/cms-sw/cmsdist/commits/"
    },
    colorCoding: {
        prodColor: '#5cb85c', // production arch
        alternatingColors: [
            '#777',
            '#999',
            '#CCC'
        ],
        defaultColor: '#555', // default
    },
    statusLabelsConfigs: [
        // functions  [found|not-found|inProgress]
        /**
         {
             key: "lizard", (data key in JSON)
             name: "Complexity metrics" (text shown)
             ifFound: function(),
             ifNotFound:  function() (default - no output),
             ifInProgress: function() (default - in progress),
             getUrl: function()
         }
         default icons:
         not-found - empty
         inprogress - glyphicon-refresh
         found - glyphicon-list-alt

         example
         // ifFound: function (ib) {
            //     return {
            //         name: this.name,
            //         glyphicon: this.glyphicon,
            //         url: this.getUrl(ib)
            //     };
            // },
         */
        // IB Tag is in StatusLabel  component
        {
            //add_comp_baseline_tests_link
            key: "comp_baseline",
            glyphicon: "glyphicon-ok-sign",
            glyphiconWarning: "glyphicon-warning-sign",
            name: "Comparison Baseline",
            getUrl: function (ib) {
                return ib.comp_baseline;
            },
            customResultInterpretation: function (result) {
                if (result === "not-found") {
                    return "not-found";
                } else if (result === "inprogress") {
                    return "inprogress";
                } else if (result) {
                    return "found";
                }
            },
            ifFound: function (ib) {
                const status = ib.comp_baseline_state;
                if (status === "ok") {
                    return {
                        name: this.name,
                        glyphicon: this.glyphicon,
                        url: this.getUrl(ib)
                    };
                } else {
                    return {
                        name: this.name,
                        glyphicon: this.glyphiconWarning,
                        url: this.getUrl(ib)
                    };
                }
            },
        },
        {
            //add_dqm_tests_link
            key: "dqm_tests",
            name: "DQM Tests",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-dqm-tests/" + getCurrentIbTag(ib);
            }
        },
        {
            //add_hlt_tests_link
            key: "hlt_tests",
            name: "HLT Validation",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/HLT-Validation/" + getCurrentIbTag(ib);
            }
        },
        {
            //add_valgrind_tests_link
            key: "valgrind",
            name: "Valgrind",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/valgrind/" + getCurrentIbTag(ib);
            }
        },
        {
            //add_lizard_tests_link
            // Lizard
            key: "lizard",
            name: "Code complexity metrics",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/lizard/" + getCurrentIbTag(ib);
            }
        },
        {
            //add_igprof_tests_link
            key: "igprof",
            name: "IgProf",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/igprof/" + getCurrentIbTag(ib);
            }
        },
        {
            name: "Static Analyzer",
            key: "static_checks_v2",
            getUrl: function (ib, result) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-static-analysis/"
                    + getCurrentIbTag(ib) + '/' + result.arch + '/llvm-analysis/index.html';
            },
        },
        {
            name: "SA thread unsafe",
            key: "static_checks_v2",
            getUrl: function (ib, result) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-static-analysis/"
                    + getCurrentIbTag(ib) + '/' + result.arch + "/reports/modules2statics.txt";
            },
            ifInProgress: () => {
                return null;
            }
        },
        {
            // This config produce multiple labels
            // iterateItem - will be added from result to a config
            name: "SA failures",
            key: "static_checks_failures",
            glyphicon: "glyphicon-alert",
            getUrl: function (ib, result) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-static-analysis/"
                    + getCurrentIbTag(ib) + '/' + result.arch + "/" + this.iterateItem;
            },
            ifInProgress: () => {
                return null;
            },
            ifFound: function (ib, result) {
                return {
                    name: this.name,
                    glyphicon: this.glyphicon,
                    url: this.getUrl(ib, result)
                };
            }
        },
        {
            name: "SA thread unsafe EventSetup products",
            key: "static_checks_v2",
            getUrl: function (ib, result) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/ib-static-analysis/"
                    + getCurrentIbTag(ib) + '/' + result.arch + "/reports/tlf2esd.txt";
            },
            ifInProgress: () => {
                return null;
            }
        },
        {
            // NOTE JSON usually empty
            glyphicon: "glyphicon-warning-sign",
            key: "RVExceptions",
            name: "Relvals Exceptions Summary",
            getUrl: function (ib) {
                return "http://cms-sw.github.io/relvalsExceptions.html#" + getCurrentIbTag(ib);
            }
        },
        {
            name: "Material budget",
            key: "material_budget_v2",
            getUrl: function (ib, result) {
                return "/SDT/jenkins-artifacts/material-budget/" + getCurrentIbTag(ib) + '/' + result.arch;
            }
        },
        {
            name: "Material budget comparison",
            key: "material_budget_comparison",
            glyphicon: "glyphicon-ok-sign",
            glyphiconWarning: "glyphicon-warning-sign",
            getUrl: function (ib, result) {
                return "/SDT/jenkins-artifacts/material-budget/" + getCurrentIbTag(ib) + '/' + result.arch + "/comparison";
            },
            ifFound: function (ib, result) {
                const results = result.results;
                if (results === "ok") {
                    return {
                        name: this.name,
                        glyphicon: this.glyphicon,
                        url: this.getUrl(ib, result)
                    };
                } else {
                    return {
                        name: this.name,
                        glyphicon: this.glyphiconWarning,
                        url: this.getUrl(ib, result)
                    };
                }
            }
        }
    ]
};

import {getCurrentIbTag} from "./processing";

export default {
    tooltipDelayInMs: 200,

    urls: {
        q_a: (arch, release_name) => '/SDT/cgi-bin/newQA.py?arch=' + arch + '&release=' + release_name,
        dataDir: "/SDT/html/data/",
        buildOrUnitTestUrl: "/SDT/cgi-bin/showBuildLogs.py/",
        scramDetailUrl: "http://cms-sw.github.io/scramDetail.html#",
        relvalLogDetailUrl: "https://cms-sw.github.io/relvalLogDetail.html#",
        fwliteUrl: "/SDT/cgi-bin/showBuildLogs.py/fwlite/",
        showAddOnLogsUrls: "/SDT/cgi-bin//showAddOnLogs.py/",
        relVals: ( type, file, arch, ib ) => '' // TODO finish
    },
    archShowCodes: {
        color: {
            slc7: "#20e41a",
            slc6: "#48c9b0",
            amd64: "#20e41a",
            aarch64: "#f0b27a",
            gcc700: "#f5b7b1",
            gcc630: "#20e41a"
        }
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
        // TODO IB Tag
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
            //add_static_analyzer_link
            //TODO non-standart method, needs to be able to creat multiple labels
            //  Modules to thread unsafe statics
            //   Modules to thread unsafe EventSetup products
            //  produce/analyze/filter()
            name: "Static Analyzer(TODO)",
            key: "static_checks",
            // getUrl: function (ib) {
            //     return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/igprof/" + getCurrentIbTag(ib);
            // }
            customResultInterpretation: function (result) {
                if (result === "not-found") {
                    return "not-found";
                } else if (result === "inprogress") {
                    return "inprogress";
                } else if (result) {
                    return "found";
                }
            }
        },
        {
            // NOTE JSON usually empty
            //add_rv_exceptions_link
            glyphicon: "glyphicon-warning-sign",
            key: "RVExceptions",
            name: "Relvals Exceptions Summary",
            getUrl: function (ib) {
                return "http://cms-sw.github.io/relvalsExceptions.html#" + getCurrentIbTag(ib);
            }
        },
        {
            //add_material_budget_tests_link
            // NOTE JSON usually empty
            //TODO non-standart method, needs to be able to creat multiple labels
            key: "material_budget"
        }

    ]
};

import {getCurrentIbTag} from "./processing";

export default {
    tooltipDelayInMs: 200,

    urls: {
        "buildOrUnitTestUrl": "https://cmssdt.cern.ch/SDT/cgi-bin/showBuildLogs.py/",
        "scramDetailUrl": "http://cms-sw.github.io/scramDetail.html#",
        "relvalLogDetailUrl": "https://cms-sw.github.io/relvalLogDetail.html#",
        "fwliteUrl": "https://cmssdt.cern.ch/SDT/cgi-bin/showBuildLogs.py/fwlite/",
        "showAddOnLogsUrls": "https://cmssdt.cern.ch/SDT/cgi-bin//showAddOnLogs.py/"
    },
    archShowCodes: {
        "color": {
            "slc7": "#20e41a",
            "slc6": "#48c9b0",
            "amd64": "#20e41a",
            "aarch64": "#f0b27a",
            "gcc700": "#f5b7b1",
            "gcc630": "#20e41a"
        }
    },
    statusLabelsConfigs: [
        // functions  [found|not-found|inProgress]
        /**
         {
             key: "lizard",
             ifFound: function(),
             ifNotFound:  function() (default - no output),
             ifInProgress: function() (default - in progress)
         }
         */

        {
            //add_comp_baseline_tests_link
            key: "comp_baseline",
        },
        {
            //add_dqm_tests_link
            key: "dqm_tests",
        },
        {
            //add_hlt_tests_link
            key: "hlt_tests",
        },
        {
            //add_valgrind_tests_link
            key: "valgrind",
        },
        {
            //add_lizard_tests_link
            // Lizard
            key: "lizard",
            name: "Code complexity metrics",
            glyphicon: "glyphicon-list-alt",
            getUrl: function (ib) {
                return "https://cmssdt.cern.ch/SDT/jenkins-artifacts/lizard/" + getCurrentIbTag(ib);
            }
            // ifFound: function (ib) {
            //     return {
            //         name: this.name,
            //         glyphicon: this.glyphicon,
            //         url: this.getUrl(ib)
            //     };
            // },

        },
        {
            //add_igprof_tests_link
            key: "igprof",
        },
        {
            //add_static_analyzer_link
            key: "static_checks",
        },
        {
            //add_rv_exceptions_link
            key: "RVExceptions",
        },
        {
            //add_material_budget_tests_link
            key: "material_budget"
        }

    ]
};

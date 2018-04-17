import React from 'react';
import {filterNameList, filterRelValStructure} from "../Utils/processing";
// import App from '../App';

/*
 * problem with models that are not correctly transpiled
 */
// it('renders without crashing', () => {
//     const div = document.createElement('div');
//     ReactDOM.render(<App/>, div);
// });

it('filterNameList() works', () => {
    const list = ['aaa', 'bbb', 'ccc'];
    expect(filterNameList(list, 'ccc').length).toEqual(1);
    expect(filterNameList(list, ['ccc', 'bbb']).length).toEqual(2);
});

const structure = {
    "flavors": {
        "DEVEL_X": {
            "slc6_amd64_gcc630": {
                "1.0": {
                    "exitcode": 1,
                    "id": "1.0",
                },
                "2.0": {
                    "exitcode": 1,
                    "id": "2.0",
                },
                "3.0": {
                    "exitcode": 1,
                    "id": "3.0",
                },
                "4.17": {
                    "exitcode": 1,
                    "id": "4.17",
                }
            }
        },
        "CLANG_X": {
            "slc6_amd64_gcc630": {
                "1.0": {
                    "exitcode": 0,
                    "id": "1.0",
                },
                "2.0": {
                    "exitcode": 0,
                    "id": "2.0",
                },
                "3.0": {
                    "exitcode": 1,
                    "id": "3.0",
                },
                "4.17": {
                    "exitcode": 0,
                    "id": "4.17",
                }
            }
        },
        "X": {
            "slc6_amd64_gcc630": {
                "1.0": {
                    "exitcode": 1,
                    "id": "1.0",
                },
                "2.0": {
                    "exitcode": 1,
                    "id": "2.0",
                },
                "3.0": {
                    "exitcode": 0,
                    "id": "3.0",
                },
                "4.17": {
                    "exitcode": 0,
                    "id": "4.17",
                }
            },
            "slc7_amd64_gcc630": {
                "1.0": {
                    "exitcode": 1,
                    "id": "1.0",
                },
                "2.0": {
                    "exitcode": 1,
                    "id": "2.0",
                },
                "3.0": {
                    "exitcode": 1,
                    "id": "3.0",
                },
                "4.17": {
                    "exitcode": 1,
                    "id": "4.17",
                }
            },
        },
    },
    "allRelvals": [
        {
            "id": "1.0",
        },
        {
            "id": "2.0",
        },
        {
            "id": "3.0",
        },
        {
            "id": "4.17",
        }
    ]
};

it('filterRelValStructure() works on arch level filter', () => {
        const selectedStatus = [
            "failed",
            // "passed"
        ];
        const selectedArchs_1 = [
            "slc6_amd64_gcc630",
            // "slc7_amd64_gcc630"
        ];
        const selectedFlavors_1 = [
            // "DEVEL_X",
            // "CLANG_X",
            "X"
        ];
        const res = filterRelValStructure({
            structure,
            selectedArchs: selectedArchs_1,
            selectedFlavors: selectedFlavors_1,
            selectedStatus
        });
        expect(res.length).toEqual(2);
    }
);

it('filterRelValStructure() works on flavor level filter', () => {
        const selectedStatus = [
            "failed",
            // "passed"
        ];
        const selectedArchs_1 = [
            "slc6_amd64_gcc630",
            // "slc7_amd64_gcc630"
        ];
        const selectedFlavors_1 = [
            // "DEVEL_X",
            "CLANG_X",
            "X"
        ];
        const res = filterRelValStructure({
            structure,
            selectedArchs: selectedArchs_1,
            selectedFlavors: selectedFlavors_1,
            selectedStatus
        });
        expect(res.length).toEqual(3);
    }
);


/*
 Example structure
*/

// const structure_back = {
//     "flavors": {
//         "ROOT6_X": {
//             "slc6_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             }
//         },
//         "DEVEL_X": {
//             "slc6_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             }
//         },
//         "X": {
//             "slc7_aarch64_gcc700": {
//                 "1.0": {
//                     "exitcode": 1,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 1,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//             "slc7_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 1,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 1,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 1,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 1,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//             "slc6_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//             "slc7_amd64_gcc700": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//             "slc6_amd64_gcc700": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//         },
//         "ROOT612_X": {
//             "slc7_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//             "slc6_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 0,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 0,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 0,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 0,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             },
//         },
//         "CLANG_X": {
//             "slc6_amd64_gcc630": {
//                 "1.0": {
//                     "exitcode": 1,
//                     "id": "1.0",
//                     "known_error": 0,
//                 },
//                 "2.0": {
//                     "exitcode": 1,
//                     "id": "2.0",
//                     "known_error": 0,
//                 },
//                 "3.0": {
//                     "exitcode": 1,
//                     "id": "3.0",
//                     "known_error": 0,
//                 },
//                 "4.17": {
//                     "exitcode": 1,
//                     "id": "4.17",
//                     "known_error": 0,
//                 }
//             }
//         }
//     },
//     "allRelvals": [
//         {
//             "id": "1.0",
//         },
//         {
//             "id": "2.0",
//         },
//         {
//             "id": "3.0",
//         },
//         {
//             "id": "4.17",
//         }
//     ]
// };

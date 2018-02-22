import _ from 'underscore';

/**
 *  In this modules functions for pre-processing data are stored.
 */

export function groupAndTransformIBDataList(data) {
    // TODO-prep: could be done in python
    let x = _.map(data, _getComparisons);
    x = _.flatten(x, true);
    x = _.groupBy(x, 'next_ib');
    let grouped = _.map(_.groupBy(x['false'], 'ib_date'), function (item, key) {
        return {dateKey: key, data: item};
    });
    let result = x['true'] !== undefined ? [x['true']] : [];
    let groupedArray = _.map(_.sortBy(grouped, 'dateKey').reverse(), function (item) {
        return item.data;
    });
    result = result.concat(groupedArray);
    return result;
}

function _getComparisons(listEl) {
    return _.map(listEl.comparisons, function (comparison) {
        return comparison;
    });
}

export function getAllArchitecturesFromIBGroup(IBGroup) {
    let a = _.map(IBGroup, function (item) {
        return item.tests_archs;
    });
    a = _.flatten(a, true);
    a = _.uniq(a);
    return a;
}

export function getAllArchitecturesFromIBGroupByFlavor(IBGroup) {
    let a = _.map(IBGroup, function (ib) {
        return {
            flavor: ib.release_queue,
            name: ib.release_name,
            archs: ib.tests_archs,
            cmsdistTags: ib.cmsdistTags,
            current_tag: getCurrentIbTag(ib)
        };
    });
    a = _.flatten(a, true);
    a = _.uniq(a);
    return a;
}

/**
 * general utility functions
 */

export function getCurrentIbTag(ib) {
    return ib.compared_tags.split("-->")[1]
}

export function getPreviousIbTag(ib) {
    return ib.compared_tags.split("-->")[0]
}

export function checkIfTableIsEmpty({fieldsToCheck = [], IBGroup = []}) {
    for (let i = 0; i < IBGroup.length; i++) {
        let ib = IBGroup[i];
        for (let i = 0; i < fieldsToCheck.length; i++) {
            let field = fieldsToCheck[i];
            if (!(ib[field] === undefined || ib[field].length === 0 )) {
                return false // there are some data in the table
            }
        }
    }
    return true // fields are empty
}

export function checkIfCommitsAreEmpty({IBGroup = []}) {
    for (let i = 0; i < IBGroup.length; i++) {
        let ib = IBGroup[i];
        if (!(ib['merged_prs'] === undefined || ib['merged_prs'].length === 0 )) {
            return false // there are commits
        }
    }
    return true // there are no commits
}

// keeping short display name for an object
let displayNameCache = {};

export function getDisplayName(name) {
    // TODO could be writen as service and load json
    let lookUp = displayNameCache[name];
    if (lookUp) {
        return lookUp;
    } else {
        let re = /^[a-zA-Z]+_[0-9]+_[0-9]+_/g; // will match 'CMSSW_10_0_'
        let result = name.replace(re, '');
        if (result === 'X') {
            displayNameCache[name] = 'DEFAULT';
            return 'DEFAULT'
        } else {
            displayNameCache[name] = result;
            return result;
        }

    }
}



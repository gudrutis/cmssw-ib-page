import _ from 'underscore';

/**
 *  In this modules functions for pre-processing data are stored.
 */

export function groupAndTransformIBDataList(data) {
    // TODO-prep: could be done in python
    let x = _.map(data, _getComparisons)
    x = _.flatten(x, true);
    x = _.groupBy(x, 'next_ib')
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



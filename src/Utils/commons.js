import queryString from 'query-string';

export function goToLinkWithoutHistoryUpdate(history) {
    history.replace(history.location);
}

export function partiallyUpdateLocationQuery(location, queryKey, queryValues) {
    let currentQuery = queryString.parse(location.search);
    currentQuery[queryKey] = queryValues;
    location.search = queryString.stringify(currentQuery);
    return location;
}


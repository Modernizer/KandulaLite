define(function (require) {

    //This function agregate duplicate URLS
    function findUniqueUrls(orginalQueries) {
        var newQueries = [],
            origLen = orginalQueries.length,
            found, x, y;

        for (x = 0; x < origLen; x++) {
            found = undefined;
            for (y = 0; y < newQueries.length; y++) {
                if (compareRequestObjects(orginalQueries[x], newQueries[y])) {
                    found = true;
                    break;
                }
            }
            if (!found) {
                orginalQueries[x].duplicateQueries = [];
                newQueries.push(orginalQueries[x]);
            }
            else {
                //this is a duplicate. The query that it is a duplicate of will have a list of the duplicated queries. Add to this list
                newQueries[y].duplicateQueries.push(orginalQueries[x]);

                newQueries[y].selectClause = mergeSelectClause(newQueries[y], orginalQueries[x]);
                y = y * 1;
            }
        }

        return newQueries;
    }

    function mergeSelectClause(query1, query2) {
        if (query2.selectClause === null) {
            return query1.selectClause;
        }
            

        for (var i = 0; i < query2.selectClause.propertyPaths.length; i++) {
            if (query1.selectClause.propertyPaths.indexOf(query2.selectClause.propertyPaths[i]) === -1) {
                query1.selectClause.propertyPaths.push(query2.selectClause.propertyPaths[i]);
            }
        }
        return query1.selectClause;
    }

    function compareRequestObjects(requestObjOne, requestObjTwo) {
        return (requestObjOne.resourceName === requestObjTwo.resourceName) &&
               (requestObjOne.orderByClause === requestObjTwo.orderByClause) &&
               (requestObjOne.skipCount === requestObjTwo.skipCount) &&
               (requestObjOne.takeCount === requestObjTwo.takeCount) &&
               isTheParametersEqual(requestObjOne, requestObjTwo) &&
               compareIfWhereClauseExists(requestObjOne.wherePredicate, requestObjTwo.wherePredicate);
    }

    function isTheParametersEqual(requestObjOne, requestObjTwo) {
        var param1 = requestObjOne.parameters;
        for (var propertyName in requestObjTwo.parameters) {
            if (requestObjOne.parameters[propertyName] !== requestObjTwo.parameters[propertyName]) {
                return false;
            }
                
        }
        for (propertyName in requestObjOne.parameters) {
            if (requestObjTwo.parameters[propertyName] !== requestObjOne.parameters[propertyName]) {
                return false;
            }
                
        }
        return true;
    }

    function compareIfWhereClauseExists(whereClauseOne, whereClauseTwo) {
        //if where predicate exists 
        if ((whereClauseOne !== null && whereClauseOne.length > 0) || (whereClauseTwo !== null && whereClauseTwo.length > 0)) {
            return false;
        } 

        return true;
    }

    return {
        aggregateApiRequests: function (queries) {
            var resourceName, wherePredicate, orderByClause,
                selectClause, skipCount, takeCount,
                expandClause, parameters;

            var requestObjectsWittoutDup = findUniqueUrls(queries);

            return requestObjectsWittoutDup;
        }
    };
});
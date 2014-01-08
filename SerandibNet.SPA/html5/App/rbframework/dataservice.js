define(function (require) {
    var apiAggregation = require('rbframework/apiaggregation'),
        breezejs = require('rbframework/breeze'),
        user = require('rbframework/user'),
        system = require('durandal/system'),
        apiBaseUrl = 'https://api.rambase.net/';

    function addAccessTokenAndFormatToUrl(url) {
        var accessToken = user.getAccessToken();
        if (url.indexOf("?") === -1) {
            return apiBaseUrl + url + '?$access_token=' + accessToken + '&$format=json';
        }
        else {
            return apiBaseUrl + url + '&$access_token=' + accessToken + '&$format=json';
        }
    }

    function notifyCallerAboutQueryCompleted(query, data, hasError) {
        if (hasError === true) {
            query.deferred.reject(data);
            //if this query contains a list of duplicate queries, we also need to notify the callers of these duplicate queries
            if (query.duplicateQueries !== undefined) {
                for (var i = 0; i < query.duplicateQueries.length; i++) {
                    query.duplicateQueries[i].deferred.reject(data);
                }
            }
        }
        else {
            query.deferred.resolve(data);
            //if this query contains a list of duplicate queries, we also need to notify the callers of these duplicate queries
            if (query.duplicateQueries !== undefined) {
                for (var j = 0; j < query.duplicateQueries.length; j++) {
                    query.duplicateQueries[j].deferred.resolve(data);
                }
            }
        }
    }

    return {
        executeActivateQuery: function (activateQueries, query, dontAllowBatch) {
            //Add a query that will execute when an application is activated
            //and all components are loaded.
            query.deferred = Q.defer();
            query.dontAllowBatch = dontAllowBatch;

            activateQueries.push(query);

            return query.deferred.promise;
        },
        executeDeactivateQuery: function (deactivateQueries, query) {
            //Add a query that will execute when an application is deactivated
            deactivateQueries.push(query);
        },
        executeQuery: function (query) {
            //execute a query immeediatly
            var ms = new breezejs.MetadataStore();
            var fullUri = ms.toQueryString(query);
            fullUri = addAccessTokenAndFormatToUrl(fullUri);
            var request = $.ajax({ url: fullUri });
            request.done(function (data) {
                query.deferred.resolve(data);
                notifyCallerAboutQueryCompleted(query, data, false);
            });
            request.fail(function (error) {
                alert("erorr in executeQuery in dataservice.js: " + error.statusText);
                notifyCallerAboutQueryCompleted(query, error, true);
            });

            return query.deferred.promise;
        },
        executeBatchQuery: function (queries, duplicateQueries) {
            //Execute a list of queries as a batch - only one ajax call to the server.
            //var url = apiBaseUrl + "batch?$format=json"+accessToken;
            var url = addAccessTokenAndFormatToUrl('batch');
            var ms = new breezejs.MetadataStore();
            for (var i = 0; i < queries.length; i++) {
                var resourceUri = ms.toQueryString(queries[i]);
                url += "&resource" + (i + 1) + "=" + encodeURIComponent(resourceUri);
                queries[i].batchId = "resource" + (i + 1);
            }

            var request = $.ajax({ url: url });
            request.done(function (data) {
                for (i = 0; i < data.resources.length; i++) {
                    for (var j = 0; j < queries.length; j++) {
                        if (data.resources[i].batchId === queries[j].batchId) {
                            if (typeof data.resources[i].response.error === "undefined") {
                                notifyCallerAboutQueryCompleted(queries[j], data.resources[i].response, false);
                            }
                            else {
                                notifyCallerAboutQueryCompleted(queries[j], data.resources[i].response, true);
                            }
                        }
                    }
                }
            });
            request.fail(function (error) {
                for (var j = 0; j < queries.length; j++) {
                    notifyCallerAboutQueryCompleted(queries[j], error, true);
                }
            });
        },
        executeAllActivateQueries: function (activateQueries) {
            //This method will be called when an application is activated 
            //and all of it sub components has been loaded

            var queries = apiAggregation.aggregateApiRequests(activateQueries);

            for (var i = 0; i < queries.length; i++) {
                if (queries[i].dontAllowBatch === true) {
                    this.executeQuery(queries[i]);
                }
            }

            var batchQueries = [];
            for (i = 0; i < queries.length; i++) {
                if (queries[i].dontAllowBatch !== true) {
                    batchQueries.push(queries[i]);
                }
            }
            if (batchQueries.length > 1) {
                this.executeBatchQuery(queries);
            }
            if (batchQueries.length === 1) {
                this.executeQuery(queries[0]);
            }
        },
        executeAllDeactivateQueries: function (deactivateQueries) {
            //This method will be called when an application is deactivated
            var queries = apiAggregation.aggregateApiRequests(deactivateQueries);
        },

        executeUpdate: function (url, dataObject) {
            var deferred = Q.defer();
            $.ajax({
                url: addAccessTokenAndFormatToUrl(url),
                type: 'PUT',
                data: JSON.stringify(dataObject),
                contentType: 'application/json',
                success: function (result) {
                    console.log("successsss?");
                    console.log(result);
                    deferred.resolve(result);
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    if (jqXHR.status == 200 || jqXHR.status == 202) {//TODO:this is a bug fix for jquery 
                        system.log('Parse error with status ', textStatus);
                        deferred.resolve('');
                    }
                    else {
                        var errorResponse = jqXHR.error().responseText;
                        system.log('Request failed!', textStatus, errorResponse);
                        deferred.reject({
                            Status: jqXHR.status,
                            StatusText: textStatus,
                            ErrorText:  errorThrown
                        });
                    }
                }
            });
            return deferred.promise;
        },

        executeInsert: function (url, dataObject) {
            var deferred = Q.defer();
            $.ajax({
                url: addAccessTokenAndFormatToUrl(url),
                type: 'POST',
                data: JSON.stringify(dataObject),
                contentType: 'application/json',
                success: function (result) {
                    console.log("success?");
                    console.log(result);
                    deferred.resolve(result);
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    deferred.reject(thrownError);
                }
            });

            return deferred.promise;
        }

    };

});
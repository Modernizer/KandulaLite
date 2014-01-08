/// <reference path="datacontext.js" />
define(function (require) {
    var ds = require('rbframework/dataservice'),
        breezejs = require('rbframework/breeze'),
        dataStore = require('rbframework/datastore'),
     system = require('durandal/system');



    function notifyListeners(verb, uri, obj, listeners) {
        var regExp;
        var uriSegments = uri.split('/');
        //    var uriSegmants
        for (var i = 0; i < listeners.length; i++) {
            if (verb !== listeners[i].verb) {
                continue;
            }

            //check that number of uri segments matches
            if (uriSegments.length !== listeners[i].uriSegments.length) {
                continue;
            }

            // loop trough all uri segments and check if it matches the listener.
            var isMatch = true;
            var parameters = [];
            for (var j = 0; j < uriSegments.length; j++) {
                if (listeners[i].uriSegments[j].indexOf('{') === 0 && listeners[i].uriSegments[j].indexOf('}') === listeners[i].uriSegments[j].length - 1) {
                    //is parameter
                    parameters.push(uriSegments[j]);
                }
                else {
                    if (listeners[i].uriSegments[j] !== uriSegments[j].toLowerCase()) {
                        isMatch = false;
                        break;
                    }
                }
            }

            if (isMatch === true) {
                listeners[i].callback.apply(listeners[i].viewModel, [verb, uri, obj].concat(parameters));
            }
        }
    }

    var DataContext = function () {
        this.listeners = [];
        observableObjects = [];

        this.activateQueries = [];
        this.deactivateQueries = [];

        this.Query = breezejs.Query;
        this.Predicate = breezejs.Predicate;

        this.executeActivateQuery = function (query, dontAllowBatch) {
            //return ds.executeActivateQuery(this.activateQueries, query, dontAllowBatch);
            var self = this;
            var promise = ds.executeActivateQuery(this.activateQueries, query, dontAllowBatch);

            var thenFnOriginal = promise.then;

            promise.then = function (callback) {
                return thenFnOriginal.call(promise, function (data) {
                    for (var i = 0; i < observableObjects.length; i++) {
                        if (observableObjects[i].resourceName === query.resourceName) {
                            //merge objects
                            //$.extend(true, observableObjects[i].observable, data);
                            observableObjects[i].observable.merge(data);

                            callback(observableObjects[i].observable);
                            return;
                        }
                    }

                    var observable = dataStore.create(data);
                    observableObjects.push({ resourceName: query.resourceName, observable: observable });
                    callback(observable);
                });
            };

            return promise;
        };

        this.executeDeactivateQuery = function (query) {
            return ds.executeDeactivateQuery(this.deactivateQueries, query);
        };

        this.executeQuery = function (query) {
            query.deferred = Q.defer();
            return ds.executeQuery(query);
        };

        this.executeBatchQuery = function (queries) {
            return ds.executeBatchQuery(queries);
        };

        this.executeAllActivateQueries = function () {
            return ds.executeAllActivateQueries(this.activateQueries);
        };

        this.executeAllDeactivateQueries = function (deactivateQueries) {
            return ds.executeAllDeactivateQueries(this.deactivateQueries);
        };

        this.destroy = function () {
            //do the clean up logic
            listeners = [];
            observableObjects = [];
        };

        this.update = function (uri, obj, model) {
            if (model.updatePromise) {
                system.log('Update in progress for the same data..');
                return model.updatePromise;
            }

            model.updatePromise = ds.executeUpdate(uri, obj, model);
            model.updatePromise.finally(function () {
                delete model.updatePromise;
            });
            //notify other components about this
            notifyListeners("put", uri, obj, this.listeners);
            return model.updatePromise;
        };

        this.insert = function (uri, obj,model) {
            if (model.insertPromise) {
                system.log('Insert in progress for the same data..');
                return model.insertPromise;
            }
         
            model.insertPromise = ds.executeInsert(uri, obj);
            model.insertPromise.finally(function () {
                delete model.insertPromise;
            });
            //notify other components about this
            notifyListeners("post", uri, obj, this.listeners);
            return model.insertPromise;
        };

        this.registerListeners = function (viewModel, verb, uri, callback) {
            var uriSegments = uri.split('/');
            this.listeners.push({ viewModel: viewModel, verb: verb.toLowerCase(), uri: uri.toLowerCase(), uriSegments: uriSegments, callback: callback });
        };

    };

    return {
        create: function () {
            return new DataContext();
        }
    };



});
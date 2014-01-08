define(function (require) {
    var system = require('durandal/system');
    var dc = require('rbframework/datacontext');
    var dataStore = require('rbframework/datastore');

    var ctor = function (options) {
        options = options || {};
        var that = this;

        that.options = $.extend(true, options, {});

        function create(options) {
            system.log('Create', options);
            var resource = that.options.url;
            var inputData = {};
            inputData[that.options.schema.model.name || 'data'] = options.data;
        }

        function read(options) {
            system.log('Read', options);

            if (options.data.sort === undefined)
                delete options.data.sort;

            options.data = kendo.data.transports.odata.parameterMap(options.data, "read");
                        
            var resourceurl = that.options.url;
            var readOptions = $.extend(true, options.data, that.options);

            var top = readOptions.pageSize || 100;

            if (readOptions.url.indexOf('?$') > 0) {
                resourceurl += kendo.format('&$top={0}', top);
            } else {
                resourceurl += kendo.format('?$top={0}', top);
            }

            if (readOptions.handle) {
                resourceurl += kendo.format('&$handle={0}', readOptions.handle);
                resourceurl += kendo.format('&$offset={0}', readOptions.offset || 0);
            }

            if (readOptions.skipCount)
                resourceurl += kendo.format('&$skip={0}', readOptions.skipCount);

            if (readOptions.$orderby) {
                resourceurl += kendo.format('&$orderBy={0}', readOptions.$orderby);
            }

            if (readOptions.$filter) {
                resourceurl += kendo.format('&$filter={0}', readOptions.$filter);
            }

            var dataContext = dc.create();
            var query = new dataContext.Query().from(resourceurl);

            var data = dataContext.executeQuery(query).then(function (data) {
                if (data.paging) {
                    var link = data.paging.nextPage || data.paging.previousPage;
                    // Store the result set handle
                    var match = /[?&](?:\%24|\$)handle=([^&]+)/g.exec(link);
                    if (match)
                        that.options.handle = match[1];
                    that._datasource.rbPaging = data.paging;//TODO: fix this , this is used to genarate the footer summery

                    that._datasource.nextPageLink = data.paging.nextPage;
                    that._datasource.prevPageLink = data.paging.previousPage;

                    that._datasource.hasNextPage = !!data.paging.nextPage;
                    that._datasource.hasPrevPage = !!data.paging.previousPage;
                }
                options.success(data);
            });

            //Fail ligic goes here
        }
        
        function update(options) {
            system.log('Update Not implimented yet !', options);
        }

        function destroy(options) {
            system.log('Delete Not implimented yet !', options);
        }

        this._datasource = new kendo.data.DataSource({
            pageSize: that.options.pageSize,
            autoSync: false,
            selectable: "multiple cell",
            serverSorting: true,
            serverFiltering: true,
            schema: that.options.schema,
            transport: {
                create: create,
                read: read,
                update: update,
                destroy: destroy,
                parameterMap: function (data, operation) {
                    if (operation == "read") {
                        return kendo.data.transports.odata.parameterMap(data, operation);
                    }
                }
            },
            error: function (e) {
                system.log('Error in datasource: ', e);
                var message = "Error: " + (e.message || ('\n' + e.xhr) || "");
                addErrorMessage(message);
            }
        });
    };

    ctor.prototype.getKendoDataSource = function () {
        return this._datasource;
    };

    ctor.prototype.clearCurrentQuery = function () {
        var that = this;
        if (that.options) {
            delete that.options.handle;
            delete that.options.offset;
        }
    };

    ctor.prototype.clearFilters = function () {
        this.options.filters = [];
    };

    ctor.prototype.reload = function () {
        var that = this;
        that.clearCurrentQuery();
        that._datasource.read();
    };

    ctor.prototype.addFilter = function (filter) {
        var that = this;
        that.options.filters = that.options.filters || [];
        that.options.filters.push(filter);
    };

    ctor.prototype.getById = function (id) {
        return this._datasource.get(id)
    }

    return ctor;
});
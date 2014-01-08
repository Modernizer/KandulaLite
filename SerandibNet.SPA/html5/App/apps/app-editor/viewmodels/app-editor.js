/// <reference path="app-editor.js" />
define(function (require) {

    var persistence = require('./persistence'),
        model = require('./model'),
        resizer = require('./resizer'),
        ParamEditor = require('./param-editor'),
        TabNameModal = require('./tab-name-dialog'),
        SetCompModal = require('./comp-dialog'),
        ThemSelectDialog = require('./theme-selector-dialog'),
        componentList = ko.observableArray([]);


    var defaultLaout = {
        rows: [{
            columns: [{
                type: 'column',
                span: 12,
                height: 500,
                //component: {
                //    name: "Please choose your components here",
                //},
                guid: "f94765ba-4f8d-4bc7-9821-995193edd193"
            }]
        }]
    };

    function loadAppLayout(vm, appNumber) {
        vm.set("message", "");

        var success = function (response) {
            vm.set("layout", response.RowData);
            if (response.RowData) {
                componentList = response.RowData.parameterMap ? response.RowData.parameterMap.componentList : [];
            }
            vm.renderAll();
        };

        var error = function (xhr, ajaxOptions, thrownError) {
            vm.set("layout", defaultLaout);
            vm.renderAll();
            vm.set("message", "Default Layout Loaded..  Error :" + xhr.responseText);
        };

        persistence.retreiveLayout(appNumber, success, error);
    }


    function saveAppLayout(vm) {
        var appInfo = {};
        appInfo.RowData = ko.toJS(vm.layout);
        appInfo.ApplicationMatch = location.hash.split('/')[1];//TODO:fix this

        var success = function (response) {
            vm.set("message", response.Message);
        };

        var failure = function (xhr, ajaxOptions, thrownError) {
            vm.set("message", "Error :" + thrownError);
        };

        persistence.saveLayout(appInfo, success, failure);
    }


    function parseUrl(queryString) {
        var splitV = queryString.split('/');
        return splitV;
    }

    var viewModel = kendo.observable({

        layout: { rows: [] },

        message: "",

        createComponentList: function () {

            var returnParamObj = {};

            returnParamObj.componentList = componentList;
            returnParamObj.parameterUrl = ko.observable('appname/id/par1/para2/para3');

            return returnParamObj;
        },

        manageParams: function () {
            var paramObj = viewModel.createComponentList();
            ParamEditor.show(paramObj).then(function (response) {
                if (response != "cancel") {
                    viewModel.layout.parameterMap = response;
                    viewModel.saveLayout();
                }
            });
        },

        saveLayout: function () {
            saveAppLayout(viewModel);
        },

        menuActionSplit: function (e) {
            var columnId = $(e.target).data("uniqueid");
            model.split(viewModel, columnId);
        },

        menuActionAddChild: function (e) {
            var columnId = $(e.target).data("uniqueid");
            model.addChild(viewModel, columnId);
        },

        menuActionDelete: function (e) {
            var columnId = $(e.target).data("uniqueid");
            model.remove(viewModel, columnId);
        },

        menuActionAddTab: function (e) {
            TabNameModal.show().then(function (tabName) {
                if (tabName) {
                    var columnId = $(e.target).data("uniqueid");
                    model.addTab(viewModel, columnId, tabName);
                }
            });
        },

        menuActionSetComp: function (e) {
            SetCompModal.show().then(function (component) {
                if (component) {
                    var columnId = $(e.target).data("uniqueid");

                    var parameternames = [{ parameterName: "id" }, { parameterName: "param1" }];

                    var success = function (response) {
                        if (response.parameters) {
                            parameternames = response.parameters;
                            $.each(parameternames, function (i, item) {
                                if (!item.parameterValue)
                                    item.parameterValue = "";
                            });
                        }
                        var compRef = {

                            applicationID: component.applicationID,
                            columnGuid: columnId,
                            name: component.name,
                            status: component.status,
                            applicationMatch: component.applicationMatch,
                            parameternames: parameternames
                        };

                        componentList.push(compRef);
                    };

                    var failure = function (xhr, ajaxOptions, thrownError) {
                        viewModel.set("message", "Error :" + thrownError);
                    }

                    persistence.retreiveParameterNames(component.applicationID, success, failure);



                    var compModel = {
                        applicationID: component.applicationID,
                        name: component.name,
                        status: component.status,
                        applicationMatch: component.applicationMatch,
                    }
                    model.setComponent(viewModel, columnId, compModel);
                }
            });
        },

        menuActionClearComp: function (e) {
            var columnId = $(e.target).data("uniqueid");

            model.clearComponent(viewModel, columnId);
            var compArray = componentList;
            $.each(compArray, function (i) {
                if (compArray[i].columnGuid === columnId) {
                    compArray.splice(i, 1);
                    return false;
                }
            });
        },

        menuActionSetTheme :function (e) {
            ThemSelectDialog.show().then(function (theme) {
                if (theme) {
                    var columnId = $(e.target).data("uniqueid");
                    model.setTheme(viewModel, columnId, theme);
                }
            });
        },

        renderAll: function () {
            viewModel.set("message", "");
            var template = kendo.template($("#row-template").html());
            $('#app-editor-host').html(kendo.render(template, viewModel.layout.rows));
            //setup event handlers
            $('.menu-button-split').click(viewModel.menuActionSplit);
            $('.menu-button-addchild').click(viewModel.menuActionAddChild);
            $('.menu-button-delete').click(viewModel.menuActionDelete);
            $('.menu-button-addtab').click(viewModel.menuActionAddTab);
            $('.menu-button-setcomp').click(viewModel.menuActionSetComp);
            $('.menu-button-compclear').click(viewModel.menuActionClearComp);
            $('.menu-button-settheme').click(viewModel.menuActionSetTheme);
            //initialize resize handlers
            resizer.setup(viewModel);
            //initialize the tabstrips
            $('.layout-editor-tabstrip').kendoTabStrip();
        }

    });

    /* return durandal module */
    return {
        attached: function (view, parent) {
            loadAppLayout(viewModel, location.hash.split('/')[1]);
        },

        binding: function (view) {
            //lets call kendo mvvm bindings
            kendo.bind(view, viewModel);

            // stop default durandal bindings of knockout
            //return { applyBindings: false };
        },
        contextReady: function (dc, appmodel) {
            appmodel.appEditorViewModel = viewModel;
            this.model = appmodel;
        },
        activate: function (contexr, data) {

        }
    }
});
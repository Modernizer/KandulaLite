define(function (require) {
    var system = require('durandal/system'),
        dialog = require('plugins/dialog'),
        ko = require('knockout');

    var tabStripElement = null;
    var tabStrip = null;
    var paramObject = null;

    $(window).resize(function () {
        resizeAll();
    });

    var expandContentDivs = function (divs) {
        divs.height(tabStripElement.innerHeight() - tabStripElement.children(".k-tabstrip-items").outerHeight() - 16);
    };
    // 16px are substracted to compensate for content div vertical paddings and borders

    var resizeAll = function () {
        if (tabStripElement) {
            expandContentDivs(tabStripElement.children(".k-content"));
        }
    };

    var ParamEditor = function (paramObj) {
        var self = this;
        self.layout = paramObj;
        self.layout.paramKeys = ko.computed(function () {
            return this.layout.parameterUrl().split('/');
        }, this);
    };


    ParamEditor.prototype.ok = function () {
        dialog.close(this, this.layout);
    };

    ParamEditor.prototype.cancel = function () {
        dialog.close(this, "cancel");
    };


    ParamEditor.show = function (paramObj) {
        return dialog.show(new ParamEditor(paramObj));
    };


    ParamEditor.prototype.attached = function (parent, child, settings) {

        kendo.bind(parent, this);
        tabStripElement = $("#tabstrip").kendoTabStrip(),
        tabStrip = tabStripElement.data("kendoTabStrip");

        resizeAll();
    };

    return ParamEditor;
});
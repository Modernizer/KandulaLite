define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app'),
        ds = require('rbframework/dataservice'),
        system = require('durandal/system'),
            composition = require('durandal/composition');

  
    function startSubscriptions() {
        app.on('toolbar:modelChanged').then(function (e) {
            model.hasChanges(true);
        });
        app.on('toolbar:modelSaved').then(function (e) {
            model.hasChanges(false);
        });
    }


    var model = {
        hasChanges: ko.observable(false),
        instance: this,
        
        saveChanges: function () {
            app.trigger('saveChanges', {});
        },
        createNew: function () {
            app.trigger('createNew', {});
        }
    };

    return model;
});
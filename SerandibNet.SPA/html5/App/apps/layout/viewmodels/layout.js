define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app');
    
    return {
        displayName: 'Demo app with a complex Layout',
        activate: function () {
            
        },
        canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        },
        navigate: function () {
            var router = require("durandal/plugins/router");
            router.navigateTo("#/welcome");
        }
    };
});
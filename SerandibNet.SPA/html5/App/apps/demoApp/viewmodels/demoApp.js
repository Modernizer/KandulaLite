define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app'),
        dc = require('rbframework/datacontext');

    var numberOfComponents = 2, numberOfActivatedComponents = 0;
    var dataContext = dc.create();
    
    return {
        displayName: 'Demo app',

        activate: function () {

        },
        canDeactivate: function () {
            //clear cache etc?
            dataContext.destroy();

            //the router's activator calls this function to see if it can leave the screen
            //return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
            return true;
        },
        navigate: function () {
            var router = require("plugins/router");
            router.navigateTo("#/welcome");
        },
        composeCompleted: function (child, context) {

            //inject the child view model with data context for this application
            if (context.model.contextReady) {
                context.model.contextReady(dataContext);
            }

            if (++numberOfActivatedComponents === numberOfComponents) {
                dataContext.executeAllActivateQueries();
            }
        }
    };
});
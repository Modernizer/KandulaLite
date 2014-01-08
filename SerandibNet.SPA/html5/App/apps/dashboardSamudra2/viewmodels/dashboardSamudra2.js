define(function (require) {
    var composedComponents = [];

    /*
    view model for the application
    */
    return {
        displayName: 'Samudra Dashboard',
        description: 'Discription Samudra Dashboard',

        composeCompleted: function (child, parent, context) {
            composedComponents.push(context);
        },

        compositionComplete: function () {
            //reAttachSubModules();
        }
    }
});
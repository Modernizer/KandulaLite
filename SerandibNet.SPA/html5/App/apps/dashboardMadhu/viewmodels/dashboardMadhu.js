define(function (require) {
    var composedComponents = [];

    /*
    view model for the application
    */
    return {
        displayName: 'Madhushi Dashboard',
        description: 'Discription Madhushi Dashboard',

        composeCompleted: function (child, parent, context) {
            composedComponents.push(context);
        },

        compositionComplete: function () {
            //reAttachSubModules();
        }
    }
});
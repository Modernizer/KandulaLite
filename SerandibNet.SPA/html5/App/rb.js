define(function (require) {

    return {

        applyExtensions: function () {
            //require('extensions/routerExtensions').extend();
            //require('extensions/viewModelBinderExtensions').extend();
            require('extensions/knockout-extensions').extend();

            kendo.ns = "kendo-";
        }

    };

});
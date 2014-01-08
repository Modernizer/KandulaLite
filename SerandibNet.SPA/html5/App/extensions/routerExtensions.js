define(function (require) {

    var autoConvertRouteToModuleId = function (url, params) {
        var route = this.stripParameter(url);
        return "plugins/" + route + "/viewmodels/" + route;
    };

    var convertRouteToModuleId = function (route) {
        var strippedRoute = this.stripParameter(route);
        return "plugins/" + strippedRoute + "/viewmodels/" + strippedRoute;
    };


    return {
        extend: function () {
            var router = require('durandal/plugins/router');
            router.autoConvertRouteToModuleId = autoConvertRouteToModuleId;
            router.convertRouteToModuleId = convertRouteToModuleId;
        }
    };
});
define(function (require) {
    var viewModelBinder = require('durandal/viewModelBinder');


    return {
        extend: function () {

            viewModelBinder.beforeBind = function (obj, view) {
                //kendo.bind(view, obj.viewModel);
                console.log(obj);
            };
        }

    };
        
});
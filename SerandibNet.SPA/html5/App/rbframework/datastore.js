define(function (require) {

    
    return {
        create: function () {
            var model;
            var changedFields = [];
            
            if (arguments.length !== 0) {
                model = kendo.observable(arguments[0]);
            }
            else {
                model = kendo.observable({});
            }

            model.merge = function (newData) {
                for (var name in newData) {
                    if (!newData.hasOwnProperty(name)) {
                        continue;
                    }
                    var existing = this.get(name);
                    $.extend(true, existing, newData[name]);
                    this.set(name, existing);
                }
            };
            
            return model;

        }
    };
        
});
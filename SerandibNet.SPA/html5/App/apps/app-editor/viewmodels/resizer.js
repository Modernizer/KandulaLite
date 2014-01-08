define(function (require) {
    var utils = require('./utils');


    var findUpperLimit = function (parentArray, elementIndex) {
        var spanTotal = 0;
        for (var i = 0; i < parentArray.length; i++) {
            if (i !== elementIndex) {
                spanTotal += parentArray[i].span;
            }
        }
        return 12 - spanTotal;
    }

    return {
        setup: function (vm) {
            $(".placeholder").each(function (index, value) {

                $(value).resizable({
                    stop: function (event, ui) {
                        //find the guid of the element being resized
                        var guid = ui.element.data("uniqueid");
                        //get context info about that element from the model
                        var context = utils.find(vm, guid);

                        //set new span as per the propotion resized
                        var propotion = ui.size.width / ui.element.parent().width();
                        var newSpan = Math.round(12 * propotion);
                        if (newSpan < 1) {
                            newSpan = 1;
                        }
                        var spanUpperLimit = findUpperLimit(context.columnArray, context.columnIndex)
                        if (newSpan > spanUpperLimit) {
                            newSpan = spanUpperLimit;
                        }

                        //change the model and re-render
                        context.column.set("span", newSpan);
                        context.column.set("height", ui.size.height);

                        vm.renderAll();
                    }
                });

            });
        }

    };

});
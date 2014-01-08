define(function (require) {

    var utils = require('./utils'),
        app = require('durandal/app');

    var createColumn = function (span, height) {
        return { "type": "column", "span": span, "height": height, "guid": utils.guid() };
    };

    var performDeletion = function (context, vm) {
        if (context.columnArray.length === 1) {
            //if its inside a tab and if this is the only column, we remove the tab too
            if (context.tabArray) {
                context.tabArray.splice(context.tabIndex, 1);
            } else {
                //if this is the only column in the row, lets remove the row too
                context.wrappingRowArray.splice(context.wrappingRowIndex, 1);
            }
        } else {
            //if there are other columns, just remove this column only
            context.columnArray.splice(context.columnIndex, 1);
        }
        vm.renderAll();
    };

    return {
        split: function (vm, columnId) {
            var context = utils.find(vm, columnId);
            var colSpan = context.column.span;

            if (colSpan < 2) return;

            //make the col span of the target half of the original
            var newColSpan = Math.round(colSpan / 2);
            context.column.span = newColSpan;

            //create a new column and add to the array
            var cloneColSpan = colSpan - newColSpan;
            var clone = createColumn(cloneColSpan, context.column.height);
            context.columnArray.splice(context.columnIndex + 1, 0, clone);
            vm.renderAll();
        },

        addChild: function (vm, columnId) {
            var context = utils.find(vm, columnId);

            if ((context.column.tabs && context.column.tabs.length > 0) || context.column.component) {
                // if rows are already added to the column, we do not allow adding tabs
                app.showMessage('It is not possible to add rows when other content is available. Please delete all content inside and try again.');
                return;
            }

            var child = { "type": "row", "columns": [createColumn(12, 200)] };

            if (!context.column.rows) {
                context.column.set("rows", []);
            } 
            context.column.rows.push(child);
            vm.renderAll();
        },

        remove: function (vm, columnId) {
            var context = utils.find(vm, columnId);

            if ((context.column.tabs && context.column.tabs.length > 0) || (context.column.rows && context.column.rows.length > 0) || context.column.component) {
                // if rows are already added to the column, we do not allow adding tabs
                var answer = app.showMessage('You have content inside. Are you sure you want to delete?', 'Confirm deletion', ['Yes', 'No']).then(function (answer) {
                    if (answer === "Yes") {
                        performDeletion(context, vm);
                    };
                });
            } else {
                performDeletion(context, vm);
            }
        },

        addTab: function (vm, columnId, tabName) {
            var context = utils.find(vm, columnId);

            if ((context.column.rows && context.column.rows.length > 0) || context.column.component) {
                // if rows are already added to the column, we do not allow adding tabs
                app.showMessage('It is not possible to add tabs when other content available. Please delete all content inside and try again.');
                return;
            }

            var child = { "title": tabName, "rows": [{ "type": "row", "columns": [createColumn(12, 100)] }] }

            if (!context.column.tabs) {
                context.column.set("tabs", []);
            }
            context.column.tabs.push(child);
            vm.renderAll();
        },

        setComponent: function (vm, columnId, component) {
            var context = utils.find(vm, columnId);

            if ((context.column.rows && context.column.rows.length > 0) || (context.column.tabs && context.column.tabs.length > 0)) {
                // if rows are already added to the column, we do not allow adding tabs
                app.showMessage('It is not possible to add components when other content is available. Please delete all content inside and try again.');
                return;
            }
            
            context.column.set("component", component);
            vm.renderAll();
        },

        setTheme: function (vm, columnId, theme) {
            var context = utils.find(vm, columnId);
            context.column.set("theme", theme);
        },

        clearComponent: function (vm, columnId) {
            var context = utils.find(vm, columnId);
            context.column.set("component", null);
            vm.renderAll();
        }
    };
});
define(function (require) {

    function s4() {
        return Math.floor((1 + Math.random()) * 0x10000)
                   .toString(16)
                   .substring(1);
    };

    function guid() {
        return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
               s4() + '-' + s4() + s4() + s4();
    };

    /* return the context information of the column with given id */
    var find = function (vm, columnId) {
        var result = searchInRows(vm.layout.rows, columnId);
        return result;
    };

    /* recursive method to traverse the layout to locate the given column */
    var searchInRows = function (rows, columnId) {
        for (var rowindex = 0; rowindex < rows.length; rowindex++) {
            for (var colindex = 0; colindex < rows[rowindex].columns.length; colindex++) {
                //check if the column is the target
                if (rows[rowindex].columns[colindex].guid === columnId) {
                    var retObject = {};
                    retObject.columnIndex = colindex;
                    retObject.columnArray = rows[rowindex].columns;
                    retObject.wrappingRowIndex = rowindex;
                    retObject.wrappingRowArray = rows;
                    retObject.column = rows[rowindex].columns[colindex];
                    return retObject;
                } else if (rows[rowindex].columns[colindex].rows) {
                    //if not found in this column, check in its nested rows
                    var subPathReturn = searchInRows(rows[rowindex].columns[colindex].rows, columnId);
                    if (subPathReturn) return subPathReturn;
                } else if (rows[rowindex].columns[colindex].tabs) {
                    //if not found still, check in its nested tabs
                    for (var tabindex = 0; tabindex < rows[rowindex].columns[colindex].tabs.length; tabindex++) {
                        var subPathReturn = searchInRows(rows[rowindex].columns[colindex].tabs[tabindex].rows, columnId);
                        if (subPathReturn) {
                            if (!subPathReturn.tabArray) {
                                //column found in an tab (and not set yet), lets add tab info to the context
                                subPathReturn.tabArray = rows[rowindex].columns[colindex].tabs;
                                subPathReturn.tabIndex = tabindex;
                            }
                            return subPathReturn;
                        }
                    }
                }
            }
        }
    }

    return {
        guid: guid,
        find: find
    };

});
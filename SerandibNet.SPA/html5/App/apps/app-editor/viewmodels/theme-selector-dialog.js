define(['plugins/dialog', 'knockout', 'durandal/system', 'rbframework/kendodatasource'], function (dialog, ko, system, KendoDataSource) {


    var dataSource = new kendo.data.DataSource({
        data: [{ name: "Default", url: 'default.less' }, { name: "Blue Opal", url: 'blueOpal.less' }],
        //url: "system/applications/components", /* base url for resource */
        //schema: {
        //    data: function (data) {
        //        return data.components;
        //    },
        //    total: function (data) {
        //        return data.paging.size;
        //    },
        //    model: {
        //        id: "applicationID",
        //        name: "name",
        //        fields: {
        //            applicationID: "applicationID",
        //            name: "name",
        //            status: "status",
        //            applicationMatch: "applicationMatch"
        //        }
        //    }
        //},
        //autoLogin: true,
        //pageSize: 10 /* to be fixed.. support paging */
    });


    var viewModel = kendo.observable({
        dataSource: function () {
            return dataSource;
        },
        selectedRow: null,

        selectionExist: function () {
            return (this.get("selectedRow") !== null);
        },

        change: function (eventArgs) {
            this.set("selectedRow", eventArgs.sender.dataItem(eventArgs.sender.select()));
        },

        createPager: function () {
            //var pager = $('div#setCompContainer');
            //pager.kendoRbPager({
            //    dataSource: this.dataSource,
            //    placeHolders: { prevContainer: 'div#setCompPagerPrev', nextContainer: 'div#setCompPagerNext' }
            //});
        },

        ok: function () {
            dialog.close(this, this.get("selectedRow").toJSON());
        },

        binding: function (view) {
            kendo.bind(view, viewModel);
            return false;
        },

        bindingComplete: function () {
           // viewModel.createPager();
        },

        cancel: function () {
            dialog.close(this);
        },

        show: function () {
            viewModel.set("selectedRow", null);
            return dialog.show(viewModel);
        }
    });

    return viewModel;
});
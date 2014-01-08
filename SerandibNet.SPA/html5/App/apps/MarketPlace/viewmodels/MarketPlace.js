define(function (require) {
   
    var home = function () {

    };


    home.prototype.attached = function () {
        var self = this;
        var sharedDataSource = new kendo.data.DataSource({
            data: [
                { id: 1, value: 10, item: "Item1" },
                { id: 2, value: 12, item: "Item2" },
                { id: 3, value: 15, item: "Item3" },
                { id: 4, value: 18, item: "Item4" },
                { id: 5, value: 22, item: "Item5" },
                { id: 6, value: 11, item: "Item6" }
            ],
            schema: {
                model: {
                    id: "id",
                    fields: {
                        id: { type: "number", editable: false },
                        value: { type: "number" },
                        item: { type: "string" }
                    }
                }
            }
        });


        $("#grid").kendoGrid({
            dataSource: sharedDataSource,
            autoBind: false,
            editable: true,
            toolbar: ["save", "cancel"]
        });

        $("#chart").kendoChart({
            dataSource: sharedDataSource,
            autoBind: false,
            categoryAxis: {
                field: "item"
            },
            series: [
                { field: "value", name: "Value" }
            ]
        });

        sharedDataSource.read();

    };

    return home;
})
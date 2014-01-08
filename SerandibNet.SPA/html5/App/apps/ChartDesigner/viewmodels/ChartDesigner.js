define(function (require) {
    var app1 = function () {
        this.displayName = 'Create Your Dashboard';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            '4 Applications',
            '3 Applications',
            '2 Applications',
            'customize'
        ];


        this.entities = null;
        this.association = null;
        this.namespace = null;
        this.entitySchema = null;
        this.entitySet = null;
        this.associationSet = null;
        this.createdQueryBuilder = null;

    };

    app1.prototype.attached = function () {
        var temp = this;

        setup();
    }

    function getNamesValueFromObject(obj, startIndex) {
        startIndex = startIndex || 0;
        var keys = [];
        for (var i = 0, l = obj.length; i < l; i++) {
            keys.push({ key: i + startIndex, value: obj[i].name, object: obj[i] });
        }
        return keys;
    };


    function getAcceptableProperties (entityId) {
        var e = this.entities[entityId];
        var properties = e.property || [];

        // If it is a hierarchical entity add the base classes' properties.
        if (e.baseType) {
            var baseEntityName = e.baseType.replace(this.namespace + '.', '');
            var baseEntityId = this._getEntityIdByName(baseEntityName);
            var baseProperties = this._getAcceptableProperties(baseEntityId);

            properties = properties.concat(baseProperties);
        }

        return properties;
    };

    function getEntityIdByName (entityName) {
        for (var i = this.entities.length - 1; i >= 0; i--) {
            if (this.entities[i].name == entityName) {
                return i;
            }
        }

        return undefined;
    };
    
    var html = [];
    function createList(arr) {
        html.push('<ul>');
        $.each(arr, function (i, val) {
            html.push('<li>' + val.Name);
            if (val.PropertyList) {
                createList(val.PropertyList)

            }
            html.push('</li>');
        });
        html.push('</ul>');
    }


    function ShowEmployees(div, item) {
        div.append("<br/>" + "Id: " + item.Id + ", Name: " + item.Name);
    }


    var SampleData;

    $(function () {
        "use strict";
        
    });

    function setup() {
        getData();
        layout();
    }

    function getData() {
        SampleData = new kendo.data.DataSource({
            type: "odata",
            pageSize: 50,
            transport: {
                read: "http://demos.kendoui.com/service/Northwind.svc/Products"
            }
        });
    }

    function tabSelect(e) {
        if ($(e.contentElement).children("#chartWidget").length) {
            window.setTimeout(function () {
                buildChart();
            }, 800);
        }
    }

    function layout() {
        //buildMenu();
        buildGrid();
        buildChart();

        /**
        $("#tabPane").kendoTabStrip({ select: tabSelect });
        $("#splitWindow").kendoSplitter({
            orientation: "horizontal",
            panes: [
                
                { size: "100%", scrollable: false }
            ]
        });

        **/
    }

    function buildMenu() {
        $("#gridMenu").kendoMenu({
        });
    }

    function buildGrid() {
        "use strict";
        $("#gridWidget").kendoGrid({
            dataSource: SampleData,
            pageable: true,
            dataBound: resizeGrid,
            columns: [
                "ProductID",
                "ProductName",
                "QuantityPerUnit",
                "UnitsInStock",
                "UnitsOnOrder"
            ]
        });
    }

    function buildChart() {
        $("#chartWidget").kendoChart({
            title: {
                text: "Units In Stock"
            },
            dataSource: SampleData,
            series: [
                {
                    name: "Units In Stock",
                    field: "UnitsInStock"
                }
            ],
            categoryAxis: {
                field: "ProductName",
                labels: { rotation: 90 }
            }
        });
    }

    function resizeGrid() {
        var gridElement = $("#gridWidget"),
            dataArea = gridElement.find(".k-grid-content"),
            gridHeight = gridElement.innerHeight(),
            otherElements = gridElement.children().not(".k-grid-content"),
            otherElementsHeight = 0;
        otherElements.each(function () {
            otherElementsHeight += $(this).outerHeight();
        });
        dataArea.height(gridHeight - otherElementsHeight);
        console.debug("gridHeight: " + gridHeight + " otherElementsHeight: " + otherElementsHeight);
    }

    $(window).resize(function () {
        resizeGrid();
    });

   

    return app1;
})
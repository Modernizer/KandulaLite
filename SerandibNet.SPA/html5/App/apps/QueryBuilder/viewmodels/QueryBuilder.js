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

        $('#btnGenerate').click({ parm: temp }, function (event) {
    
            var url = event.data.parm.createdQueryBuilder.getUrl();

            var queryBuilder = event.data.parm.createdQueryBuilder.queryBuilder;
            var selectedEntityId = queryBuilder.getSelectedEntityId();
            var properties = queryBuilder.getQueryPropertiesForEntity(selectedEntityId);

            var selectedColumnList = queryBuilder.getSelectColumnList();

            var keys = [];
            for (var i = 0, l = selectedColumnList.length; i < l; i++) {



                keys.push({ key: i, value: selectedColumnList[i].name });
            }


            var request = $.ajax({ url: url, dataType: "json" });
            request.done(function (data) {

           $("#grid").kendoGrid({
                    dataSource: data.value
                });

                console.log(data);
            });
            
            /*
            $("#grid").kendoGrid({
                dataSource: {
                    type: "odata",
                    transport: {
                        read: "http://northwindpoc.azurewebsites.net/odata/Product/"
                    },
                    pageSize: 10
                },
                groupable: true,
                sortable: true,
                pageable: {
                    refresh: true,
                    pageSizes: true,
                    buttonCount: 5
                },

                //columns: [{
                //    field: "ContactName",
                //    title: "Contact Name",
                //    width: 140
                //}, {
                //    field: "ContactTitle",
                //    title: "Contact Title",
                //    width: 190
                //}, {
                //    field: "CompanyName",
                //    title: "Company Name"
                //}, {
                //    field: "Country",
                //    width: 110
                //}

                columns: [{ field: "ProductID", title: "ID", width: "50px" },
                    { field: "ProductName", title: "Name"},
                    { field: "QuantityPerUnit", title: "Quantity", width: "200px" },
                    { field: "UnitsInStock", title: "Stock", width: "90px" },
                    { field: "UnitPrice", title: "Price", format: "{0:c}", width: "100px" },
                    { field: "Discontinued", width: "150px" }
            
            ]
            });
            */

           
            

        });
        

        $('#btnSave').click({ parm: temp }, function (event) {


            var fakeData = [{
                "title": "Wire the money to Panama",
                "isDone": true
            },
            {
                "title": "Get hair dye, beard trimmer, dark glasses and \"passport\"",
                "isDone": false
            },
            {
                "title": "Book taxi to airport",
                "isDone": false
            },
            {
                "title": "Arrange for someone to look after the cat",
                "isDone": false
            }];

            var obj = JSON.stringify(fakeData);

            $.ajax({
                type: "POST",
                url: "/MarketPlaceController/SaveModel", //Aqui vai o seu url
                data: obj,

                dataType: 'json',
                success: function (result) {

                }
            });

            $.getJSON("/MarketPlaceController/SaveModel", null, function (data) {
                var div = $('#EmployeeResultDiv');
                createList(data)

                div.html("<br/> " + "Object Model " + "<br/>");
                div.append("<br/>" + html.join(''));
            });




        });

        this.createdQueryBuilder = new OData.explorer.DataExplorer(
                 {
                     // An array containing the different endpoints.
                     endpoints: [
                         {
                             name: 'Northwind Production',
                             url: 'http://prodmarket.azurewebsites.net/odata',
                         },

                         {
                             name: 'Northwind Developer',
                             url: ' http://devmarket.azurewebsites.net/odata',
                         },

                         {
                             name: 'OData Sample',
                             url: 'http://odataservices.azurewebsites.net/OData/OData.svc',
                         },

                         {
                             name: 'Kendo',
                             url: 'http://demos.kendoui.com/service/Northwind.svc',
                         }

                       
                     ]
                 });


        $('#btnInitDb').click(function () {
            
            var url = 'http://northwindpoc.azurewebsites.net/odata/';

            OData.read(url + '$metadata', function (data) {
                for (var e in data.dataServices.schema) {
                    var schema = data.dataServices.schema[e];
                    if (schema.entityType) {
                        this.entities = schema.entityType;
                        this.association = schema.association;
                        this.namespace = schema.namespace;
                    }

                    if (schema.entityContainer) {
                        this.entitySchema = schema;
                        this.entitySet = schema.entityContainer[0].entitySet;
                        this.associationSet = schema.entityContainer[0].associationSet;
                    }
                }


                var properties = getAcceptableProperties(1);
                var names = getNamesValueFromObject(properties);
                console.log(data);
            }, function (err) {


            }, OData.metadataHandler);

            


            
            $.getJSON("/Dashboard/InitDb", null, function (data) {

                var div = $('#EmployeeResultDiv');


                div.html("<br/> " + "Employee List: " + "<br/>");
                $.each(data, function (i, item) {
                    ShowEmployees(div, item);
                });


                div.html("<br/> " + "Object Model " + "<br/>");
                div.append("<br/>" + html.join(''));
            });

            
            
           
        });
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


    return app1;
})
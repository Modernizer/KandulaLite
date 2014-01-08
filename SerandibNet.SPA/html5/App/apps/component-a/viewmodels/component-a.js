define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app'),
        ds = require('rbframework/dataservice');
    
    
    return {
        displayName: 'Component A',
        activate: function () {
        },

        contextReady: function (dc) {
            
            //var p1 = new ds.Predicate("customerno", "==", 10000);
            //var p2 = new ds.Predicate("customerno", "==", 10001);
            //var p3 = new ds.Predicate("st", ">", "9");
            //var predicate = p1.or(p2.and(p3));

            //var predicate2 = ds.Predicate.create("ShipCity", "startswith", "F").or("Size", "gt", 2000);

            var query = new dc.Query().from("collaboration/contacts/100272");
            //var query = new dc.Query().from("deprecated/sales/customers").orderBy('firstname desc');

            console.time('someFunction timer');
            dc.executeActivateQuery(query).then(function (data) {
                console.timeEnd('someFunction timer');
                console.log("got data:" +  data);
                console.log(data);
            }).fail(function (error) {
                console.log("data access failed:" + error);
            });
        },
        canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        },
        viewModel: kendo.observable({
            firstName: "John",
            lastName: "Doe",
            genders: ["Male", "Female"],
            gender: "Male",
            agreed: false,
            confirmed: false,
            register: function (e) {
                e.preventDefault();
                this.set("firstName", "hasith");
                this.set("confirmed", true);
            },
            startOver: function () {
                this.set("confirmed", false);
                this.set("agreed", false);
                this.set("gender", "Male");
                this.set("firstName", "John");
                this.set("lastName", "Doe");
            }
        })
            

    //viewAttached: function (newChild) {
    //    var viewModel = kendo.observable({
    //        firstName: "John",
    //        lastName: "Doe",
    //        genders: ["Male", "Female"],
    //        gender: "Male",
    //        agreed: false,
    //        confirmed: false,
    //        register: function (e) {
    //            e.preventDefault();

    //            this.set("confirmed", true);
    //        },
    //        startOver: function () {
    //            this.set("confirmed", false);
    //            this.set("agreed", false);
    //            this.set("gender", "Male");
    //            this.set("firstName", "John");
    //            this.set("lastName", "Doe");
    //        }
    //    });

    //    kendo.bind($("#kendo-bindable"), viewModel);
    //}
    };
});
define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app');
        //ds = require('rbframework/dataservice');


    return {
        displayName: 'Contact Edit',

        model: null,
        dataContext: null,

        contextReady: function (dc, appmodel) {
            this.dataContext = dc;
            this.model = appmodel;
            
            var self = this;

            var query = new dc.Query().from("collaboration/contacts/100271");
            dc.executeActivateQuery(query).then(function (data) {
                //self.model.merge("contact", data.contact);
                self.model.set("contact", data.contact);

                self.model.set("fullName", function () {
                    return self.model.get("contact.firstname") + " x " + self.model.get("contact.lastname");
                });
            });
        },

        action: function (e) {
            e.preventDefault();
            this.model.set("contact.firstname", "Roger");
            this.dataContext.update("sales/customers/3432", { name: "roger", lastName: "gullhaug" });
        }

    };
});
define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app'),
        ds = require('rbframework/dataservice');


    return {
        displayName: 'Contact Test',

        model: null,

        contextReady: function (dc, appmodel) {
            this.model = appmodel;
            var self = this;

            var query = new dc.Query().from("collaboration/contacts/100272");
            dc.executeActivateQuery(query).then(function (data) {
                self.model.set("contact", data.contact);
            });
        },

        action: function (e) {
            e.preventDefault();
            this.model.set("contact.firstname", "Test");
        }

    };
});
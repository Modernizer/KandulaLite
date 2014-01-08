define(function (require) {
    var http = require('plugins/http'),
        app = require('durandal/app');

    return {
        displayName: 'Component B',
        items: ko.observableArray([
            { id: "1", name: "apple", color: "red", size: 10, count: 45, from: "Norway" },
            { id: "2", name: "orange", color: "blue", size: 20, count: 23, from: "Sweden" },
            { id: "3", name: "banana", color: "green", size: 30, count: 53, from: "Singapore" }
        ]),
        addItem: function () {
            var num = this.items().length + 1;
            this.items.push({ id: num, name: "new" + num});
        },
        clearItems: function () {
            this.items.removeAll();
        },
        activate: function () {

        },

        contextReady: function (dc) {
            var query = new dc.Query().from("collaboration/contacts/100272");//.where("contactid", "eq", "32223");
            dc.executeActivateQuery(query).then(function (data) {
                console.log(data);
            });
        },
        canDeactivate: function () {
            //the router's activator calls this function to see if it can leave the screen
            return app.showMessage('Are you sure you want to leave this page?', 'Navigate', ['Yes', 'No']);
        }
    };
});
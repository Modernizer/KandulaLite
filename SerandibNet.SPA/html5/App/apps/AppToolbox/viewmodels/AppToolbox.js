define(function (require) {
   var app1 = function () {
        this.displayName = 'Create Your Dashboard';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';

        this.checkedObs = ko.observable(false);
        this.userList = ko.observableArray();
        this.viewCode = ko.observable();
        this.viewModelCode = ko.observable();
        this.name = ko.observable();
       this.optionValuesUsers = ko.observableArray(),
       this.optionValuesApps = ko.observableArray(),
        this.selectedOptionValue = ko.observable()
        this.multipleSelectedOptionValuesUsers = ko.observable();
        this.multipleSelectedOptionValuesApps = ko.observable();

        var count = 0;

    };



    app1.prototype.attached = function () {
        var self = this;
        $.getJSON("/Dashboard/GetApplications", null, function (data) {
            $.each(data, function (i, item) {
                self.optionValuesApps.push(item.Name);
                console.log(item);
            });
        });

     
        $.getJSON("/Home/GetUsers", null, function (data) {
            $.each(data, function (i, item) {
                self.optionValuesUsers.push(item.Name);
                console.log(item);
            });
        });


        $('#btn-share').click({ parm: self }, function (event) {
            var postObj = { userApps: [] };

            
            $.each(self.multipleSelectedOptionValuesUsers(), function (i, itemUser) {
                $.each(self.multipleSelectedOptionValuesApps(), function (i, itemApp) {
                    postObj.userApps.push({ UserName: itemUser, AppName: itemApp })
                });
            });
               
            

            $.ajax({
                type: "POST",
                url: "/Dashboard/addDashboardForUser", //Aqui vai o seu url
                data: JSON.stringify (postObj),
                contentType:"application/json; charset=utf-8",
                dataType: 'json',
                success: function (result) {

                }
            });

        });


        $('#btn-save').click({ parm: self }, function (event) {
            var postObj = { view: self.viewCode(), viewModel:self.viewModelCode(), name:self.name() };
            $.ajax({
                type: "POST",
                url: "/Dashboard/SaveModel", //Aqui vai o seu url
                data: postObj,

                dataType: 'json',
                success: function (result) {

                }
            });

        });

    }



    return app1;
})
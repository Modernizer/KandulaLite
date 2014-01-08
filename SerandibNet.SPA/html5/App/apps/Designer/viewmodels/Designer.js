define(function (require) {
   var app1 = function () {
        this.displayName = 'Create Your Dashboard';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';

        this.checkedObs = ko.observable(false);
        this.userList = ko.observableArray();
        this.viewCode = ko.observable();
        this.viewModelCode = ko.observable();
        this.name = ko.observable();
        this.optionValues = ko.observableArray(),
        this.selectedOptionValue = ko.observable()
        this.multipleSelectedOptionValues = ko.observable(["Alpha"]);

        var count = 0;

    };



    app1.prototype.attached = function () {
        var self = this;
        $.getJSON("/Dashboard/GetApplications", null, function (data) {
            $.each(data, function (i, item) {
                self.optionValues.push(item.Name);
                console.log(item);
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
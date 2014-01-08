define(function (require) {
    var firstName = ko.observable("Planet");
    var lastName = ko.observable("Earth");

    var home = function () {

        this.username =ko.observable("User1"),

        this.usertype = ko.observable("Beta")
    };

    
    home.prototype.attached = function () {      
        var self = this;
        $('#btn-save').click({ parm: self }, function (event) {
            var postObj = { username: self.username(), usertype: self.usertype() };
            $.ajax({
                type: "POST",
                url: "/Home/SaveUser", //Aqui vai o seu url
                data: postObj,

                dataType: 'json',
                success: function (result) {

                }
            });

        });
    };

    return home;
})
define(['durandal/app', 'durandal/system', 'knockout'], function (app, system, ko) {
    var name = ko.observable();
    var canSayHello = ko.computed(function () {
        return name() ? true : false;
    });

    return {
        displayName: 'What is your name?',
        name: name,
        sayHello: function () {
            app.showMessage('Hello ' + name() + '!', 'Greetings');
        },
        canSayHello: canSayHello,
        activate: function () {
            system.log('Lifecycle : activate : hello');

           
        },
        binding: function () {
            system.log('Lifecycle : binding : hello');
            return { cacheViews:false }; //cancels view caching for this module, allowing the triggering of the detached callback
        },
        bindingComplete: function () {
            system.log('Lifecycle : bindingComplete : hello');
        },
        attached: function (view, parent) {
            system.log('Lifecycle : attached : hello');

            var dataSource = new kendo.data.DataSource({
                transport: {
                    read: {
                        url: "http://demos.kendoui.com/service/Products",
                        dataType: "jsonp"
                    }
                },
                pageSize: 9
            });

            $("#pager").kendoPager({
                dataSource: dataSource
            });

            $("#listView").kendoListView({
                dataSource: dataSource,
                selectable: "multiple",
                template: kendo.template($("#template").html())
            });



            /*
            $("#verticalMenu").kendoMenu({ orientation: "vertical" });
            $("#horizontalMenu").kendoMenu();

            $(document.body).keydown(function (e) {
                if (e.altKey && e.keyCode == 87) {
                    $("#verticalMenu").focus();
                } else if (e.altKey && e.keyCode == 81) {
                    $("#horizontalMenu").focus();
                }
            });
            */
        },
        compositionComplete: function (view) {
            system.log('Lifecycle : compositionComplete : hello');
        },
        detached: function (view) {
            system.log('Lifecycle : detached : hello');
        }
    };
});
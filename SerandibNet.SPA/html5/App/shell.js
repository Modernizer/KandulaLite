define(['plugins/router', 'durandal/system'], function (router, system) {
    var appLookup = function (instruction) {
        if (instruction.fragment === "") {
            instruction.fragment = "welcome";
        }

        var programName = instruction.fragment;
        var indexOfSlash = instruction.fragment.indexOf('/');
        if (indexOfSlash > -1) {
            programName = instruction.fragment.substring(0, indexOfSlash);
        }

        return system.defer(function (dfd) {
            $(function () {
                var request = $.ajax({ url: "html5/serversidecode/applookup.ashx?appmatch=" + programName, dataType: "text" });
                request.done(function (data) {
                    if (data === "") {
                    } else {
                        var result = JSON.parse(data);
                        if (result.UserName === "Admin") {
                            instruction.fragment = "dashboardAdmin";
                        }
                    }
                    instruction.config.moduleId = "apps/" + instruction.fragment + "/viewmodels/" + instruction.fragment;
                    dfd.resolve();
                });
                
            });
        }).promise();
    };


    return {
        router: router,
        search: function () {
            //It's really easy to show a message box.
            //You can add custom options too. Also, it returns a promise for the user's response.
            //app.showMessage('Search not yet implemented...');
        },
        activate: function () {
            router.mapUnknownRoutes(appLookup).buildNavigationModel();
            return router.activate();
        }
    };
});
define(function (require) {
   var  user = require('rbframework/user');
    var online = false;

    return {
        saveLayout: function (appInfo, success, failure) {

            if (online) {
                $.ajax({
                    url: "html5/serversidecode/UploadAppLayout.ashx",
                    data: JSON.stringify(appInfo),
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    success: success,
                    error: failure
                });
            } else {
                localStorage.designermodel = JSON.stringify(appInfo);
                success({ Message: 'saved to local storage' });
            }
            
        },

        retreiveLayout: function (appNumber, success, failure) {

            if (online) {
                $.ajax({
                    url: "html5/serversidecode/GetAppLayout.ashx?appNumber=" + appNumber,
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    success: success,
                    error: failure
                });
            } else {
                var layoutStr = JSON.parse(localStorage['designermodel']);
                success(layoutStr);
            }
            
        },
        retreiveParameterNames: function (appNumber, success, failure) {

            if (online) {
                $.ajax({
                    url: "https://api.rambase.net/system/applications/components/" + appNumber + "/parameters?$access_token=" + user.getAccessToken() + "&$format=json",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    type: "POST",
                    success: success,
                    error: failure
                });
            } else {
                success([{ parameterName: 'id' }, { parameterName: 'param1' }]);
            }

        }

 
    };
});
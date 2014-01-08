define(function (require) {
    var accessToken;

    return {
        setAccessToken: function (ac) {
            accessToken = ac;
            localStorage['accessToken'] = ac;
        },

        getAccessToken: function () {
            if (accessToken)
                return accessToken;
            else
                return localStorage['accessToken'];
        }
    }
});

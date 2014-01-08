define(function (require) {
    return {

        parseQueryString: function (url) {
            var obj = {};
            if (this.parameterPresenceCheck(url)) {
                var split = url.split('?');
            }
            else {
                return;
            }

            queryString = split[1];

            var splitV = queryString.split('&');
            for (var i = 0, max = splitV.length; i < max; i++) {
                obj[splitV[i].split('=')[0]] = splitV[i].split('=')[1];
            }
            return obj;
        },

        parameterPresenceCheck: function (uri) {
            if (uri.indexOf('?') !== -1) {
                return true;
            } else {
                return false;
            }
        },

        addParameter : function (uri, key, value) {
            if (uri == "" || key == "" ||uri == undefined || key == undefined) return;

            var decodedUri = decodeURIComponent(uri);

            if (decodedUri.indexOf(key + '=' + value) < 0) {
                if (this.parameterPresenceCheck(uri)) {
                    uri = uri + '&' + key + '=' + value;
                } else {
                    uri = uri + '?' + key + '=' + value;
                }
            }
            return uri;
        },

        addSplatParameter: function (uri, value) {
            if (uri == "" || uri == undefined) return;

            var decodedUri = decodeURIComponent(uri);


            uri = uri + '/' + value;
            return uri;
        }
    };
});
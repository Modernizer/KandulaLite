$.ajaxSetup({
    beforeSend: function (xhr) {
        xhr.setRequestHeader('X-UA-Compatible', 'IE=8');
    }
});



kendo.data.DataSource.prototype.nextPage = function () {
    var queryString = {},
        nextPagelink = this.nextPageLink;
    if (nextPagelink) {
        //split query parameters into querystring array
        nextPagelink.substring(nextPagelink.indexOf('?')).replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) { queryString[$1] = $3; }
        );
        var options = { handle: queryString['%24handle'], offset: queryString['%24offset'], skipCount: queryString['%24skip'] };
        this.read(options);
    }
}

kendo.data.DataSource.prototype.previousPage = function () {
    var queryString = {},
        prevPagelink = this.prevPageLink;
    if (prevPagelink) {
        //split query parameters into querystring array
        prevPagelink.substring(prevPagelink.indexOf('?')).replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) { queryString[$1] = $3; }
        );

        this.read({ handle: queryString['%24handle'], offset: queryString['%24offset'], skipCount: queryString['%24skip'] });
    }
}

kendo.data.DataSource.prototype.reloadCurrentPage = function () {
    var queryString = {},
        link = this.reader.prevPage || this.reader.nextPage;
    if (link) {
        // Force the data reader to load the current page by resetting offset to 0.
        //split query parameters into querystring array
        link.substring(link.indexOf('?')).replace(
            new RegExp("([^?=&]+)(=([^&]*))?", "g"),
            function ($0, $1, $2, $3) { queryString[$1] = $3; }
        );
        queryString['$offset'] = 0; //Override the offset.

        this.transport.options.read.data = queryString;
    }
    this.read();
}



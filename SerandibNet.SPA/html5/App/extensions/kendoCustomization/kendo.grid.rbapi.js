kendo.ui.Grid.prototype.addCustomPagingControls = function () {
    var that = this;

    // Remove default paging controls and add custom paging buttons
    $(".k-grid-pager",this.element).find("ul.k-pager").remove();
    $(".k-grid-pager", this.element).html("<div class='k-grid-pager'><button id='prevPage' class='k-button'>« " +
        kendo.cultures.current.grid.paging.previous + "</button><button id='nextPage' class='k-button'>" +
        kendo.cultures.current.grid.paging.next + " »</button></div>");

    // Bind click events to next and previous buttons
    $('#prevPage',this.element).on("click", function (event) {
        that.dataSource.previousPage();
    });
    $('#nextPage', this.element).on("click", function (event) {
        that.dataSource.nextPage();
    });

    // Set the visibility of next and previous buttons based on the data source.
    this.dataSource.bind("change", function (e) {
        if (e.items.length == 0) {
            that.element.html(kendo.cultures.current.grid.messages.noItems);
        }

        if (!that.dataSource.reader.prevPage)
            disableButton('#prevPage');
        else
            enableButton('#prevPage');

        if (!that.dataSource.reader.nextPage)
            disableButton('#nextPage');
        else
            enableButton('#nextPage');
    });

    disableButton = function (buttonId) {
        $(buttonId, that.element).attr("disabled", "disabled");
        $(buttonId, that.element).addClass("paging-button-disabled");
    };

    enableButton = function (buttonId) {
        $(buttonId, that.element).removeAttr("disabled");
        $(buttonId, that.element).removeClass("paging-button-disabled");
    };
}
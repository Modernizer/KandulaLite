(function ($, undefined) {
    ui = kendo.ui;
    Widget = ui.Widget;

    var RbPager = Widget.extend({
        init: function (element, options) {
            console && console.log('Initializing RbPager...');
            that = this;
            Widget.fn.init.call(that, element, options);
            options = that.options;
            that.dataSource = options.dataSource;
            that.dataSource.bind("change", function (e) {
                that._dataSourceChanged(e);
            });

            var btnTmpl = kendo.template(that._templates.linkButton);

            that.nextPageButton = $(btnTmpl({ iconClass: "k-i-arrow-e" }));
            that.prevPageButton = $(btnTmpl({ iconClass: "k-i-arrow-w" }));

            that.nextPageButton.click(function (e) {
                e.preventDefault();
                that._nextPage();
            });
            that.prevPageButton.click(function (e) {
                e.preventDefault();
                that._previousPage();
            });


            if (options.placeHolders) {
                if (typeof (options.placeHolders.prevContainer) === 'string') {
                    var pCont = $(options.placeHolders.prevContainer).get(0);
                    if (pCont) $(pCont).append(that.prevPageButton);
                }
                if (typeof (options.placeHolders.nextContainer) === 'string') {
                    var nCont = $(options.placeHolders.nextContainer).get(0);
                    if (nCont) $(nCont).append(that.nextPageButton);
                }
            }
            else {
                var contTmpl = kendo.template(that._templates.container);
                that.pagerContainer = $(contTmpl({}));
                that.pagerContainer.append(that.prevPageButton).append(that.nextPageButton);
                that.pagerContainer.append($(kendo.template(that._templates.status)({})));
                $(element).append(that.pagerContainer);
            }
        },
        options: {
            name: "RbPager"
        },
        _templates: {
            linkButton: '<a class="rb-AddBttn rb-add-button k-button" href="#">="#"><span class="k-icon #: iconClass # "></span></a>',
            container: '<div class="rb-pager"></div>',
            status: '<span class="rb-pager-status"></span>'
        },
        _nextPage: function () {
            // Depends on rbapi extensions to the Kendo Datasource
            console && console.log("Move to next page...");
            that.dataSource && that.dataSource().nextPage();
        },
        _previousPage: function () {
            // Depends on rbapi extensions to the Kendo Datasource
            console && console.log("Move to previous page...");
            that.dataSource && that.dataSource().previousPage();
          //  that.dataSource && that.dataSource.read({ offset: -1 });
        },
        _dataSourceChanged: function (e) {
            if (e && (!e.action || e.action == "read")) {
                var pageSize = e.sender.options.pageSize;
                var rbPaging = e.sender.rbPaging;
                if (pageSize && rbPaging) {
                    var pos = rbPaging.position || 1;
                    var page = Math.floor(pos / pageSize) + 1;
                    var totalPages = Math.ceil(rbPaging.size / pageSize);

                    var statusFmt = "Showing page {0} of {1} pages";
                    $(that.pagerContainer).find('.rb-pager-status').html(kendo.format(statusFmt, page, totalPages));
                }
                var sender = e.sender;
                if (sender) {
                    // Enable or disable paging buttons depending on the availability of pages
                    if (sender.hasNextPage)
                        $(that.nextPageButton).removeAttr('disabled').show();
                    else
                        $(that.nextPageButton).attr('disabled', 'disabled').hide();
                    if (sender.hasPrevPage)
                        $(that.prevPageButton).removeAttr('disabled').show();
                    else
                        $(that.prevPageButton).attr('disabled', 'disabled').hide();
                }
            }
        }
    });

    ui.plugin(RbPager);

})(jQuery);
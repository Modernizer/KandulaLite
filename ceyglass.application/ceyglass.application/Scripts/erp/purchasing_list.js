var oTable_pr_list, chart, currData = [];

$(function () {
    oTable_pr_list = $('#PR-item-list').dataTable(PRDataTableOptions(GetPurchasingCartItems()));
    LoadChart();
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTable_pr_list == 'undefined') {
        oTable_pr_list = $('#PR-item-list').dataTable(PRDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_pr_list.fnClearTable(0);
        oTable_pr_list.fnAddData(aaDataArr);
        oTable_pr_list.fnDraw();
    }
}

function PRDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Item. Id" },
            { "sTitle": "Item" },
            { "sTitle": "UOM" },
            { "sTitle": "Avg. LT" },
            { "sTitle": "Available" },
            { "sTitle": "Min. Order Level" },
            { "sTitle": "Pending POs" },
            { "sTitle": "Request" }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [7],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<input type="text" itemId="' + full[0] + '" class="req-val" style="width:100px;" value="' + full[7] + '" onkeypress="return IsNumberKey(event);"/>';
                        }
                    }
        ],
        "fnPreDrawCallback": function (oSettings) {
            /* reset currData before each draw*/
            currData = [];
        },
        "fnRowCallback": function (nRow, aData, iDisplayIndex, iDisplayIndexFull) {
            /* push this row of data to currData array*/
            currData.push(aData);

        }
    };
}

function LoadChart() {

    var prDetails = GetPurchasingCartItemsMappedWithTotalRawMaterialReqs();

    var category_arr = [],
        available_arr = [],
        minOrderLevel_arr = [],
        prRequest_arr = [],
        total_raw_req_arr = [],
        pending_pos_arr = [];

    $.each(prDetails, function (index, prItm) {
        category_arr.push(prItm.ItemName);
        minOrderLevel_arr.push(prItm.MinimumInventoryLevel);
        available_arr.push(prItm.AvailableInStocks);
        prRequest_arr.push(prItm.CartQty);
        total_raw_req_arr.push(prItm.TotalPendingRequestsQty);
        pending_pos_arr.push(prItm.TotalPendingPurchaseOrders);
    });

    /*if you change the order of the columns make sure you change the index of PR column on $('#btn-update-chart').click() function*/
    var series_arr = [{
        id: 1,
        name: 'PR',
        data: prRequest_arr,
        stack: 'inhand'
    }, {
        id: 2,
        name: 'Pending POs',
        data: pending_pos_arr,
        stack: 'inhand'
    }, {
        id: 3,
        name: 'Available',
        data: available_arr,
        stack: 'inhand'
    }, {
        id: 4,
        name: 'All Orders',
        data: total_raw_req_arr,
        stack: 'orders'
    }, {
        id: 5,
        name: 'Minimum Order Level',
        data: minOrderLevel_arr,
        stack: 'orders'
    }];

    var options = {
        chart: {
            type: 'column',
            renderTo: 'div-PR-comparison',
            zoomType: 'xy'
        },
        title: {
            text: 'New Inventory/Inventory Requests'
        },
        subtitle: {
            text: 'ceyglass.lk'
        },
        xAxis: {
            categories: category_arr,
            title: {
                text: 'items'
            }
        },
        series: series_arr,
        yAxis: {
            title: {
                text: 'qty'
            }
        },
        plotOptions: {

            column: {
                stacking: 'normal'
            }
        },
        tooltip: {
            shared: false,
            formatter: function () {
                //var text = '';
                //if (this.series.options.id == 2 || this.series.options.id == 3) {
                //    text = '<b>' + this.x + '</b><br/>' +
                //        this.series.name + ': ' + this.y + '<br/>' +
                //        'Total: ' + this.point.stackTotal;
                //}
                //else {
                //    text = '<b>' + this.x + '</b><br/>' +
                //       this.series.name + ': ' + this.y;
                //}

                //return text;

                return text = '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true
        }
    };

    chart = new Highcharts.Chart(options);

}

$('#btn-update-chart').click(function () {
    var dtInputCollection = oTable_pr_list.$("input:text.req-val", { "page": "all" });
    var datatable_content = oTable_pr_list.fnGetData();
    /*index 0 represents PR column*/
    var chartSeries_PR_values = chart.series[0].data;

    for (var i = 0; i < chartSeries_PR_values.length; i++) {

        var datatable_row = $.grep(datatable_content, function (e) { return e[1] == chartSeries_PR_values[i].category; });
        if (datatable_row != null) {
            var matching_input_field = $.grep(dtInputCollection, function (e) { return $(e).attr("itemid") == datatable_row[0][0]; });
            if (matching_input_field != null) {
                chartSeries_PR_values[i].update(parseInt($(matching_input_field[0]).val()));
            }
        }
    }
});

$('#btn-add-PR').click(function () {

    var inventory_item_arr = [];

    var confirm_msg_tbl_body = '';
    var dtInputCollection = oTable_pr_list.$("input:text.req-val", { "page": "all" });
    $.each(dtInputCollection, function (index, item) {
        /*get rows in current order matching to input collection order*/
        var rowData = currData[index];
        var req_qty = ($(item).val() != '' ? parseInt($(item).val()) : 0);

        /*add to PurchaseRequsitionItem list to be added to PurchaseRequsition object*/
        inventory_item_arr.push({
            'ItemId': rowData[0],
            'Qty': req_qty
        });

        /*append to html table body (to be used in confirm dialog box)*/
        confirm_msg_tbl_body += '<tr><td>' + rowData[1] + '</td><td>' + req_qty + '</td><td>' + rowData[2] + '</td></tr>';
    });

    /*confirm msg body*/
    var msgBody = '';

    msgBody += '<p><b>Please confirm PR details !</b></p><br/>';
    msgBody += '<div class="row">';

    /*date picker*/
    msgBody += '<div class="form-group">';
    msgBody += '<label class="col-sm-3 control-label no-padding-right">Required by</label>';
    msgBody += '<div class="col-sm-6">';
    msgBody += '<input id="txt-req-date" class="col-xs-10 col-sm-10" type="text">';
    msgBody += '</div>';
    msgBody += '</div>';

    /*table*/
    msgBody += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    msgBody += '<div class="widget-box">';
    msgBody += '<div class="widget-header widget-header-small header-color-blue">';
    msgBody += '<h6 class="bigger lighter">PR Summary</h6>';
    msgBody += '</div>';
    msgBody += '<div class="widget-body">';
    msgBody += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    msgBody += '<thead style="font-weight: bold;">';
    msgBody += '<tr><td>Item</td><td>Order Qty</td><td>UOM</td></tr>';
    msgBody += '</thead>';
    msgBody += confirm_msg_tbl_body;
    msgBody += '</table>';
    msgBody += '</div>';
    msgBody += '</div>';

    msgBody += '</div>';

    bootbox.confirm(msgBody, function (result) {
        /*user has confirmed*/
        if (result) {
            if ($('#txt-req-date').val() != '') {
                var pr = {
                    'RequestedOn': moment().format('MM/DD/YYYY'),
                    'RequiredBy': $('#txt-req-date').val(),
                    'RequestedProducts': inventory_item_arr
                };

                var isSussess = AddPR(pr);

                if (isSussess) {
                    bootbox.alert('PR added successfully !', function () {
                        /*redraw table*/
                        DrawTable(GetPurchasingCartItems());
                    });
                }
                else {
                    bootbox.alert('Error occurred - add PR !');
                    return false;
                }
            }
            else {
                bootbox.alert('Date field required !');
                return false;
            }
        }
    });

    $('#txt-req-date').datepicker();
});

function IsNumberKey(event) {
    var key = window.event ? event.keyCode : event.which;

    if (event.keyCode == 8 || event.keyCode == 9 || event.keyCode == 46
     || event.keyCode == 37 || event.keyCode == 39) {
        return true;
    }
    else if (key < 48 || key > 57) {
        return false;
    }

    else return true;
};

function GetPurchasingCartItems() {
    /*temp data*/
    return [
            [1, 'dolamite', 'g', 20, 85000, 50000, 100000, 150000],
            [2, 'silica', 'g', 18, 100000, 140000, 0, 132800],
            [3, 'soda ash', 'g', 26, 75000, 50000, 0, 180000],
            [4, 'felspar', 'g', 12, 120000, 50000, 75000, 120000],
            [5, 'cullets', 'g', 10, 90000, 50000, 0, 168900]
    ];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPurchasingCartItems',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (/*msg.cartItems.length*/0 > 0) {

                $.each(msg.cartItems, function (index, item) {
                    aaDataArr.push(
                        item.ItemId,
                        item.ItemName,
                        item.UOM,
                        item.AverageLeadTime,
                        item.AvailableInStocks,
                        item.MinimumInventoryLevel,
                        item.TotalPendingPurchaseOrders,
                        item.CartQty)
                });
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetPurchasingCartItemsMappedWithTotalRawMaterialReqs() {
    /*temp data*/
    return [
            { 'ItemId': 1, 'ItemName': 'dolamite', 'UOM': 'g', 'CartQty': 85000, 'AverageLeadTime': 20, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 150000, 'TotalPendingPurchaseOrders': 100000, 'TotalPendingRequestsQty': 215995 },
            { 'ItemId': 2, 'ItemName': 'silica', 'UOM': 'g', 'CartQty': 100000, 'AverageLeadTime': 18, 'MinimumInventoryLevel': 140000, 'AvailableInStocks': 132800, 'TotalPendingPurchaseOrders': 0, 'TotalPendingRequestsQty': 105071 },
            { 'ItemId': 3, 'ItemName': 'soda ash', 'UOM': 'g', 'CartQty': 75000, 'AverageLeadTime': 26, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 180000, 'TotalPendingPurchaseOrders': 0, 'TotalPendingRequestsQty': 119300 },
            { 'ItemId': 4, 'ItemName': 'felspar', 'UOM': 'g', 'CartQty': 120000, 'AverageLeadTime': 12, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 120000, 'TotalPendingPurchaseOrders': 75000, 'TotalPendingRequestsQty': 151700 },
            { 'ItemId': 5, 'ItemName': 'cullets', 'UOM': 'g', 'CartQty': 90000, 'AverageLeadTime': 10, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 168900, 'TotalPendingPurchaseOrders': 0, 'TotalPendingRequestsQty': 282530 }
    ];

    var cartItems = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPurchasingCartItemsMappedWithTotalRawMaterialReqs',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.cartItems.length > 0) {
                cartItems = msg.cartItems;
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return cartItems;
}

function AddPR(pr) {

    var res = false;

    $.ajax({
        type: "POST",
        url: '/Store/AddPR',
        data: "{'pr':" + JSON.stringify(pr) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            res = msg.isSuccess;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return res;
}
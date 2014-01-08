var oTable_inv_order;

$(function () {
    oTable_inv_order = $('#inventory-req-list').dataTable(InventoryRequestsDataTableOptions(GetPendingRawMaterialRequests()));
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTable_inv_order == 'undefined') {
        oTable_inv_order = $('#inventory-req-list').dataTable(InventoryRequestsDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_inv_order.fnClearTable(0);
        oTable_inv_order.fnAddData(aaDataArr);
        oTable_inv_order.fnDraw();
    }
}

function InventoryRequestsDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Req. Id" },
            { "sTitle": "Customer Order. Id" },
            { "sTitle": "Production date" },
            { "sTitle": "Special Notes" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    {
                        "aTargets": [5],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ViewDetails(this)" class="blue" href="javascript:void(0);"><i class="icon-collapse bigger-130"></i></a></div>';
                        }
                    }
        ]
    };
}

function ViewDetails(element) {
    var nTr = $(element).parents('tr')[0];
    if (oTable_inv_order.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_inv_order.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_inv_order.fnOpen(nTr, fnFormatDetails(oTable_inv_order, nTr), 'details');
        /*load chart data*/
        var aData = oTable_inv_order.fnGetData(nTr);

        LoadChart(aData[0]);
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_inv_order, nTr) {
    var aData = oTable_inv_order.fnGetData(nTr);

    var reqId = aData[0],
        cust_orderId = aData[1];

    var requestedItems_arr = GetRawMaterialRequestDetails(reqId);

    var sOut = '';

    sOut = '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Raw Material request for Customer Order No: &nbsp;<i class="icon-double-angle-right"></i>' + cust_orderId + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table id="tbl-invent-order-' + reqId + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Avg.<br/>LT</td><td>Request</td><td>Available</td><td>Pending<br/>POs</td><td>Min.<br/>Ord Level</td><td>UOM</td><td>PR</td></tr>';
    sOut += '</thead>';

    if (requestedItems_arr.length > 0) {
        $.each(requestedItems_arr, function (index, rItm) {
            var available = rItm.AvailableInStocks;
            var minOrdLevel = rItm.MinimumInventoryLevel;

            sOut += '<tr><td>' + rItm.Name + '</td><td>' + rItm.AverageLeadTime + '</td><td>' + parseFloat(rItm.QtyRequested).toFixed(2) + '</td><td ' + (available < minOrdLevel ? 'style="color:red;"' : '') + '>' + parseFloat(available).toFixed(2) + '</td><td>' + rItm.TotalPendingPurchaseOrders + '</td><td>' + parseFloat(minOrdLevel).toFixed(2) + '</td><td>' + rItm.UOM + '</td><td><input class="chk-PR" type="checkbox" itemId="' + rItm.Id + '"/></td></tr>';
        });
    }
    else {
        sOut += '<tr><td colspan="8">No items found</td></tr>';
    }

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '<div class="col-xs-12 col-sm-12">';

    sOut += '<button class="btn btn-warning btn-sm" onclick="SendPR(' + reqId + ')"><i class="icon-shopping-cart"></i>&nbsp;Add to Purchasing Cart</button> &nbsp;&nbsp;';
    sOut += '<button class="btn btn-success btn-sm" onclick=IssueNote(' + reqId + ')><i class="icon-share-alt"></i>&nbsp;Issue Note</button>';

    sOut += '</div>';

    sOut += '</div>';
    /*charts*/
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div id="invent-chart-' + reqId + '" class="div-inventory-chart"></div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}

function LoadChart(reqId) {

    var requestedItems_arr = GetPendingRawMaterialRequestDetailsMappedToTotalPendingRequests(reqId);

    var category_arr = [],
        requested_arr = [],
        otherOrders_arr = [],
        available_arr = [],
        minOrderLevel_arr = [],
        pending_po_arr = [];

    $.each(requestedItems_arr, function (index, reqItem) {
        category_arr.push(reqItem.Name);
        requested_arr.push(reqItem.QtyRequested);
        otherOrders_arr.push((reqItem.TotalPendingRequestsQty - reqItem.QtyRequested));
        minOrderLevel_arr.push(reqItem.MinimumInventoryLevel);
        available_arr.push(reqItem.AvailableInStocks);
        pending_po_arr.push(reqItem.TotalPendingPurchaseOrders);
    });

    var series_arr = [{
        id: 1,
        name: 'Pending PO',
        data: pending_po_arr,
        stack: 'available',
        color: '#FF00FF'
    }, {
        id: 2,
        name: 'Available',
        data: available_arr,
        stack: 'available',
        color: '#2f7ed8'
    }, {
        id: 3,
        name: 'Requested',
        data: requested_arr,
        stack: 'request',
        color: '#0d233a'
    }, {
        id: 4,
        name: 'Min. Order Level',
        data: minOrderLevel_arr,
        stack: 'request',
        color: '#8bbc21'
    }, {
        id: 5,
        name: 'Other Orders',
        data: otherOrders_arr,
        stack: 'allorders',
        color: '#910000'
    }, {
        id: 6,
        name: 'Requested',
        data: requested_arr,
        stack: 'allorders',
        color: '#0d233a',
        /*hide in legend since this is already there on it*/
        showInLegend: false
    }, {
        id: 7,
        name: 'Min Order Level',
        data: minOrderLevel_arr,
        stack: 'allorders',
        color: '#8bbc21',
        /*hide in legend since this is already there on it*/
        showInLegend: false
    }];

    var options = {
        chart: {
            type: 'column',
            renderTo: 'invent-chart-' + reqId,
            zoomType: 'xy'
        },
        title: {
            text: 'Requested/Available'
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
                var text = '';
                // if (this.series.options.id != 1) {
                text = '<b>' + this.x + '</b><br/>' +
                    this.series.name + ': ' + this.y + '<br/>' +
                    'Total: ' + this.point.stackTotal;
                //}
                //else {
                //    text = '<b>' + this.x + '</b><br/>' +
                //       this.series.name + ': ' + this.y;
                //}

                return text;
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

function IssueNote(reqId) {

    var requestedItems_arr = GetRawMaterialRequestDetails(reqId);
    var isContainNegativeValues = false;

    var table_body = '';
    $.each(requestedItems_arr, function (index, rItm) {
        var available = parseFloat(rItm.AvailableInStocks);
        var requested = parseFloat(rItm.QtyRequested);
        var minOrderLevel = parseFloat(rItm.MinimumInventoryLevel);
        var balance = (available - requested);
        if (balance < 0) {
            isContainNegativeValues = true;
            /*break the loop*/
            return false;
        }

        table_body += '<tr><td>' + rItm.item + '</td><td>' + requested + '</td><td ' + (available < minOrderLevel ? 'style="color:red;"' : '') + '>' + available + '</td><td>' + minOrderLevel + '</td><td>' + rItm.UOM + '</td><td ' + (balance < 0 ? 'style="color:red;"' : '') + '>' + parseFloat(balance).toFixed(2) + '</td></tr>';
    });
    /*no sufficent stocks to issue*/
    if (!isContainNegativeValues) {

        bootbox.confirm(GetIssueNoteSummaryHtml(reqId, table_body), function (result) {
            /*user has confirmed*/
            if (result) {
                var isSuccess = AddIssueNote(reqId);
                if (isSuccess) {
                    bootbox.alert('Issued successfully!');
                }
                else {
                    bootbox.alert('Error occurred - issue note!');
                }
            }
        });
    }
    else {
        bootbox.alert('Insufficient stocks in hand !');
    }
}

function GetIssueNoteSummaryHtml(reqId, table_body) {

    var sOut = '';

    sOut += '<p><b>Are you sure you want to Issue this stock ? Please Re-verify with the following summary and confirm issuance of the same !</b></p><br/>';
    sOut += '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Raw materials request summary &nbsp;<i class="icon-double-angle-right"></i> Request No: ' + reqId + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead style="font-weight: bold;">';
    sOut += '<tr><td>Item</td><td>Request</td><td>Available</td><td>Min.<br/>Ord Level</td><td>UOM</td><td>Balance<br/>(3-2)</td></tr>';
    sOut += '</thead>';

    sOut += table_body;

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}

function SendPR(reqId) {

    var chkedItem = $('#tbl-invent-order-' + reqId + ' input.chk-PR:checked');
    var cartItem_arr = [];

    if (chkedItem.length > 0) {

        $.each(chkedItem, function (index, item) {
            cartItem_arr.push($(item).attr('itemId'));
        });

        var reqDetails = GetRawMaterialRequestDetails(reqId);
        var selectedItems_arr = [];
        var purchasingCart = [];

        $.each(cartItem_arr, function (index, item) {
            var temp = $.grep(reqDetails, function (e) { return e.Id == item; })
            if (temp.length > 0) {
                selectedItems_arr.push(temp[0]);

                purchasingCart.push({
                    'ItemId': temp[0].Id,
                    'Qty': temp[0].QtyRequested
                });
            }
        });

        bootbox.confirm(GetPRSummaryHtml(selectedItems_arr), function (result) {
            /*user has confirmed*/
            if (result) {

                var isSuccess = AddToPurchasingCart(purchasingCart);

                if (isSuccess) {
                    bootbox.alert("Items successfully added to purchasing cart !");
                }
                else {
                    bootbox.alert("error occurred - purchasing cart !");
                }
            }
        });
    }
    else {
        bootbox.alert("No item has been selected to add purchasing cart !");
    }
}

function GetPRSummaryHtml(selectedItems_arr) {

    var sOut = '';

    sOut += '<p><b>Are you sure you want to add following items to purchasing cart ? Please Re-verify and confirm the same !</b></p><br/>';
    sOut += '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Current purchasing cart summary</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead style="font-weight: bold;">';
    sOut += '<tr><td>Item</td><td>Request</td><td>Available</td><td>Min.<br/>Ord Level</td><td>Pending<br/>POs</td><td>UOM</td><td>Balance<br/>(3-2)</td></tr>';
    sOut += '</thead>';

    $.each(selectedItems_arr, function (index, rItm) {
        var available = parseFloat(rItm.AvailableInStocks);
        var requested = parseFloat(rItm.QtyRequested);
        var minOrderLevel = parseFloat(rItm.MinimumInventoryLevel);
        var balance = (available - requested);
        sOut += '<tr><td>' + rItm.Name + '</td><td>' + requested + '</td><td ' + (available < minOrderLevel ? 'style="color:red;"' : '') + '>' + available + '</td><td>' + minOrderLevel + '</td><td>' + rItm.TotalPendingPurchaseOrders + '</td><td>' + rItm.UOM + '</td><td ' + (balance < 0 ? 'style="color:red;"' : '') + '>' + parseFloat(balance).toFixed(2) + '</td></tr>';
    });

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}

function GetPendingRawMaterialRequests() {
    /*temp data *remove this after finalizing* */
    return [
        [10520, 1, moment("01-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 'To be dilivered to No.46, Colombo', 'Pending', null],
        [12410, 2, moment("12-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 'High priority client', 'Pending', null]
    ];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPendingRawMaterialRequests',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {

            if (/*msg.pending_req.length*/0 > 0) {

                $.each(msg.pending_req, function (index, item) {
                    aaDataArr.push(
                        item.Id,
                        item.CustomerOrderId,
                        item.RequiredDate,
                        item.SpecialNotes,
                        item.RequestState,
                        /*for expand button column*/null)
                });
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetRawMaterialRequestDetails(reqId) {
    /*temp data *remove this after finalizing* */
    return [
            { 'Id': 1, 'Name': 'dolamite', 'UOM': 'g', 'QtyRequested': 153575, 'AverageLeadTime': 20, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 150000, 'TotalPendingPurchaseOrders': 100000 },
            { 'Id': 2, 'Name': 'silica', 'UOM': 'g', 'QtyRequested': 47835, 'AverageLeadTime': 18, 'MinimumInventoryLevel': 140000, 'AvailableInStocks': 132800, 'TotalPendingPurchaseOrders': 0 },
            { 'Id': 3, 'Name': 'soda ash', 'UOM': 'g', 'QtyRequested': 64150, 'AverageLeadTime': 26, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 180000, 'TotalPendingPurchaseOrders': 0 },
            { 'Id': 4, 'Name': 'felspar', 'UOM': 'g', 'QtyRequested': 79250, 'AverageLeadTime': 12, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 120000, 'TotalPendingPurchaseOrders': 75000 },
            { 'Id': 5, 'Name': 'cullets', 'UOM': 'g', 'QtyRequested': 149900, 'AverageLeadTime': 10, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 168900, 'TotalPendingPurchaseOrders': 0 }];

    var raw_details = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetRawMaterialRequestDetails',
        data: "{'requestId':" + reqId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.details.length > 0) {
                raw_details = msg.details;
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return raw_details;
}

function GetPendingRawMaterialRequestDetailsMappedToTotalPendingRequests(reqId) {
    /*temp data *remove this after finalizing* */
    return [
            { 'Id': 1, 'Name': 'dolamite', 'UOM': 'g', 'QtyRequested': 153575, 'AverageLeadTime': 20, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 150000, 'TotalPendingRequestsQty': 215995, 'TotalPendingPurchaseOrders': 100000 },
            { 'Id': 2, 'Name': 'silica', 'UOM': 'g', 'QtyRequested': 47835, 'AverageLeadTime': 18, 'MinimumInventoryLevel': 140000, 'AvailableInStocks': 132800, 'TotalPendingRequestsQty': 105071, 'TotalPendingPurchaseOrders': 0 },
            { 'Id': 3, 'Name': 'soda ash', 'UOM': 'g', 'QtyRequested': 64150, 'AverageLeadTime': 26, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 180000, 'TotalPendingRequestsQty': 119300, 'TotalPendingPurchaseOrders': 0 },
            { 'Id': 4, 'Name': 'felspar', 'UOM': 'g', 'QtyRequested': 79250, 'AverageLeadTime': 12, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 120000, 'TotalPendingRequestsQty': 151700, 'TotalPendingPurchaseOrders': 75000 },
            { 'Id': 5, 'Name': 'cullets', 'UOM': 'g', 'QtyRequested': 149900, 'AverageLeadTime': 10, 'MinimumInventoryLevel': 50000, 'AvailableInStocks': 168900, 'TotalPendingRequestsQty': 282530, 'TotalPendingPurchaseOrders': 0 }];

    var raw_details = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPendingRawMaterialRequestDetailsMappedToTotalPendingRequests',
        data: "{'requestId':" + reqId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (msg.details.length > 0) {
                raw_details = msg.details;
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
    /*return empty array if ajax method does not return anything*/
    return raw_details;
}

function AddIssueNote(reqId) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Store/AddIssueNote',
        data: "{'rawMaterialReqId':" + reqId + "}",
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

function AddToPurchasingCart(purchasingCart) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Store/AddIssueNote',
        data: "{'purchasingCart':" + JSON.stringify(purchasingCart) + "}",
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
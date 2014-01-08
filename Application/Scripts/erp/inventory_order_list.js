var oTable;

$(function () {
    oTable = $('#inventory-req-list').dataTable(InventoryRequestsDataTableOptions());
});

function InventoryRequestsDataTableOptions() {

    var data = GetInventoryOrderList();
    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var order = [item.OrderId, item.ProductionDate, item.SpecialNotes, item.Status, null];
        aaDataArr.push(order);
    });

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Order. Id" },
            { "sTitle": "Production date" },
            { "sTitle": "Special Notes" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    {
                        "aTargets": [4],
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
    if (oTable.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable.fnOpen(nTr, fnFormatDetails(oTable, nTr), 'details');
        /*load chart data*/
        var aData = oTable.fnGetData(nTr);

        LoadChart(aData[0]);
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable, nTr) {
    var aData = oTable.fnGetData(nTr);

    var orderId = aData[0];
    /*get dummy data*/
    var requestedItems = GetInventoryOrderDetails(orderId);

    var sOut = '';

    sOut = '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Inventory request for Order No: &nbsp;<i class="icon-double-angle-right"></i>' + orderId + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table id="tbl-invent-order-' + orderId + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Avg.<br/>LT</td><td>Request</td><td>Available</td><td>Min.<br/>Ord Level</td><td>UOM</td><td>PR</td></tr>';
    sOut += '</thead>';

    $.each(requestedItems.ItemList, function (index, rItm) {
        var available = rItm.available;
        var minOrdLevel = rItm.minOrderLevel;
        sOut += '<tr><td>' + rItm.item + '</td><td>' + rItm.avgLeadTime + '</td><td>' + parseFloat(rItm.qty).toFixed(2) + '</td><td ' + (available < minOrdLevel ? 'style="color:red;"' : '') + '>' + parseFloat(available).toFixed(2) + '</td><td>' + parseFloat(rItm.minOrderLevel).toFixed(2) + '</td><td>' + rItm.UOM + '</td><td><input class="chk-PR" type="checkbox" itemId="' + rItm.id + '"/></td></tr>';
    });

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '<div class="col-xs-12 col-sm-12">';

    sOut += '<button class="btn btn-warning btn-sm" onclick="SendPR(' + orderId + ')">Add to Purchasing list</button> &nbsp;&nbsp;';
    sOut += '<button class="btn btn-success btn-sm" onclick=IssueNote(' + orderId + ')>Issue Note</button>';

    sOut += '</div>';

    sOut += '</div>';
    /*charts*/
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div id="invent-chart-' + orderId + '" class="div-inventory-chart"></div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}

function GetInventoryOrderList() {
    var orderlist = [
         {
             'OrderId': 10520,
             'ProductionDate': moment("01-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'SpecialNotes': 'To be dilivered to No.46, Colombo',
             'Status': 'P',
             'ItemList': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 153575, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 47835, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 64150, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 79250, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 149900, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }]
         },
         {
             'OrderId': 12410,
             'ProductionDate': moment("12-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'SpecialNotes': 'High priority client',
             'Status': 'P',
             'ItemList': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 62420, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 57236, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 55150, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 72450, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 132630, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }]
         }
    ];

    return orderlist;
}

function GetInventoryOrderDetails(orderId) {
    var orderList = GetInventoryOrderList();

    return $.grep(orderList, function (e) { return e.OrderId == orderId; })[0];
}

function LoadChart(orderId) {
    /*to be replaced by the backend*/
    var tempAllOrders = [215995, 105071, 119300, 151700, 282530];
    var orderDetails = GetInventoryOrderDetails(orderId);

    var category_arr = [];
    var requested_arr = [];
    var otherOrders_arr = [];
    var available_arr = [];
    var minOrderLevel_arr = [];
    $.each(orderDetails.ItemList, function (index, ordItm) {
        category_arr.push(ordItm.item);
        requested_arr.push(ordItm.qty);
        otherOrders_arr.push((tempAllOrders[index] - ordItm.qty));
        minOrderLevel_arr.push(ordItm.minOrderLevel);
        available_arr.push(ordItm.available);

    });

    var series_arr = [{
        id: 1,
        name: 'Available',
        data: available_arr,
        stack: 'available',
        color: '#2f7ed8'
    }, {
        id: 2,
        name: 'Requested',
        data: requested_arr,
        stack: 'request',
        color: '#0d233a'
    }, {
        id: 3,
        name: 'Min. Order Level',
        data: minOrderLevel_arr,
        stack: 'request',
        color: '#8bbc21'
    }, {
        id: 4,
        name: 'Other Orders',
        data: otherOrders_arr,
        stack: 'allorders',
        color: '#910000'
    }, {
        id: 5,
        name: 'Requested',
        data: requested_arr,
        stack: 'allorders',
        color: '#0d233a',
        /*hide in legend since this is already there on it*/
        showInLegend: false
    }, {
        id: 6,
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
            renderTo: 'invent-chart-' + orderId,
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
                if (this.series.options.id != 1) {
                    text = '<b>' + this.x + '</b><br/>' +
                        this.series.name + ': ' + this.y + '<br/>' +
                        'Total: ' + this.point.stackTotal;
                }
                else {
                    text = '<b>' + this.x + '</b><br/>' +
                       this.series.name + ': ' + this.y;
                }

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

function IssueNote(orderId) {
    bootbox.confirm(GetIssueNoteSummaryHtml(orderId), function (result) {
        /*user has confirmed*/
        if (result) {
            /*Store/AddIssueNote */
        }
    });
}

function GetIssueNoteSummaryHtml(orderId) {

    var requestedItems = GetInventoryOrderDetails(orderId);

    var sOut = '';

    sOut += '<p><b>Are you sure you want to Issue this stock ? Please Re-verify with the following summary and confirm issuance of the same !</b></p><br/>';
    sOut += '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Inventory Summary &nbsp;<i class="icon-double-angle-right"></i> Order No: ' + orderId + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead style="font-weight: bold;">';
    sOut += '<tr><td>Item</td><td>Request</td><td>Available</td><td>Min.<br/>Ord Level</td><td>UOM</td><td>Balance</td></tr>';
    sOut += '</thead>';

    $.each(requestedItems.ItemList, function (index, rItm) {
        var available = parseFloat(rItm.available);
        var requested = parseFloat(rItm.qty);
        var minOrderLevel = parseFloat(rItm.minOrderLevel);
        var balance = (available - requested);
        sOut += '<tr><td>' + rItm.item + '</td><td>' + requested + '</td><td ' + (available < minOrderLevel ? 'style="color:red;"' : '') + '>' + available + '</td><td>' + minOrderLevel + '</td><td>' + rItm.UOM + '</td><td ' + (balance < 0 ? 'style="color:red;"' : '') + '>' + parseFloat(balance).toFixed(2) + '</td></tr>';
    });

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}

function SendPR(orderId) {

    var chkedItem = $('#tbl-invent-order-' + orderId + ' input.chk-PR:checked');
    var orderedItem_arr = [];
    if (chkedItem.length > 0) {
        $.each(chkedItem, function (index, item) {
            orderedItem_arr.push($(item).attr('itemId'));
        });

        var orderDetails = GetInventoryOrderDetails(orderId);
        var selectedItems_arr = [];
        $.each(orderedItem_arr, function (index, item) {
            var temp = $.grep(orderDetails.ItemList, function (e) { return e.id == item; })
            if (temp.length > 0) {
                selectedItems_arr.push(temp[0]);
            }
        });

        bootbox.confirm(GetPRSummaryHtml(selectedItems_arr), function (result) {
            /*user has confirmed*/
            if (result) {
            }
        });
    }
    else {
        bootbox.alert("No item has been selected to add PR !");
    }
}

function GetPRSummaryHtml(selectedItems_arr) {

    var sOut = '';

    sOut += '<p><b>Are you sure you want to add following items to purchasing list ? Please Re-verify and confirm the same !</b></p><br/>';
    sOut += '<div class="row">';
    /*table*/
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">Current purchasing list summary</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead style="font-weight: bold;">';
    sOut += '<tr><td>Item</td><td>Request</td><td>Available</td><td>Min.<br/>Ord Level</td><td>UOM</td><td>Balance</td></tr>';
    sOut += '</thead>';

    $.each(selectedItems_arr, function (index, rItm) {
        var available = parseFloat(rItm.available);
        var requested = parseFloat(rItm.qty);
        var minOrderLevel = parseFloat(rItm.minOrderLevel);
        var balance = (available - requested);
        sOut += '<tr><td>' + rItm.item + '</td><td>' + requested + '</td><td ' + (available < minOrderLevel ? 'style="color:red;"' : '') + '>' + available + '</td><td>' + minOrderLevel + '</td><td>' + rItm.UOM + '</td><td ' + (balance < 0 ? 'style="color:red;"' : '') + '>' + parseFloat(balance).toFixed(2) + '</td></tr>';
    });

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';

    sOut += '</div>';

    return sOut;
}
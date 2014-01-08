var oTable, chart, currData = [];

$(function () {
    oTable = $('#PR-item-list').dataTable(PRDataTableOptions());
    LoadChart();
});

function PRDataTableOptions() {

    var data = GetPRItemDetails();
    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var order = [item.id, item.item, item.UOM, item.avgLeadTime, (item.available + ' ( ' + item.minOrderLevel + ' )'), item.qty];
        aaDataArr.push(order);
    });

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
            { "sTitle": "Available<br/>(Min. Order Level)" },
            { "sTitle": "Request" }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [5],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {

                            return '<input type="text" itemId="' + full[0] + '" class="req-val" style="width:100px;" value="' + full[5] + '" onkeypress="return IsNumberKey(event);"/>';
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

function GetPRItemDetails() {
    return [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 85000, 'avgLeadTime': 20, 'minOrderLevel': 50000, 'available': 150000 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 100000, 'avgLeadTime': 18, 'minOrderLevel': 140000, 'available': 132800 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 75000, 'avgLeadTime': 26, 'minOrderLevel': 50000, 'available': 180000 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 120000, 'avgLeadTime': 12, 'minOrderLevel': 50000, 'available': 120000 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 90000, 'avgLeadTime': 10, 'minOrderLevel': 50000, 'available': 168900 }];
}

function GetPRItemRequestedQty(itemId) {
    var prItems = GetPRItemDetails();

    return $.grep(prItems, function (e) { return e.id == itemId; })[0].qty;
}

function LoadChart() {

    var prDetails = GetPRItemDetails();

    var category_arr = [];
    var available_arr = [];
    var minOrderLevel_arr = [];
    var prRequest_arr = [];

    $.each(prDetails, function (index, prItm) {
        category_arr.push(prItm.item);
        minOrderLevel_arr.push(prItm.minOrderLevel);
        available_arr.push(prItm.available);
        prRequest_arr.push(prItm.qty);
    });

    /*if you change the order of the columns make sure you change the index of PR column on $('#btn-update-chart').click() function*/
    var series_arr = [{
        id: 1,
        name: 'PR',
        data: prRequest_arr,
        stack: 'inhand'
    }, {
        id: 2,
        name: 'Available',
        data: available_arr,
        stack: 'inhand'
    }, {
        id: 3,
        name: 'All Orders',
        data: [215995, 105071, 119300, 151700, 282530],
        stack: 'orders'
    }, {
        id: 4,
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
    var dtInputCollection = oTable.$("input:text.req-val", { "page": "all" });
    var datatable_content = oTable.fnGetData();
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
    var confirm_msg_tbl_body = '';
    var dtInputCollection = oTable.$("input:text.req-val", { "page": "all" });
    $.each(dtInputCollection, function (index, item) {
        /*get rows in current order matching to input collection order*/
        var rowData = currData[index];
        /*append to html table body (to be used in confirm dialog box)*/
        confirm_msg_tbl_body += '<tr><td>' + rowData[1] + '</td><td>' + ($(item).val() != '' ? parseInt($(item).val()) : 0) + '</td><td>' + rowData[2] + '</td></tr>';
    });

    /*confirm msg body*/
    var msgBody = '';

    msgBody += '<p><b>Please confirm PR details !</b></p><br/>';
    msgBody += '<div class="row">';
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
        }
    });
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
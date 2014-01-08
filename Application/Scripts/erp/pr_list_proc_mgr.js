var oTable, sumTable, chart;

$(function () {
    LoadPRCharts();

    var main_table_data = GetPendingPRList();
    oTable = $('#PR-list').dataTable(PRListDataTableOptions(main_table_data));

    var summary_table_data = GetSummary(null);
    sumTable = $('#PR-summary').dataTable(PRSummaryDataTableOptions(summary_table_data));

    /*related to model popup*/
    $('#datepicker-duedate').datepicker();

    $('#select-items').select2({
        placeholder: "Select items",
        width: '300px',
        closeOnSelect: false
    });

    $('#select-suppliers').select2({
        placeholder: "Select suppliers",
        width: '300px',
        closeOnSelect: false
    });
});

function PRListDataTableOptions(data) {


    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var pr = [null, item.PrId, item.PrDate, item.Status, null];
        aaDataArr.push(pr);
    });

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "mData": null },
            { "sTitle": "PR. Id" },
            { "sTitle": "PR date" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    {
                        "aTargets": [0],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<input class="chk-pr" type="checkbox" prId=\"' + full[1] + '\" checked>';
                        }
                    },
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

function PRSummaryDataTableOptions(data) {

    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var pr = [item.id, null, item.item, item.UOM, item.qty, item.avgLeadTime];
        aaDataArr.push(pr);
    });

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": 'ItemId' },
            { "mData": null },
            { "sTitle": "Item" },
            { "sTitle": "UOM" },
            { "sTitle": "Qty" },
            { "sTitle": "Avg. LT" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                     { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                     {
                         "aTargets": [1],
                         "mData": null,
                         "bSearchable": false,
                         "bSortable": false,
                         "mRender": function (data, type, full) {
                             return '<input class="chk-pr-sum" type="checkbox" itemId=\"' + full[0] + '\" checked>';
                         }
                     },
                     {
                         "aTargets": [6],
                         "mData": null,
                         "bSearchable": false,
                         "bSortable": false,
                         "mRender": function (data, type, full) {
                             return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ViewSupplyHistory(this)" class="blue" href="javascript:void(0);"><i class="icon-collapse bigger-130"></i></a></div>';
                         }
                     }
        ],
        "fnCreatedRow": function (nRow, aData, iDataIndex) {
            $(nRow).attr('id', aData[0]);
        }
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
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable, nTr) {
    var aData = oTable.fnGetData(nTr);

    var prId = aData[1];
    /*get dummy data*/
    var requestedItems = GetPrDetails(prId);

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';

    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">PR No: &nbsp;<i class="icon-double-angle-right"></i>' + prId + '</h6>';
    sOut += '</div>';

    sOut += '<div class="widget-body">';

    sOut += '<table id="tbl-pr-' + prId + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>UOM</td><td>Qty</td><td>Avg. LT</td></tr>';
    sOut += '</thead>';
    $.each(requestedItems.ItemList, function (index, rItm) {

        sOut += '<tr><td>' + rItm.item + '</td><td>' + rItm.UOM + '</td><td>' + rItm.qty + '</td><td>' + rItm.avgLeadTime + '</td></tr>';
    });
    sOut += '</table>';

    sOut += '</div>';

    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

function GetSummary(prId_arr) {
    var itemlist = [];
    /*get all items*/
    if (prId_arr == null) {
        var prList = GetPendingPRList();
        $.each(prList, function (index, item) {

            $.each(item.ItemList, function (sindex, sitem) {
                var existingItem = $.grep(itemlist, function (e) { return e.id == sitem.id; });
                /*if there is no item matching in the array add new item*/
                if (existingItem.length == 0) {
                    itemlist.push(sitem);
                }
                else {
                    /*alter values in 1st matching item from the return array*/
                    existingItem[0].qty += sitem.qty;
                }
            });
        });
    }
    else {

        for (var i = 0; i < prId_arr.length; i++) {
            var prList = $.grep(GetPendingPRList(), function (e) { return e.PrId == prId_arr[i]; })
            $.each(prList, function (index, item) {

                $.each(item.ItemList, function (sindex, sitem) {
                    var existingItem = $.grep(itemlist, function (e) { return e.id == sitem.id; });
                    /*if there is no item matching in the array add new item*/
                    if (existingItem.length == 0) {
                        itemlist.push(sitem);
                    }
                    else {
                        /*alter values in 1st matching item from the return array*/
                        existingItem[0].qty += sitem.qty;
                    }
                });
            });
        }
    }

    return itemlist;
}

function GetPendingPRList() {
    var prlist = [
         {
             'PrId': 10520,
             'PrDate': moment("01-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'Status': 'P',
             'ItemList': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 153575, 'avgLeadTime': 20 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 47835, 'avgLeadTime': 18 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 64150, 'avgLeadTime': 26 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 79250, 'avgLeadTime': 12 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 149900, 'avgLeadTime': 10 }]
         },
         {
             'PrId': 12410,
             'PrDate': moment("12-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'Status': 'P',
             'ItemList': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 62420, 'avgLeadTime': 20 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 57236, 'avgLeadTime': 18 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 55150, 'avgLeadTime': 26 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 72450, 'avgLeadTime': 12 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 132630, 'avgLeadTime': 10 }]
         }
    ];

    return prlist;
}

function GetPrDetails(prId) {
    var prList = GetPendingPRList();

    return $.grep(prList, function (e) { return e.PrId == prId; })[0];
}

$('#btn-update-summary').click(function () {
    var rowcollection = oTable.$("input:checkbox.chk-pr:checked", { "page": "all" });
    var prId_arr = [];

    rowcollection.each(function (index, elem) {
        prId_arr.push($(elem).attr("prId"));
    });

    /*temporarily save PR ids selected for get the summary, to be used to update the status when calling quotations*/
    $('#hf-prIds').val(prId_arr.join(','));

    /*regenerate summary*/
    var data = GetSummary(prId_arr);
    /*redraw summary table*/
    RedrawSummaryTable(data);
});

function ViewSupplyHistory(element) {
    var nTr = $(element).parents('tr')[0];
    if (sumTable.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        sumTable.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');

        var aData = sumTable.fnGetData(nTr);
        var itemId = aData[0];
        sumTable.fnOpen(nTr, fnFormatSupplyHistoryDetails(itemId), 'details');

        LoadSupplyHistoryOfItem_Chart(itemId);
    }
}

/* Formating function for row details */
function fnFormatSupplyHistoryDetails(itemId) {

    var sOut = '';

    sOut = '<div class="row">';
    /*chart will be loaded here*/
    sOut += '<div id="div-sup-hist-' + itemId + '" class="col-xs-12 col-sm-12 widget-container-span" style="min-height:300px;">';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

function LoadSupplyHistoryOfItem_Chart(itemId) {
    var series_arr = [];

    var itemSupplyHistory = GetSuppliyHistoryByItem(itemId);
    if (itemSupplyHistory != null) {

        $.each(itemSupplyHistory.SupplierList, function (index, supplier) {

            series_arr.push({
                'name': supplier.Supplier,
                'data': [supplier.AvgLeadTime]
            });

        });

        var options = {
            chart: {
                type: 'column',
                renderTo: ('div-sup-hist-' + itemId),
                zoomType: 'xy'
            },
            title: {
                text: 'Avg. Lead time / Supplier'
            },
            subtitle: {
                text: 'ceyglass.lk'
            },
            xAxis: {
                categories: [itemSupplyHistory.Item],
                title: {
                    text: 'Supplier(s)'
                }
            },
            series: series_arr,
            yAxis: {
                min: 0,
                title: {
                    text: 'lead time'
                }
            },
            plotOptions: {
                line: {
                    dataLabels: {
                        enabled: true
                    }
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
}

function GetSuppliyHistoryByItem(itemId) {
    var supHistory = GetSupplyHistory();

    return $.grep(supHistory, function (e) { return e.ItemId == itemId; })[0];
}

function GetSupplyHistory() {
    var history = [
        {
            'ItemId': 1,
            'Item': 'dolamite',
            'SupplierList': [
                { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 19 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 22 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 20 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 17 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 21 }
            ]
        },
        {
            'ItemId': 2,
            'Item': 'silica',
            'SupplierList': [
                { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 15 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 20 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 14 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 19 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 18 },
                { 'id': 6, 'Supplier': 'Supplier 6', 'AvgLeadTime': 16 },
                { 'id': 7, 'Supplier': 'Supplier 7', 'AvgLeadTime': 21 },
                { 'id': 8, 'Supplier': 'Supplier 8', 'AvgLeadTime': 16 }
            ]
        },
        {
            'ItemId': 3,
            'Item': 'soda ash',
            'SupplierList': [
                { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 30 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 28 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 24 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 25 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 26 },
                { 'id': 6, 'Supplier': 'Supplier 6', 'AvgLeadTime': 27 },
                { 'id': 7, 'Supplier': 'Supplier 7', 'AvgLeadTime': 28 }
            ]
        },
        {
            'ItemId': 4,
            'Item': 'felspar',
            'SupplierList': [
                { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 10 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 12 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 14 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 13 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 11 }
            ]
        },
        {
            'ItemId': 5,
            'Item': 'cullets',
            'SupplierList': [
                { 'id': 1, 'Supplier': 'Supplier 1', 'AvgLeadTime': 8 },
                { 'id': 2, 'Supplier': 'Supplier 2', 'AvgLeadTime': 11 },
                { 'id': 3, 'Supplier': 'Supplier 3', 'AvgLeadTime': 9 },
                { 'id': 4, 'Supplier': 'Supplier 4', 'AvgLeadTime': 10 },
                { 'id': 5, 'Supplier': 'Supplier 5', 'AvgLeadTime': 9 }
            ]
        }
    ];

    return history;
}

function LoadPRCharts() {

    var cat_arr = [];
    var series_arr = [];

    var supplyHistory = GetSupplyHistory();

    $.each(supplyHistory, function (index, item) {
        cat_arr.push(item.Item);
    });

    series_arr.push({
        'name': 'Supplier 1',
        'data': [19, 15, 30, 10, 8]
    },
    {
        'name': 'Supplier 2',
        'data': [22, 20, 28, 12, 11]
    },
    {
        'name': 'Supplier 3',
        'data': [20, 14, 24, 14, 9]
    },
    {
        'name': 'Supplier 4',
        'data': [17, 19, 25, 13, 10]
    }, {
        'name': 'Supplier 5',
        'data': [21, 18, 26, 11, 9]
    }, {
        'name': 'Supplier 6',
        'data': [null, 16, 27, null, null]
    }, {
        'name': 'Supplier 7',
        'data': [null, 21, 28, null, null]
    },
    {
        'name': 'Supplier 8',
        'data': [null, 16, null, null, null]
    });


    var options = {
        chart: {
            type: 'line',
            renderTo: 'div-PR-chart',
            zoomType: 'xy'
        },
        title: {
            text: 'Avg. Lead Time/ Supplier'
        },
        subtitle: {
            text: 'ceyglass.lk'
        },
        xAxis: {
            categories: cat_arr,
            title: {
                text: 'items'
            }
        },
        series: series_arr,
        yAxis: {
            min: 0,
            max: 50,
            title: {
                text: 'Avg. Lead time'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
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
/*update chart data*/
$('#btn-redraw-chart').click(function () {
    var start = $('#txt-range-start').val().trim() == '' ? 0 : parseInt($('#txt-range-start').val().trim());
    var end = $('#txt-range-end').val().trim() == '' ? 0 : parseInt($('#txt-range-end').val().trim());

    if (start > 0 || end > 0) {
        /*rearange*/
        if (start > end) {
            var temp = end;
            end = start;
            start = temp;
        }

        /*new array filtered by the selected range*/
        var series_arr = [];

        series_arr.push({
            'name': 'Supplier 1',
            'data': [null, 16, 27, null, null]
        },
        {
            'name': 'Supplier 2',
            'data': [null, 16, 27, null, null]
        },
        {
            'name': 'Supplier 3',
            'data': [null, 16, 27, null, null]
        },
        {
            'name': 'Supplier 4',
            'data': [null, 16, 27, null, null]
        }, {
            'name': 'Supplier 5',
            'data': [null, 16, 27, null, null]
        }, {
            'name': 'Supplier 6',
            'data': [null, 16, 27, null, null]
        }, {
            'name': 'Supplier 7',
            'data': [null, 21, 28, null, null]
        },
        {
            'name': 'Supplier 8',
            'data': [null, 16, null, null, null]
        });


        $.each(chart.series, function (index, item) {
            item.setData(series_arr[index].data);
        });

    }
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

$('#btn-call-quotations').click(function () {
    /*initially clear form data if exists*/
    ClearFields();
    var form_item_html = '';
    /*checked nodes*/
    var rowcollection = sumTable.$("input:checkbox.chk-pr-sum:checked", { "page": "all" });
    /*table rows*/
    var tableRows = sumTable.fnGetNodes();

    $.each(rowcollection, function (index, item) {
        /*get matched row from the data table*/
        var matchedRow = $.grep(tableRows, function (e) { return e.id == $(item).attr('itemId'); })[0];
        /*get rowdata*/
        var data = sumTable.fnGetData(matchedRow);
        /*get item details to the form*/
        form_item_html += GetQuotationItemHtml(data[0], data[2], data[3], data[4]);
    });

    $('#div-qutation-selected-item-list').append(form_item_html);

    /*open poup form*/
    $('#model-quotation').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });

});

$('#btn-form-call-quotation').click(function () {

    /*save quotation*/
    /*save_function();*/

    /*update PR status*/
    var prId_arr = $('#hf-prIds').val().split(',');
    /*change PR status*/
    /*changeFunction()*/

    bootbox.alert("Quotations are successfully ditributed among suppliers !", function () {
        /*after confirm the alert, clear the fields and close the window*/
        ClearFields();

        /*redraw main table*/
        var main_table_data = GetPendingPRList();
        RedrawMainTable(main_table_data);

        /*redraw summary table*/
        var summary_table_data = GetSummary(null);
        RedrawSummaryTable(summary_table_data);

        $('#model-quotation').modal('hide');
    });


});

$('#file-attachment').ace_file_input({
    no_file: 'No File ...',
    btn_choose: 'Choose',
    btn_change: 'Change',
    droppable: false,
    onchange: null,
    thumbnail: false //| true | large
    //whitelist:'gif|png|jpg|jpeg'
    //blacklist:'exe|php'
    //onchange:''
    //
});

$('#btn-add-items').click(function () {
    var html = '';

    if ($('#select-items :selected').length > 0) {
        var $container = $('#div-qutation-selected-item-list');
        /*currently if there are no items clear the message and then append items*/
        if ($container.find('.quotation-selected-item').length == 0) {
            $container.html('');
        }

        $('#select-items :selected').each(function (index, item) {
            if ($container.find('input#itemid-' + $(item).val()).length == 0) {
                html += GetQuotationItemHtml($(item).val(), $(item).text(), $(item).attr('uom'), 0);
            }
        });

        $container.append(html);
        /*clear item list selected*/
        $('#select-items').select2('data', null);
    }
    else {
        bootbox.alert("No items has been selected for add to quotation !");
    }
});

function GetQuotationItemHtml(id, text, uom, value) {
    var html = '';

    html += '<div class="quotation-selected-item row" style="margin-bottom:5px;">';
    html += '<label class="col-sm-6">' + text + ' ( ' + uom + ' )' + '</label>&nbsp;';
    html += '<input id="itemid-' + id + '" class="input-sm col-xs-3" type="number" value="' + (value > 0 ? value : '') + '" onkeypress="return IsNumberKey(event);" /> &nbsp;';
    html += '<button class="btn btn-danger btn-xs" onclick="RemoveQuotationItem(this);">';
    html += '<i class="icon-trash bigger-110 icon-only"></i>';
    html += '</button>';
    html += '</div>';

    return html;
}

function RemoveQuotationItem(element) {
    $(element).parent('div.quotation-selected-item').remove();

    if ($('#div-qutation-selected-item-list').find('.quotation-selected-item').length == 0) {
        $('#div-qutation-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for quotation</span>');
    }
}

function ClearFields() {
    $('#txt-title').val('');
    $('#datepicker-duedate').val('');
    $('#select-items').select2('data', null);
    $('#select-suppliers').select2('data', null);
    $('#div-qutation-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for quotation</span>');
    $('#txt-description').val('');
    $('#file-attachment').siblings('a').click();
}

function RedrawMainTable(data) {
    /*if there is no table create and assign data*/
    if (typeof oTable == 'undefined') {
        oTable = $('#PR-list').dataTable(PRListDataTableOptions(data));
    }
        /*clear existing content and add new values*/
    else {
        var aaDataArr = [];
        /*generate rows*/
        $.each(data, function (index, item) {
            var pr = [null, item.PrId, item.PrDate, item.Status, null];
            aaDataArr.push(pr);
        });

        oTable.fnClearTable(0);
        oTable.fnAddData(aaDataArr);
        oTable.fnDraw();
    }
}

function RedrawSummaryTable(data) {
    /*if there is no table create and assign data*/
    if (typeof sumTable == 'undefined') {
        sumTable = $('#PR-summary').dataTable(PRSummaryDataTableOptions(data));
    }
        /*clear existing content and add new values*/
    else {
        var aaDataArr = [];
        /*generate rows*/
        $.each(data, function (index, item) {
            var pr = [item.id, null, item.item, item.UOM, item.qty, item.avgLeadTime];
            aaDataArr.push(pr);
        });

        sumTable.fnClearTable(0);
        sumTable.fnAddData(aaDataArr);
        sumTable.fnDraw();
    }
}
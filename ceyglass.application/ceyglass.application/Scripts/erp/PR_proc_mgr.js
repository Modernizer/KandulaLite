var oTable_PR_proc, oTable_PR_proc_summary, chart;

$(function () {
    LoadPRCharts();

    var main_table_data = GetPendingPRListToPurchase();
    oTable_PR_proc = $('#PR-list').dataTable(PRListDataTableOptions(main_table_data));

    var summary_table_data = GetPRSummary(null);
    oTable_PR_proc_summary = $('#PR-summary').dataTable(PRSummaryDataTableOptions(summary_table_data));

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

    FillRawMaterialCombo();
    FillSupplierCombo();
});

/*chart data is hard coded for demonstration purposes*/
function LoadPRCharts() {

    var cat_arr = [];
    var series_arr = [];

    var supplyHistory = GetSupplyHistory();

    $.each(supplyHistory, function (index, item) {
        cat_arr.push(item.Item);
    });

    /*dummy data*/
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

function PRListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "mData": null },
            { "sTitle": "Id" },
            { "sTitle": "Requested Date" },
            { "sTitle": "Required By" },
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
    if (oTable_PR_proc.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_PR_proc.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_PR_proc.fnOpen(nTr, fnFormatDetails(oTable_PR_proc, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_PR_proc, nTr) {
    var aData = oTable_PR_proc.fnGetData(nTr);

    var prId = aData[1];

    var requestedItems = GetPrDetailsById(prId);

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
    $.each(requestedItems, function (index, rItm) {

        sOut += '<tr><td>' + rItm.Name + '</td><td>' + rItm.UOM + '</td><td>' + rItm.Qty + '</td><td>' + rItm.AverageLeadTime + '</td></tr>';
    });
    sOut += '</table>';

    sOut += '</div>';

    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

function PRSummaryDataTableOptions(aaDataArr) {

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

$('#btn-update-summary').click(function () {
    var rowcollection = oTable_PR_proc.$("input:checkbox.chk-pr:checked", { "page": "all" });
    var prId_arr = [],
        pr_obj_arr = [];

    rowcollection.each(function (index, elem) {
        prId_arr.push($(elem).attr("prId"));
        pr_obj_arr.push({ 'Id': $(elem).attr("prId") });
    });

    /*temporarily save PR ids selected for get the summary, to be used to update the status when calling quotations*/
    $('#hf-prIds').val(prId_arr.join(','));

    /*regenerate summary*/
    var aaDataArr = GetPRSummary(pr_obj_arr);
    /*redraw summary table*/
    RedrawSummaryTable(aaDataArr);
});

function ViewSupplyHistory(element) {
    var nTr = $(element).parents('tr')[0];
    if (oTable_PR_proc_summary.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_PR_proc_summary.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');

        var aData = oTable_PR_proc_summary.fnGetData(nTr);
        var itemId = aData[0];
        oTable_PR_proc_summary.fnOpen(nTr, fnFormatSupplyHistoryDetails(itemId), 'details');

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

/*supplier history reflects dummy data for demonstration purposes*/
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

$('#btn-call-quotations').click(function () {
    /*initially clear form data if exists*/
    ClearFields();
    var form_item_html = '';
    /*checked nodes*/
    var rowcollection = oTable_PR_proc_summary.$("input:checkbox.chk-pr-sum:checked", { "page": "all" });
    /*table rows*/
    var tableRows = oTable_PR_proc_summary.fnGetNodes();

    $.each(rowcollection, function (index, item) {
        /*get matched row from the data table*/
        var matchedRow = $.grep(tableRows, function (e) { return e.id == $(item).attr('itemId'); })[0];
        /*get rowdata*/
        var data = oTable_PR_proc_summary.fnGetData(matchedRow);
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
    var isQuotationAddedSuccess = AddQuotation();

    /*update PR status*/
    var isPrStatusChangedSuccess = UpdatePRStatusToQuotationsCalled();

    if (isQuotationAddedSuccess && isPrStatusChangedSuccess) {
        bootbox.alert("Quotations are successfully ditributed among suppliers !", function () {
            /*after confirm the alert, clear the fields and close the window*/
            ClearFields();

            /*redraw main table*/
            var main_table_data = GetPendingPRListToPurchase();
            RedrawMainTable(main_table_data);

            /*redraw summary table*/
            var summary_table_data = GetPRSummary(null);
            RedrawSummaryTable(summary_table_data);

            $('#model-quotation').modal('hide');
        });
    }
    else {
        if (!isQuotationAddedSuccess) {
            bootbox.alert('error occurred - Add quotation !');
        }

        if (!isPrStatusChangedSuccess) {
            bootbox.alert('error occurred -Change PR status !');
        }
    }

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
    html += '<input id="itemid-' + id + '" itemId="' + id + '" class="input-sm col-xs-3" type="number" value="' + (value > 0 ? value : '') + '" onkeypress="return IsNumberKey(event);" /> &nbsp;';
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
    $('#div-qutation-selected-item-list').html('');
    $('#txt-description').val('');
    $('#file-attachment').siblings('a').click();
}

function RedrawMainTable(aaDataArr) {
    /*if there is no table create and assign data*/
    if (typeof oTable_PR_proc == 'undefined') {
        oTable_PR_proc = $('#PR-list').dataTable(PRListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_PR_proc.fnClearTable(0);
        oTable_PR_proc.fnAddData(aaDataArr);
        oTable_PR_proc.fnDraw();
    }
}

function RedrawSummaryTable(aaDataArr) {
    /*if there is no table create and assign data*/
    if (typeof oTable_PR_proc_summary == 'undefined') {
        oTable_PR_proc_summary = $('#PR-summary').dataTable(PRSummaryDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {

        oTable_PR_proc_summary.fnClearTable(0);
        oTable_PR_proc_summary.fnAddData(aaDataArr);
        oTable_PR_proc_summary.fnDraw();
    }
}

function GetPendingPRListToPurchase() {
    /*temp data*/
    var temp = [
        { 'Id': 1, 'RequestedOn': '10/05/2013', 'RequiredBy': '12/01/2013', 'Status': 'Pending' },
        { 'Id': 2, 'RequestedOn': '10/12/2013', 'RequiredBy': '11/20/2013', 'Status': 'Pending' },
        { 'Id': 3, 'RequestedOn': '10/18/2013', 'RequiredBy': '12/31/2013', 'Status': 'Pending' }
    ];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPendingPRListToPurchase',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            // if (msg.pendingPrs.length > 0) {
            $.each(/*msg.pendingPrs*/temp, function (index, item) {
                aaDataArr.push([
                    null /*checkbox column*/,
                    item.Id,
                    item.RequestedOn,
                    item.RequiredBy,
                    item.Status,
                    null/*expanding column*/]);
            });
            //}
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetPrDetailsById(prId) {
    /*temp data*/
    return [{ 'ItemId': 1, 'Name': 'dolamite', 'UOM': 'g', 'Qty': 153575, 'AverageLeadTime': 20 },
            { 'ItemId': 2, 'Name': 'silica', 'UOM': 'g', 'Qty': 47835, 'AverageLeadTime': 18 },
            { 'ItemId': 3, 'Name': 'soda ash', 'UOM': 'g', 'Qty': 64150, 'AverageLeadTime': 26 },
            { 'ItemId': 4, 'Name': 'felspar', 'UOM': 'g', 'Qty': 79250, 'AverageLeadTime': 12 },
            { 'ItemId': 5, 'Name': 'cullets', 'UOM': 'g', 'Qty': 149900, 'AverageLeadTime': 10 }];

    var items = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPrDetailsById',
        data: "{'prId':" + prId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            items = msg.items;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return items;
}

function GetAllPendingPRDetailsSummary() {
    /*temp data*/
    return [{ 'ItemId': 1, 'Name': 'dolamite', 'UOM': 'g', 'Qty': 153575, 'AverageLeadTime': 20 },
            { 'ItemId': 2, 'Name': 'silica', 'UOM': 'g', 'Qty': 47835, 'AverageLeadTime': 18 },
            { 'ItemId': 3, 'Name': 'soda ash', 'UOM': 'g', 'Qty': 64150, 'AverageLeadTime': 26 },
            { 'ItemId': 4, 'Name': 'felspar', 'UOM': 'g', 'Qty': 79250, 'AverageLeadTime': 12 },
            { 'ItemId': 5, 'Name': 'cullets', 'UOM': 'g', 'Qty': 149900, 'AverageLeadTime': 10 }];

    var items = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetAllPendingPRDetailsSummary',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            items = msg.items;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return items;
}

function GetPRDetailsSummaryOfSelectedPendingPRs(pr_arr) {
    /*temp data*/
    return [{ 'ItemId': 1, 'Name': 'dolamite', 'UOM': 'g', 'Qty': 153575, 'AverageLeadTime': 20 },
            { 'ItemId': 2, 'Name': 'silica', 'UOM': 'g', 'Qty': 47835, 'AverageLeadTime': 18 },
            { 'ItemId': 3, 'Name': 'soda ash', 'UOM': 'g', 'Qty': 64150, 'AverageLeadTime': 26 },
            { 'ItemId': 4, 'Name': 'felspar', 'UOM': 'g', 'Qty': 79250, 'AverageLeadTime': 12 },
            { 'ItemId': 5, 'Name': 'cullets', 'UOM': 'g', 'Qty': 149900, 'AverageLeadTime': 10 }];

    var items = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPRDetailsSummaryOfSelectedPendingPRs',
        data: "{'pr':" + JSON.stringify(pr_arr) + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            items = msg.items;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return items;
}

function GetPRSummary(pr_arr) {
    var aaDataArr = [];
    var items = [];
    /*get all items*/
    if (pr_arr == null) {
        items = GetAllPendingPRDetailsSummary();
    }
    else {
        items = GetPRDetailsSummaryOfSelectedPendingPRs(pr_arr);
    }

    $.each(items, function (index, item) {
        aaDataArr.push([
            item.ItemId,
            null /*checkbox column*/,
            item.Name,
            item.UOM,
            item.Qty,
            item.AverageLeadTime,
            null/*expand column*/
        ]);
    });

    return aaDataArr;
}

function AddQuotation() {
    var res = false;

    var quotation_item_arr = [],
        quotation_supplier = [];

    $.each($('#div-qutation-selected-item-list').find('.quotation-selected-item row'), function (index, item) {
        var $input = $(item).find('input');
        var val = ($input.val() != '' ? parseInt($input.val()) : 0);

        if (val > 0) {
            quotation_item_arr.push({
                'ItemId': $input.attr('itemid'),
                'RequiredQuantity': val
            });
        }
    });

    $.each($('#select-suppliers option:selected'), function (index, item) {

        quotation_supplier.push({
            'SupplireId': this.value
        });
    });

    var quotation = {
        'QuotationName': $('#txt-title').val(),
        'DueDate': $('#datepicker-duedate').val(),
        'Description': $('#txt-description').val(),
        'QuotationItem': quotation_item_arr,
        'QuotationSupplire': quotation_supplier
    };

    $.ajax({
        type: "POST",
        url: '/Purchasing/AddQuotation',
        data: "{'quotation':" + JSON.stringify(quotation) + "}",
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

function UpdatePRStatusToQuotationsCalled() {
    var res = false;

    var pr_arr = $('#hf-prIds').val().split(',');

    $.each($('#hf-prIds').val().split(','), function (index, item) {
        pr_arr.push({
            'Id': item
        });
    });

    $.ajax({
        type: "POST",
        url: '/Purchasing/UpdatePRStatusToQuotationsCalled',
        data: "{'pr':" + JSON.stringify(pr_arr) + "}",
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

function FillSupplierCombo() {
    /*temp*/
    var temp = [
        { 'Id': 1, 'Name': 'Sunil Traders' },
        { 'Id': 2, 'Name': 'ABS (pvt) Ltd' },
        { 'Id': 3, 'Name': 'Amanda Services' },
        { 'Id': 4, 'Name': 'Hokandara Hardwares' },
        { 'Id': 5, 'Name': 'MAGA' },
    ];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetAllSuppliers',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            $.each(/*msg.suppliers*/temp, function (index, item) {
                $('#select-suppliers')
					.append($("<option></option>")
								.attr("value", item.Id)
								.text(item.Name));
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function FillRawMaterialCombo() {
    /*temp*/
    var temp = [
        { 'Id': 1, 'Name': 'Dolomite', 'UOM': 'g' },
        { 'Id': 2, 'Name': 'Silica', 'UOM': 'g' },
        { 'Id': 3, 'Name': 'Soda ash', 'UOM': 'g' },
        { 'Id': 4, 'Name': 'Felspar', 'UOM': 'g' },
        { 'Id': 5, 'Name': 'Cullets', 'UOM': 'g' },
    ];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetAllInventoryItems_RawMaterials',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            $.each(/*msg.items*/temp, function (index, item) {
                $('#select-items')
					.append($("<option></option>")
								.attr("value", item.Id)
                                .attr("uom", item.UOM)
								.text(item.Name));
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

/*dummy data*/
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
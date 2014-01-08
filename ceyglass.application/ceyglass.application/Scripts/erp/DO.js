var oTable_do;

$(function () {
    var aaDataArr = GetDOList();
    oTable_do = $('#DO-list').dataTable(DOListDataTableOptions(aaDataArr));

    $('.datepicker').datepicker();

    $('#select-suppliers').select2({
        placeholder: "Select suppliers",
        width: '300px',
        closeOnSelect: false
    });

    $('#select-pending-po').select2({
        placeholder: "Select currency",
        width: '300px',
        closeOnSelect: false
    });

    FillSupplierCombo();
    FillPOCombo();
});

function DOListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Id" },
            { "sTitle": "Supplier" },
            { "sTitle": "Delivered on" },
            { "sTitle": "PO Id" },
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

function RedrawTable(aaDataArr) {
    /*if there is no table create and assign data*/
    if (typeof oTable_do == 'undefined') {
        oTable_do = $('#DO-list').dataTable(DOListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_do.fnClearTable(0);
        oTable_do.fnAddData(aaDataArr);
        oTable_do.fnDraw();
    }
}

function ViewDetails(element) {
    var nTr = $(element).parents('tr')[0];
    if (oTable_do.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_do.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_do.fnOpen(nTr, fnFormatDetails(oTable_do, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_do, nTr) {
    var aData = oTable_do.fnGetData(nTr);

    var poId = aData[3];

    var po = GetPOById(poId);

    var sOut = '';

    if (po != null) {
        sOut = '<div class="row">';

        sOut += '<div class="col-xs-6 col-sm-6 widget-container-span">';
        sOut += '<div class="row">';

        sOut += '<div class="div-lbl">PO Date :</div>';
        sOut += '<div class="div-cnt">' + po.PODate + '</div>';

        sOut += '<div class="div-lbl">Expected Delivery Date :</div>';
        sOut += '<div class="div-cnt">' + po.ExpectedDeliveryDate + '</div>';

        sOut += '<div class="div-lbl">Currency Code :</div>';
        sOut += '<div class="div-cnt">' + po.CurrencyCode + '</div>';

        sOut += '<div class="div-lbl">Total Cost :</div>';
        sOut += '<div class="div-cnt">' + po.TotalCost + '</div>';

        sOut += '</div>';
        sOut += '</div>';

        sOut += '<div class="col-xs-6 col-sm-6 widget-container-span">';
        sOut += '<div class="widget-box">';

        sOut += '<div class="widget-header widget-header-small header-color-blue">';
        sOut += '<h6 class="bigger lighter">PO No: &nbsp;<i class="icon-double-angle-right"></i>' + poId + '</h6>';
        sOut += '</div>';

        sOut += '<div class="widget-body">';

        sOut += '<table id="tbl-po-' + poId + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
        sOut += '<thead>';
        sOut += '<tr><td>Item</td><td>UOM</td><td>Qty</td><td>UnitPrice</td></tr>';
        sOut += '</thead>';

        $.each(po.OrderedItems, function (index, poItm) {

            sOut += '<tr><td>' + poItm.ItemName + '</td><td>' + poItm.UOM + '</td><td>' + poItm.Qty + '</td><td>' + poItm.UnitPrice + '</td></tr>';
        });

        sOut += '</table>';

        sOut += '</div>';

        sOut += '</div>';
        sOut += '</div>';
        sOut += '</div>';
    }

    return sOut;
}

$('#btn-do-model').click(function () {
    /*initially clear form data if exists*/
    ClearFields();

    /*open poup form*/
    $('#model-do').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });
});

function ClearFields() {

    $('.datepicker').val('');
    $('#select-suppliers').select2('data', null);
    $('#select-pending-po').select2('data', null);
}

$('#btn-add-DO').click(function () {
    var _do = {
        'SupplierId': $('#select-suppliers option:selected').val(),
        'DeliverdOn': $('#do-date').val(),
        'POId': $('#select-pending-po option:selected').val()
    };

    var isSuccess = AddDO(_do);

    if (isSuccess) {
        bootbox.alert('DO placed successfully !', function () {
            /*rebind table*/
            var aaDataArr = GetDOList();
            RedrawTable(aaDataArr);

            /*hide popup*/
            $('#model-do').modal('hide');
        });
    }
    else {
        bootbox.alert('Error occurred ! - add DO');
    }
});

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

function FillPOCombo() {
    /*temp*/
    var temp = [
        { 'Id': 1 },
        { 'Id': 2 },
        { 'Id': 3 },
        { 'Id': 4 },
        { 'Id': 5 },
    ];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPendingPOs',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            $.each(/*msg.pos*/temp, function (index, item) {
                $('#select-pending-po')
					.append($("<option></option>")
								.attr("value", item.Id)
								.text(item.Id));
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function AddDO(_do) {
    var res = false;
    debugger;
    $.ajax({
        type: "POST",
        url: '/Purchasing/AddDO',
        data: "{'_do':" + JSON.stringify(_do) + "}",
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

function GetDOList() {
    /*temp data*/
    var temp = [{
        'Id': 1,
        'SupplierName': 'Sunil Traders',
        'DeliverdOn': '10/12/2013',
        'POId': '1'
    }];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetAllDOs',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            $.each(/*msg.dos*/temp, function (index, item) {
                aaDataArr.push([
                    item.Id,
                    item.SupplierName,
                    item.DeliverdOn,
                    item.POId,
                    null/*expanding column*/
                ]);
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetPOById(poId) {
    /*temp*/
    return {
        'PODate': '09/18/2013',
        'TotalCost': 1250430,
        'ExpectedDeliveryDate': '10/15/2013',
        'CurrencyCode': 'LKR',
        'Status': 'Pending',
        'OrderedItems': [
        { 'ItemId': 1, 'ItemName': 'Dolomite', 'Qty': 1000, 'UnitPrice': 20, 'UOM': 'g' },
        { 'ItemId': 2, 'ItemName': 'Silica', 'Qty': 1200, 'UnitPrice': 19, 'UOM': 'g' },
        { 'ItemId': 3, 'ItemName': 'Soda ash', 'Qty': 800, 'UnitPrice': 25, 'UOM': 'g' },
        { 'ItemId': 4, 'ItemName': 'Felspar', 'Qty': 600, 'UnitPrice': 28, 'UOM': 'g' },
        { 'ItemId': 5, 'ItemName': 'Cullets', 'Qty': 900, 'UnitPrice': 18, 'UOM': 'g' }]
    };

    var items = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPOById',
        data: "{'poId':" + poId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            items = msg.po;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return items;
}

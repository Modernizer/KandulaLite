var oTable_po;

$(function () {
    var aaDataArr = GetPOList();
    oTable_po = $('#PO-list').dataTable(POListDataTableOptions(aaDataArr));

    $('.datepicker').datepicker();

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

    $('#select-currency').select2({
        placeholder: "Select currency",
        width: '300px',
        closeOnSelect: false
    });

    FillRawMaterialCombo();
    FillSupplierCombo();
});

function POListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Id" },
            { "sTitle": "PO Date" },
            { "sTitle": "Delivery Date" },
            { "sTitle": "Currency" },
            { "sTitle": "Total Cost" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    {
                        "aTargets": [6],
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
    if (typeof oTable_po == 'undefined') {
        oTable_po = $('#PO-list').dataTable(POListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_po.fnClearTable(0);
        oTable_po.fnAddData(aaDataArr);
        oTable_po.fnDraw();
    }
}

function ViewDetails(element) {
    var nTr = $(element).parents('tr')[0];
    if (oTable_po.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_po.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_po.fnOpen(nTr, fnFormatDetails(oTable_po, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_po, nTr) {
    var aData = oTable_po.fnGetData(nTr);

    var poId = aData[0];

    var poItems = GetPODetailsById(poId);

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';

    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">PO No: &nbsp;<i class="icon-double-angle-right"></i>' + poId + '</h6>';
    sOut += '</div>';

    sOut += '<div class="widget-body">';

    sOut += '<table id="tbl-po-' + poId + '" cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>UOM</td><td>Qty</td><td>UnitPrice</td></tr>';
    sOut += '</thead>';
    $.each(poItems, function (index, poItm) {

        sOut += '<tr><td>' + poItm.ItemName + '</td><td>' + poItm.UOM + '</td><td>' + poItm.Qty + '</td><td>' + poItm.UnitPrice + '</td></tr>';
    });
    sOut += '</table>';

    sOut += '</div>';

    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

$('#btn-po-model').click(function () {
    /*initially clear form data if exists*/
    ClearFields();

    /*open poup form*/
    $('#model-po').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });
});

$('#btn-add-items').click(function () {
    var html = '';

    if ($('#select-items :selected').length > 0) {
        var $container = $('#div-po-selected-item-list');
        /*currently if there are no items clear the message and then append items*/
        if ($container.find('.po-selected-item').length == 0) {
            $container.html('');
        }

        $('#select-items :selected').each(function (index, item) {
            if ($container.find('input#itemid-' + $(item).val()).length == 0) {
                html += GetPOItemHtml($(item).val(), $(item).text(), $(item).attr('uom'));
            }
        });

        $container.append(html);
        /*clear item list selected*/
        $('#select-items').select2('data', null);
    }
    else {
        bootbox.alert("No items has been selected for add to list !");
    }
});

$('#btn-add-PO').click(function () {

    var po_item_arr = [];
    var total_cost = 0;

    $.each($('#div-po-selected-item-list').find('.po-selected-item'), function (index, item) {
        var qty = ($(item).find('.input-qty').val() != '' ? parseInt($(item).find('.input-qty').val()) : 0);
        var uprice = ($(item).find('.input-unitp').val() != '' ? parseInt($(item).find('.input-unitp').val()) : 0);
        total_cost += (qty * uprice);

        po_item_arr.push({
            'ItemId': $(item).attr('itemid'),
            'Qty': qty,
            'UnitPrice': uprice,
        });
    });

    var po = {
        'SupplierId': $('#select-suppliers option:selected').val(),
        'PODate': $('#po-date').val(),
        'ExpectedDeliveryDate': $('#deli-date').val(),
        'TotalCost': total_cost,
        'CurrencyCode': $('#select-currency option:selected').val(),
        'OrderedItems': po_item_arr
    };

    var isSuccess = AddPO(po);
    if (isSuccess) {
        bootbox.alert('PO placed successfully !', function () {
            /*rebind table*/
            var aaDataArr = GetPOList();
            RedrawTable(aaDataArr);
            /*hide popup*/
            $('#model-po').modal('hide');
        });
    }
    else {
        bootbox.alert('Error occurred ! - add PO');
    }

});

function GetPOItemHtml(id, text, uom) {
    var html = '';

    html += '<div class="po-selected-item row" style="margin-bottom:5px;" itemId="' + id + '">';
    html += '<label class="col-sm-4">' + text + ' ( ' + uom + ' )' + '</label>&nbsp;';
    html += '<input id="itemid-' + id + '" class="input-sm col-xs-3 input-qty" type="number" onkeypress="return IsNumberKey(event);" placeholder="qty" />';
    html += '<input class="input-sm col-xs-3 input-unitp" type="number" onkeypress="return IsNumberKey(event);" placeholder="unit price"  />';
    html += '<button class="btn btn-danger btn-xs" onclick="RemoveItem(this);">';
    html += '<i class="icon-trash bigger-110 icon-only"></i>';
    html += '</button>';
    html += '</div>';

    return html;
}

function RemoveItem(element) {
    $(element).parent('div.po-selected-item').remove();

    if ($('#div-po-selected-item-list').find('.po-selected-item').length == 0) {
        $('#div-po-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for PO</span>');
    }
}

function ClearFields() {

    $('.datepicker').val('');
    $('#select-currency').select2('data', null);
    $('#select-items').select2('data', null);
    $('#select-suppliers').select2('data', null);
    $('#div-po-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for PO</span>');
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

function AddPO(po) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Purchasing/AddPO',
        data: "{'po':" + JSON.stringify(po) + "}",
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

function GetPOList() {
    /*temp data*/
    var temp = [{
        'Id': 1,
        'PODate': '09/15/2013',
        'ExpectedDeliveryDate': '10/26/2013',
        'CurrencyCode': 'LKR',
        'TotalCost': 1250420,
        'Status': 'Pending'
    }];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetAllPOs',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            $.each(/*msg.pos*/temp, function (index, item) {
                aaDataArr.push([
                    item.Id,
                    item.PODate,
                    item.ExpectedDeliveryDate,
                    item.CurrencyCode,
                    item.TotalCost,
                    item.Status,
                    null/*expanding column*/
                ]);
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetPODetailsById(poId) {
    /*temp*/
    return [
        { 'ItemId': 1, 'ItemName': 'Dolomite', 'Qty': 1000, 'UnitPrice': 20, 'UOM': 'g' },
        { 'ItemId': 2, 'ItemName': 'Silica', 'Qty': 1200, 'UnitPrice': 19, 'UOM': 'g' },
        { 'ItemId': 3, 'ItemName': 'Soda ash', 'Qty': 800, 'UnitPrice': 25, 'UOM': 'g' },
        { 'ItemId': 4, 'ItemName': 'Felspar', 'Qty': 600, 'UnitPrice': 28, 'UOM': 'g' },
        { 'ItemId': 5, 'ItemName': 'Cullets', 'Qty': 900, 'UnitPrice': 18, 'UOM': 'g' }
    ];

    var items = [];

    $.ajax({
        type: "POST",
        url: '/Purchasing/GetPODetailsById',
        data: "{'poId':" + poId + "}",
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
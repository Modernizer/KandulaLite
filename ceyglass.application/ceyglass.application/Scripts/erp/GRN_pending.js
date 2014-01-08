var oTableGrn;

$(function () {
    oTableGrn = $('#GRN-list').dataTable(GRNListDataTableOptions(GetPendingGRNs()));
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTableGrn == 'undefined') {
        oTableGrn = $('#GRN-list').dataTable(GRNListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTableGrn.fnClearTable(0);
        oTableGrn.fnAddData(aaDataArr);
        oTableGrn.fnDraw();
    }
}

function GRNListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "mData": null },
            { "sTitle": "Transaction Id" },
            { "sTitle": "Transaction Date" },
            { "sTitle": "Status" },
            { "sTitle": "Total Cost" },
            { "mData": null }

        ],
        "aoColumnDefs": [
            {
                "aTargets": [0],
                "mData": null,
                "bSearchable": false,
                "bSortable": false,
                "mRender": function (data, type, full) {
                    return '<input class="chk-grn-item" type="checkbox" grnId=\"' + full[1] + '\">';
                }
            }, {
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
    if (oTableGrn.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTableGrn.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTableGrn.fnOpen(nTr, fnFormatDetails(oTableGrn, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTableGrn, nTr) {
    var aData = oTableGrn.fnGetData(nTr);

    var grnId = aData[1];

    var grnItems = GetGrnDetails(grnId);

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';

    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">GRN ID: &nbsp;<i class="icon-double-angle-right"></i>' + grnId + '</h6>';
    sOut += '</div>';

    sOut += '<div class="widget-body">';

    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Qty</td><td>Price</td></tr>';
    sOut += '</thead>';

    $.each(grnItems, function (index, gItm) {
        sOut += '<tr><td>' + gItm.Name + '</td><td>' + gItm.Qty + '</td><td>' + gItm.Price + '</td></tr>';
    });

    sOut += '</table>';

    sOut += '</div>';

    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

$('#btn-confirm').click(function () {
    var rowcollection = oTableGrn.$("input:checkbox.chk-grn-item:checked", { "page": "all" });
    if (rowcollection.length > 0) {

        var grnItemIds_arr = [];
        var inventory_trans_arr = [];

        $.each(rowcollection, function (index, item) {
            grnItemIds_arr.push($(item).attr('grnId'));
            inventory_trans_arr.push({ 'Id': $(item).attr('grnId') });
        });

        bootbox.confirm('Are you sure you want to CONFIRM following GRNs ? <br/><b>' + grnItemIds_arr.join(' , ') + '</b>',
            function (result) {
                /*user has confirmed*/
                if (result) {
                    var isSuccess = ConfirmGRNList(inventory_trans_arr);
                    if (isSuccess) {

                        bootbox.alert("Successfully Confirmed !", function () {
                            /*redraw table*/
                            DrawTable(GetPendingGRNs());
                        });
                    }
                    else {
                        bootbox.alert("error occurred - Confirm GRN!");
                    }

                }
            });
    }
    else {
        bootbox.alert("No item has been selected to confirm !");
    }
})

function GetPendingGRNs() {
    var temp = [{
        'Id': 1,
        'TrasactionDate': '10/19/2013',
        'TrasactionStatus': 'Pending',
        'CostValue': 1012500
    }];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPendingGRNs',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            //if (msg.grns.length > 0) {

            $.each(/*msg.grns*/temp, function (index, item) {
                aaDataArr.push([
                    null /*for checkbox column*/,
                    item.Id,
                    item.TrasactionDate,
                    item.TrasactionStatus,
                    item.CostValue,
                    null /*exmpand column*/
                ]);
            });

            //}
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetGrnDetails(grnId) {

    /*temp data*/
    return [
        { 'Id': 1, 'Name': 'dolamite', 'Qty': 1000, 'Price': 120000 },
        { 'Id': 2, 'Name': 'silica', 'Qty': 800, 'Price': 80000 },
        { 'Id': 3, 'Name': 'soda ash', 'Qty': 950, 'Price': 150000 },
        { 'Id': 4, 'Name': 'felspar', 'Qty': 250, 'Price': 45000 },
        { 'Id': 5, 'Name': 'cullets', 'Qty': 120, 'Price': 240000 }
    ];

    var grnItems = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetGrnDetails',
        data: "{'grnId':" + grnId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            grnItems = msg.grnItems;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return grnItems;
}

function ConfirmGRNList(inventory_trans_arr) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Store/ConfirmGRNList',
        data: "{'grns':" + JSON.stringify(inventory_trans_arr) + "}",
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
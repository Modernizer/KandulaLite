var oTableFrn;

$(function () {

    oTableFrn = $('#FRN-list').dataTable(FRNListDataTableOptions(GetPendingFRNs()));
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTableFrn == 'undefined') {
        oTableFrn = $('#FRN-list').dataTable(FRNListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTableFrn.fnClearTable(0);
        oTableFrn.fnAddData(aaDataArr);
        oTableFrn.fnDraw();
    }
}

function FRNListDataTableOptions(aaDataArr) {

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
                    return '<input class="chk-frn-item" type="checkbox" frnId=\"' + full[1] + '\">';
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
    if (oTableFrn.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTableFrn.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTableFrn.fnOpen(nTr, fnFormatDetails(oTableFrn, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTableFrn, nTr) {
    var aData = oTableFrn.fnGetData(nTr);

    var frnId = aData[1];

    var frnItems = GetFrnDetails(frnId);

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-12 widget-container-span">';
    sOut += '<div class="widget-box">';

    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">FRN ID: &nbsp;<i class="icon-double-angle-right"></i>' + frnId + '</h6>';
    sOut += '</div>';

    sOut += '<div class="widget-body">';

    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Qty</td><td>Price</td></tr>';
    sOut += '</thead>';

    $.each(frnItems, function (index, fItm) {
        sOut += '<tr><td>' + fItm.Name + '</td><td>' + fItm.Qty + '</td><td>' + fItm.Price + '</td></tr>';
    });

    sOut += '</table>';

    sOut += '</div>';

    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

$('#btn-confirm').click(function () {
    var rowcollection = oTableFrn.$("input:checkbox.chk-frn-item:checked", { "page": "all" });
    if (rowcollection.length > 0) {

        var frnItemIds_arr = [];
        var inventory_trans_arr = [];

        $.each(rowcollection, function (index, item) {
            frnItemIds_arr.push($(item).attr('frnId'));
            inventory_trans_arr.push({ 'Id': $(item).attr('frnId') });
        });

        bootbox.confirm('Are you sure you want to CONFIRM following FRNs ? <br/><b>' + frnItemIds_arr.join(' , ') + '</b>',
            function (result) {
                /*user has confirmed*/
                if (result) {
                    var isSuccess = ConfirmFRNList(inventory_trans_arr);
                    if (isSuccess) {

                        bootbox.alert("Successfully Confirmed !", function () {
                            /*redraw table*/
                            DrawTable(GetPendingFRNs());
                        });
                    }
                    else {
                        bootbox.alert("error occurred - Confirm FRN!");
                    }

                }
            });
    }
    else {
        bootbox.alert("No item has been selected to confirm !");
    }
})

function GetPendingFRNs() {
    var temp = [{
        'Id': 1,
        'TrasactionDate': '10/19/2013',
        'TrasactionStatus': 'Pending',
        'CostValue': 1012500
    }];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetPendingFRNs',
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

function GetFrnDetails(frnId) {

    /*temp data*/
    return [
        { 'Id': 1, 'Name': 'flint type 1', 'Qty': 1000, 'Price': 120000 }
    ];

    var frnItems = [];

    $.ajax({
        type: "POST",
        url: '/Store/GetFRNDetails',
        data: "{'frnId':" + frnId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            frnItems = msg.frnItems;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return frnItems;
}

function ConfirmFRNList(inventory_trans_arr) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Store/ConfirmFRNList',
        data: "{'frns':" + JSON.stringify(inventory_trans_arr) + "}",
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
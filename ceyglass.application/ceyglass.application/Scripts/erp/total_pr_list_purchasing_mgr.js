var oTable_pr_list_proc;

$(function () {
    var data = GetPRList();
    oTable_pr_list_proc = $('#PR-list').dataTable(PRListDataTableOptions(data));

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
                    return '<input class="chk-pr-item" type="checkbox" prId=\"' + full[1] + '\">';
                }
            }, {
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
    if (oTable_pr_list_proc.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_pr_list_proc.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_pr_list_proc.fnOpen(nTr, fnFormatDetails(oTable_pr_list_proc, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_pr_list_proc, nTr) {
    var aData = oTable_pr_list_proc.fnGetData(nTr);

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

function GetPRList() {
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
    var prList = GetPRList();

    return $.grep(prList, function (e) { return e.PrId == prId; })[0];
}

$('#btn-status-model-open').click(function () {
    var rowcollection = oTable_pr_list_proc.$("input:checkbox.chk-pr-item:checked", { "page": "all" });
    if (rowcollection.length > 0) {
        var prItemList_arr = [];

        $.each(rowcollection, function (index, item) {
            prItemList_arr.push($(item).attr('prId'));
        });

        bootbox.confirm('Are you sure you want to change the status of following PR items ? <br/><b>' + prItemList_arr.join(' , ') + '</b>', function (result) {
            /*user has confirmed*/
            if (result) {
                /*clear form controllers before open*/
                ClearModelPopupForm();

                $('#div-pr-id-list').html('<b>' + prItemList_arr.join(' , ') + '</b>');

                /*open poup form*/
                $('#model-pr-status').modal({
                    "backdrop": "static",
                    "keyboard": false,
                    "show": true
                });
            }
        });
    }
    else {
        bootbox.alert("No item has been selected for update the status !");
    }
});

function ClearModelPopupForm() {
    $('#div-pr-id-list').html('');
    /*select 1st child*/
    $('#select-status option:first-child').attr("selected", "selected");

}

$('#btn-update-status').click(function () {
    var rowcollection = oTable_pr_list_proc.$("input:checkbox.chk-pr-item:checked", { "page": "all" });

    if (rowcollection.length > 0) {
        /*hold pr item*/
        var prItemList_arr = [];

        $.each(rowcollection, function (index, item) {
            prItemList_arr.push($(item).attr('prId'));
        });

        var selected_status = $('#select-status').val();
    }

    bootbox.alert("Status updated successfully !", function () {
        /*clear form data*/
        ClearModelPopupForm();
        /*redraw table*/
        var data = GetPRList();
        RedrawTable(data);
        /*hide popup form*/
        $('#model-pr-status').modal('hide');
    });

});

function RedrawTable(data) {
    /*if there is no table create and assign data*/
    if (typeof oTable_pr_list_proc == 'undefined') {
        oTable_pr_list_proc = $('#PR-list').dataTable(PRListDataTableOptions(data));
    }
        /*clear existing content and add new values*/
    else {
        var aaDataArr = [];
        /*generate rows*/
        $.each(data, function (index, item) {
            var pr = [null, item.PrId, item.PrDate, item.Status, null];
            aaDataArr.push(pr);
        });

        oTable_pr_list_proc.fnClearTable(0);
        oTable_pr_list_proc.fnAddData(aaDataArr);
        oTable_pr_list_proc.fnDraw();
    }
}
var oTable;

$(function () {

    var data = GetPRList();
    oTable = $('#PR-list').dataTable(PRListDataTableOptions(data));

});

function PRListDataTableOptions(data) {

    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var pr = [null, item.PrId, item.PrDate, item.Status, (item.IsAddedToInventory.toLowerCase() === 'true' ? 'yes' : 'no'), null];
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
            { "sTitle": "Added to Inventory" },
            { "mData": null }
        ],
        "aoColumnDefs": [
                    {
                        "aTargets": [0],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            /*allow adding to inventory if only it is not already added to inventory list*/
                            if (full[4].toLowerCase() === 'no') {
                                return '<input class="chk-pr-item" type="checkbox" prId=\"' + full[1] + '\">';
                            }
                            else {
                                return '';
                            }
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

function GetPRList() {
    var prlist = [
         {
             'PrId': 10520,
             'PrDate': moment("01-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'Status': 'P',
             'IsAddedToInventory': 'false',
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
             'IsAddedToInventory': 'true',
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

$('#btn-addto-inventory').click(function () {
    var rowcollection = oTable.$("input:checkbox.chk-pr-item:checked", { "page": "all" });
    if (rowcollection.length > 0) {
        var prItemList_arr = [];

        $.each(rowcollection, function (index, item) {
            prItemList_arr.push($(item).attr('prId'));
        });

        bootbox.confirm('Are you sure you want to add selected item(s) to inventory ? <br/><b>' + prItemList_arr.join(' , ') + '</b>', function (result) {
            /*user has confirmed*/
            if (result) {
                /*add to inventory*/
                /*AddToInventory() ==> Store/AddPRItemsToInventory */

                /*redraw table*/
                var data = GetPRList();
                RedrawTable(data);
            }
        });
    }
    else {
        bootbox.alert("No item has been selected for add to inventory !");
    }
});

function RedrawTable(data) {
    /*if there is no table create and assign data*/
    if (typeof oTable == 'undefined') {
        oTable = $('#PR-list').dataTable(PRListDataTableOptions(data));
    }
        /*clear existing content and add new values*/
    else {
        var aaDataArr = [];
        /*generate rows*/
        $.each(data, function (index, item) {
            var pr = [null, item.PrId, item.PrDate, item.Status, (item.IsAddedToInventory.toLowerCase() === 'true' ? 'yes' : 'no'), null];
            aaDataArr.push(pr);
        });

        oTable.fnClearTable(0);
        oTable.fnAddData(aaDataArr);
        oTable.fnDraw();
    }
}
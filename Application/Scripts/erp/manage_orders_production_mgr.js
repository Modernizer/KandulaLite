var oTable;

$(function () {
    $("#select-items").select2();
    $('#datepicker-production-sdate').datepicker();

    var data = GetOrderList();
    oTable = $('#orders-list-prod').dataTable(OrderListProdctionDataTableOptions(data));
});

function OrderListProdctionDataTableOptions(data) {
    var aaDataArr = [];
    /*generate rows*/
    $.each(data, function (index, item) {
        var order = [null, item.OrderId, item.CustId, item.Customer, item.OrderDate, item.ProductId, item.Product, item.Qty, item.UnitPrice, item.DeliveryDate, item.DeliveryInstruction, item.isordered, item.isrecieved, item.iscompleted, null];
        aaDataArr.push(order);
    });

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "mData": null },
            { "sTitle": "Order. Id" },
            { "sTitle": "Cust. Id" },
            { "sTitle": "Customer" },
            { "sTitle": "Order date" },
            { "sTitle": "ProductId" },
            { "sTitle": "Product" },
            { "sTitle": "Qty" },
            { "sTitle": "Unit price" },
            { "sTitle": "Delivery date" },
            { "sTitle": "Delivery Instructions" },
            { "sTitle": "IsOrdered" },
            { "sTitle": "IsReceived" },
            { "sTitle": "IsCompleted" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    //{ "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [2] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [5] },
                    {
                        "aTargets": [0],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<input class="chk-order" type=\"checkbox\" orderId=\"' + full[1] + '\" productId=\"' + full[5] + '\" qty=\"' + full[7] + '\">';

                        }
                    },
                    {
                        "aTargets": [14],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ViewOrderBOM(this)" class="blue" href="javascript:void(0);"><i class="icon-collapse bigger-130"></i></a></div>';
                        }
                    }
        ]
    };
}

function ViewOrderBOM(element) {
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

    var itemId = aData[5];
    /*get dummy data*/
    var bom = GetBOM(itemId)[0];

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">BOM &nbsp;<i class="icon-double-angle-right"></i>' + aData[6] + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Qty Per product</td><td>Products Count</td><td>Required Qty</td><td>UOM</td></tr>';
    sOut += '</thead>';

    $.each(bom.BOM, function (index, bomItem) {

        sOut += '<tr><td>' + bomItem.item + '</td><td>' + parseFloat(bomItem.qty).toFixed(2) + '</td><td>' + aData[7] + '</td><td>' + (parseFloat(bomItem.qty) * parseFloat(aData[7])).toFixed(2) + '</td><td>' + bomItem.UOM + '</td></tr>';
    });

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

function GetOrderList() {
    var orderlist = [
         {
             'OrderId': 1,
             'CustId': 1,
             'Customer': 'Abc (Pvt) Ltd',
             'OrderDate': moment("01-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'ProductId': 1,
             'Product': 'Flint bottle T1',
             'Qty': 1000,
             'UnitPrice': 10,
             'DeliveryDate': moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'DeliveryInstruction': 'To be dilivered to No.46, Colombo',
             'isordered': 'false',
             'isrecieved': 'false',
             'iscompleted': 'false'
         },
         {
             'OrderId': 2,
             'CustId': 2,
             'Customer': 'Amanda Services',
             'OrderDate': moment("06-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'ProductId': 2,
             'Product': 'Flint bottle T2',
             'Qty': 1350,
             'UnitPrice': 15,
             'DeliveryDate': moment("08-12-2013", "DD-MM-YYYY").format("DD-MM-YYYY"),
             'DeliveryInstruction': '',
             'isordered': 'false',
             'isrecieved': 'false',
             'iscompleted': 'false'
         }
    ];

    return orderlist;
}

function GetOrderDetails(orderId) {
    var orderList = GetOrderList();

    return $.grep(orderList, function (e) { return e.OrderId == orderId; });
}

function GetBOM(productId) {
    var productBOMs = [
         /*Flint bottle T1*/
       {
           'productId': '1',
           'BOM': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 20.5 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 18 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 25 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 32 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 50 }]
       },
       /*Flint bottle T2*/
       {
           'productId': '2',
           'BOM': [
            { 'id': 1, 'item': 'dolamite', 'UOM': 'g', 'qty': 24.5 },
            { 'id': 2, 'item': 'silica', 'UOM': 'g', 'qty': 22.1 },
            { 'id': 3, 'item': 'soda ash', 'UOM': 'g', 'qty': 29 },
            { 'id': 4, 'item': 'felspar', 'UOM': 'g', 'qty': 35 },
            { 'id': 5, 'item': 'cullets', 'UOM': 'g', 'qty': 74 }]
       }
    ];

    return $.grep(productBOMs, function (e) { return e.productId == productId; });
}

$('#btn-req-items').click(function () {
    var bomItems = [];
    var rowcollection = oTable.$("input:checkbox.chk-order:checked", { "page": "all" });

    rowcollection.each(function (index, elem) {

        var prodId = parseInt($(elem).attr('productId'));
        var reqQty = parseInt($(elem).attr('qty'));

        var bomDetails = GetBOM(prodId);

        $.each(bomDetails[0].BOM, function (ind, itm) {

            var existingItem = $.grep(bomItems, function (e) { return e.id == itm.id; });
            /*if there is no item exists in current list add new one or else update the existing values*/
            if (existingItem.length == 0) {
                bomItems.push({
                    'id': itm.id,
                    'item': itm.item,
                    'qty': (itm.qty * reqQty),
                    'uom': itm.UOM
                });
            }
            else {
                /*alter values in 1st matching item from the return array (should return only one item if the logic is in correct form)*/
                existingItem[0].qty += (itm.qty * reqQty);
            }
        });
    });

    /*clear controllers on window before open*/
    ClearModelPopUp();

    var $container = $('#div-order-list');
    /*currently if there are no items clear the message and then append items if there is any*/
    if ($container.find('.order-item').length == 0 && bomItems.length > 0) {
        $container.html('');
    }
    /*add to model window*/
    $.each(bomItems, function (index, ele) {
        $container.append(GetInventoryItemHtml(ele.id, ele.item, ele.qty, ele.uom));
    });

    $('#model-inventory-order').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });
});

/*clear controllers on model popup*/
function ClearModelPopUp() {
    $('#datepicker-production-sdate').val('');
    $('#select-items').select2('data', null);
    $('#div-order-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for order</span>');
    $('#txt-notes').val('');
}

function GetInventoryItemHtml(id, text, value, uom) {
    var html = '';

    html += '<div class="order-item">';
    html += '<label class="col-sm-4">' + text + ' (' + uom + ')</label>&nbsp;';
    html += '<input id="itemid-' + id + '" class="input-sm col-xs-3" type="number" onkeypress="return IsNumberKey(event);" value="' + value + '" /> &nbsp;';
    html += '<button class="btn btn-danger btn-xs" onclick="RemoveItem(this);">';
    html += '<i class="icon-trash bigger-110 icon-only"></i>';
    html += '</button>';
    html += '</div>';

    return html;
}

function RemoveItem(element) {
    $(element).parent('div.order-item').remove();

    if ($('#div-order-list').find('.order-item').length == 0) {
        $('#div-order-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for order</span>');
    }
}

$('#btn-add-items').click(function () {
    var html = '';

    if ($('#select-items :selected').length > 0) {
        var $container = $('#div-order-list');
        /*currently if there are no items clear the message and then append items*/
        if ($container.find('.order-item').length == 0) {
            $container.html('');
        }

        $('#select-items :selected').each(function (index, item) {
            if ($container.find('input#itemid-' + $(item).val()).length == 0) {
                html += GetInventoryItemHtml($(item).val(), $(item).text(), '', $(item).attr('uom'));
            }
        });

        $container.append(html);
        /*clear item list selected*/
        $('#select-items').select2('data', null);
    }
    else {
        bootbox.alert("No items has been selected for add to order list !");
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

$('#btn-order-inventory').click(function () {


    /*close popup after saving & rebind the grid*/
    bootbox.alert("Order placed successfully!", function () {
        /*clear form data*/
        ClearModelPopUp();
        /*redraw table*/
        var data = GetOrderList();
        RedrawTable(data);
        /*close after saving data*/
        $('#model-inventory-order').modal('hide');
    });
});

$('#btn-addto-inventory').click(function () {
    var rowcollection = oTable.$("input:checkbox.chk-order:checked", { "page": "all" });

    if (rowcollection.length > 0) {
        var orderId_arr = [];
        rowcollection.each(function (index, item) {
            orderId_arr.push($(item).attr('orderId'));
        });

        bootbox.confirm('Are you sure you want to add selected orders to finish good inventory ?<br/> Order Id(s) : <b>' + orderId_arr.join(',') + '</b>', function (result) {
            /*if user confirmed*/
            if (result) {
                /*Orders/AddOrdersToFinishGoodsInventory*/

                /*close popup after saving & rebind the grid*/
                bootbox.alert("Finish goods added to inventory successfully!", function () {
                    /*clear form data*/
                    ClearModelPopUp();
                    /*redraw table*/
                    var data = GetOrderList();
                    RedrawTable(data);
                    /*close after saving data*/
                    $('#model-inventory-order').modal('hide');
                });
            }
        });

    }
    else {
        bootbox.alert('No item has been selected for add to inventory');
    }
});

function RedrawTable(data) {
    /*if there is no table create and assign data*/
    if (typeof oTable == 'undefined') {
        oTable = $('#orders-list-prod').dataTable(OrderListProdctionDataTableOptions(data));
    }
        /*clear existing content and add new values*/
    else {
        var aaDataArr = [];
        /*generate rows*/
        $.each(data, function (index, item) {
            var order = [null, item.OrderId, item.CustId, item.Customer, item.OrderDate, item.ProductId, item.Product, item.Qty, item.UnitPrice, item.DeliveryDate, item.DeliveryInstruction, item.isordered, item.isrecieved, item.iscompleted, null];
            aaDataArr.push(order);
        });

        oTable.fnClearTable(0);
        oTable.fnAddData(aaDataArr);
        oTable.fnDraw();
    }
}
var oTable_manage_order_production;

$(function () {
    oTable_manage_order_production = $('#orders-list-prod').dataTable(ProdctionOrderListDataTableOptions(GetOrdersForSelectedOrderStatus()));

    GetProductionPlants();
});

$('#select-order-status').change(function () {
    /*redraw table*/
    DrawTable(GetOrdersForSelectedOrderStatus());
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTable_manage_order_production == 'undefined') {
        oTable_manage_order_production = $('#orders-list-prod').dataTable(ProdctionOrderListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_manage_order_production.fnClearTable(0);
        oTable_manage_order_production.fnAddData(aaDataArr);
        oTable_manage_order_production.fnDraw();
    }
}

function ProdctionOrderListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Index" },
            { "mData": null },
            { "sTitle": "Order. Id" },
            { "sTitle": "Cust. Id" },
            { "sTitle": "Customer" },
            { "sTitle": "Order date" },
            { "sTitle": "ProductId" },
            { "sTitle": "Product" },
            { "sTitle": "Qty" },
            { "sTitle": "Unit price" },
            { "sTitle": "In Stocks" },
            { "sTitle": "Delivery date" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [3] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [6] },
                    {
                        "aTargets": [1],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            //return '<input class="chk-order" type=\"checkbox\" orderId=\"' + full[1] + '\" productId=\"' + full[5] + '\" qty=\"' + full[7] + '\">';
                            return '<input class="chk-order" type=\"checkbox\" index=\"' + full[0] + '\">';

                        }
                    },
                    {
                        "aTargets": [13],
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
    if (oTable_manage_order_production.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_manage_order_production.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_manage_order_production.fnOpen(nTr, fnFormatDetails(oTable_manage_order_production, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_manage_order_production, nTr) {
    var aData = oTable_manage_order_production.fnGetData(nTr);

    var productId = aData[6];
    var product = aData[7];
    var orderedQty = parseFloat(aData[8]);

    /*get dummy data*/
    var prod_struct = GetProductStructureOfProduct(productId);

    var sOut = '';

    sOut = '<div class="row">';
    sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
    sOut += '<div class="widget-box">';
    sOut += '<div class="widget-header widget-header-small header-color-blue">';
    sOut += '<h6 class="bigger lighter">BOM &nbsp;<i class="icon-double-angle-right"></i>' + product + '</h6>';
    sOut += '</div>';
    sOut += '<div class="widget-body">';
    sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px; width:100%;">';
    sOut += '<thead>';
    sOut += '<tr><td>Item</td><td>Qty Per product</td><td>Products Count</td><td>Required Qty</td><td>UOM</td></tr>';
    sOut += '</thead>';

    if (prod_struct.length > 0) {
        $.each(prod_struct, function (index, struct_item) {

            sOut += '<tr><td>' + struct_item.Name + '</td><td>' + parseFloat(struct_item.Quantity).toFixed(2) + '</td><td>' + orderedQty + '</td><td>' + (parseFloat(struct_item.Quantity) * orderedQty).toFixed(2) + '</td><td>' + struct_item.UOM + '</td></tr>';
        });
    }
    else {
        sOut += '<tr><td colspan="5">no records found</td></tr>';
    }

    sOut += '</table>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';
    sOut += '</div>';

    return sOut;
}

$('#btn-req-items').click(function () {

    /*clear controllers on model popup before open*/
    ClearRawMaterialModelPopUp();

    var product_struct_items = [];
    var rowcollection = oTable_manage_order_production.$("input:checkbox.chk-order:checked", { "page": "all" });

    /*only one order can be used to request raw materials at once */
    if (rowcollection.length == 1) {

        var aData = oTable_manage_order_production.fnGetData(parseInt($(rowcollection[0]).attr('index')));

        var customerOrderId = parseInt(aData[2]);
        var prodId = parseInt(aData[6]);
        var product = aData[7];
        var reqQty = parseInt(aData[8]);
        var instocks = parseInt(aData[10]);

        var product_struct = GetProductStructureOfProduct(prodId);

        $.each(product_struct, function (ind, itm) {

            var existingItem = $.grep(product_struct_items, function (e) { return e.id == itm.Id; });
            /*if there is no item exists in current list add new one or else update the existing values*/
            if (existingItem.length == 0) {
                product_struct_items.push({
                    'Id': itm.Id,
                    'Item': itm.Name,
                    'RequestedQty': reqQty,
                    'UnitPrice': itm.Quantity,
                    'Total': (itm.Quantity * reqQty),
                    'UOM': itm.UOM
                });
            }
            else {
                /*alter values in 1st matching item from the return array (should return only one item if the logic is in correct form)*/
                existingItem[0].Total += (itm.Quantity * reqQty);
            }
        });

        /*initialize model pop up controller values*/
        $('#hf-cust-orderId').val(customerOrderId);
        $('#txt-product').val(product);
        $('#hf-productId').val(prodId);
        $('#txt-stocks').val(instocks)
        $('#txt-req-qty').val(reqQty);
        $('#txt-manuf-qty').val(reqQty);
        /*if the plant is not local no need to order inventory so hide inventory item details*/
        var $plant_selected = $('#select-plant option:selected');
        if (parseInt($plant_selected.attr('isLocal')) != 1) {
            $('#fs-order-items').hide();
        }

        var $container = $('#div-order-list');
        /*currently if there are no items clear the message and then append items if there is any*/
        if ($container.find('.order-item').length == 0 && product_struct_items.length > 0) {
            $container.html('');
        }
        /*add to model window*/
        $.each(product_struct_items, function (index, ele) {
            $container.append(GetInventoryItemHtml(ele));
        });

        /*open model popup*/
        $('#model-inventory-order').modal({
            "backdrop": "static",
            "keyboard": false,
            "show": true
        });
    }
    else if (rowcollection.length > 1) {
        bootbox.alert('Raw material request can be only set to one order at once !');
    }
        /*at least one order should be selected*/
    else {
        bootbox.alert('Select at least one customer order to request Raw materials !');
    }
});

$('#txt-from-stocks').blur(function (e) {
    var in_stocks = $('#txt-stocks').val().trim() != '' ? parseInt($('#txt-stocks').val().trim()) : 0;
    var from_stocks = $('#txt-from-stocks').val().trim() != '' ? parseInt($('#txt-from-stocks').val().trim()) : 0;
    var requested_qty = $('#txt-req-qty').val().trim() != '' ? parseInt($('#txt-req-qty').val().trim()) : 0;

    var balance = (requested_qty - from_stocks);

    if (balance > 0 && in_stocks >= from_stocks) {

        $('#txt-manuf-qty').val(balance);

        $.each($('#div-order-list').find('.order-item'), function (index, item) {
            $(item).find('.item-req-qty').html(balance);
            var unitPrice = parseFloat($(item).find('.item-unit-price').attr('unitPrice'));
            $(item).find('input').val((unitPrice * balance));
        });
    }
    else if (in_stocks < from_stocks || balance < 0) {
        bootbox.alert('Invalid stock request !');
    }
    else {
        $('#txt-from-stocks').val('');

    }
});

$('#select-plant').change(function () {
    /*if the plant is not local no need to order inventory so hide inventory item details*/
    var $plant_selected = $('#select-plant option:selected');
    if (parseInt($plant_selected.attr('isLocal')) != 1) {
        $('#fs-order-items').hide();
    }
    else {
        $('#fs-order-items').show();
    }
});

/*clear controllers on model popup*/
function ClearRawMaterialModelPopUp() {
    $('#hf-cust-orderId').val('-1');

    $('#txt-product').val('');
    $('#hf-productId').val('-1');
    $('#txt-stocks').val('');
    $('#txt-req-qty').val('');
    $('#txt-manuf-qty').val('');
    $('#txt-from-stocks').val('');

    $('.datepicker').val('');
    /*select the 1st item*/
    $('#select-plant option:first-child').attr("selected", "selected");

    $('#div-order-list').html('');
    $('#txt-notes').val('');
}

function GetInventoryItemHtml(inventoryItem) {
    var html = '';

    html += '<div class="order-item" itemId="' + inventoryItem.Id + '">';
    html += '<label class="col-sm-3">' + inventoryItem.Item + ' (' + inventoryItem.UOM + ')</label>&nbsp;';

    html += '<label unitPrice="' + inventoryItem.UnitPrice + '" class="col-sm-2 item-unit-price">' + inventoryItem.UnitPrice + '</label>';
    html += '<label class="col-sm-1">X</label>';
    html += '<label class="col-sm-2 item-req-qty">' + inventoryItem.RequestedQty + '</label>&nbsp;';

    html += '<input id="itemid-' + inventoryItem.Id + '" class="input-sm col-xs-3" type="number" onkeypress="return IsNumberKey(event);" value="' + inventoryItem.Total + '" /> &nbsp;';
    //html += '<button class="btn btn-danger btn-xs" onclick="RemoveItem(this);">';
    //html += '<i class="icon-trash bigger-110 icon-only"></i>';
    //html += '</button>';
    html += '</div>';

    return html;
}

$('#btn-order-inventory').click(function () {

    var $plant_selected = $('#select-plant option:selected');
    var customer_order_id = $('#hf-cust-orderId').val(),
        total_req = parseInt($('#txt-req-qty').val()),
        in_stock = parseInt($('#txt-stocks').val()),
        from_stocks = ($('#txt-from-stocks').val() != '' ? parseInt($('#txt-from-stocks').val()) : 0),
        production_qty = parseInt($('#txt-manuf-qty').val());

    if (in_stock >= from_stocks && (production_qty + from_stocks == total_req)) {
        var product_plan = {
            'CustomerOrderId': customer_order_id,
            'ProductId': $('#hf-productId').val(),
            'TotalRequested': total_req,
            'ReservedFinishedGoodQty': from_stocks,
            'TotalQtyToProduce': production_qty,
            'ProductionFactory': $plant_selected.val()
        };

        var isPrductionPlanAdded = AddProductionPlan(product_plan);

        if (isPrductionPlanAdded) {
            /*if the plant is local proceed with raw material request or only add to production plan*/
            if (parseInt($plant_selected.attr('isLocal')) == 1) {
                var req_items = [];

                $.each($('#div-order-list').find('.order-item'), function (index, item) {
                    var request_amt = ($(item).find('input').val().trim() != '' ? parseInt($(item).find('input').val().trim()) : 0);

                    if (request_amt > 0) {
                        req_items.push(
                            {
                                'InventryItemId': $(item).attr('itemid'),
                                'QtyRequested': request_amt
                            });
                    }
                });

                var rawMaterialReq = {
                    'RequiredDate': $('#datepicker-production-sdate').val(),
                    'SpecialNotes': $('#txt-notes').val(),
                    'CustomerOrderId': customer_order_id,
                    'rawmeterialRequestDetail': req_items
                };

                if (rawMaterialReq.rawmeterialRequestDetail.length > 0) {

                    var isSuccess = AddRawMaterialRequest(rawMaterialReq);

                    if (isSuccess) {
                        /*close popup after saving & rebind the grid*/
                        bootbox.alert("Raw materials request placed successfully!", function () {
                            /*redraw table*/
                            DrawTable(GetOrdersForSelectedOrderStatus());
                            /*close after saving data*/
                            $('#model-inventory-order').modal('hide');
                        });
                    }
                    else {
                        bootbox.alert('Error occurred -Raw material request!');
                    }
                }
                else {
                    bootbox.alert('Order placed Successfully !');
                }
            }
            else {
                bootbox.alert('Production plan Successfully added to ' + $plant_selected.text() + ' !', function () {
                    /*redraw table*/
                    DrawTable(GetOrdersForSelectedOrderStatus());
                    /*close after saving data*/
                    $('#model-inventory-order').modal('hide');
                });
            }
        }
        else {
            bootbox.alert('Error occurred - production plan !');
        }
    }
    else {
        bootbox.alert('Invalid stock request !');
    }
});

$('#btn-addto-inventory').click(function () {
    var rowcollection = oTable_manage_order_production.$("input:checkbox.chk-order:checked", { "page": "all" });

    if (rowcollection.length > 0) {
        var order_arr = [];
        var orderId_arr = [];
        rowcollection.each(function (index, item) {

            var aData = oTable_manage_order_production.fnGetData(parseInt($(item).attr('index')));
            orderId_arr.push(parseInt(aData[2]));
            order_arr.push({ 'Id': parseInt(aData[2]) });
        });

        bootbox.confirm('Are you sure you want to add selected orders to finish good inventory ?<br/> Order Id(s) : <b>' + orderId_arr.join(',') + '</b>', function (result) {
            /*if user confirmed*/
            if (result) {

                var isSuccess = AddOrdersToFinishGoods(order_arr);

                if (isSuccess) {
                    /*close popup after saving & rebind the grid*/
                    bootbox.alert("Finish goods added to inventory successfully!", function () {
                        /*clear form data*/
                        ClearRawMaterialModelPopUp();
                        /*redraw table*/
                        DrawTable(GetOrdersForSelectedOrderStatus());

                        /*close after saving data*/
                        $('#model-inventory-order').modal('hide');
                    });
                }
                else {
                    bootbox.alert('Error occurred ');
                }
            }
        });

    }
    else {
        bootbox.alert('No item has been selected for add to inventory');
    }
});

$('#btn-internal-order').click(function () {

    ManageOrder(-1, true);
});

function OnOrderPlaced_SuccessHandler() {
    /*redraw table*/
    DrawTable(GetOrdersForSelectedOrderStatus());
}

function GetOrdersForSelectedOrderStatus() {

    /*temp data *remove this after finalizing* */
    return [

            [0, null, 1, 1, "Abc (Pvt) Ltd", moment("01-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 1, "Flint bottle", 1000, 20, 600, moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 'Confirm', null],
             [1, null, 2, 2, "Amanda Services", moment("06-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 1, "Flint bottle", 1350, 15, 750, moment("08-12-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 'Confirm', null]
    ];

    var orderStatusId = parseInt($('#select-order-status option:selected').val());
    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Orders/GetCustomerOrdersByStatus',
        data: "{'statusId':" + orderStatusId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {

            if (/*msg.Orders.length*/0 > 0) {
                $.each(msg.Orders, function (index, item) {
                    aaDataArr.push(
                        /*index*/index,
                        /*column for checkbox*/null,
                        item.OrderId,
                        item.CustomerId,
                        item.CustomerName,
                        item.OrderDate,
                        item.ProductId,
                        item.ProductName,
                        item.RequiredQty,
                        item.UnitPrice,
                        item.AvailableQtyInStocks,
                        item.RequiredDeliveryDate,
                        item.OrderStatues,
                        /*column for expand*/null)
                });
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetProductStructureOfProduct(productId) {
    /*dummy data*/
    return [
            { 'Id': 1, 'Name': 'dolamite', 'UOM': 'g', 'Quantity': 20.5 },
            { 'Id': 2, 'Name': 'silica', 'UOM': 'g', 'Quantity': 18 },
            { 'Id': 3, 'Name': 'soda ash', 'UOM': 'g', 'Quantity': 25 },
            { 'Id': 4, 'Name': 'felspar', 'UOM': 'g', 'Quantity': 32 },
            { 'Id': 5, 'Name': 'cullets', 'UOM': 'g', 'Quantity': 50 }
    ];

    var product_strut = [];

    $.ajax({
        type: "POST",
        url: '/Orders/GetProductStructureOfProduct',
        data: "{'productId':" + productId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            if (/*msg.product_struct.length*/0 > 0) {
                product_strut = msg.product_struct;
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return product_strut;
}

function GetProductionPlants() {
    /*temp dataset*/
    var temp = [
        { 'Id': '1', 'Name': 'Colombo,Sri Lanka', 'IsLocal': '1' },
        { 'Id': '2', 'Name': 'Bihar,India', 'IsLocal': '0' }
    ];

    $.ajax({
        type: "POST",
        url: '/Orders/GetProductionPlants',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            //if (msg.plants.length > 0) {
            $.each(temp/*msg.plants*/, function (index, item) {
                $('#select-plant')
                    .append($("<option></option>")
                                .attr("value", item.Id)
                                .attr("isLocal", item.IsLocal)
                                .text(item.Name));
            });
            //}
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function AddRawMaterialRequest(rawMaterialReq) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Orders/AddRawMaterialRequest',
        data: "{'rawMaterialReq':" + JSON.stringify(rawMaterialReq) + "}",
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

function AddOrdersToFinishGoods(order_arr) {
    var res = false;
    $.ajax({
        type: "POST",
        url: '/Orders/AddOrdersToFinishGoodsInventory',
        data: "{'order':" + JSON.stringify(order_arr) + "}",
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

function AddProductionPlan(product_plan) {
    var res = false;
    $.ajax({
        type: "POST",
        url: '/Orders/AddProductionPlan',
        data: "{'productionPlan':" + JSON.stringify(product_plan) + "}",
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

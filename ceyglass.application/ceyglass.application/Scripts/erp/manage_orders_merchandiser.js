var oTable_manage_order_merchandiser;

$(function () {
    oTable_manage_order_merchandiser = $('#orders-list').dataTable(OrderListDataTableOptions(GetOrdersForSelectedOrderStatus()));
});

function DrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTable_manage_order_merchandiser == 'undefined') {
        oTable_manage_order_merchandiser = $('#orders-list').dataTable(OrderListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_manage_order_merchandiser.fnClearTable(0);
        oTable_manage_order_merchandiser.fnAddData(aaDataArr);
        oTable_manage_order_merchandiser.fnDraw();
    }
}

function OrderListDataTableOptions(aaDataArr) {
    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Order. Id" },
            { "sTitle": "Cust. Id" },
            { "sTitle": "Customer" },
            { "sTitle": "Order date" },
            { "sTitle": "ProductId" },
            { "sTitle": "Product" },
            { "sTitle": "Qty (unit price)" },
            { "sTitle": "Dilivery date" },
            { "sTitle": "Dilivery Address" },
            { "sTitle": "Dilivery Instructions" },
            { "sTitle": "Status" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [1] },
                    { "bSearchable": false, "bVisible": false, "aTargets": [4] },
                    {
                        "aTargets": [11],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var html = '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons">';
                            html += '<a onclick="ManageOrder(\'' + parseInt(full[0]) + '\',false)" class="blue" href="javascript:void(0);"><i class="icon-edit bigger-130"></i></a>';
                            html += '</div>';
                            return html;
                        }
                    }
        ]
    };
}

$('#select-order-status').change(function () {
    /*redraw table*/
    DrawTable(GetOrdersForSelectedOrderStatus());
});

$('#btn-add-order').click(function () {
    /*-1 indicates new order*/
    ManageOrder(-1, false);
});

function OnOrderPlaced_SuccessHandler() {
    /*redraw table*/
    DrawTable(GetOrdersForSelectedOrderStatus());
}

function GetOrdersForSelectedOrderStatus() {

    /*temp data *remove this after finalizing* */
    return [

            [1, 1, "Abc (Pvt) Ltd", moment("01-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 1, "Flint bottle", "1000 (10)", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "No.46 Colombo", "To be dilivered to No.46, Colombo", 'Confirm', null],
             [2, 2, "Amanda Services", moment("06-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), 1, "Flint bottle", "1350 (10)", moment("08-12-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "No.9 Pannipitiya", "Call Mr. Sunil on 2 450 263", 'Confirm', null]
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
                        item.OrderId,
                        item.CustomerId,
                        item.CustomerName,
                        item.OrderDate,
                        item.ProductId,
                        item.ProductName,
                        (item.RequiredQty + ' ( ' + item.UnitPrice + ' )'),
                        item.RequiredDeliveryDate,
                        item.DeliveryAddress,
                        item.DeliveryInstructions,
                        item.OrderStatues,
                        /*for edit button column*/null)
                });
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}
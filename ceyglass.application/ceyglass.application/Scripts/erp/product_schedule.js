var oTable_plan;

$(function () {
    var aaDataArr = GetRawMaterialAllocatedProductionPlans();
    oTable_plan = $('#plan-list').dataTable(ProductPlanListDataTableOptions(aaDataArr));

    //$('.external-event').draggable({
    //    zIndex: 999,
    //    revert: "invalid",      // will cause the event to go back to its
    //    revertDuration: 0  //  original position after the drag
    //});

    $('.droppable').droppable({
        drop: function (event, ui) {
            alert('droped');
        },
        tolerance: "pointer"
    });
});

function ReDrawTable(aaDataArr) {

    /*if there is no table create and assign data*/
    if (typeof oTable_plan == 'undefined') {
        oTable_plan = $('#plan-list').dataTable(ProductPlanListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_plan.fnClearTable(0);
        oTable_plan.fnAddData(aaDataArr);
        oTable_plan.fnDraw();
    }
}

function ProductPlanListDataTableOptions(aaDataArr) {

    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Index" },
            { "mData": null },
            { "sTitle": "Plan Id" },
            { "sTitle": "Customer Order Id" },
            { "sTitle": "Product Id" },
            { "sTitle": "Product" },
            { "sTitle": "Total Request" },
            { "sTitle": "Reserved Finish Goods" },
            { "sTitle": "Qty to Produce" },
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
                    return '<input class="chk-plan-item" type="checkbox" index=\"' + full[0] + '\">';
                }
            },
            { "bSearchable": false, "bVisible": false, "aTargets": [4] },
            {
                "aTargets": [9],
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
    if (oTable_plan.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        oTable_plan.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        oTable_plan.fnOpen(nTr, fnFormatDetails(oTable_plan, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(oTable_plan, nTr) {
    var aData = oTable_plan.fnGetData(nTr);

    var orderId = aData[3];

    var order = GetCustomerOrderById(orderId);

    var sOut = '';

    if (order != null) {
        sOut = '<div class="row">';
        sOut += '<div class="col-xs-6 col-sm-6 widget-container-span">';
        sOut += '<div class="widget-box">';

        sOut += '<div class="widget-header widget-header-small header-color-blue">';
        sOut += '<h6 class="bigger lighter">Customer Order ID: &nbsp;<i class="icon-double-angle-right"></i>' + orderId + '</h6>';
        sOut += '</div>';

        sOut += '<div class="widget-body">';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Customer : </div>';
        sOut += '<div class="div-cnt">' + order.CustomerName + '</div>';
        sOut += '</div>';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Order Date : </div>';
        sOut += '<div class="div-cnt">' + order.OrderDate + '</div>';
        sOut += '</div>';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Due Date : </div>';
        sOut += '<div class="div-cnt">' + order.RequiredDeliveryDate + '</div>';
        sOut += '</div>';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Estimated Cost : </div>';
        sOut += '<div class="div-cnt">' + order.EstimatedCost + '</div>';
        sOut += '</div>';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Delivery Address : </div>';
        sOut += '<div class="div-cnt">' + order.DeliveryAddress + '</div>';
        sOut += '</div>';

        sOut += '<div class="row">';
        sOut += '<div class="div-lbl">Delivery Instructions : </div>';
        sOut += '<div class="div-cnt">' + order.DeliveryInstructions + '</div>';
        sOut += '</div>';

        sOut += '</div>';

        sOut += '</div>';
        sOut += '</div>';
        sOut += '</div>';
    }

    return sOut;
}

$('#btn-add-to-list').click(function () {
    var rowcollection = oTable_plan.$("input:checkbox.chk-plan-item:checked", { "page": "all" });

    if (rowcollection.length > 0) {
        var $container = $('#div-selected-plans').empty();

        $.each(rowcollection, function (index, item) {
            var rowIndex = $(item).attr('index');
            var rowData = oTable_plan.fnGetData(rowIndex);

            $container.append(PlanDragItemHtml(rowData));
        });

        /*initialize draggable item */
        $('.schedule-item-drag').draggable({
            zIndex: 999,
            revert: "invalid",      // will cause the event to go back to its
            revertDuration: 0  //  original position after the drag
        });
    }
});

function PlanDragItemHtml(rowData) {

    var html = '';

    html += '<div class="schedule-item-drag external-event label-success" style="position: relative;">';
    html += '<i class="icon-move"></i>';
    html += 'Plan Id : <b>' + rowData[2] + '</b> Request : <b>' + rowData[8] + '</b>';
    html += '</div>';

    return html;
}

function GetRawMaterialAllocatedProductionPlans() {

    /*temp*/
    var temp = [
        {
            'Id': 1,
            'CustomerOrderId': 1,
            'ProductId': 1,
            'ProductName': 'Flint Type 1',
            'TotalRequested': 1000,
            'ReservedFinishedGoodQty': 600,
            'TotalQtyToProduce': 400
        }
    ];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Production/GetRawMaterialAllocatedProductionPlans',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {

            $.each(/*msg.prdPlans*/temp, function (index, item) {
                aaDataArr.push([
                    index/*row index*/,
                    null/*checkbox column*/,
                    item.Id,
                    item.CustomerOrderId,
                    item.ProductId,
                    item.ProductName,
                    item.TotalRequested,
                    item.ReservedFinishedGoodQty,
                    item.TotalQtyToProduce,
                    null/*expanding column*/
                ]);
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;
}

function GetCustomerOrderById(orderId) {

    /*temp*/
    return {
        'Id': 1,
        'CustomerId': 10,
        'CustomerName': 'Abc (Pvt) Ltd',
        'OrderDate': '09/22/2013',
        'RequiredDeliveryDate': '11/15/2013',
        'EstimatedCost': 1256480,
        'DeliveryAddress': 'No. 04, Colombo',
        'DeliveryInstructions': 'Call Mr. Sunil On 011-2123456 as soon as production completed'
    };

    var order = null;

    $.ajax({
        type: "POST",
        url: '/Production/GetCustomerOrderById',
        data: "{'orderId':" + orderId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            order = msg.order;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return order;
}
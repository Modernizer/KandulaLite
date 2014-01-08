/*initialize common features*/
$(function () {

    BindCustomerOrderStatusList();

    $("#select-customers").select2();
    $("#select-product").select2();
    $('.datepicker').datepicker();

    GetAllCustomers();
    GetAllProducts();

})

function BindCustomerOrderStatusList() {
    /*temp dataset*/
    var temp = [
        { 'Id': '0', 'Status': 'Confirm' },
        { 'Id': '1', 'Status': 'SheduleForProduction' },
        { 'Id': '2', 'Status': 'ProductionComplete' },
        { 'Id': '3', 'Status': 'Deliver' }
    ];

    $.ajax({
        type: "POST",
        url: '/Orders/GetCustomerOrderStatusList',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {

            $.each(temp/*msg.customerOrderStatusList*/, function (index, item) {
                $('#select-order-status')
                    .append($("<option></option>")
                                .attr("value", item.Id)
                                .text(item.Status));
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function GetAllCustomers() {
    /*temp dataset*/
    var temp = [
        { 'Id': '0', 'CustomerName': 'Internal Customer' },
        { 'Id': '1', 'CustomerName': 'Sunil Traders' },
        { 'Id': '2', 'CustomerName': 'ABS (pvt) Ltd' },
        { 'Id': '3', 'CustomerName': 'Amanda Services' },
        { 'Id': '4', 'CustomerName': 'Hokandara Hardwares' },
        { 'Id': '5', 'CustomerName': 'MAGA' },
        { 'Id': '6', 'CustomerName': 'Sunimal Enterprises' },
        { 'Id': '7', 'CustomerName': 'CB (pvt) Ltd' },
        { 'Id': '8', 'CustomerName': 'ABC Hardwares' }
    ];

    $.ajax({
        type: "POST",
        url: '/Orders/GetAllCustomers',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            //if (msg.items.length > 0) {
            $.each(temp/*msg.customerList*/, function (index, item) {
                $('#select-customers')
                    .append($("<option></option>")
                                .attr("value", item.Id)
                                .text(item.CustomerName));
            });
            // }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function GetAllProducts() {
    /*temp dataset*/
    var temp = [
        { 'Id': '1', 'Name': 'Flint Type 1', 'Price': 20 },
        { 'Id': '2', 'Name': 'Flint Type 2', 'Price': 25 },
        { 'Id': '3', 'Name': 'Amber Type 1', 'Price': 30 },
        { 'Id': '4', 'Name': 'Amber Type 2', 'Price': 36 }
    ];

    $.ajax({
        type: "POST",
        url: '/Orders/GetAllProducts',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: true,
        success: function (msg) {
            $.each(temp/*msg.products*/, function (index, item) {
                $('#select-product')
                    .append($("<option></option>")
                                .attr("value", item.Id)
                                .attr("unitprice", item.Price)
                                .text(item.Name));
            });
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });
}

function ClearOrderModelControllers() {

    $('#hf-orderId').val('-1');
    $('.datepicker').val('');
    $('#select-customers').select2('data', null);
    $('#select-product').select2('data', null);
    $('#txt-unitprice').val('');
    $('#txt-quantity').val('');
    $('#txt-delivery-address').val('');
    $('#txt-delivery-inst').val('');
}

function ManageOrder(orderId, isInternalOrder) {

    /*initially clear model controllers*/
    ClearOrderModelControllers();

    /*edit mode*/
    if (orderId != -1) {
        /*not considered in this case study*/
    }

    if (isInternalOrder) {
        $("#select-customers").select2("val", 0/*GetInternalCustomerId()*/);
        $("#select-customers").select2("readonly", true);
    }

    /*open model popup*/
    $('#model-order').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });

}

$('#select-product').change(function () {
    $('#txt-unitprice').val($('option:selected', this).attr('unitprice'));
});

$('#btn-add-cust-order').click(function () {

    var order = {
        'Id': $('#hf-orderId').val(),//this will be -1 if the order is a new item
        'CustomerId': $('#select-customers option:selected').val(),
        'OrderDate': $('#datepicker-orderdate').val(),
        'DeliveryAddress': $('#txt-delivery-address').val(),
        'EstimatedCost': parseInt($('#txt-quantity').val()) * parseInt($('#txt-unitprice').val()),
        'RequiredDeliveryDate': $('#datepicker-duedate').val(),
        'DeliveryInstructions': $('#txt-delivery-inst').val(),
        'OrderDetails': [
            {
                'ProductId': $('#select-product option:selected').val(),
                'RequiredQty': $('#txt-quantity').val()
            }
        ]
    };

    var isSuccess = DBManageOrder(order);

    if (isSuccess) {
        bootbox.alert("Order successfully placed  !", function () {
            /*related table will be rebinded*/
            OnOrderPlaced_SuccessHandler();
            /*close model popup after completion*/
            $('#model-order').modal('hide');
        });
    }
    else {
        bootbox.alert("Error occurred !");
    }

});

function DBManageOrder(order) {
    var res = false;

    $.ajax({
        type: "POST",
        url: '/Orders/ManageOrder',
        data: "{'order':" + JSON.stringify(order) + "}",
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

function GetInternalCustomerId() {
    $.ajax({
        type: "POST",
        url: '/Orders/GetInternalCustomerId',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            return msg.Id;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return -1;
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

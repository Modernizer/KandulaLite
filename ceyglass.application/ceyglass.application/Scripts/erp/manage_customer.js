var oTable_manage_customer;

$(function () {
    oTable_manage_customer = $('#customer-list').dataTable(CustomerListDataTableOptions(GetAllCustomers()));
});

function DrawTable(aaDataArr) {
    /*if there is no table create and assign data*/
    if (typeof oTable_manage_customer == 'undefined') {
        oTable_manage_customer = $('#customer-list').dataTable(CustomerListDataTableOptions(aaDataArr));
    }
        /*clear existing content and add new values*/
    else {
        oTable_manage_customer.fnClearTable(0);
        oTable_manage_customer.fnAddData(aaDataArr);
        oTable_manage_customer.fnDraw();
    }
}

function CustomerListDataTableOptions(aaDataArr) {
    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": aaDataArr,
        "aoColumns": [
            { "sTitle": "Cust. Id" },
            { "sTitle": "Name" },
            { "sTitle": "Address" },
            { "sTitle": "Contact number" },
            { "sTitle": "email" },
            { "sTitle": "website" },
            { "sTitle": "Description" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [7],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ManageCustomer(\'' + parseInt(full[0]) + '\')" class="blue" href="javascript:void(0);"><i class="icon-edit bigger-130"></i></a></div>';
                        }
                    }
        ]
    };
}

$('#btn-add-cust').click(function () {
    /*-1 indicates new customer*/
    ManageCustomer(-1);
});

function ManageCustomer(custId) {
    /*initially clear controllers*/
    ClearModelPopupControllers();

    /*on edit mode*/
    if (custId != -1) {
        var customer = GetCustomerById(custId);
        if (customer != null) {
            $('#hf-custId').val(customer.Id);
            $('#txt-name').val(customer.CustomerName);

            $('#txt-line1').val(customer.AddressLine1);
            $('#txt-line2').val(customer.AddressLine2);
            $('#txt-city').val(customer.AddressCity);

            $('#txt-cont-no').val(customer.PhoneNo);
            $('#txt-email').val(customer.Email);
            $('#txt-website').val(customer.WebSite);
            $('#txt-description').val(customer.Description);
        }
    }

    /*open model popup*/
    $('#model-customer').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });

}

function ClearModelPopupControllers() {
    $('#hf-custId').val('-1');
    $('#txt-name').val('');

    $('#txt-line1').val('');
    $('#txt-line2').val('');
    $('#txt-city').val('');

    $('#txt-cont-no').val('');
    $('#txt-email').val('');
    $('#txt-website').val('');
    $('#txt-description').val('');
}

/*add/edit customer details*/
$('#btn-add-customer').click(function () {

    var customer = {
        'Id': $('#hf-custId').val(),
        'CustomerName': $('#txt-name').val(),
        'AddressLine1': $('#txt-line1').val(),
        'AddressLine2': $('#txt-line2').val(),
        'AddressCity': $('#txt-city').val(),
        'PhoneNo': $('#txt-cont-no').val(),
        'Email': $('#txt-email').val(),
        'WebSite': $('#txt-website').val(),
        'Description': $('#txt-description').val()
    };

    var isSuccess = ManageCustomerDetails(customer);

    if (isSuccess) {
        bootbox.alert("Customer successfully added to database !", function () {
            /*redraw table*/
            DrawTable(GetAllCustomers());
            /*close model popup after completion*/
            $('#model-customer').modal('hide');
        });
    }
    else {
        bootbox.alert("Error occurred !");
    }
});

function ManageCustomerDetails(customer) {
    var res = false;
    $.ajax({
        type: "POST",
        url: '/Customer/ManageCustomerDetails',
        data: "{'customer':" + JSON.stringify(customer) + "}",
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

function GetCustomerById(custId) {
    var customer = null;
    $.ajax({
        type: "POST",
        url: '/Customer/GetCustomerById',
        data: "{'customerId':" + custId + "}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {
            customer = msg.customer;
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return customer;
}

function GetAllCustomers() {
    /*temp data *remove this after finalizing* */
    return [

            [1, "Abc (Pvt) Ltd", "Abc (Pvt) Ltd, No. 49, Colombo -05", "011-2723456,011-2753659", "abcpvtltd@gmail.com", "http://www.abcholdings.lk", 'description 1', null],
            [2, "Amanda Services", "Amanda Services, No.125/23, Nugegoda", "011-2234586,011-2789645", "amandaservices@yahoo.com", "http://www.amandaservices.com", 'description 2 ', null]
    ];

    var aaDataArr = [];

    $.ajax({
        type: "POST",
        url: '/Customer/GetAllCustomers',
        data: "{}",
        contentType: "application/json; charset=utf-8",
        dataType: "json",
        async: false,
        success: function (msg) {

            if (/*msg.customers.length*/0 > 0) {
                $.each(msg.customers, function (index, item) {
                    aaDataArr.push(
                        item.Id,
                        item.CustomerName,
                        (item.AddressLine1 + ',' + item.AddressLine2 + ',' + item.AddressCity),
                        item.PhoneNo,
                        item.Email,
                        item.WebSite,
                        item.Description,
                        /*for edit button column*/null)
                });
            }
        },
        /*error method defined in Scripts/erp/indexview.js*/
        error: AjaxError
    });

    return aaDataArr;

}
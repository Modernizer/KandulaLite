var oTable;

$(function () {

    $("#select-customers").select2();
    $("#select-product").select2();
    $('#datepicker-orderdate').datepicker();
    $('#datepicker-duedate').datepicker();

    oTable = $('#orders-list').dataTable(OrderListDataTableOptions());
});

function OrderListDataTableOptions() {
    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": [

            [1, 1, "Abc (Pvt) Ltd", moment("01-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Flint bottle", "1000 (10)", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "To be dilivered to No.46, Colombo", null],
             [2, 2, "Amanda Services", moment("06-09-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Flint bottle", "1350 (10)", moment("08-12-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "", null]
        ],
        "aoColumns": [
            { "sTitle": "Order. Id" },
            { "sTitle": "Cust. Id" },
            { "sTitle": "Customer" },
            { "sTitle": "Order date" },
            { "sTitle": "Product" },
            { "sTitle": "Qty (unit price)" },
            { "sTitle": "Dilivery date" },
             { "sTitle": "Dilivery Instructions" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [8],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            var html = '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons">';
                            html += '<a onclick="EditOrder(\'' + full[0] + '\')" class="blue" href="javascript:void(0);"><i class="icon-edit bigger-130"></i></a>';
                            html += '</div>';
                            return html;
                        }
                    }
        ]
    };
}

function EditOrder(orderId) {
    ManageOrder(orderId);
}

$('#btn-add-order').click(function () {
    /*-1 indicates new order*/
    ManageOrder(-1);
});

function ManageOrder(orderId) {
    $('#model-order').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });

    //.modal('hide');
}

$('#select-product').change(function () {

    $('#txt-unitprice').val($('option:selected', this).attr('unitprice'));
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
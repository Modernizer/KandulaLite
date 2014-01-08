var oTable;

$(function () {

    oTable = $('#customer-list').dataTable(OrderListDataTableOptions());
});

function OrderListDataTableOptions() {
    return {

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": [

            [1, "Abc (Pvt) Ltd", "Abc (Pvt) Ltd, No. 49, Colombo -05", "011-2723456,011-2753659", "abcpvtltd@gmail.com", "http://www.abcholdings.lk", null],
              [2, "Amanda Services", "Amanda Services, No.125/23, Nugegoda", "011-2234586,011-2789645", "amandaservices@yahoo.com", "http://www.amandaservices.com", null]
        ],
        "aoColumns": [
            { "sTitle": "Cust. Id" },
            { "sTitle": "Name" },
            { "sTitle": "Address" },
            { "sTitle": "Contact number (s)" },
            { "sTitle": "email" },
            { "sTitle": "website" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [6],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="EditCustomer(\'' + full[0] + '\')" class="blue" href="javascript:void(0);"><i class="icon-edit bigger-130"></i></a></div>';
                        }
                    }
        ]
    };
}

function EditCustomer(custId) {
    ManageCustomer(custId);
}

$('#btn-add-cust').click(function () {
    /*-1 indicates new customer*/
    ManageCustomer(-1);
});

function ManageCustomer(custId) {
    $('#model-customer').modal({
        "backdrop": "static",
        "keyboard": false,
        "show": true
    });

    //.modal('hide');
}

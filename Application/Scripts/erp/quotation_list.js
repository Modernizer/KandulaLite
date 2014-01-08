var oTable, detailedTable;
var chart;

jQuery(function ($) {
    /*initially hide detail area*/
    $('#div-detail-area').hide();

    oTable = $('#quotation-list').dataTable({

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": [
            /* Reduced data set */
            [1, "Quotation 1", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 1", null],
            [2, "Quotation 2", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 2", null],
            [3, "Quotation 3", moment("06-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 3", null],
            [4, "Quotation 4", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 4", null],
            [5, "Quotation 5", moment("10-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 5", null],
            [6, "Quotation 6", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 6", null],
            [7, "Quotation 7", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 7", null],
            [8, "Quotation 8", moment("25-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 8", null],
            [9, "Quotation 9", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 9", null],
            [10, "Quotation 10", moment("08-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 10", null],
            [11, "Quotation 11", moment("05-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 11", null],
            [12, "Quotation 15", moment("12-10-2013", "DD-MM-YYYY").format("DD-MM-YYYY"), "Description 12", null]
        ],
        "aoColumns": [
            { "sTitle": "Ref Id" },
            { "sTitle": "Title" },
            { "sTitle": "Due Date" },
            { "sTitle": "Description" },
            { "mData": null }

        ],
        "aoColumnDefs": [
                    //{ "bSearchable": false, "bVisible": false, "aTargets": [0] },
                    {
                        "aTargets": [4],
                        "mData": null,
                        "bSearchable": false,
                        "bSortable": false,
                        "mRender": function (data, type, full) {
                            return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ViewQuotationsReceived(\'' + full[0] + '\',\'' + full[1] + '\')" class="blue" href="javascript:void(0);"><i class="icon-zoom-in bigger-130"></i></a></div>';
                        }
                    }
        ]
    });
});

/* Get the rows which are currently selected */
function fnGetSelected(oTableLocal) {
    return oTableLocal.$('tr.row_selected');
}

/* Add a click handler to the rows - this could be used as a callback */
$("#quotation-list tbody tr").live("click", function (e) {

    if (!$(this).hasClass('row_selected')) {
        oTable.$('tr.row_selected').removeClass('row_selected');
        $(this).addClass('row_selected');
    }
});

function ViewQuotationsReceived(refId, title) {
    $('#div-detail-area').show();
    $('#header-quotation').html('<strong>Quotation : </strong>' + title);

    SwitchDetails($('.li-quotation-det.active').attr('id'), refId);
}

$('.li-quotation-det').click(function () {
    var selected_row = fnGetSelected(oTable);
    var selected_ref = $(selected_row).children('td:first').text();

    SwitchDetails($(this).attr('id'), selected_ref);
});

function SwitchDetails(selected_tab, refId) {
    switch (selected_tab) {
        case 'li-table':
            $('#div-chart-type').hide();
            LoadDetailTable(refId);
            break;
        case 'li-charts':
            $('#div-chart-type').show();
            LoadCharts(refId);
            break;
    }
}

function LoadDetailTable(refId) {
    $('#div-quotation-details').html('<table id="quotation-details-tab" class="table table-striped table-bordered table-hover"></table>');

    detailedTable = $('#quotation-details-tab').dataTable({

        "oTableTools": {
            "sRowSelect": "single"
        },
        "aaData": [
            /* Reduced data set */
            [1, "Sunil Traders", 125, "4", null],
            [2, "ABS (pvt) Ltd", 115, "4", null],
            [3, "Amanda Services", 130, "5", null],
            [4, "Hokandara Hardwares", 110, "5", null],
            [5, "MAGA", 150, "9", null],
            [6, "Sunimal Enterprises", 100, "6", null],
            [7, "CB (pvt) Ltd", 135, "8", null],
            [8, "ABC Hardwares", 110, "8", null]
        ],
        "aoColumns": [
            { "sTitle": "Id" },
            { "sTitle": "Supplier" },
            { "sTitle": "Total Bid (,000)" },
            { "sTitle": "Supplier rating" },
             { "mData": null }
        ],
        "aoColumnDefs": [
                        { "bSearchable": false, "bVisible": false, "aTargets": [0] },
                         {
                             "aTargets": [4],
                             "mData": null,
                             "bSearchable": false,
                             "bSortable": false,
                             "mRender": function (data, type, full) {
                                 return '<div class="visible-md visible-lg hidden-sm hidden-xs action-buttons"><a onclick="ViewQuotationDetails(this)" class="blue" href="javascript:void(0);"><i class="icon-collapse bigger-130"></i></a></div>';
                             }
                         }
        ]
    });
}

function ViewQuotationDetails(element) {
    var nTr = $(element).parents('tr')[0];
    if (detailedTable.fnIsOpen(nTr)) {
        $(element).find('i').removeAttr('class').addClass('icon-collapse bigger-130');
        detailedTable.fnClose(nTr);
    }
    else {
        $(element).find('i').removeAttr('class').addClass('icon-collapse-top bigger-130');
        detailedTable.fnOpen(nTr, fnFormatDetails(detailedTable, nTr), 'details');
    }
}

/* Formating function for row details */
function fnFormatDetails(detailedTable, nTr) {
    var aData = detailedTable.fnGetData(nTr);
    /*get dummy data*/
    var supplier_bid = GetQuotationsBySuppliers();

    var result = $.grep(supplier_bid, function (e) { return e.supplierId == aData[0]; });

    var sOut = '';

    if (result.length > 0) {
        sOut = '<div class="row">';
        sOut += '<div class="col-xs-12 col-sm-6 widget-container-span">';
        sOut += '<div class="widget-box">';
        sOut += '<div class="widget-header widget-header-small header-color-blue">';
        sOut += '<h6 class="bigger lighter">' + result[0].supplier + '&nbsp;<i class="icon-double-angle-right"></i> Quotation summary (,000)</h6>';
        sOut += '</div>';
        sOut += '<div class="widget-body">';
        sOut += '<table cellpadding="5" cellspacing="0" border="0" style="padding-left:50px;">';

        $.each(result[0].items, function (index, quotation_item) {
            sOut += '<tr><td>' + quotation_item.item + ' : </td><td>' + quotation_item.price + '</td></tr>';
        });

        sOut += '</table>';
        sOut += '</div>';
        sOut += '</div>';
        sOut += '</div>';
        sOut += GetSupplierProfile(result[0].supplierId);
        sOut += '</div>';
    }

    return sOut;
}

function LoadCharts(refId) {

    var series_arr = [];

    $.each(GetQuotationsBySuppliers(), function (index, supplier) {

        var data = [];
        $.each(supplier.items, function (index, supItem) {
            data.push(supItem.price);
        });

        series_arr.push({
            'name': supplier.supplier,
            'data': data
        });

    });

    var options = {
        chart: {
            type: 'line',
            renderTo: 'div-quotation-details',
            zoomType: 'xy'
        },
        title: {
            text: 'Quotation comparison'
        },
        subtitle: {
            text: 'ceyglass.lk'
        },
        xAxis: {
            categories: ['Dolomite', 'Silica', 'Soda ash', 'Felspar', 'Cullets'],
            title: {
                text: 'items'
            }
        },
        series: series_arr,
        yAxis: {
            min: 0,
            max: 50,
            title: {
                text: 'bids (,000)'
            }
        },
        plotOptions: {
            line: {
                dataLabels: {
                    enabled: true
                }
            }
        },
        credits: {
            enabled: false
        },
        exporting: {
            enabled: true
        }
    };

    chart = new Highcharts.Chart(options);
}

$('#select-chart-type').change(function () {
    var series = chart.series;
    var ser;

    for (var i = 0; i < series.length; i++) {
        ser = chart.series[i];
        ser.update({ type: $(this).val() });
    }
});

function GetSupplierProfile(supplierId) {
    var html = '';

    html += '<div class="col-sm-6">';
    html += '<div class="tabbable tabs-left">';
    html += '<ul class="nav nav-tabs">';
    html += '<li class="active">';
    html += '<a data-toggle="tab" href="#cmpHistory_' + supplierId + '">';
    html += '<i class="pink icon-dashboard bigger-110"></i>';
    html += 'Business History';
    html += '</a>';
    html += '</li>';

    html += '<li>';
    html += '<a data-toggle="tab" href="#cmpProfile_' + supplierId + '">';
    html += '<i class="blue icon-user bigger-110"></i>';
    html += 'Company Profile';
    html += '</a>';
    html += '</li>';

    html += '<li>';
    html += '<a data-toggle="tab" href="#cmpContact_' + supplierId + '">';
    html += '<i class="icon-rocket"></i>';
    html += 'Contact Details';
    html += '</a>';
    html += '</li>';
    html += '</ul>';

    html += '<div class="tab-content">';

    html += '<div id="cmpHistory_' + supplierId + '" class="tab-pane in active">';
    html += 'company history';
    html += '</div>';

    html += '<div id="cmpProfile_' + supplierId + '" class="tab-pane">';
    html += 'company profile';
    html += '</div>';

    html += '<div id="cmpContact_' + supplierId + '" class="tab-pane">';
    html += 'contact details';
    html += '</div>';

    html += '</div>';
    html += '</div>';
    html += '</div>';

    return html;
}

/*dummy data*/
function GetQuotationsBySuppliers() {
    var data_arr = [
        {
            'supplierId': 1,
            'supplier': 'Sunil Traders',
            'items': [
               { 'id': 1, 'item': 'Dolomite', 'price': 40 },
                { 'id': 2, 'item': 'Silica', 'price': 25 },
                { 'id': 3, 'item': 'Soda ash', 'price': 15 },
                { 'id': 4, 'item': 'Felspar', 'price': 20 },
                { 'id': 5, 'item': 'Cullets', 'price': 25 }
            ]
        },

         {
             'supplierId': 2,
             'supplier': 'ABS (pvt) Ltd',
             'items': [
                { 'id': 1, 'item': 'Dolomite', 'price': 37 },
                { 'id': 2, 'item': 'Silica', 'price': 28 },
                { 'id': 3, 'item': 'Soda ash', 'price': 10 },
                { 'id': 4, 'item': 'Felspar', 'price': 18 },
                { 'id': 5, 'item': 'Cullets', 'price': 22 }
             ]
         },

          {
              'supplierId': 3,
              'supplier': 'Amanda Services',
              'items': [
                { 'id': 1, 'item': 'Dolomite', 'price': 45 },
                { 'id': 2, 'item': 'Silica', 'price': 29 },
                { 'id': 3, 'item': 'Soda ash', 'price': 18 },
                { 'id': 4, 'item': 'Felspar', 'price': 22 },
                { 'id': 5, 'item': 'Cullets', 'price': 16 }
              ]
          },

           {
               'supplierId': 4,
               'supplier': 'Hokandara Hardwares',
               'items': [
                { 'id': 1, 'item': 'Dolomite', 'price': 35 },
                { 'id': 2, 'item': 'Silica', 'price': 24 },
                { 'id': 3, 'item': 'Soda ash', 'price': 18 },
                { 'id': 4, 'item': 'Felspar', 'price': 15 },
                { 'id': 5, 'item': 'Cullets', 'price': 18 }
               ]
           },

            {
                'supplierId': 5,
                'supplier': 'MAGA',
                'items': [
                { 'id': 1, 'item': 'Dolomite', 'price': 46 },
                { 'id': 2, 'item': 'Silica', 'price': 28 },
                { 'id': 3, 'item': 'Soda ash', 'price': 26 },
                { 'id': 4, 'item': 'Felspar', 'price': 22 },
                { 'id': 5, 'item': 'Cullets', 'price': 28 }
                ]
            },

             {
                 'supplierId': 6,
                 'supplier': 'Sunimal Enterprises',
                 'items': [
                    { 'id': 1, 'item': 'Dolomite', 'price': 35 },
                    { 'id': 2, 'item': 'Silica', 'price': 25 },
                    { 'id': 3, 'item': 'Soda ash', 'price': 10 },
                    { 'id': 4, 'item': 'Felspar', 'price': 15 },
                    { 'id': 5, 'item': 'Cullets', 'price': 15 }
                 ]
             },

              {
                  'supplierId': 7,
                  'supplier': 'CB (pvt) Ltd',
                  'items': [
                    { 'id': 1, 'item': 'Dolomite', 'price': 42 },
                    { 'id': 2, 'item': 'Silica', 'price': 32 },
                    { 'id': 3, 'item': 'Soda ash', 'price': 22 },
                    { 'id': 4, 'item': 'Felspar', 'price': 20 },
                    { 'id': 5, 'item': 'Cullets', 'price': 19 }
                  ]
              },

               {
                   'supplierId': 8,
                   'supplier': 'ABC Hardwares',
                   'items': [
                      { 'id': 1, 'item': 'Dolomite', 'price': 32 },
                      { 'id': 2, 'item': 'Silica', 'price': 28 },
                      { 'id': 3, 'item': 'Soda ash', 'price': 14 },
                      { 'id': 4, 'item': 'Felspar', 'price': 19 },
                      { 'id': 5, 'item': 'Cullets', 'price': 17 }
                   ]
               },
    ];

    return data_arr;
}
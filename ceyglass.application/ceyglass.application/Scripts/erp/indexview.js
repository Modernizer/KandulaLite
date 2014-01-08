$(function () {
    $('body').removeClass('login-layout');

    var $initial_li = $('#li-dashboard');

    GetBreadcrumb($initial_li);

    LoadContent($initial_li);
});

$('.menu-item').click(function () {

    $('.menu-item.active').removeClass('active');

    $(this).addClass('active');

    GetBreadcrumb($(this));

    LoadContent($(this));
});

/*set titles of the page & breadcrumb */
function GetBreadcrumb(li) {

    var breadcrumb = '', pagetitle = '';

    breadcrumb += '<li> <i class="icon-home home-icon"></i><a href="javascript:void(0);">ceyglass Home</a></li>';
    pagetitle += '<h1>';

    switch ($(li).attr('id')) {
        case 'li-dashboard':
            breadcrumb += '<li >Dashboard</li>';
            pagetitle += 'Dashboard <small> <i class="icon-double-angle-right"></i> user dashboard</small>';
            break;
            /*purchasing department related links*/
        case 'li-PR':
            breadcrumb += '<li >PR</li><li>Pending PR list</li>';
            pagetitle += 'PR <small> <i class="icon-double-angle-right"></i> Pending PR list from stores</small>';
            break;
        case 'li-PO':
            breadcrumb += '<li >PO</li><li>PO list</li>';
            pagetitle += 'PO <small> <i class="icon-double-angle-right"></i> Manage PO list</small>';
            break;
        case 'li-DO':
            breadcrumb += '<li >DO</li><li>DO list</li>';
            pagetitle += 'DO <small> <i class="icon-double-angle-right"></i> Manage DO list</small>';
            break;
        case 'li-call-qutation':
            breadcrumb += '<li >Quotations</li><li>Call Quotations</li>';
            pagetitle += 'Call quotations from suppliers <small> <i class="icon-double-angle-right"></i> quotaion distribution</small>';
            break;
        case 'li-receive-qutation':
            breadcrumb += '<li >Quotation</li><li>Received Quotations</li>';
            pagetitle += 'Received Quotations<small> <i class="icon-double-angle-right"></i> list of quotations recieved by clients</small>';
            break;
            /*production & merchandiser department related links*/
        case 'li-manage-customer':
            breadcrumb += '<li >Customer Orders</li><li>Manage customer(s)</li>';
            pagetitle += 'Manage Customers<small> <i class="icon-double-angle-right"></i> manage list of customers</small>';
            break;
        case 'li-manage-order':
            breadcrumb += '<li >Customer Orders</li><li>Manage orders</li>';
            pagetitle += 'Manage Orders<small> <i class="icon-double-angle-right"></i> manage list of orders received</small>';
            break;
        case 'li-schedule':
            breadcrumb += '<li >Production</li><li>Schedule Production</li>';
            pagetitle += 'Schedule Production<small> <i class="icon-double-angle-right"></i> Schedule production plans</small>';
            break;
            /*store related links*/
        case 'li-inventory-req':
            breadcrumb += '<li >Inventory</li><li>Inventory requests</li>';
            pagetitle += 'Manage Raw materials requests<small> <i class="icon-double-angle-right"></i> manage list of Raw materials requests received</small>';
            break;
        case 'li-temp-PR-list':
            breadcrumb += '<li >Inventory</li><li>Purchasing list</li>';
            pagetitle += 'Purchasing items list <small> <i class="icon-double-angle-right"></i> list of items to be purchase</small>';
            break;
        case 'li-grn':
            breadcrumb += '<li >Inventory</li><li>Pending GRN list</li>';
            pagetitle += 'Pending GRN list <small> <i class="icon-double-angle-right"></i> pending GRNs to confirm</small>';
            break;
        case 'li-frn':
            breadcrumb += '<li >Inventory</li><li>Pending FRN list</li>';
            pagetitle += 'Pending FRN list <small> <i class="icon-double-angle-right"></i> pending FRNs to confirm</small>';
            break;
        default:
            break;
    }

    pagetitle += '</h1>';

    $('#ul-breadcrumb').html(breadcrumb);
    $('#div-page-title').html(pagetitle);
}

/*load related content based on selected menu item*/
function LoadContent(li) {
    var $contentdiv = $('#div-render-body');
    var uri = '';

    switch ($(li).attr('id')) {
        case 'li-dashboard':
            uri = 'User/Index';
            break;
            /*purchasing department related links*/
        case 'li-PR':
            uri = 'Purchasing/PR';
            break;
        case 'li-PO':
            uri = 'Purchasing/PO';
            break;
        case 'li-DO':
            uri = 'Purchasing/DO';
            break;
        case 'li-call-qutation':
            uri = 'Purchasing/CallQuotations';
            break;
        case 'li-receive-qutation':
            uri = 'Purchasing/ReceivedQuotationList';
            break;
            /*production & merchandiser department related links*/
        case 'li-manage-customer':
            uri = 'Customer/Index';
            break;
        case 'li-manage-order':
            uri = 'Orders/Index';
            break;
        case 'li-schedule':
            uri = 'Production/Schedule';
            break;
            /*store related links*/
        case 'li-inventory-req':
            uri = 'Store/Index';
            break;
        case 'li-temp-PR-list':
            uri = 'Store/PurchasingList';
            break;
        case 'li-grn':
            uri = 'Store/PendingGRN';
            break;
        case 'li-frn':
            uri = 'Store/PendingFRN';
            break;
    }
    if (uri != '') {
        $contentdiv.load(uri);
    }

    //// show loading animation        
    //$("#loading-animation").show();
    //setTimeout(function () {
    //    $contentdiv.load(uri, function () {
    //        // hide loading animation
    //        $("#loading-animation").hide();
    //    });
    //}, 3000)

}

/*ajax method error handler*/
function AjaxError(jqXHR, exception) {
    if (jqXHR.status === 0) {
        alert('Not connect.\n Verify Network.');
    } else if (jqXHR.status == 404) {
        alert('Requested page not found. [404]');
    } else if (jqXHR.status == 500) {
        alert('Internal Server Error [500]. Please Contact Administrator !');
    } else if (exception === 'parsererror') {
        alert('Requested JSON parse failed. Please Contact Administrator !');
    } else if (exception === 'timeout') {
        alert('Time out error. Please Contact Administrator !');
    } else if (exception === 'abort') {
        alert('Ajax request aborted. Please Contact Administrator !');
    } else {
        alert('Uncaught Error.\n' + jqXHR.responseText);
    }
}
$(function () {
    $('body').removeClass('login-layout');
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
        case 'li-PR-All':
            breadcrumb += '<li >PR</li><li>Total PR list</li>';
            pagetitle += 'PR <small> <i class="icon-double-angle-right"></i> PR list summary</small>';
            break;
        case 'li-call-qutation':
            breadcrumb += '<li >Quotations</li><li>Call Quotations</li>';
            pagetitle += 'Call quotations from suppliers <small> <i class="icon-double-angle-right"></i> quotaion distribution</small>';
            break;
        case 'li-receive-qutation':
            breadcrumb += '<li >Quotation</li><li>Received Quotations</li>';
            pagetitle += 'Received Quotations<small> <i class="icon-double-angle-right"></i> list of quotations recieved by clients</small>';
            break;
            /*order department related links*/
        case 'li-manage-customer':
            breadcrumb += '<li >Customer Orders</li><li>Manage customer(s)</li>';
            pagetitle += 'Manage Customers<small> <i class="icon-double-angle-right"></i> manage list of customers</small>';
            break;
        case 'li-manage-order':
            breadcrumb += '<li >Customer Orders</li><li>Manage orders</li>';
            pagetitle += 'Manage Orders<small> <i class="icon-double-angle-right"></i> manage list of orders received</small>';
            break;
            /*store related links*/
        case 'li-inventory-req':
            breadcrumb += '<li >Inventory</li><li>Inventory requests</li>';
            pagetitle += 'Manage inventory Orders<small> <i class="icon-double-angle-right"></i> manage list of inventory orders received</small>';
            break;
        case 'li-temp-PR-list':
            breadcrumb += '<li >Inventory</li><li>Purchasing list</li>';
            pagetitle += 'Purchasing items list<small> <i class="icon-double-angle-right"></i> list of items to be purchase</small>';
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
            break;
            /*purchasing department related links*/
        case 'li-PR':
            uri = 'Purchasing/PR';
            break;
        case 'li-PR-All':
            uri = 'Purchasing/Index';
            break;
        case 'li-call-qutation':
            uri = 'Purchasing/CallQuotations';
            break;
        case 'li-receive-qutation':
            uri = 'Purchasing/ReceivedQuotationList';
            break;
            /*order department related links*/
        case 'li-manage-customer':
            uri = 'Customer/Index';
            break;
        case 'li-manage-order':
            uri = 'Orders/Index';
            break;
            /*store related links*/
        case 'li-inventory-req':
            uri = 'Store/Index';
            break;
        case 'li-temp-PR-list':
            uri = 'Store/PurchasingList';
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
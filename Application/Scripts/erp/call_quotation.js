$(function () {

    $('#datepicker-duedate').datepicker();

    $('#select-items').select2({
        placeholder: "Select items",
        width: '300px',
        closeOnSelect: false
    });

    $('#select-suppliers').select2({
        placeholder: "Select suppliers",
        width: '300px',
        closeOnSelect: false
    });
});

$('#file-attachment').ace_file_input({
    no_file: 'No File ...',
    btn_choose: 'Choose',
    btn_change: 'Change',
    droppable: false,
    onchange: null,
    thumbnail: false //| true | large
    //whitelist:'gif|png|jpg|jpeg'
    //blacklist:'exe|php'
    //onchange:''
    //
});

$('#btn-add-items').click(function () {
    var html = '';

    if ($('#select-items :selected').length > 0) {
        var $container = $('#div-qutation-selected-item-list');
        /*currently if there are no items clear the message and then append items*/
        if ($container.find('.quotation-selected-item').length == 0) {
            $container.html('');
        }

        $('#select-items :selected').each(function (index, item) {
            if ($container.find('input#itemid-' + $(item).val()).length == 0) {
                html += GetQuotationItemHtml($(item).val(), $(item).text(), $(item).attr('uom'));
            }
        });

        $container.append(html);
        /*clear item list selected*/
        $('#select-items').select2('data', null);
    }
    else {
        bootbox.alert("No items has been selected for add to quotation !");
    }
});

function GetQuotationItemHtml(id, text, uom) {
    var html = '';

    html += '<div class="quotation-selected-item">';
    html += '<label class="col-sm-3">' + text + ' ( ' + uom + ' )' + '</label>&nbsp;';
    html += '<input id="itemid-' + id + '" class="input-sm col-xs-1" type="number" onkeypress="return IsNumberKey(event);" /> &nbsp;';
    html += '<button class="btn btn-danger btn-xs" onclick="RemoveQuotationItem(this);">';
    html += '<i class="icon-trash bigger-110 icon-only"></i>';
    html += '</button>';
    html += '</div>';

    return html;
}

function RemoveQuotationItem(element) {
    $(element).parent('div.quotation-selected-item').remove();

    if ($('#div-qutation-selected-item-list').find('.quotation-selected-item').length == 0) {
        $('#div-qutation-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for quotation</span>');
    }
}

$('#btn-submit').click(function () {
    ClearFields();
    bootbox.alert("Quotations are successfully ditributed among suppliers !");
});

$('#btn-clear').click(function () {
    ClearFields();
});

function ClearFields() {
    $('#txt-title').val('');
    $('#datepicker-duedate').val('');
    $('#select-items').select2('data', null);
    $('#select-suppliers').select2('data', null);
    $('#div-qutation-selected-item-list').html('<span class="label label-warning arrowed-in-right arrowed">select items for quotation</span>');
    $('#txt-description').val('');
    $('#file-attachment').siblings('a').click();
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
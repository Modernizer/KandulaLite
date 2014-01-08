define(['plugins/dialog', 'knockout'], function (dialog, ko) {
    var TabNameModal = function () {
        this.input = ko.observable('');
    };

    TabNameModal.prototype.ok = function () {
        dialog.close(this, this.input());
    };

    TabNameModal.prototype.cancel = function () {
        dialog.close(this);
    };

    TabNameModal.show = function () {
        return dialog.show(new TabNameModal());
    };

    return TabNameModal;
});
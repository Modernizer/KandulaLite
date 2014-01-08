define(function (require) {
    var welcome = function () {
        this.displayName = 'Sample Workspace ';
           };

    welcome.prototype.viewAttached = function (view) {
        //you can get the view after it's bound and connected to it's parent dom node if you want
    };


    welcome.prototype.composeCompleted = function (child, parent, context) {
        
    };
    welcome.prototype.compositionComplete =  function () {
        
    };

    return welcome;
});
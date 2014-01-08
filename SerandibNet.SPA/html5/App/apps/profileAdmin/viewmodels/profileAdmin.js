define(function (require) {
    var app1 = function () {
        this.displayName = 'User Profile';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            'Clean MV* Architecture',
            'JS & HTML Modularity',
            'Simple App Lifecycle'
        ];
    };

    
    app1.prototype.attached = function () {
    };

    return app1;
})
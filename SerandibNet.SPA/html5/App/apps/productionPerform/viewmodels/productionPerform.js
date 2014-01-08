define(function (require) {
    var app1 = function () {
        this.displayName = 'Prodction Performance Analysis';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            'Clean MV* Architecture',
            'JS & HTML Modularity',
            'Simple App Lifecycle'
        ];
    };

    
    app1.prototype.attached = function () {

        $('#piechart-placeholde-productionPerformance').highcharts({
            title: {
                text: 'Annual Production Performance',
                x: -20 //center
            },
            
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Production Volume (units)'
                },
                plotLines: [{
                    value: 0,
                    width: 1,
                    color: '#808080'
                }]
            },
            tooltip: {
                valueSuffix: 'Units'
            },
            legend: {
                layout: 'vertical',
                align: 'right',
                verticalAlign: 'middle',
                borderWidth: 0
            },
            series: [{
                name: 'Expected Production',
                data: [800, 1000, 1100, 1200, 1200, 1100, 1000, 1000, 1000, 1100,1200, 1200]
            }, {
                name: 'Production',
                data: [750, 900, 1050, 1200, 1300, 1400, 1000, 900, 900, 0, 0, 0]
            }]
        });
    };

    return app1;
})
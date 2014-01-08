define(function (require) {
    var app1 = function () {
        this.displayName = 'Stock Status Analysis';
        this.description = 'Durandal is a cross-device, cross-platform client framework written in JavaScript and designed to make Single Page Applications (SPAs) easy to create and maintain.';
        this.features = [
            'Clean MV* Architecture',
            'JS & HTML Modularity',
            'Simple App Lifecycle'
        ];
    };

    
    app1.prototype.attached = function () {

        $('#piechart-placeholde-stockStatus').highcharts({
            title: {
                text: 'Annual Stock Status',
                x: -20 //center
            },
           
            xAxis: {
                categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
                    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
            },
            yAxis: {
                title: {
                    text: 'Stock Level (Units)'
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
                name: 'Reorder Level',
                data: [300, 300, 400, 500, 400, 300, 300, 300,400, 400, 500, 500]
            }, {
                name: 'Actual Stok Status - Average',
                data: [500, 700, 400, 300, 500, 600, 600, 700, 500, 400, 400, 400]
            }]
        });
    };

    return app1;
})
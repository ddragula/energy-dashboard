import Highcharts from 'highcharts/es-modules/masters/highstock.src';
import 'highcharts/es-modules/masters/modules/boost.src';

import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src';

import '@highcharts/dashboards/css/dashboards.css';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

Highcharts.setOptions({
    rangeSelector: {
        buttons: [{
            type: 'day',
            count: 1,
            text: '1d',
            title: 'Pokaż 1 dzień'
        }, {
            type: 'week',
            count: 1,
            text: '1w',
            title: 'Pokaż 1 tydzień'
        }, {
            type: 'month',
            count: 1,
            text: '1m',
            title: 'Pokaż 1 miesiąc'
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'Pokaż 3 miesiące'
        }, {
            type: 'all',
            text: 'All',
            title: 'Pokaż wszystkie dane'
        }]
    },
    plotOptions: {
        series: {
            dataGrouping: {
                enabled: true,
                units: [
                    ['minute', [15, 30]],
                    ['hour', [1, 2, 3, 6, 12]],
                    ['day', [1]]
                ],
                groupPixelWidth: 10
            },
        },
        area: {
            lineWidth: 0,
            fillOpacity: 1
        }
    }
});

Dashboards.board('dashboard', {
    dataPool: {
        connectors: [{
            id: 'entsoe15m',
            type: 'CSV',
            options: {
                csvURL: '/data/2025-entsoe15m.csv'
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'navigator'
                }]
            }, {
                cells: [{
                    id: 'generation-chart'
                }]
            }]
        }]
    },
    components: [{
        type: 'Highcharts',
        renderTo: 'navigator',
        chartConstructor: 'stockChart',
        connector: {
            id: 'entsoe15m',
            columnAssignment: [{
                seriesId: 'load',
                data: ['Date', 'Load']
            }]
        },
        chartOptions: {
            chart: {
                height: 100
            },
            scrollbar: {
                enabled: false
            },
            xAxis: {
                visible: false
            },
            yAxis: {
                visible: false
            }
        }
    }, {
        type: 'Highcharts',
        renderTo: 'generation-chart',
        chartConstructor: 'stockChart',
        connector: {
            id: 'entsoe15m',
            columnAssignment: [{
                seriesId: 'Biomass',
                data: ['Date', 'Gen-Biomass']
            }, {
                seriesId: 'Coal',
                data: ['Date', 'Gen-Coal']
            }, {
                seriesId: 'Gas',
                data: ['Date', 'Gen-Gas']
            }, {
                seriesId: 'Oil',
                data: ['Date', 'Gen-Oil']
            }, {
                seriesId: 'Hydro',
                data: ['Date', 'Gen-Hydro']
            }, {
                seriesId: 'Solar',
                data: ['Date', 'Gen-Solar']
            }, {
                seriesId: 'Wind',
                data: ['Date', 'Gen-Wind']
            }, {
                seriesId: 'Other',
                data: ['Date', 'Gen-Other']
            }]
        },
        chartOptions: {
            title: {
                text: 'Produkcja energii per źródło',
                align: 'left',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold'
                }
            },
            plotOptions: {
                area: {
                    stacking: 'normal',
                    marker: {
                        enabled: false
                    }
                }
            },
            rangeSelector: {
                enabled: false
            },
            navigator: {
                enabled: false
            },
            scrollbar: {
                enabled: false
            },
            tooltip: {
                split: false,
                valueDecimals: 0,
                valueSuffix: ' MW ({(multiply (divide point.y point.total) 100):.2f}%)',
                footerFormat: '● Total: <b>{point.total:,.0f} MW</b>',
            },
            series: [{
                type: 'area',
                id: 'Hydro',
                name: 'Hydro',
                color: '#1E90FF'
            }, {
                type: 'area',
                id: 'Solar',
                name: 'Solar',
                color: '#FFD700'
            }, {
                type: 'area',
                id: 'Wind',
                name: 'Wiatr',
                color: '#32CD32'
            }, {
                type: 'area',
                id: 'Biomass',
                name: 'Biomasa',
                color: '#8B4513'
            }, {
                type: 'area',
                id: 'Gas',
                name: 'Gaz ziemny',
                color: '#FF4500'
            }, {
                type: 'area',
                id: 'Coal',
                name: 'Węgiel',
                color: '#333333'
            }, {
                type: 'area',
                id: 'Oil',
                name: 'Ropa naftowa',
                color: '#000000'
            }, {
                type: 'area',
                id: 'Other',
                name: 'Inne',
                color: '#808080'
            }]
        }
    }]
}, true).then(board => {
    // syncExtremes(board); TODO
});
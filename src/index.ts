import type HighchartsComponent from '@highcharts/dashboards/es-modules/Dashboards/Components/HighchartsComponent/HighchartsComponent';
import type KPIComponent from '@highcharts/dashboards/es-modules/Dashboards/Components/KPIComponent/KPIComponent';

import Highcharts from 'highcharts/es-modules/masters/highstock.src';
import 'highcharts/es-modules/masters/modules/boost.src';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src';
import '@highcharts/dashboards/css/dashboards.css';
import extremesSync from './syncs/extremesSync';
import './styles.css';

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
                    id: 'kpi-other'
                }, {
                    id: 'kpi-oil'
                }, {
                    id: 'kpi-coal'
                }, {
                    id: 'kpi-gas'
                }, {
                    id: 'kpi-biomass'
                }, {
                    id: 'kpi-wind'
                }, {
                    id: 'kpi-solar'
                }, {
                    id: 'kpi-hydro'
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
        type: 'KPI',
        renderTo: 'kpi-other',
        title: 'Inne'
    }, {
        type: 'KPI',
        renderTo: 'kpi-oil',
        title: 'Ropa'
    }, {
        type: 'KPI',
        renderTo: 'kpi-coal',
        title: 'Węgiel'
    }, {
        type: 'KPI',
        renderTo: 'kpi-gas',
        title: 'Gaz'
    }, {
        type: 'KPI',
        renderTo: 'kpi-biomass',
        title: 'Biomasa'
    }, {
        type: 'KPI',
        renderTo: 'kpi-wind',
        title: 'Wiatr'
    }, {
        type: 'KPI',
        renderTo: 'kpi-solar',
        title: 'Solar'
    }, {
        type: 'KPI',
        renderTo: 'kpi-hydro',
        title: 'Hydro'
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
            }, {
                seriesId: 'load',
                data: ['Date', 'Load']
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
                    },
                    tooltip: {
                        footerFormat: '● Total: <b>{point.total:,.0f} MW</b>',
                        valueSuffix: ' MW ({(multiply (divide point.y point.total) 100):.2f}%)'   
                    },
                    showInLegend: false
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
                valueSuffix: ' MW ({(multiply (divide point.y point.total) 100):.2f}%)'
            },
            legend: {
                enabled: true,
                floating: true,
                align: 'right',
                verticalAlign: 'top',
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
                color: '#8B0000'
            }, {
                type: 'area',
                id: 'Other',
                name: 'Inne',
                color: '#808080'
            }, {
                type: 'spline',
                id: 'load',
                name: 'Obciążenie Sieci',
                color: '#FF00FF',
                lineWidth: 4,
                dashStyle: 'ShortDash',
                visible: false
            }]
        }
    }]
}, true).then(async board => {
    const navigatorComponent = board.getComponentByCellId('navigator') as HighchartsComponent;
    const generationComponent = board.getComponentByCellId('generation-chart') as HighchartsComponent;

    const kpiComponents = {
        other: board.getComponentByCellId('kpi-other') as KPIComponent,
        oil: board.getComponentByCellId('kpi-oil') as KPIComponent,
        coal: board.getComponentByCellId('kpi-coal') as KPIComponent,
        gas: board.getComponentByCellId('kpi-gas') as KPIComponent,
        biomass: board.getComponentByCellId('kpi-biomass') as KPIComponent,
        wind: board.getComponentByCellId('kpi-wind') as KPIComponent,
        solar: board.getComponentByCellId('kpi-solar') as KPIComponent,
        hydro: board.getComponentByCellId('kpi-hydro') as KPIComponent
    }

    Object.keys(kpiComponents).forEach((key: keyof typeof kpiComponents) => {
        const kpiComponent = kpiComponents[key];
        if (!kpiComponent) {
            return;
        }

        kpiComponent.element.addEventListener('click', () => {
            const series = generationComponent.chart.get(key[0].toUpperCase() + key.slice(1)) as Highcharts.Series;

            if (kpiComponent.contentElement.classList.toggle('inactive')) {
                series.hide();
            } else {
                series.show();
            }
        });
    });

    async function setKPIRange(min: number, max: number) {
        const dataTable = await board.dataPool.getConnectorTable('entsoe15m');
        const columns = dataTable.columns;
        const sums = {
            other: 0,
            oil: 0,
            coal: 0,
            gas: 0,
            biomass: 0,
            wind: 0,
            solar: 0,
            hydro: 0,
            total: 0
        }

        for (let i = 0, iEnd = columns['Date'].length; i < iEnd; ++i) {
            const date = Number(columns['Date'][i]);
            if (date < min || date > max) {
                continue;
            }

            sums.other += Number(columns['Gen-Other'][i] || 0);
            sums.oil += Number(columns['Gen-Oil'][i] || 0);
            sums.coal += Number(columns['Gen-Coal'][i] || 0);
            sums.gas += Number(columns['Gen-Gas'][i] || 0);
            sums.biomass += Number(columns['Gen-Biomass'][i] || 0);
            sums.wind += Number(columns['Gen-Wind'][i] || 0);
            sums.solar += Number(columns['Gen-Solar'][i] || 0);
            sums.hydro += Number(columns['Gen-Hydro'][i] || 0);
        }

        sums.total = sums.other + sums.oil + sums.coal + sums.gas + sums.biomass + sums.wind + sums.solar + sums.hydro;

        Object.keys(kpiComponents).forEach((key: keyof typeof kpiComponents) => {
            const kpiComponent = kpiComponents[key];
            if (!kpiComponent) {
                return;
            }

            const GWh = sums[key] / 4000; // Convert from MW to GWh (15 min intervals)

            const decimalPlaces = GWh < 10 ? 2 : GWh < 100 ? 1 : 0;
            const percentage = sums[key] / sums.total * 100;

            kpiComponent.update({
                value: GWh,
                valueFormat: `
                    <div class="percentage">{(${percentage}):,.2f} %</div>
                    <div class="value">{value:,.${decimalPlaces}f} GWh</div>
                `,
            })
        })
    }

    await setKPIRange(-Infinity, Infinity);

    extremesSync([
        navigatorComponent.chart,
        generationComponent.chart
    ], async (min, max) => {
        await setKPIRange(min, max);
    });
});
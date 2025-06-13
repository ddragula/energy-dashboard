import type HighchartsComponent from '@highcharts/dashboards/es-modules/Dashboards/Components/HighchartsComponent/HighchartsComponent';
import type KPIComponent from '@highcharts/dashboards/es-modules/Dashboards/Components/KPIComponent/KPIComponent';

import Highcharts from 'highcharts/es-modules/masters/highstock.src';
import 'highcharts/es-modules/masters/modules/boost.src';
import Dashboards from '@highcharts/dashboards/es-modules/masters/dashboards.src';
import '@highcharts/dashboards/es-modules/masters/modules/layout.src';
import '@highcharts/dashboards/css/dashboards.css';
import extremesSync from './syncs/extremesSync';
import crosshairSync from './syncs/crosshairSync';
import './styles.css';
import CSVConnector from '@highcharts/dashboards/es-modules/Data/Connectors/CSVConnector';

Dashboards.HighchartsPlugin.custom.connectHighcharts(Highcharts);
Dashboards.PluginHandler.addPlugin(Dashboards.HighchartsPlugin);

Highcharts.setOptions({
    rangeSelector: {
        buttons: [{
            type: 'day',
            count: 1,
            text: '1d',
            title: 'Pokaż 1 dzień',
        }, {
            type: 'week',
            count: 1,
            text: '1w',
            title: 'Pokaż 1 tydzień',
        }, {
            type: 'month',
            count: 1,
            text: '1m',
            title: 'Pokaż 1 miesiąc',
        }, {
            type: 'month',
            count: 3,
            text: '3m',
            title: 'Pokaż 3 miesiące',
        }, {
            type: 'all',
            text: 'All',
            title: 'Pokaż wszystkie dane',
        }],
    },
    xAxis: {
        crosshair: {
            snap: false,
            zIndex: 5,
            color: '#5555',
        }
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
            id: 'generation',
            type: 'CSV',
            options: {
                csvURL: './data/2025-generation.csv'
            }
        }, {
            id: 'trade',
            type: 'CSV',
            options: {
                csvURL: './data/2025-trade.csv'
            }
        }]
    },
    gui: {
        layouts: [{
            rows: [{
                cells: [{
                    id: 'html-title'
                }, {
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
            }, {
                cells: [{
                    id: 'prices-chart'
                }, {
                    id: 'prices-kpi-block',
                    layout: {
                        rows: [{
                            cells: [{
                                id: 'kpi-price'
                            }]
                        }, {
                            cells: [{
                                id: 'kpi-net'
                            }]
                        }]
                    }
                }]
            }]
        }]
    },
    components: [{
        type: 'HTML',
        renderTo: 'html-title',
        html: `
            <div class="title-container">
                <div class="title">
                    <h1>Energia w Polsce</h1>
                    <p class="subtitle">produkcja i handel</p>
                </div>
                <div class="year-selector-container">
                    <div>
                        Dane z roku:
                        <select id="year-select">
                            <option value="2025" selected>2025</option>
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                        </select>
                    </div>
                </div>
            </div>
        `
    }, {
        type: 'Highcharts',
        renderTo: 'navigator',
        chartConstructor: 'stockChart',
        connector: {
            id: 'generation',
            columnAssignment: [{
                seriesId: 'load',
                data: ['Date', 'Load']
            }]
        },
        chartOptions: {
            chart: {
                height: 110
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
            id: 'generation',
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
                text: 'Produkcja energii',
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
                        valueSuffix: ' MW ({(multiply (divide point.y point.total) 100):.2f}%)',
                    },
                    showInLegend: false
                }
            },
            yAxis: {
                title: {
                    text: 'Produkcja energii (MW)',
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
    }, {
        type: 'Highcharts',
        renderTo: 'prices-chart',
        chartConstructor: 'stockChart',
        connector: {
            id: 'trade',
            columnAssignment: [{
                seriesId: 'price',
                data: ['Date', 'Prices']
            }, {
                seriesId: 'netPositions',
                data: ['Date', 'NetPositions']
            }]
        },
        chartOptions: {
            yAxis: [{
                id: 'priceAxis',
                height: '45%',
                title: {
                    text: 'Cena energii (€/MWh)',
                },
                offset: 0
            }, {
                id: 'netPositionsAxis',
                height: '45%',
                top: '50%',
                title: {
                    text: 'Pozycje netto (MW)',
                },
                offset: 0
            }],
            title: {
                text: 'Ceny energii i pozycje netto',
                align: 'left',
                style: {
                    fontSize: '24px',
                    fontWeight: 'bold'
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
            series: [{
                type: 'areaspline',
                id: 'netPositions',
                name: 'Pozycje netto',
                yAxis: 'netPositionsAxis',
                zones: [{
                    value: 0,
                    color: '#f00'
                }, {
                    color: '#0d0'
                }],
                tooltip: {
                    valueDecimals: 0,
                    valueSuffix: ' MW'
                }
            }, {
                type: 'line',
                id: 'price',
                name: 'Cena energii',
                yAxis: 'priceAxis',
                tooltip: {
                    valueDecimals: 2,
                    valueSuffix: ' €/MWh'
                }
            }]
        }
    }, {
        type: 'KPI',
        renderTo: 'kpi-price',
        title: 'Średnia cena energii',
        valueFormat: '<strong class="value">{value:,.2f}</strong><br><span style="font-size: 0.8em">€/MWh</span>'
    }, {
        type: 'KPI',
        renderTo: 'kpi-net',
        title: 'Bilans handlowy',
        valueFormat: '<strong class="value">{value:,.2f}</strong><br><span style="font-size: 0.8em">GWh</span>'
    }]
}, true).then(async board => {
    const navigatorComponent = board.getComponentByCellId('navigator') as HighchartsComponent;
    const generationComponent = board.getComponentByCellId('generation-chart') as HighchartsComponent;
    const pricesComponent = board.getComponentByCellId('prices-chart') as HighchartsComponent;

    const generationConnector = await board.dataPool.getConnector('generation') as CSVConnector;
    const tradeConnector = await board.dataPool.getConnector('trade') as CSVConnector;

    const kpiComponents = {
        other: board.getComponentByCellId('kpi-other') as KPIComponent,
        oil: board.getComponentByCellId('kpi-oil') as KPIComponent,
        coal: board.getComponentByCellId('kpi-coal') as KPIComponent,
        gas: board.getComponentByCellId('kpi-gas') as KPIComponent,
        biomass: board.getComponentByCellId('kpi-biomass') as KPIComponent,
        wind: board.getComponentByCellId('kpi-wind') as KPIComponent,
        solar: board.getComponentByCellId('kpi-solar') as KPIComponent,
        hydro: board.getComponentByCellId('kpi-hydro') as KPIComponent,
    };

    const tradeKpis = {
        price: board.getComponentByCellId('kpi-price') as KPIComponent,
        net: board.getComponentByCellId('kpi-net') as KPIComponent,
    };

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
        const columns15m = generationConnector.table.getColumns();
        const columns1h = tradeConnector.table.getColumns();

        const sums = {
            // Generation KPIs
            other: 0,
            otherGWh: 0,
            oil: 0,
            oilGWh: 0,
            coal: 0,
            coalGWh: 0,
            gas: 0,
            gasGWh: 0,
            biomass: 0,
            biomassGWh: 0,
            wind: 0,
            windGWh: 0,
            solar: 0,
            solarGWh: 0,
            hydro: 0,
            hydroGWh: 0,
            total: 0,
            totalGWh: 0,

            // Trade KPIs
            price: 0,
            priceCount: 0,
            net: 0,
        };

        for (let i = 0, iEnd = columns15m['Date'].length; i < iEnd; ++i) {
            const date = Number(columns15m['Date'][i]);
            if (date < min || date > max) {
                continue;
            }

            const hInterval = (Number(columns15m['Date'][i + 1]) - date) / 36e5;

            const other = Number(columns15m['Gen-Other'][i] || 0);
            const oil = Number(columns15m['Gen-Oil'][i] || 0);
            const coal = Number(columns15m['Gen-Coal'][i] || 0);
            const gas = Number(columns15m['Gen-Gas'][i] || 0);
            const biomass = Number(columns15m['Gen-Biomass'][i] || 0);
            const wind = Number(columns15m['Gen-Wind'][i] || 0);
            const solar = Number(columns15m['Gen-Solar'][i] || 0);
            const hydro = Number(columns15m['Gen-Hydro'][i] || 0);

            sums.other += other;
            sums.oil += oil;
            sums.coal += coal;
            sums.gas += gas;
            sums.biomass += biomass;
            sums.wind += wind;
            sums.solar += solar;
            sums.hydro += hydro;

            if (!isNaN(hInterval)) {
                sums.otherGWh += other * hInterval * 0.001;
                sums.oilGWh += oil * hInterval * 0.001;
                sums.coalGWh += coal * hInterval * 0.001;
                sums.gasGWh += gas * hInterval * 0.001;
                sums.biomassGWh += biomass * hInterval * 0.001;
                sums.windGWh += wind * hInterval * 0.001;
                sums.solarGWh += solar * hInterval * 0.001;
                sums.hydroGWh += hydro * hInterval * 0.001;
            }
        }

        for (let i = 0, iEnd = columns1h['Date'].length; i < iEnd; ++i) {
            const date = Number(columns1h['Date'][i]);
            if (date < min || date > max) {
                continue;
            }

            sums.net += Number(columns1h['NetPositions'][i] || 0);
            sums.price += Number(columns1h['Prices'][i]);
            sums.priceCount += 1;
        }

        sums.total = sums.other + sums.oil + sums.coal + sums.gas + sums.biomass + sums.wind + sums.solar + sums.hydro;
        sums.totalGWh = sums.otherGWh + sums.oilGWh + sums.coalGWh + sums.gasGWh + sums.biomassGWh + sums.windGWh + sums.solarGWh + sums.hydroGWh;

        Object.keys(kpiComponents).forEach((key: keyof typeof kpiComponents) => {
            const kpiComponent = kpiComponents[key];
            if (!kpiComponent) {
                return;
            }

            const GWh = sums[key + 'GWh' as 'otherGWh' | 'oilGWh' | 'coalGWh' | 'gasGWh' | 'biomassGWh' | 'windGWh' | 'solarGWh' | 'hydroGWh'] || 0;

            const decimalPlaces = GWh < 10 ? 2 : GWh < 100 ? 1 : 0;
            const percentage = sums[key] / sums.total * 100;

            kpiComponent.update({
                value: GWh,
                valueFormat: `
                    <div class="percentage">{(${percentage}):,.2f} %</div>
                    <div class="value">{value:,.${decimalPlaces}f} GWh</div>
                `,
            });
        });

        tradeKpis.price.setValue(sums.price / sums.priceCount);
        tradeKpis.net.setValue(sums.net * 0.001);

        if (sums.net < 0) {
            tradeKpis.net.contentElement.classList.add('negative');
        } else {
            tradeKpis.net.contentElement.classList.remove('negative');
        }
    }

    setKPIRange(-Infinity, Infinity);

    extremesSync([
        navigatorComponent.chart,
        generationComponent.chart,
        pricesComponent.chart,
    ], async (min, max) => {
        setKPIRange(min, max);
    });

    crosshairSync([
        generationComponent.chart,
        pricesComponent.chart,
    ]);

    document.getElementById('year-select')?.addEventListener('change', async e => {
        const year = (e.target as HTMLSelectElement).value;


        generationConnector.options.csvURL = `./data/${year}-generation.csv`;
        tradeConnector.options.csvURL = `./data/${year}-trade.csv`;

        await generationConnector.load();
        await tradeConnector.load();

        navigatorComponent.chart?.xAxis[0].setExtremes(null, null, true, false);
    });
});

import type { Chart } from "highcharts";

import Highcharts from 'highcharts/es-modules/masters/highstock.src';
import emitter from '../emitter';

let iterator = 0;

export default function (charts: Chart[], callback?: (min: number, max: number) => void) {
    const eventName = 'extremes_' + iterator;

    emitter.on(eventName, (e: { chart: Chart, min: number, max: number}) => {
        const { chart, min, max } = e;

        for (const c of charts) {
            if (c !== chart) {
                c.xAxis[0].setExtremes(min, max, true, false, {
                    trigger: 'extremesSync'
                });
            }
        }

        callback?.(min, max);
    });

    for (const chart of charts) {
        Highcharts.addEvent(chart.xAxis[0], 'setExtremes', function (e: { min: number; max: number, trigger: string }) {
            if (e.trigger === 'extremesSync') {
                return;
            }

            emitter.emit(eventName, {
                chart: chart,
                min: e.min,
                max: e.max
            }, false);
        });
    }

    iterator++;
}

import type { Chart } from "highcharts";

import Highcharts from 'highcharts/es-modules/masters/highstock.src';
import emitter from '../emitter';

let iterator = 0;

export default function (charts: Chart[]) {
    const eventName = 'crosshair_' + iterator;

    emitter.on(eventName + '_mousemove', (e: { chart: Chart, x: number}) => {
        const { chart, x } = e;

        for (const c of charts) {
            if (c === chart) {
                continue;
            }

            const xAxis = c.xAxis[0];

            xAxis.drawCrosshair({
                chartX: xAxis.toPixels(x),
                chartY: 0
            } as any);
        }
    });

    emitter.on(eventName + '_mouseleave', (e: { chart: Chart }) => {
        const { chart } = e;

        for (const c of charts) {
            if (c !== chart) {
                c.xAxis[0].hideCrosshair();
            }
        }
    });

    for (const chart of charts) {
        Highcharts.addEvent(chart.container, 'mousemove', function (e: { chartX?: number, chartY?: number }) {
            if (e.chartX === void 0) {
                return;
            }

            if (e.chartX < chart.plotLeft || e.chartX > chart.plotLeft + chart.plotWidth) {
                emitter.emit(eventName + '_mouseleave', { chart });
                return;
            }

            if (e.chartY < chart.plotTop || e.chartY > chart.plotTop + chart.plotHeight) {
                emitter.emit(eventName + '_mouseleave', { chart });
                return;
            }

            emitter.emit(eventName + '_mousemove', {
                chart: chart,
                x: chart.xAxis[0].toValue(e.chartX)
            })
        });

        chart.container.addEventListener('mouseleave', function () {
            emitter.emit(eventName + '_mouseleave', { chart });
        });
    }

    iterator++;
}

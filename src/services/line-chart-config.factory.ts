import { Injectable } from '@angular/core';
import { EColType, EAggregation, IMargin, MmObjectFactory } from 'mm-dashboard-core';
import { ILineChartConfig } from '../interfaces';

@Injectable()
export class LineChartConfigFactory {

    defaultConfig: ILineChartConfig = {
        widgetId: "LineChart",
        widgetLabel: "Line Chart",
        widgetDescription: "",
        title: "",
        margin: <IMargin>{ top: 20, right: 20, bottom: 20, left: 40 },

        color: "#000000",
        aggregation: EAggregation.count,
        showXAxis: false,
        showYAxis: false,
        xAxisName: null,
        xCol: {
            label: null,
            name: null,
            type: null
        },
        yAxisName: null,
        yCol: {
            label: null,
            name: null,
            type: null
        }
    }

    constructor(private objectFactory: MmObjectFactory<ILineChartConfig>) { }

    init(config?: ILineChartConfig) {
        return this.objectFactory.init(this.defaultConfig, config);
    }
}
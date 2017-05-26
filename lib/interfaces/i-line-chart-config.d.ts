import { EAggregation, IColumn, IBaseWidgetConfig, IMargin } from 'mm-dashboard-core';
export interface ILineChartConfig extends IBaseWidgetConfig {
    title?: string;
    margin?: IMargin;
    color?: string;
    aggregation?: EAggregation;
    showXAxis?: boolean;
    showYAxis?: boolean;
    xAxisName?: string;
    xCol?: IColumn;
    yAxisName?: string;
    yCol?: IColumn;
}

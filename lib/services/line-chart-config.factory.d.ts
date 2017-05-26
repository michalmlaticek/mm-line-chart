import { MmObjectFactory } from 'mm-dashboard-core';
import { ILineChartConfig } from '../interfaces';
export declare class LineChartConfigFactory {
    private objectFactory;
    defaultConfig: ILineChartConfig;
    constructor(objectFactory: MmObjectFactory<ILineChartConfig>);
    init(config?: ILineChartConfig): ILineChartConfig;
}

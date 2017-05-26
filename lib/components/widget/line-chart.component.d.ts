import { OnInit, OnChanges, AfterViewInit, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { IColumn, IBaseWidget, DataFormater, ITooltipConfig } from 'mm-dashboard-core';
import { ILineChartConfig } from '../../interfaces';
export declare class LineChartComponent implements IBaseWidget, OnInit, OnChanges, AfterViewInit {
    private dataFormater;
    private element;
    resized: boolean;
    config: ILineChartConfig;
    data: Array<any>;
    dataChange: EventEmitter<any[]>;
    tooltipOn: EventEmitter<ITooltipConfig>;
    tooltipOff: EventEmitter<ITooltipConfig>;
    htmlElem: HTMLElement;
    lineData: Array<any>;
    d3Svg: any;
    viewInit: boolean;
    constructor(dataFormater: DataFormater, element: ElementRef);
    ngOnInit(): void;
    ngAfterViewInit(): void;
    ngOnChanges(changes: SimpleChanges): void;
    formatData(): void;
    onDblclick(col: IColumn, value: any): void;
    draw(): void;
}

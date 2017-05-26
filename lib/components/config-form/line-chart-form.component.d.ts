import { OnInit, OnChanges, EventEmitter, SimpleChanges } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { IBaseWidgetForm } from 'mm-dashboard-core';
import { ILineChartConfig } from '../../interfaces';
import { LineChartConfigFactory } from '../../services';
export declare class LineChartFormComponent implements OnInit, OnChanges, IBaseWidgetForm {
    private formBuilder;
    private configFactory;
    config: ILineChartConfig;
    configChange: EventEmitter<ILineChartConfig>;
    form: FormGroup;
    colTypes: any;
    aggregations: any;
    constructor(formBuilder: FormBuilder, configFactory: LineChartConfigFactory);
    ngOnInit(): void;
    ngOnChanges(changes?: SimpleChanges): void;
    initFormAndListen(): void;
    initForm(conf: ILineChartConfig): FormGroup;
    xTransferSuccess(event: any): void;
    yTransferSuccess(event: any): void;
    onColorChange(color: any): void;
}

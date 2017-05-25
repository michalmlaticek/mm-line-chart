import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

import { DashboardCoreModule } from 'mm-dashboard-core';
import { DndModule } from 'ng2-dnd';

import { LineChartConfigFactory } from './services';
import { LineChartComponent } from './components/widget/line-chart.component';
import { LineChartFormComponent } from './components/config-form/line-chart-form.component';

@NgModule({
    imports: [
        CommonModule,
        ReactiveFormsModule,
        DndModule.forRoot(),
        DashboardCoreModule.forChild()
    ],
    declarations: [LineChartComponent, LineChartFormComponent],
    exports: [LineChartComponent, LineChartFormComponent],
    entryComponents: [LineChartComponent, LineChartFormComponent],
    // providers: [LineChartConfigFactory]
})
export class LineChartModule {
    static forRoot(): ModuleWithProviders {
        return {
            ngModule: LineChartModule,
            providers: [
                { provide: LineChartConfigFactory, useClass: LineChartConfigFactory }
            ]
        };
    }

    static forChild(): ModuleWithProviders {
        // widget service will need to be provided in the root module
        return {
            ngModule: LineChartModule,
            providers: [
                { provide: LineChartConfigFactory, useClass: LineChartConfigFactory }
            ]
        };
    }
}
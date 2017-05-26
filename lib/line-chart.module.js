var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DashboardCoreModule } from 'mm-dashboard-core';
import { DndModule } from 'ng2-dnd';
import { LineChartConfigFactory } from './services';
import { LineChartComponent } from './components/widget/line-chart.component';
import { LineChartFormComponent } from './components/config-form/line-chart-form.component';
var LineChartModule = LineChartModule_1 = (function () {
    function LineChartModule() {
    }
    LineChartModule.forRoot = function () {
        return {
            ngModule: LineChartModule_1,
            providers: [
                { provide: LineChartConfigFactory, useClass: LineChartConfigFactory }
            ]
        };
    };
    LineChartModule.forChild = function () {
        // widget service will need to be provided in the root module
        return {
            ngModule: LineChartModule_1,
            providers: [
                { provide: LineChartConfigFactory, useClass: LineChartConfigFactory }
            ]
        };
    };
    return LineChartModule;
}());
LineChartModule = LineChartModule_1 = __decorate([
    NgModule({
        imports: [
            CommonModule,
            ReactiveFormsModule,
            DndModule.forRoot(),
            DashboardCoreModule.forChild()
        ],
        declarations: [LineChartComponent, LineChartFormComponent],
        exports: [LineChartComponent, LineChartFormComponent],
        entryComponents: [LineChartComponent, LineChartFormComponent],
    })
], LineChartModule);
export { LineChartModule };
var LineChartModule_1;
//# sourceMappingURL=C:/_user/Code/dashboard/mm-line-chart/src/line-chart.module.js.map
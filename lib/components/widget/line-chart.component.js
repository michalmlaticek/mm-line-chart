var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Component, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { ENest, EColType, DataFormater } from 'mm-dashboard-core';
import * as D3Scale from 'd3-scale';
import * as D3Select from 'd3-selection';
import * as D3Shape from 'd3-shape';
import * as D3Array from 'd3-array';
import * as D3Axis from 'd3-axis';
import * as D3TimeFormat from 'd3-time-format';
var LineChartComponent = (function () {
    function LineChartComponent(dataFormater, element) {
        this.dataFormater = dataFormater;
        this.element = element;
        this.resized = false;
        this.dataChange = new EventEmitter();
        this.tooltipOn = new EventEmitter();
        this.tooltipOff = new EventEmitter();
        console.log("LineChartComponent -> contructor: ", dataFormater, element);
        this.htmlElem = element.nativeElement;
        this.viewInit = false;
    }
    LineChartComponent.prototype.ngOnInit = function () {
    };
    LineChartComponent.prototype.ngAfterViewInit = function () {
        console.log("LineChartComponent -> ngAfterViewInit");
        this.viewInit = true;
        this.d3Svg = D3Select.select(this.htmlElem).select('svg');
        console.log("LineChartComponent -> ngAfterViewInit -> d3Svg: ", this.d3Svg);
        if (this.config.xCol && this.config.yCol && this.data) {
            this.formatData();
            this.draw();
        }
    };
    LineChartComponent.prototype.ngOnChanges = function (changes) {
        console.log("LineChartComponent -> ngOnChanges:", changes, this.viewInit);
        if (changes && this.viewInit && this.data && this.config && this.config.xCol && this.config.yCol) {
            if (changes["data"]
                || (changes["config"]
                    && (changes["config"].currentValue["xCol"] != changes["config"].previousValue["xCol"]
                        || changes["config"].currentValue["yCol"] != changes["config"].previousValue["yCol"]
                        || changes["config"].currentValue["aggregation"] != changes["config"].previousValue["aggregation"]))) {
                console.log("LineChartComponent -> ngOnChanges -> reformating data");
                this.formatData();
            }
            console.log("LineChartComponent -> ngOnChanges -> redrawing");
            this.resized = false;
            this.draw();
        }
    };
    LineChartComponent.prototype.formatData = function () {
        this.lineData = this.dataFormater.d3aggregateNumber(this.data, [this.config.xCol], this.config.yCol, this.config.aggregation, ENest.entries);
    };
    LineChartComponent.prototype.onDblclick = function (col, value) {
        console.log("LineChartComponent -> doubleclicked");
        var filteredData = this.data.filter(function (r) { return r[col.name] == value; });
        this.dataChange.emit(filteredData);
    };
    LineChartComponent.prototype.draw = function () {
        var _this = this;
        var data = this.lineData;
        var config = this.config;
        var width = this.htmlElem.children[0].children[1].clientWidth - config.margin.left - config.margin.right;
        var height = this.htmlElem.children[0].children[1].clientHeight - config.margin.top - config.margin.bottom;
        var parseKey;
        var xScale;
        var valueLine = D3Shape.line();
        // Clear old drawing
        console.log("LineChartComponent -> draw -> clearing old elements: ", this.d3Svg);
        this.d3Svg.selectAll("g").remove();
        switch (config.xCol.type) {
            case EColType.number:
                console.log("parsing as float");
                parseKey = parseFloat;
                xScale = D3Scale.scaleLinear().range([0, width]).domain(D3Array.extent(data, function (d) { return parseKey(d.key); }));
                valueLine = valueLine.x(function (d) {
                    console.log("Non scaledX: ", d["key"]);
                    var scaledX = xScale(d["key"]);
                    console.log("scaledX: ", scaledX);
                    return scaledX;
                });
                break;
            case EColType.date:
                console.log("parsing as date");
                parseKey = D3TimeFormat.timeParse("%d-%b-%y");
                xScale = D3Scale.scaleTime().range([0, width]).domain(D3Array.extent(data, function (d) { return parseKey(d.key); }));
                valueLine = valueLine.x(function (d) {
                    console.log("Non scaledX: ", parseKey(d["key"]));
                    var scaledX = xScale(parseKey(d["key"]));
                    console.log("scaledX: ", scaledX);
                    return scaledX;
                });
                break;
            default:
                console.error("Invalid type of Column X [xCol]");
                return;
        }
        var yScale = D3Scale.scaleLinear().range([height, 0]).domain(D3Array.extent(data, function (d) { return d.value; }));
        valueLine = valueLine.y(function (d) { return yScale(d["value"]); });
        var d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
        d3TopG.append("path")
            .datum(data)
            .attr("class", "mm-line")
            .attr("stroke", config.color)
            .attr("d", valueLine);
        d3TopG.selectAll(".linePoint")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", function (d) { return xScale(parseKey(d["key"])); })
            .attr("cy", function (d) { return yScale(d["value"]); })
            .attr("r", 3)
            .attr("fill", config.color)
            .on("dblclick", function (d) { return _this.onDblclick(_this.config.xCol, d.key); })
            .on("mouseover", function (d) {
            _this.tooltipOn.emit({
                event: D3Select.event,
                values: [
                    { key: d.key, value: d.value }
                ]
            });
        })
            .on("mouseout", function (d) {
            _this.tooltipOff.emit({
                event: D3Select.event,
                values: []
            });
        });
        if (config.showXAxis) {
            // add the x Axis
            d3TopG.append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(D3Axis.axisBottom(xScale));
        }
        if (config.showYAxis) {
            // add the y Axis
            d3TopG.append("g")
                .call(D3Axis.axisLeft(yScale));
        }
    };
    return LineChartComponent;
}());
__decorate([
    Input(),
    __metadata("design:type", Boolean)
], LineChartComponent.prototype, "resized", void 0);
__decorate([
    Input(),
    __metadata("design:type", Object)
], LineChartComponent.prototype, "config", void 0);
__decorate([
    Input(),
    __metadata("design:type", Array)
], LineChartComponent.prototype, "data", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], LineChartComponent.prototype, "dataChange", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], LineChartComponent.prototype, "tooltipOn", void 0);
__decorate([
    Output(),
    __metadata("design:type", EventEmitter)
], LineChartComponent.prototype, "tooltipOff", void 0);
LineChartComponent = __decorate([
    Component({
        selector: 'mm-line-chart',
        // templateUrl: './line-chart.component.html',
        // styleUrls: ['./line-chart.component.css'],
        template: "\n        <article class=\"line-chart-container\">\n            <h2>{{config.title}}</h2>\n            <svg></svg>\n        </article>\n    ",
        styles: [
            "\n        .line-chart-container {\n            width: 100%;    \n            height: 100%;\n            display: flex;\n            flex-flow: column;\n        }\n\n        .line-chart-container svg {\n            width: 100%;\n            flex: 1;\n        }\n    "
        ]
    }),
    __metadata("design:paramtypes", [DataFormater,
        ElementRef])
], LineChartComponent);
export { LineChartComponent };
//# sourceMappingURL=C:/_user/Code/dashboard/mm-line-chart/src/components/widget/line-chart.component.js.map
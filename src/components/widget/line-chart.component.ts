import { Component, OnInit, OnChanges, AfterViewInit, Input, Output, EventEmitter, SimpleChanges, ElementRef } from '@angular/core';
import { EAggregation, ENest, EColType, IColumn, IBaseWidget, DataFormater, ITooltipConfig } from 'mm-dashboard-core';
import { ILineChartConfig } from '../../interfaces';

import * as D3Scale from 'd3-scale';
import * as D3Path from 'd3-path';
import * as D3Select from 'd3-selection';
import * as D3Shape from 'd3-shape';
import * as D3Array from 'd3-array';
import * as D3Collection from 'd3-collection';
import * as D3Axis from 'd3-axis';
import * as D3Transition from 'd3-transition';
import * as D3Time from 'd3-time';
import * as D3TimeFormat from 'd3-time-format';


@Component({
    selector: 'mm-line-chart',
    // templateUrl: './line-chart.component.html',
    // styleUrls: ['./line-chart.component.css'],
    template:
    `
        <article class="line-chart-container">
            <h2>{{config.title}}</h2>
            <svg></svg>
        </article>
    `,
    styles: [
        `
        .line-chart-container {
            width: 100%;    
            height: 100%;
            display: flex;
            flex-flow: column;
        }

        .line-chart-container svg {
            width: 100%;
            flex: 1;
        }
    `
    ]
})
export class LineChartComponent implements IBaseWidget, OnInit, OnChanges, AfterViewInit {
    @Input() resized: boolean = false;
    @Input() config: ILineChartConfig;
    @Input() data: Array<any>;
    @Output() dataChange: EventEmitter<any[]> = new EventEmitter();
    @Output() tooltipOn: EventEmitter<ITooltipConfig> = new EventEmitter();
    @Output() tooltipOff: EventEmitter<ITooltipConfig> = new EventEmitter();

    htmlElem: HTMLElement;
    lineData: Array<any>; // formated data
    d3Svg: any;
    viewInit: boolean;

    constructor(
        private dataFormater: DataFormater,
        private element: ElementRef
    ) {
        console.log("LineChartComponent -> contructor: ", dataFormater, element);
        this.htmlElem = element.nativeElement;
        this.viewInit = false;
    }

    ngOnInit() {

    }

    ngAfterViewInit() {
        console.log("LineChartComponent -> ngAfterViewInit");
        this.viewInit = true;
        this.d3Svg = D3Select.select(this.htmlElem).select('svg');
        console.log("LineChartComponent -> ngAfterViewInit -> d3Svg: ", this.d3Svg);
        if (this.config.xCol && this.config.yCol && this.data) {
            this.formatData();
            this.draw();
        }
    }

    ngOnChanges(changes: SimpleChanges) {
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
    }

    formatData() {
        this.lineData = this.dataFormater.d3aggregateNumber(
            this.data,
            [this.config.xCol],
            this.config.yCol,
            this.config.aggregation,
            ENest.entries);
    }

    onDblclick(col: IColumn, value: any) {
        console.log("LineChartComponent -> doubleclicked");
        let filteredData = this.data.filter(r => r[col.name] == value);
        this.dataChange.emit(filteredData);
    }

    draw() {
        let data = this.lineData;
        let config = this.config;
        let width = this.htmlElem.children[0].children[1].clientWidth - config.margin.left - config.margin.right;
        let height = this.htmlElem.children[0].children[1].clientHeight - config.margin.top - config.margin.bottom;
        let parseKey;
        let xScale;
        let valueLine = D3Shape.line();

        // Clear old drawing
        console.log("LineChartComponent -> draw -> clearing old elements: ", this.d3Svg);
        this.d3Svg.selectAll("g").remove();

        switch (config.xCol.type) {
            case EColType.number:
                console.log("parsing as float");
                parseKey = parseFloat;
                xScale = D3Scale.scaleLinear().range([0, width]).domain(D3Array.extent(data, d => parseKey(d.key)));
                valueLine = valueLine.x(d => {
                    console.log("Non scaledX: ", d["key"]);
                    let scaledX = xScale(d["key"]);
                    console.log("scaledX: ", scaledX);
                    return scaledX;
                });
                break;
            case EColType.date:
                console.log("parsing as date");
                parseKey = D3TimeFormat.timeParse("%d-%b-%y");
                xScale = D3Scale.scaleTime().range([0, width]).domain(<Array<Date>>D3Array.extent(data, d => parseKey(d.key)));
                valueLine = valueLine.x(d => {
                    console.log("Non scaledX: ", parseKey(d["key"]));
                    let scaledX = xScale(parseKey(d["key"]));
                    console.log("scaledX: ", scaledX);
                    return scaledX;
                });
                break;
            default:
                console.error("Invalid type of Column X [xCol]");
                return;
        }
        let yScale = D3Scale.scaleLinear().range([height, 0]).domain(D3Array.extent(data, d => d.value));

        valueLine = valueLine.y(d => yScale(d["value"]));

        let d3TopG = this.d3Svg.append('g').attr('transform', 'translate(' + config.margin.left + ',' + config.margin.top + ')');
        d3TopG.append("path")
            .datum(data)
            .attr("class", "mm-line")
            .attr("stroke", config.color)
            .attr("d", valueLine);

        d3TopG.selectAll(".linePoint")
            .data(data)
            .enter()
            .append("circle")
            .attr("cx", d => xScale(parseKey(d["key"])))
            .attr("cy", d => yScale(d["value"]))
            .attr("r", 3)
            .attr("fill", config.color)
            .on("dblclick", d => this.onDblclick(this.config.xCol, d.key))
            .on("mouseover", d => {
                this.tooltipOn.emit({
                    event: D3Select.event,
                    values: [
                        { key: d.key, value: d.value }
                    ]
                })
            })
            .on("mouseout", d => {
                this.tooltipOff.emit({
                    event: D3Select.event,
                    values: []
                })
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
    }
}
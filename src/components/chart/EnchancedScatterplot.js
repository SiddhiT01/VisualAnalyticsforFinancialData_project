import React, { Component } from 'react';
import * as d3 from 'd3';
import MultiRangeSlider from './MultiRangeSlider'; // Replace Timeslider with MultiRangeSlider

class ScatterPlotWithTimeslider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      selectedXAxis: "sma(50)",
      selectedYAxis: "sma(250)",
      dateRange: [new Date('2017-01-01'), new Date('2017-12-31')], 
      filteredData: this.props.data.data, // Start with the full dataset
    };

    this.xAxisOptions = [
      { "name": "sma(250)", "startangle": 5.4, "endangle": 4.8, "color": "#9F6F2E", "axis": 'y', "label": "SMA-250" },
      { "name": "sma(150)", "startangle": 4.8, "endangle": 4.2, "color": "#1E5B56", "axis": 'y', "label": "SMA-150" },
      { "name": "sma(50)", "startangle": 3.8, "endangle": 3.2, "color": " #9F2E2E", "axis": 'x', "label": "SMA-50" },
      { "name": "close", "startangle": 3.2, "endangle": 2.6, "color": "#2E8540", "axis": 'x', "label": "price" },
    ];

    this.data = props.data.data;
    this.i = props.i;
    this.id = props.id;
  }

  componentDidMount() {
    this.drawScatterPlot();
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevState.filteredData !== this.state.filteredData || 
        prevState.selectedXAxis !== this.state.selectedXAxis || 
        prevState.selectedYAxis !== this.state.selectedYAxis) {
      this.drawScatterPlot();
    }
  }

  handleAxisChange = (option, axis) => {
    if (axis === 'x') {
      this.setState({ selectedXAxis: option });
    } else {
      this.setState({ selectedYAxis: option });
    }
  };

  handleDateRangeChange = (start, end) => {
    const filteredData = this.data.filter(d => new Date(d.date) >= start && new Date(d.date) <= end);
    this.setState({ dateRange: [start, end], filteredData });
  };

  generateButtonArc(circleRadius, startAngle, endAngle, button_name) {
    return d3.arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + ([this.state.selectedXAxis, this.state.selectedYAxis].includes(button_name) ? 40 : 30))
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(5)();
  }

  generateRSIArc(circleRadius, rsi) {
    return d3.arc()({
      innerRadius: circleRadius,
      outerRadius: circleRadius - 15,
      startAngle: 6,
      endAngle: 6 + (rsi / 100) * 2,
    });
  }

  drawScatterPlot() {
    const { filteredData, selectedXAxis, selectedYAxis } = this.state;
    const width = 350;
    const height = 350;
    const scatter_x = 100;
    const scatter_y = 120;
    const scatter_width = 300;
    const scatter_height = 300;
    const circleRadius = 200;
    const circleX = 250;
    const circleY = 250;
    const elem = this;
  
    d3.select(this.chartRef).selectAll('*').remove();
  
    const x = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[selectedXAxis])).nice()
      .range([scatter_x + 25, scatter_width]);
  
    const y = d3.scaleLinear()
      .domain(d3.extent(filteredData, d => d[selectedYAxis])).nice()
      .range([scatter_height, scatter_y + 25]);
  
    this.svg = d3.select(this.chartRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0, 0, 500, 500])
      .attr("style", "max-width: 100%; height: auto;");
  
    const xAxis = this.svg.append("g")
      .attr("transform", `translate(40,${scatter_height + 80})`)
      .call(d3.axisBottom(x).ticks(scatter_width / 80))
      .call(g => g.select(".domain").attr("display", "none"));
  
    const yAxis = this.svg.append("g")
      .attr("transform", `translate(${scatter_height - 170},50)`)
      .call(d3.axisLeft(y).ticks(scatter_width / 80))
      .call(g => g.select(".domain").attr("display", "none"));
  
    this.svg.append("defs").append("SVG:clipPath")
      .attr("id", "clip")
      .append("SVG:rect")
      .attr("width", scatter_width - 50)
      .attr("height", scatter_height - 60)
      .attr("x", 130)
      .attr("y", 150);
  
    const zoom = d3.zoom()
      .scaleExtent([1, 10])
      .on("zoom", zoomed);
  
    this.svg.append("rect")
      .attr("width", scatter_width)
      .attr("height", scatter_height)
      .style("fill", "none")
      .style("pointer-events", "all")
      .attr('transform', 'translate(' + scatter_x + ',' + scatter_y + ')')
      .call(zoom);
  
    const scatter = this.svg.append('g')
      .attr("clip-path", "url(#clip)");
  
    const gLine = scatter.append("path")
      .datum(filteredData)
      .attr("fill", "none")
      .attr("stroke", "orange")
      .attr("stroke-width", 3)
      .attr("d", d3.line()
        .x(d => x(d[selectedXAxis]))
        .y(d => y(d[selectedYAxis]))
      );
  
    // Only render RSI arc if `rsi` exists
    if (filteredData.length > 0 && typeof filteredData[0]['rsi'] !== 'undefined') {
      const rsi_path = this.svg.append("path")
        .attr("id", "arc_rsi")
        .attr('d', this.generateRSIArc(circleRadius, filteredData[0]['rsi']))
        .attr("transform", "translate(250,250)")
        .attr('fill', filteredData[0]['rsi'] > 70 ? "red" : (filteredData[0]['rsi'] <= 30 ? "green" : "grey"));
  
      scatter.selectAll("circle")
        .on('mouseover', function (event, d) {
          if (typeof d['rsi'] !== 'undefined') {
            rsi_path.transition()
              .duration(200)
              .attr('d', elem.generateRSIArc(circleRadius, d.rsi))
              .attr('fill', d.rsi > 70 ? "red" : (d.rsi <= 30 ? "green" : "grey"));
          }
        });
    }
  
    scatter.append("g")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("fill", d => d.color)
      .attr("stroke", d => d.color)
      .attr("cx", d => x(d[selectedXAxis]))
      .attr("cy", d => y(d[selectedYAxis]))
      .attr("r", 3);
  
    this.svg.append('circle')
      .attr('cx', circleX)
      .attr('cy', circleY)
      .attr('r', circleRadius)
      .attr('fill', 'none')
      .attr('stroke', 'black')
      .attr('stroke-width', 2);
  
    this.svg.selectAll('buttons').data(this.xAxisOptions).enter().append("path")
      .attr("id", d => "button_" + d.name)
      .attr('d', d => this.generateButtonArc(circleRadius, d.startangle, d.endangle, d.name))
      .attr("transform", "translate(250,250)")
      .attr('fill', d => d.color)
      .attr('stroke', 'black')
      .attr('stroke-width', 2)
      .style("cursor", "pointer")
      .attr('class', 'arc-button')
      .on('click', (event, d) => this.handleAxisChange(d.name, d.axis));
  
    const tangentAngles = [[9.10, 30], [8.30, 70]];
    tangentAngles.forEach(function (tangentAngle) {
      const lineEndY = circleX + 220 * Math.cos(tangentAngle[0]);
      const lineEndX = circleY + 220 * Math.sin(tangentAngle[0]);
      const lineStartY = circleX + 160 * Math.cos(tangentAngle[0]);
      const lineStartX = circleY + 160 * Math.sin(tangentAngle[0]);
      elem.svg.append("line")
        .attr("x1", lineStartX)
        .attr("y1", lineStartY)
        .attr("y2", lineEndY)
        .attr("x2", lineEndX)
        .attr("stroke", "blue")
        .attr("stroke-width", 2);
  
      elem.svg.append("text")
        .attr("class", "x label")
        .attr("text-anchor", "end")
        .attr("x", lineEndX + 10)
        .attr("y", lineEndY - 10)
        .text(tangentAngle[1] + "%");
  
    });
  
    this.svg.append("text")
      .attr("class", "rsi-label")
      .attr("text-anchor", "middle")
      .attr("x", circleX + 120)
      .attr("y", circleY - 180)
      .attr("fill", "black")
      .attr("font-size", "16px")
      .text("RSI");
  
    this.svg.selectAll('button_labels').data(this.xAxisOptions).enter().append("text").attr('dy', '-.8em').append("textPath")
      .join("textPath")
      .attr("xlink:href", d => "#button_" + d.name)
      .style("text-anchor", "middle")
      .attr("startOffset", "20%")
      .attr('fill', 'white')
      .attr('font-size', '20px')
      .text(d => d.label)
      .style("cursor", "pointer")
      .on('click', (event, d) => this.handleAxisChange(d.name, d.axis));
  
    function zoomed({ transform }) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      gLine.attr("transform", transform).attr("stroke-width", 2 / transform.k);
      xAxis.call(d3.axisBottom(zx));
      yAxis.call(d3.axisLeft(zy));
      scatter.selectAll("circle")
        .attr('cx', function (d) { return zx(d[elem.state.selectedXAxis]) })
        .attr('cy', function (d) { return zy(d[elem.state.selectedYAxis]) });
    }
  }
  
  render() {
    const timesliderData = this.data.map(d => ({ date: new Date(d.date) }));
    return (
      <div>
        <svg ref={ref => this.chartRef = ref}></svg>
        <MultiRangeSlider
          data={timesliderData}
          onChange={this.handleDateRangeChange}
        />
      </div>
    );
  }
}

export default ScatterPlotWithTimeslider;

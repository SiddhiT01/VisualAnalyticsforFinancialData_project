import React, { Component } from 'react';
import * as d3 from 'd3';

class CircularGlyph extends Component {
  constructor(props) {
    super(props);
    this.data = this.props.data;

    this.state = {
      selectedXAxis: "close",
      selectedYAxis: "sma(50)",
      filteredData: this.data,
    };

    this.xAxisOptions = [
      { "name": "sma(250)", "startangle": 5.8, "endangle": 5.3, "color": "#9F6F2E", "axis": 'y', "label": "SMA-250" },
      { "name": "sma(150)", "startangle": 5.3, "endangle": 4.7, "color": "#1E5B56", "axis": 'y', "label": "SMA-150" },
      { "name": "sma(50)", "startangle": 3.5, "endangle": 3.0, "color": "#9F2E2E", "axis": 'x', "label": "SMA-50" },
      { "name": "close", "startangle": 2.5, "endangle": 2.0, "color": "#2E8540", "axis": 'x', "label": "Price" },
      { "name": "macd", "startangle": 3.0, "endangle": 2.5, "color": "#FF5733", "axis": 'x', "label": "MACD" }
    ];
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

  generateButtonArc = (circleRadius, startAngle, endAngle, button_name) => {
    return d3.arc()
      .innerRadius(circleRadius)
      .outerRadius(circleRadius + ([this.state.selectedXAxis, this.state.selectedYAxis].includes(button_name) ? 40 : 30))
      .startAngle(startAngle)
      .endAngle(endAngle)
      .cornerRadius(5)();
  };

  handleAxisChange = (option, axis) => {
    if (axis === 'x') {
      this.setState({ selectedXAxis: option });
    } else {
      this.setState({ selectedYAxis: option });
    }
  };

  drawScatterPlot() {
    const { highlightedPoint, onPointHover } = this.props;
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

    // Clear previous content
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

      // Grey SMI Arc
      // Draw the SMI arc clamped between -40% and 40%
      const smiArc = d3.arc()
      .innerRadius(circleRadius - 10)  // Keep this inside the circle's outer radius
      .outerRadius(circleRadius)       // Arc should stay close to the circle's edge
      .startAngle(-Math.PI / 100)        // Start at -40%
      .endAngle(Math.PI / 3)           // End at 40%
      .cornerRadius(5);                // Smoothing the edges
    
    // Add the SMI arc to the glyph
    this.svg.append('path')
      .attr('d', smiArc)
      .attr('transform', `translate(${circleX},${circleY})`)
      .attr('fill', '#cccccc')         // Grey color for the SMI arc
      .attr('stroke', 'none');
    

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
      .scaleExtent([1, 5])
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

    const colorScale = d3.scaleLinear()
      .domain([d3.min(filteredData, d => d[selectedXAxis]), d3.mean(filteredData, d => d[selectedXAxis]), d3.max(filteredData, d => d[selectedXAxis])])
      .range(['red', 'yellow', 'green']);

    const gDot = scatter.append("g")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .selectAll("circle")
      .data(filteredData)
      .join("circle")
      .attr("fill", d => colorScale(d[selectedXAxis]))
      .attr("stroke", d => colorScale(d[selectedXAxis]))
      .attr("cx", d => x(d[selectedXAxis]))
      .attr("cy", d => y(d[selectedYAxis]))
      .attr("r", 5)
      .on('mouseover', function (event, d) {
        onPointHover(d); // Call the onPointHover function to synchronize with timeseries chart
      });

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
      .on('click', (event, d) => this.handleAxisChange(d.name, d.axis));

    this.svg.selectAll('button_labels').data(this.xAxisOptions).enter().append("text")
      .attr('dy', '-.8em').append("textPath")
      .join("textPath")
      .attr("xlink:href", d => "#button_" + d.name)
      .style("text-anchor", "middle")
      .attr("startOffset", "20%")
      .attr('fill', 'white')
      .attr('font-size', '14px')
      .text(d => d.label);

    const tangentAngles = [[9.10, -40], [8.30, 40]];

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

    function zoomed({ transform }) {
      const zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      const zy = transform.rescaleY(y).interpolate(d3.interpolateRound);
      gDot
        .attr('cx', function (d) { return zx(d[elem.state.selectedXAxis]) })
        .attr('cy', function (d) { return zy(d[elem.state.selectedYAxis]) });
    }
  }

  render() {
    return (
      <div>
        <svg ref={ref => this.chartRef = ref}></svg>
      </div>
    );
  }
}

export default CircularGlyph;

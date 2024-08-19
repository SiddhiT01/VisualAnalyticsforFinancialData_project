import React from 'react';
import * as d3 from 'd3';

class Timeslider extends React.Component {
  componentDidMount() {
    this.drawSlider();
  }

  drawSlider() {
    const { width, height, margin, data, onChange } = this.props;

    const svg = d3.select(this.sliderRef)
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    const x = d3.scaleTime()
      .domain(d3.extent(data, d => d.date))
      .range([0, width - margin.left - margin.right]);

    const xAxis = d3.axisBottom(x)
      .ticks(d3.timeMonth.every(1))
      .tickFormat(d3.timeFormat('%b %Y')); // Show date labels in 'Month Year' format

    svg.append("g")
      .attr("transform", `translate(0,${height - margin.top - margin.bottom})`)
      .call(xAxis);

    const brush = d3.brushX()
      .extent([[0, 0], [width - margin.left - margin.right, height - margin.top - margin.bottom]])
      .on("brush end", function ({ selection }) {
        if (selection) {
          const [start, end] = selection.map(x.invert);
          onChange(start, end);
        }
      });

    const brushGroup = svg.append("g")
      .call(brush);

    brushGroup.selectAll('.overlay')
      .style('fill', '#69a3b2')
      .style('stroke', '#3c6478')
      .style('cursor', 'ew-resize');

    // Restore handle styling to previous look
    brushGroup.selectAll('.handle--custom')
      .style('fill', '#b3d4fc')
      .style('stroke', '#003366')
      .style('stroke-width', 2)
      .style('cursor', 'ew-resize');

    // Adjust brush style and functionality
    brushGroup.selectAll(".handle")
      .style("fill", "#b3d4fc")
      .style("stroke", "#003366")
      .style("cursor", "ew-resize");

    // Show/hide labels on hover
    brushGroup.selectAll(".handle")
      .on("mouseover", function() {
        svg.select(".x-axis").call(xAxis);
      })
      .on("mouseout", function() {
        svg.select(".x-axis").call(d3.axisBottom(x).ticks(d3.timeMonth.every(1)).tickFormat(() => ""));
      });
  }

  render() {
    return <svg ref={ref => this.sliderRef = ref}></svg>;
  }
}

export default Timeslider;

import React, { Component } from 'react';
import * as d3 from 'd3';
import MultiRangeSlider from './MultiRangeSlider';

// Function to calculate EMA (Exponential Moving Average)
const calculateEMA = (data, windowSize, field) => {
  const multiplier = 2 / (windowSize + 1);
  return data.reduce((acc, curr, index) => {
    if (index === 0) {
      acc.push(curr[field]); // Start with the first value
    } else {
      const emaValue = (curr[field] - acc[index - 1]) * multiplier + acc[index - 1];
      acc.push(emaValue);
    }
    return acc;
  }, []);
};

// Function to calculate MACD and Signal Line
const calculateMACD = (data) => {
  const fastEMA = calculateEMA(data, 12, 'close');  // 12-period EMA for MACD
  const slowEMA = calculateEMA(data, 26, 'close');  // 26-period EMA for MACD

  // MACD is the difference between the 12-period EMA and the 26-period EMA
  const macd = fastEMA.map((value, index) => value - slowEMA[index]);

  // Signal Line is the 9-period EMA of the MACD
  const signalLine = calculateEMA(macd.map(val => ({ close: val })), 9, 'close');

  return { macd, signalLine };
};

// Function to calculate SMI (Stochastic Momentum Index)
const calculateSMI = (data) => {
  const period = 14;  // SMI calculation period
  
  return data.map((d, i) => {
    if (i < period) return 0;
    const highestHigh = Math.max(...data.slice(i - period, i + 1).map(d => d.high));
    const lowestLow = Math.min(...data.slice(i - period, i + 1).map(d => d.low));
    const smi = 100 * ((d.close - lowestLow) / (highestHigh - lowestLow));
    return smi;
  });
};

// Apply MACD and SMI Calculation to Dataset
const applyIndicatorsToDataset = (dataset) => {
  const macdData = calculateMACD(dataset);
  const smiData = calculateSMI(dataset);

  dataset.forEach((d, index) => {
    d.macd = macdData.macd[index];
    d.signalLine = macdData.signalLine[index];
    d.smi = smiData[index];
  });

  return dataset;
};

class ScatterPlotWithTimeslider extends Component {
  constructor(props) {
    super(props);

    // Apply MACD and SMI calculation to the dataset
    const datasetWithIndicators = applyIndicatorsToDataset(this.props.data.data);

    this.state = {
      selectedXAxis: "sma(50)",
      selectedYAxis: "sma(250)",
      dateRange: [new Date('2017-01-01'), new Date('2017-12-31')],
      filteredData: datasetWithIndicators, // Start with the dataset that now includes MACD and SMI
      lastValidStartDate: new Date('2017-01-01'),
      lastValidEndDate: new Date('2017-12-31'),
    };

    this.xAxisOptions = [
      { "name": "sma(250)", "startangle": 5.8, "endangle": 5.3, "color": "#9F6F2E", "axis": 'y', "label": "SMA-250" },
      { "name": "sma(150)", "startangle": 5.3, "endangle": 4.7, "color": "#1E5B56", "axis": 'y', "label": "SMA-150" },
      { "name": "sma(50)", "startangle": 3.5, "endangle": 3.0, "color": "#9F2E2E", "axis": 'x', "label": "SMA-50" },
      { "name": "close", "startangle": 2.5, "endangle": 2.0, "color": "#2E8540", "axis": 'x', "label": "Price" },
      { "name": "macd", "startangle": 3.0, "endangle": 2.5, "color": "#FF5733", "axis": 'x', "label": "MACD" } // MACD Button
    ];

    this.data = datasetWithIndicators;
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

  handleDateRangeChange = (start, end) => {
    const filteredData = this.data.filter(d => new Date(d.date) >= start && new Date(d.date) <= end);

    if (filteredData.length === 0) {
      this.setState((prevState) => ({
        dateRange: prevState.dateRange,
        filteredData: prevState.filteredData,
        lastValidStartDate: prevState.lastValidStartDate,
        lastValidEndDate: prevState.lastValidEndDate,
      }));
    } else {
      this.setState({
        dateRange: [start, end],
        filteredData,
        lastValidStartDate: start,
        lastValidEndDate: end,
      });
    }
  };

  generateSMIArc(circleRadius, smi) {
    // Clamp SMI between -40 and 40 to ensure it stays within the bounds
    const smiClamped = Math.max(-40, Math.min(40, smi));
    
    // Adjust the angle scale to map the SMI value to the arc between -40% and 40%
    const angleScale = d3.scaleLinear()
                         .domain([-40, 40])
                         .range([6.4, 7.7]); // Adjust the max range slightly (previously 8.3)

    return d3.arc()({
      innerRadius: circleRadius,
      outerRadius: circleRadius - 15,
      startAngle: 6.4, // Start of the SMI arc (-40%)
      endAngle: angleScale(smiClamped) // Map the clamped SMI value to the arc angle
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

  const gLine = scatter.append("path")
    .datum(filteredData)
    .attr("fill", "none")
    .attr("stroke", "orange")
    .attr("stroke-width", 3)
    .attr("d", d3.line()
      .x(d => x(d[selectedXAxis]))
      .y(d => y(d[selectedYAxis]))
    );

  // Initial color is grey
  const smi_path = this.svg.append("path")
    .attr("id", "arc_smi")
    .attr('d', this.generateSMIArc(circleRadius, filteredData[0]['smi']))
    .attr("transform", "translate(250,250)")
    .attr('fill', "grey"); // Initial color when not hovered

  const gDot = scatter.append("g")
    .attr("stroke-width", 2)
    .style("cursor", "pointer")
    .selectAll("circle")
    .data(filteredData)
    .join("circle")
    .attr("fill", d => d.color)
    .attr("stroke", d => d.color)
    .attr("cx", d => x(d[selectedXAxis]))
    .attr("cy", d => y(d[selectedYAxis]))
    .attr("r", 3)
    .on('mouseover', function (event, d) {
      smi_path.transition()
        .duration(200)
        .attr('d', elem.generateSMIArc(circleRadius, d.smi)) // Update the SMI arc
        .attr('fill', d.smi > 40 ? "red" : "green"); // Red for overbought, green for oversold
    })
    .on('mouseout', function () {
      smi_path.transition()
        .duration(200)
        .attr('fill', "grey"); // Reset to grey on mouse out
    });

  this.svg.append('circle')
    .attr('cx', circleX)
    .attr('cy', circleY)
    .attr('r', circleRadius)
    .attr('fill', 'none')
    .attr('stroke', 'black')
    .attr('stroke-width', 2);

  // Add buttons, zoom functionality, and other elements as before


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
      

    this.svg.append("text")
      .attr("class", "smi-label")
      .attr("text-anchor", "middle")
      .attr("x", circleX + 120)
      .attr("y", circleY - 180)
      .attr("fill", "black")
      .attr("font-size", "16px")
      .text("SMI");

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
      gDot
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
          startDate={this.state.lastValidStartDate}
          endDate={this.state.lastValidEndDate}
        />
      </div>
    );
  }
}

export default ScatterPlotWithTimeslider;

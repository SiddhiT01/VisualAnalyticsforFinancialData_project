import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          selectedXAxis: "miles",
          selectedYAxis: "gas",
        };
    
        this.xAxisOptions = [
        {"name":"miles","startangle":5.4,"endangle":5,"color":"blue","axis":'y'},
        {"name":"speed","startangle":5,"endangle":4.6,"color":"red","axis":'y'},
        {"name":"acceleration","startangle":4.6,"endangle":4.2,"color":"green","axis":'y'},        
        {"name":"steering","startangle":3.8,"endangle":3.4,"color":"yellow","axis":'x'},
        {"name":"gas","startangle":3.4,"endangle":3,"color":"purple","axis":'x'},
        {"name":"brake","startangle":3,"endangle":2.6,"color":"orange","axis":'x'},    
    
    ];
        this.yAxisOptions = ["gas", "brake", "steering"];
      }
  componentDidMount() {
    // Call the function to draw the scatter plot
    this.drawScatterPlot();
  }
  handleAxisChange = (option,axis) => {
    console.log(option)
    console.log(axis)

    if(axis=='x')
    this.setState({ selectedXAxis: option });
    else
    this.setState({ selectedYAxis: option });
    
    // Call the function to update the circular glyph with the selected X axis
    this.drawScatterPlot();
  };



  generateArc(circleRadius, startAngle, endAngle) {
    console.log(startAngle)
    return d3.arc()({
        innerRadius: circleRadius,
        outerRadius: circleRadius + 30,
        startAngle: startAngle,
        endAngle: endAngle,
    });
}

  drawScatterPlot() {
    // Data
     // Chart dimensions and margins
     const width = 300;
     const height = 300;
     const marginTop = 20;
     const marginRight = 20;
     const marginBottom = 20;
     const marginLeft = 20;
     const circleRadius = 220;
     const circleX = width / 2;
     const circleY = height / 2;
     d3.select(this.chartRef).selectAll('*').remove();
    const driving = [{
       // "side": "left",
        "year": 1956,
        "miles": 3683.6965,
        "gas": 2.3829,
        "brake":20,
        "speed":2500,
        "acceleration":250,
        "steering":20

      },
      {
       // "side": "right",
        "year": 1957,
        "miles": 3722.7648,
        "gas": 2.4026,
        "brake":10,
        "speed":2500,
        "acceleration":250,
        "steering":20
      },
      {
        // "side": "right",
         "year": 1960,
         "miles": 3726.7648,
         "gas": 2.4026,
         "brake":25,
         "speed":2500,
         "acceleration":250,
         "steering":20
       }


    ];

   
    length = (path) => d3.create("svg:path").attr("d", path).node().getTotalLength()
    // Positional encodings
    const x = d3.scaleLinear()
      .domain(d3.extent(driving, d => d[this.state.selectedXAxis])).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain(d3.extent(driving, d => d[this.state.selectedYAxis])).nice()
      .range([height - marginBottom, marginTop]);

    const line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(d => x(d[this.state.selectedXAxis]))
      .y(d => y(d[this.state.selectedYAxis]));

    const svg = d3.select(this.chartRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-100, -100, 500, 500])
      .attr("style", "max-width: 100%; height: auto;padding: 30px;");

    const l = length(line(driving));

    svg.append("g")
      .attr("transform", `translate(0,${height - marginBottom})`)
      .call(d3.axisBottom(x).ticks(width / 80))
      .call(g => g.select(".domain").remove())
      .call(g => g.append("text")
        .attr("x", width - 4)
        .attr("y", -4)
        .attr("font-weight", "bold")
        .attr("text-anchor", "end")
        .attr("fill", "currentColor")
        .text(this.state.selectedXAxis));

    svg.append("g")
      .attr("transform", `translate(${marginLeft},0)`)
      .call(d3.axisLeft(y).ticks(width / 80))
      .call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
        .attr("x", 4)
        .attr("text-anchor", "start")
        .attr("font-weight", "bold")
        .text(this.state.selectedYAxis));

    svg.append("path")
      .datum(driving)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${l}`)
      .attr("d", line)
      .attr("stroke-dasharray", `${l},${l}`);

    svg.append("g")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .selectAll("circle")
      .data(driving)
      .join("circle")
      .attr("cx", d => x(d[this.state.selectedXAxis]))
      .attr("cy", d => y(d[this.state.selectedYAxis]))
      .attr("r", 3);   
  
    svg.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', circleRadius)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
  
      // Add buttons as arcs on the right and bottom side of the circle
   
    svg.selectAll('buttons').data(this.xAxisOptions).enter().append("path")
        .attr("id", d=>  "button_"+d.name )       
        .attr('d',(d) => this.generateArc(circleRadius, d.startangle, d.endangle))
        .attr("transform", "translate(150,150)")
        .attr('fill', d=> d.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style("cursor", "pointer")
        .attr('class', 'arc-button')
        .on('click', (event,d) => this.handleAxisChange(d.name,d.axis));
  
     

    //button labels
    svg.selectAll('button_lables').data(this.xAxisOptions).enter().append("text").append("textPath")
    .join("textPath")
    .attr("xlink:href",  d=>  "#button_"+d.name ) //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "23%")
    .attr('dy', '0.35em')
    .text( d=>  d.name)
    .style("cursor", "pointer")
    .on('click',(event,d) => this.handleAxisChange(d.name,d.axis));




    }
  
   

  render() {
    return (
      <svg ref={ref => this.chartRef = ref}></svg>
    );
  }
}

export default ScatterPlot;

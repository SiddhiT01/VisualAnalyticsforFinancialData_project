import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          selectedXAxis: "sma(25)",
          selectedYAxis: "gas",
          rsi:80
        };
    
        this.xAxisOptions = [
        {"name":"sma(25)","startangle":5.4,"endangle":5,"color":"#9F6F2E","axis":'y'},
        {"name":"sma(125)","startangle":5,"endangle":4.6,"color":"#1E5B56","axis":'y'},
        {"name":"ema","startangle":4.6,"endangle":4.2,"color":"#5A1E5B","axis":'y'},        
        {"name":"steering","startangle":3.8,"endangle":3.4,"color":" #9F2E2E","axis":'x'},
        {"name":"gas","startangle":3.4,"endangle":3,"color":"#2E8540","axis":'x'},
        {"name":"brake","startangle":3,"endangle":2.6,"color":" #1E5B9F","axis":'x'},    
    
    ];
       
        this.data=[{
            // "side": "left",
             "sma(25)": 1956,
             "sma(125)": 3683.6965,
             "ema": 2.3829,
             "steering":20,
             "gas":2500,
             "brake":250,
             "rsi":50
             
     
           },
           {
            // "side": "right",
             "sma(25)": 1957,
             "sma(125)": 3722.7648,
             "ema": 2.4026,
             "brake":10,
             "gas":2500,       
             "steering":20,
             "rsi":100
           },
           {
             // "side": "right",
              "sma(25)": 1960,
              "sma(125)": 3726.7648,
              "ema": 2.4026,
              "brake":25,
              "gas":2500,         
              "steering":20,
              "rsi":25
            }     
     
         ];
        
     
      }
  componentDidMount() {
    // Call the function to draw the scatter plot
    this.drawScatterPlot();
  }
  handleAxisChange = (option,axis) => {
 
    if(axis=='x')
    this.setState({ selectedXAxis: option });
    else
    this.setState({ selectedYAxis: option });
    
    // Call the function to update the circular glyph with the selected X axis
    this.drawScatterPlot();
  };



  generateArc(circleRadius, startAngle, endAngle) {
        return d3.arc()({
            innerRadius: circleRadius,
            outerRadius: circleRadius + 30,
            startAngle: startAngle,
            endAngle: endAngle,
        });
    }
    generateRSIArc(circleRadius,rsi){
        return d3.arc()({
            innerRadius: circleRadius,
            outerRadius: circleRadius + 30,
            startAngle: 6,
            endAngle: 6+(rsi/100)*2,
        });
    }

  drawScatterPlot() {
    // Data
     // Chart dimensions and margins
     const width = 500;
     const height = 500;
     const marginTop = 120;
     const marginRight = 120;
     const marginBottom = 120;
     const marginLeft = 120;
     const circleRadius = 220;
     const circleX = width / 2;
     const circleY = height / 2;
     d3.select(this.chartRef).selectAll('*').remove();
   
   
    length = (path) => d3.create("svg:path").attr("d", path).node().getTotalLength()
    // Positional encodings
    const x = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d[this.state.selectedXAxis])).nice()
      .range([marginLeft, width - marginRight]);

    const y = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d[this.state.selectedYAxis])).nice()
      .range([height - marginBottom, marginTop]);

    const line = d3.line()
      .curve(d3.curveCatmullRom)
      .x(d => x(d[this.state.selectedXAxis]))
      .y(d => y(d[this.state.selectedYAxis]));

    const svg = d3.select(this.chartRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-50,0,600,500])
      .attr("style", "max-width: 100%; height: auto;padding: 30px;");

    const l = length(line(this.data));

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
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "black")
      .attr("stroke-width", 2.5)
      .attr("stroke-linejoin", "round")
      .attr("stroke-linecap", "round")
      .attr("stroke-dasharray", `0,${l}`)
      .attr("d", line)
      .attr("stroke-dasharray", `${l},${l}`);


    svg.append("path")
      .attr("id", "arc_rsi" )       
      .attr('d', this.generateArc(circleRadius,8,6))
      .attr("transform", "translate(250,250)")
      .attr('fill', "black")    

    var rsi_path=svg.append("path")
      .attr("id", "arc_rsi" )       
      .attr('d', this.generateRSIArc(circleRadius,this.state.rsi))
      .attr("transform", "translate(250,250)")
      .attr('fill',this.state.rsi>=70?"green":"red")
    svg.append("g")
      .attr("fill", "white")
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("cx", d => x(d[this.state.selectedXAxis]))
      .attr("cy", d => y(d[this.state.selectedYAxis]))
      .attr("r", 3)
      .on('mouseover', (event,d) => { 
        rsi_path.transition()
        .duration(200) // Animation duration in milliseconds
        .attr('d', this.generateRSIArc(circleRadius,d.rsi))
        .attr('fill',d.rsi>=70?"green":"red")
      
        });
       
  
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
        .attr("transform", "translate(250,250)")
        .attr('fill', d=> d.color)
        .attr('stroke', 'white')
        .attr('stroke-width', 2)
        .style("cursor", "pointer")
        .attr('class', 'arc-button')
        .on('click', (event,d) => this.handleAxisChange(d.name,d.axis));
    
 
        


    //button labels
    svg.selectAll('button_lables').data(this.xAxisOptions).enter().append("text").attr('dy', '-.5em').append("textPath")
    .join("textPath")
    .attr("xlink:href",  d=>  "#button_"+d.name ) //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "23%")    
    .attr('fill', 'white')
    .attr('font-size', '20px')    
    .text( d=>  d.name)
    .style("cursor", "pointer")
    // Adjust the value to move the label down
    .on('click',(event,d) => this.handleAxisChange(d.name,d.axis));




    }
  
   

  render() {
    return (
      <svg ref={ref => this.chartRef = ref}></svg>
    );
  }
}

export default ScatterPlot;

import React, { Component } from 'react';
import * as d3 from 'd3';

class ScatterPlot extends Component {
    constructor(props) {
        super(props);
    
        this.state = {
          selectedXAxis: "sma(50)",
          selectedYAxis: "sma(250)"         
        };
    
        this.xAxisOptions = [
        {"name":"sma(250)","startangle":5.4,"endangle":4.8,"color":"#9F6F2E","axis":'y',"label":"SMA-250"},
        {"name":"sma(150)","startangle":4.8,"endangle":4.2,"color":"#1E5B56","axis":'y',"label":"SMA-150"},      
        {"name":"sma(50)","startangle":3.8,"endangle":3.2,"color":" #9F2E2E","axis":'x',"label":"SMA-50"},
        {"name":"close","startangle":3.2,"endangle":2.6,"color":"#2E8540","axis":'x',"label":"price"}, 
    
    ];
       this.data=props["data"]["data"]

       this.i=props['i']
       this.id=props['id']
   
     
      }
  componentDidMount() {
    // Call the function to draw the scatter plot
    this.drawScatterPlot();
  }
  handleAxisChange = (option,axis) => {
 
    if(axis==='x')
    this.setState({ selectedXAxis: option });
    else
    this.setState({ selectedYAxis: option });
    
    // Call the function to update the circular glyph with the selected X axis
    this.drawScatterPlot();
  };



  generateButtonArc(circleRadius, startAngle, endAngle, button_name) {  
    
    const arc=d3.arc()
    .innerRadius( circleRadius)
    .outerRadius(circleRadius + ([this.state.selectedXAxis,this.state.selectedYAxis].includes(button_name)?40:30))
    .startAngle(startAngle)
    .endAngle(endAngle).cornerRadius(5);
    return arc()

    }
    generateRSIArc(circleRadius,rsi){
      if(rsi==='-'){
        return d3.arc()({
          innerRadius: circleRadius,
          outerRadius: circleRadius-15,
          startAngle: 6,
          endAngle: 8,
      });
      }
        return d3.arc()({
            innerRadius: circleRadius,
            outerRadius: circleRadius-15,
            startAngle: 6,
            endAngle: 6+(rsi/100)*2,
        });
    }
    generateRSIArcRest(circleRadius,rsi){      
        return d3.arc()({
            innerRadius: circleRadius,
            outerRadius: circleRadius-15,
            startAngle: 6+(rsi/100)*2,
            endAngle: 8,
        });
    }
     
  drawScatterPlot() {

    // Data
     // Chart dimensions. Change this to adjust the dimentions of chart
     const width = 175;
     const height = 175;


     const scatter_x=100;
     const scatter_y=120;
     const scatter_width=300;
     const scatter_height=300;
     const circleRadius = 200;
     const circleX = 250;
     const circleY = 250;
     var elem=this
    
     d3.select(this.chartRef).selectAll('*').remove();
     
   
   
     const calculateTotalLength  = (path) => d3.create("svg:path").attr("d", path).node().getTotalLength()
    // Positional encodings
    var x = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d[this.state.selectedXAxis])).nice()
      .range([scatter_x+25, scatter_width ]);

    var y = d3.scaleLinear()
      .domain(d3.extent(this.data, d => d[this.state.selectedYAxis])).nice()
      .range([scatter_height,scatter_y+25]);

    var line = d3.line()
      .x(d => x(d[this.state.selectedXAxis]))
      .y(d => y(d[this.state.selectedYAxis]));

  
    this.svg = d3.select(this.chartRef)
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [0,0,500,500])
      .attr("style", "max-width: 100%; height: auto;")   
  
      

   //const l = calculateTotalLength(line(this.data));
   
    var xAxis=this.svg.append("g")
      .attr("transform", `translate(40,${scatter_height + 80})`)
      .call(d3.axisBottom(x).ticks(scatter_width / 80))
      .call(g => g.select(".domain").attr("display", "none"))
     
    
    var yAxis=this.svg.append("g")
      .attr("transform", `translate(${scatter_height-170},50)`)
      .call(d3.axisLeft(y).ticks(scatter_width / 80))
      .call(g => g.select(".domain").attr("display", "none"))
      



     // clipPath for the line and dot: everything out of this area won't be drawn.
    this.svg.append("defs").append("SVG:clipPath")
    .attr("id", "clip")
    .append("SVG:rect")
    .attr("width", scatter_width-50)
    .attr("height", scatter_height-60)
    .attr("x", 130)
    .attr("y", 150);


  const zoom=d3.zoom()// This control how much you can unzoom (x0.5) and zoom (x20)
  .scaleExtent([1, 10])
  .on("zoom",zoomed);  

  this.svg.append("rect")
  .attr("width", scatter_width)
  .attr("height", scatter_height)
  .style("fill", "none")
  .style("pointer-events", "all")
  .attr('transform', 'translate(' + scatter_x + ',' + scatter_y + ')')
  .call(zoom);

// the scatter variable: where both the dot and the line take place
  var scatter = this.svg.append('g')
  .attr("clip-path", "url(#clip)")
   
    
    var gLine=scatter.append("path")
      .datum(this.data)
      .attr("fill", "none")
      .attr("stroke", "orange" )      
      .attr("stroke-width", 3)
      .attr("d", d3.line()
      .x(d => x(d[this.state.selectedXAxis]))
      .y(d => y(d[this.state.selectedYAxis]))
      )
      
     
     
    this.svg.append("path")
      .attr("id", "arc_rsi" )       
      .attr('d', this.generateRSIArc(circleRadius,"-"))
      .attr("transform", "translate(250,250)")
      .attr('fill', "black")
      .append("textPath")
      .text("RSI");    

      this.svg.append("text").attr("x", 180).attr("dy", -10)
      .style("text-anchor","middle").append("textPath")
      .attr("xlink:href","#arc_rsi") .text("RSI")
    
      .attr('fill', "black")
      .append("textPath")
      .text("RSI");
    var rsi_path=this.svg.append("path")
      .attr("id", "arc_rsi" )       
      .attr('d', this.generateRSIArc(circleRadius,this.data[0]['rsi']))
      .attr("transform", "translate(250,250)")
      .attr('fill',this.data[0]['rsi']>70?"red":(this.data[0]['rsi']<=30?"green":"grey"))
      

   
    const tangentAngles =[[9.10,30] ,[8.30,70]]
    tangentAngles.map(function(tangentAngle,i){

    const lineEndY = circleX + 220 * Math.cos(tangentAngle[0]);
    const lineEndX = circleY + 220 * Math.sin(tangentAngle[0]);
    const lineStartY = circleX + 160 * Math.cos(tangentAngle[0]);
    const lineStartX = circleY + 160 * Math.sin(tangentAngle[0]);
    elem.svg.append("line")
    .attr("x1", lineStartX)
    .attr("y1", lineStartY)
    .attr("y2",lineEndY)
    .attr("x2", lineEndX) 
    .attr("stroke", "blue") 
    .attr("stroke-width", 2);

    elem.svg.append("text")
    .attr("class", "x label")
    .attr("text-anchor", "end")
    .attr("x", lineEndX+20)
    .attr("y", lineEndY-10)
    .text(tangentAngle[1]+"%");


    })





      var tooltip = d3.select("body")
      .append("div")
      .style("position", "absolute")
      .style("z-index", "10")
      .style("visibility", "hidden")
      .style("background-color", "white")
      .style("border", "solid")
      .style("border-width", "2px")
      .style("border-radius", "5px")
      .style("padding", "3px");
      

    var gDot=scatter.append("g")        
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .selectAll("circle")
      .data(this.data)
      .join("circle")
      .attr("fill",  d => d.color)  
      .attr("stroke",  d => d.color)
      .attr("cx", d => x(d[this.state.selectedXAxis]))
      .attr("cy", d => y(d[this.state.selectedYAxis]))
      .attr("r", (d,i)=>{return 3})//((4/elem.data.length)*i)+1})
      .on('mouseover', (event,d) => { 
       
         

        rsi_path.transition()
        .duration(200) // Animation duration in milliseconds
        .attr('d', this.generateRSIArc(circleRadius,d.rsi))
        .attr('fill',d.rsi>70?"red": (d.rsi<=30?"green":"grey"))       
       
        tooltip.text(d.date); 
        return tooltip.style("visibility", "visible");       
      
        })
        .on("mousemove", function(event){return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");})
        .on("mouseout", function(){return tooltip.style("visibility", "hidden");})
       
  
    this.svg.append('circle')
        .attr('cx', circleX)
        .attr('cy', circleY)
        .attr('r', circleRadius)
        .attr('fill', 'none')
        .attr('stroke', 'black')
        .attr('stroke-width', 2);
  
    // indicator buttons as arcs on the left and bottom side of the circle
   
    this.svg.selectAll('buttons').data(this.xAxisOptions).enter().append("path")
        .attr("id", d=>  "button_"+d.name )       
        .attr('d',(d) => this.generateButtonArc(circleRadius, d.startangle, d.endangle,d.name))
        .attr("transform", "translate(250,250)")
        .attr('fill', d=> d.color)
        .attr('stroke', 'black')
        .attr('stroke-width', 2)
        .style("cursor", "pointer")
        .attr('class', 'arc-button')
        .on('click', (event,d) => this.handleAxisChange(d.name,d.axis));
    
 
        
    

    //button labels
   this.svg.selectAll('button_lables').data(this.xAxisOptions).enter().append("text").attr('dy', '-.8em').append("textPath")
    .join("textPath")
    .attr("xlink:href",  d=>  "#button_"+d.name ) //place the ID of the path here
    .style("text-anchor","middle") //place the text halfway on the arc
    .attr("startOffset", "20%")    
    .attr('fill', 'white')
    .attr('font-size', '20px')    
    .text( d=>  d.label)
    .style("cursor", "pointer")    
    .on('click',(event,d) => this.handleAxisChange(d.name,d.axis));
 

    
    function zoomed({transform}){
      
      var zx = transform.rescaleX(x).interpolate(d3.interpolateRound);
      var zy = transform.rescaleY(y).interpolate(d3.interpolateRound);    
      gLine.attr("transform", transform).attr("stroke-width", 2 / transform.k);     
      xAxis.call(d3.axisBottom(zx));      
      yAxis.call(d3.axisLeft(zy));
      gDot
      .attr('cx', function(d) {return zx(d[elem.state.selectedXAxis])})
      .attr('cy', function(d) {return zy(d[elem.state.selectedYAxis])});
    
    }
   
 

    }
    
  

    
   

  render() {
    return (
      <svg ref={ref => this.chartRef = ref}></svg>
      
      
    );
  }
}

export default ScatterPlot;

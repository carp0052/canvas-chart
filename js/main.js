//javascript document
var canvas, context, data, pct, cheese;
var total = 0;

document.addEventListener("DOMContentLoaded", function() {
	
	var xhr = $.ajax({
  url: "js/cheese.json",
  type: "GET",
  dataType: "json"
	});
	xhr.done(function(data){
  	console.log(data);
    	for(var i=0; i<data.segments.length; i++){
     	total +=  data.segments[i].value;
     	cheese = data.segments;
 	}
    	showPie();
			showBars();
	});
	xhr.fail(function( jqXHR, textStatus ) {
  	console.log( "Request failed: " + textStatus );
	});
});

function showPie(){
  canvas = document.querySelector("#pieChart");
  context = canvas.getContext("2d");
   
  var cx = (canvas.width/2) - 30;
  var cy = canvas.height/2 ;
  var radius = 100;
  var currentAngle = 0;
  for(var i=0; i<cheese.length; i++){
    pct = cheese[i].value/total;
    var color = cheese[i].color;
		
		//change the size of radius for specific segments
		if(cheese[i].value > 40){
			radius = 90;
		}else if(cheese[i].value < 4){
			radius = 110;
		}else{
			radius = 100;
		}
		
    var endAngle = currentAngle + (pct * (Math.PI * 2));
    context.moveTo(cx, cy);
    context.beginPath();
    context.fillStyle = color;
    context.arc(cx, cy, radius, currentAngle, endAngle, false);
    context.lineTo(cx, cy);
    context.fill();
		
    //The lines that will point to the values
    context.save();
    context.translate(cx, cy);
    context.strokeStyle = "#000";
    context.lineWidth = 0.5;
		context.stroke();
    context.beginPath();
		
    //angle to be used for the lines
		var midAngle = (currentAngle + endAngle)/2;
    context.moveTo(0,0);//this value is to start at the middle of the circle
    //to start further out...
    var dx = Math.cos(midAngle) * (0.7 * radius);
    var dy = Math.sin(midAngle) * (0.7 * radius);
    context.moveTo(dx, dy);
    //ending points for the lines
    var dx = Math.cos(midAngle) * (radius + 20);
    var dy = Math.sin(midAngle) * (radius + 20);
    context.lineTo(dx, dy);
		context.stroke();
		
    context.font = '12pt Helvetica';
    context.fillStyle = color;
    context.strokeStyle = '#000';
    context.lineWidth = 1;
		context.stroke();
		
		var label = cheese[i].label;
		var valLabel = Math.floor(cheese[i].value);
    if(label == "Gouda"){
     	context.fillText(label, dx - 40, dy - 7);
			context.fillText(valLabel, dx - 35, dy + 10);
		}else if(label == "Danish Blue"){
		 	context.fillText(label, dx - 35, dy - 25);
			context.fillText(valLabel, dx + 5, dy - 10);
		}else if(label == "Cheddar"){
		 	context.fillText(label, dx - 35, dy + 20);	
			context.fillText(valLabel, dx - 15, dy + 35);	
    }else{
      context.fillText(label, dx + 5, dy + 3);
			context.fillText(valLabel, dx + 30, dy + 20);
    }

    //put the canvas back to the original position
    context.restore();
    //update the currentAngle
    currentAngle = endAngle;
  }
};

function showBars(){
	canvas = document.querySelector("#barChart");
  context = canvas.getContext("2d");
  
  //the percentage of each value will be used to determine the height of the bars.
  var graphHeight = 250;    //bottom edge of the graph
  var offsetX = 25;	//space away from left edge of canvas to start drawing.
  var barWidth = 45;	//width of each bar in the graph
  var spaceBetweenPoints = 10; //how far apart to make each x value.
  //start at values[1].
  //values[0] is the moveTo point.
  var x = offsetX + 12;	//left edge of first rectangle
  //var y = offsetY - (graphHeight * (values[0]/100));
  //start a new path
  
  for(var i=0; i<cheese.length; i++){
				
    var pct = cheese[i].value / total;
    var barHeight = ((graphHeight * 2) * pct);
   
    context.beginPath();
		//(x, y) coordinates for a rectangle are the top, left values unless you do negative values for w, h
		context.rect(x, graphHeight-1, barWidth, -1 * barHeight);
  	context.font = "12pt Helvetica";
  	context.fillStyle = cheese[i].color;	//colour of the text
		context.fill();
		context.strokeStyle = "#000";	//colour of the lines
  	context.lineWidth = 1;
		context.stroke();
    
    //the labels for the "values" are going above the bars
    var label1 = Math.floor(cheese[i].value);
    context.fillText(label1, x + 12, graphHeight - barHeight - 15);
		//the labels for the "labels" are going beneath the x-axis and rotated
		context.save();
		context.translate(x + 15, graphHeight + 10);
		context.rotate(Math.PI*0.4);
		var label2 = cheese[i].label;
    context.fillText(label2, 0, 0);
		context.restore();
    x = x + barWidth + spaceBetweenPoints;	
    //move the x value for the next point
		context.closePath();		
  }
	
  context.strokeStyle = "#000";
  context.lineWidth = 2;
  context.beginPath();
  context.moveTo(offsetX, canvas.height-(graphHeight+100));
  context.lineTo(offsetX, graphHeight);
  context.lineTo(canvas.width-offsetX, graphHeight);
  context.stroke();  
}



	
	
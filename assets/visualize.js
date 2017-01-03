var days;
var dayOfEntry = 0;
var radius = 0;
var x;
var y;
var ctx;
var canvas;


function start(){
    if(typeof data == 'undefined'){
        data = JSON.parse(localStorage.data);
    }
    canvas = document.getElementById('app');
    ctx = canvas.getContext('2d');
    resizeCanvas();
    x = canvas.width/2;
    y = canvas.height/2;
//    var time = new Date().getTime() - 1000*60*60*24*50;
//    var currentState = false;
//    var stuff = [];
//    for(var i = 0; i < 100; i ++){
//        time += Math.round(Math.random() * 1000*60*60*10)+1000*60*60*5;
//        currentState = !currentState;
//        var event = {
//            "t" : time,
//            "e" : currentState
//        };
//        stuff.push(event);
//    }
//                data = stuff;
      
    data.push({
        "t" : new Date().getTime(),
        "e" : !data[data.length-1].e
    });
    drawV();
}

function drawV(){
    if(x > y){
        radius = y;
    } else {
        radius = x;   
    }
    var last31 = [];
    var less31 = new Date().getTime() - 1000*60*60*24*31;
    for(var i = 0; i < data.length;i++){
        if(data[i].t > less31){
            last31.push(data[i]);
        }
    }
    days = daysBetween(new Date(last31[0].t),new Date(last31[last31.length-1].t));
    for(var i = 0; i < last31.length-1; i++){
        var current = last31[i].t;
        var next = last31[i+1].t;
        drawChunk(days, current, next, last31[i].e, x, y, radius/2);
    }

}

function drawChunk(days, startTime, endTime, isEating, x, y, maxRadius){
    var start = getHoursFromMillis(startTime)/24 * 2* Math.PI - 0.5*Math.PI;
    var end = getHoursFromMillis(endTime)/24 * 2* Math.PI - 0.5*Math.PI;
    var radius;
    if(days == 0){
        days = 1;
        dayOfEntry =1;
    }
    if(getHoursFromMillis(startTime) > getHoursFromMillis(endTime)){
        radius =  (dayOfEntry/(days))* maxRadius;
        drawArc(isEating, x, y, radius, start, 1.5 * Math.PI+0.01,maxRadius, false);

        //new bit
        dayOfEntry++;
        radius =  (dayOfEntry/(days))* maxRadius;
        if(dayOfEntry == days){
            drawArc(isEating, x, y, radius, 1.5 * Math.PI, end, maxRadius, true);
        } else {
            drawArc(isEating, x, y, radius, 1.5 * Math.PI, end, maxRadius, false);
        }
    } else {
        radius =  (dayOfEntry/(days))* maxRadius;
        if(dayOfEntry == days){
            drawArc(isEating, x, y, radius, start, end, maxRadius, true);
        } else {
            drawArc(isEating, x, y, radius, start, end, maxRadius, false);
        }
    }
}

function getHoursFromMillis(time){
    var tmp = new Date(time);
    var hours = tmp.getHours() + tmp.getMinutes()/60 + tmp.getSeconds()/60/60;
    return hours;
}

function drawArc(isEating, x, y, radius, start, end, maxRadius, isPhat){
    ctx.beginPath();
    if(isEating){
        ctx.strokeStyle="#F44E3F";
    } else {
        ctx.strokeStyle="#827191";
    }
    if(isPhat){
        ctx.lineWidth=10 * (maxRadius)/200+10;
        ctx.arc(x,y,radius+25,start,end, false);
    } else {
        ctx.lineWidth=4 * (maxRadius)/200;
        ctx.arc(x,y,radius+20,start,end, false);
    }
    ctx.stroke();
}

function resizeCanvas(e) {
    canvas.style.width = document.body.clientWidth;
    canvas.style.height = document.body.clientHeight;
    canvas.width = document.body.clientWidth*2;
    canvas.height = document.body.clientHeight*2;
}

function daysBetween(first, second) {

    // Copy date parts of the timestamps, discarding the time parts.
    var one = new Date(first.getFullYear(), first.getMonth(), first.getDate());
    var two = new Date(second.getFullYear(), second.getMonth(), second.getDate());

    // Do the math.
    var millisecondsPerDay = 1000 * 60 * 60 * 24;
    var millisBetween = two.getTime() - one.getTime();
    var days = millisBetween / millisecondsPerDay;

    // Round down.
    return Math.floor(days);
}

start();
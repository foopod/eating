var data = [];
            
function toggleEating(){
    //or diary Entry
    if(document.getElementById("startStopEating").innerHTML == "Submit"){
        data = JSON.parse(localStorage.data);
        var key = "m";
        var message  = document.getElementById("diaryEntry").value;
        if (~message.indexOf(":") && !(~message.indexOf("e:") || ~message.indexOf("t:"))){
            key = message.split(':')[0];
            message = message.split(':')[1];
            
        }
        data.push({
                "t" : new Date().getTime(),
                [key] : message
            });
        localStorage.data = JSON.stringify(data);
        document.getElementById("diaryEntry").value = "";
        typing();
    } else {
        storeEating();
        toggleEatingDisplay();
    }
    exportHistory(data);
}

function storeEating(){
    data = JSON.parse(localStorage.data);
    var time = new Date().getTime();
    var event = {
        "t" : time,
        "e" : !data[data.length-1].e
    };
    data.push(event);
    localStorage.currentState = event.e;
    localStorage.data = JSON.stringify(data);
}

function init(){
    if (!localStorage.data){
        localStorage.data = JSON.stringify([{
            "t" : new Date().getTime(),
            "e" : false
        }]);
        localStorage.currentState = false;
        toggleEatingDisplay();
    }
    data = JSON.parse(localStorage.data);
    if(localStorage.diary == "true"){
        document.getElementById("diaryEntry").style.display = 'block';
        document.getElementById("diaryToggle").innerHTML = 'ON';
    } 
    
    if (localStorage.currentState == "true"){
        showEating();
    } else {
        showNotEating();
    }
    updateTime();
    exportHistory(data);
    setInterval(updateTime, 1000);
}

function updateTime(){
    var now  = new Date().getTime();
    var event = data[data.length-1];
    var index = 1;
    while(event.e == undefined){
        event = data[data.length-index];
        index++;
    }
    
    then = event.t;
    var ms = moment(now,"x").diff(moment(then,"x"));
    var d = moment.duration(ms);
    var s = Math.floor(d.asHours()) + moment.utc(ms).format(":mm:ss");

    document.getElementById("time").innerHTML = s;
}

function toggleEatingDisplay(){
    if(localStorage.currentState == "true"){
        showEating();
    } else {
        showNotEating();
    }
}

function showEating(){
    document.getElementById("startStopEating").innerHTML = 'Not Eating';
    document.getElementById("eatingDisplay").style.display = 'block';
    document.getElementById("notEatingDisplay").style.display = 'none';
}

function showNotEating(){
    document.getElementById("eatingDisplay").style.display = 'none';
    document.getElementById("notEatingDisplay").style.display = 'block';
    document.getElementById("startStopEating").innerHTML = 'Chow Time!';
}

function exportHistory(history){
    var str = JSON.stringify(history);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    var link = document.getElementById('link').href = dataUri;
}

function typing(){
    if(document.getElementById("diaryEntry").value.length > 0){
        document.getElementById("startStopEating").innerHTML = 'Submit';
    } else {
        toggleEatingDisplay();
    }
}

function toggleInfo(){
    if(document.getElementById("info").style.display == 'none'){
        document.getElementById("info").style.display = 'block';
    } else {
        document.getElementById("info").style.display = 'none';
    }
}

function toggleDiary(){
    var state = localStorage.diary;
    if(localStorage.diary == "true"){
        localStorage.diary = "false";
        document.getElementById("diaryEntry").style.display = 'none';
        document.getElementById("diaryToggle").innerHTML = 'OFF';
    } else {
        localStorage.diary = "true";
        document.getElementById("diaryEntry").style.display = 'block';
        document.getElementById("diaryToggle").innerHTML = 'ON';
    }
}

init();
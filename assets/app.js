var data = [];
            
function toggleEating(){
    //or diary Entry
    if(document.getElementById("startStopEating").innerHTML == "Submit"){
        var entries = JSON.parse(localStorage.diaryEntries);
        entries.push({
            "t" : new Date().getTime(),
            "e" : document.getElementById("diaryEntry").value
        });
        localStorage.diaryEntries = JSON.stringify(entries);
        document.getElementById("diaryEntry").value = "";
        typing();
    } else {
        storeEating();
        toggleEatingDisplay();
    }
}

function storeEating(){
    data = JSON.parse(localStorage.data);
    var time = new Date().getTime();
    var event = {
        "t" : time,
        "e" : !data[data.length-1].e
    };
    data.push(event);
    exportHistory(data);
    localStorage.currentState = event.e;
    localStorage.data = JSON.stringify(data);
}

function init(){
    if (!localStorage.data){
        localStorage.data = JSON.stringify([]);
        stopEating();
    } else {
        data = JSON.parse(localStorage.data);
    }
    if(localStorage.diary == "true"){
        document.getElementById("diaryEntry").style.display = 'block';
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
    var then = data[data.length-1].t;

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
    if(!localStorage.diaryEntries){
        localStorage.diaryEntries = JSON.stringify([]);
    }
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
    } else {
        localStorage.diary = "true";
        document.getElementById("diaryEntry").style.display = 'block';
    }
}

init();
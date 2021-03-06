var data = [];
            
function toggleEating(){
    cancelConfirm();
    storeEating();
    toggleEatingDisplay();
    exportHistory(data);
}

function confirmToggle(){
    if (localStorage.currentState == "true"){
        confirmButton.innerHTML = "Fast"
    }else{
        confirmButton.innerHTML = "Eat"
    }
    document.getElementById("mainButton").style.display = 'none';
    document.getElementById("confirmationButtons").style.display = 'block';
}

function cancelConfirm(){
    document.getElementById("mainButton").style.display = 'block';
    document.getElementById("confirmationButtons").style.display = 'none';
}

function addNewDiaryEntry(){
    data = JSON.parse(localStorage.data);
    var key = "m";
    var message  = document.getElementById("diaryField").value;
    if(message.length>0){
        if (~message.indexOf(":") && !(~message.indexOf("e:") || ~message.indexOf("t:"))){
            key = message.split(':')[0];
            message = message.split(':')[1];
        }
        data.push({
                "t" : new Date().getTime(),
                [key] : message
            });
        localStorage.data = JSON.stringify(data);
        document.getElementById("diaryField").value = "";
        exportHistory(data);
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
        document.getElementById("diaryToggle").checked = true;
    } else {
        document.getElementById("diaryEntry").style.display = 'none';
        document.getElementById("diaryToggle").checked = false;
    }
    
    if(localStorage.visualization == "true"){
        document.getElementById("visualizationContainer").style.display = 'block';
        document.getElementById("visToggle").checked = true;
    } else {
        document.getElementById("visualizationContainer").style.display = 'none';
        document.getElementById("visToggle").checked = false;
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
    document.getElementById("eatingDisplay").style.display = 'block';
    document.getElementById("notEatingDisplay").style.display = 'none';
}

function showNotEating(){
    document.getElementById("eatingDisplay").style.display = 'none';
    document.getElementById("notEatingDisplay").style.display = 'block';
}

function exportHistory(history){
    var str = JSON.stringify(history);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    var link = document.getElementById('link').href = dataUri;
}

function toggleInfo(){
    if(document.getElementById("info").style.display == 'none'){
        var info = document.getElementById("info");
        info.style.display = 'block';
        scrollTo(document.body,500,200);
    } else {
        document.getElementById("info").style.display = 'none';
    }
}

function toggleDiary(){
    if(localStorage.diary == "true"){
        localStorage.diary = "false";
        document.getElementById("diaryEntry").style.display = 'none';
    } else {
        localStorage.diary = "true";
        document.getElementById("diaryEntry").style.display = 'block';
    }
}

function toggleVis(){
    if(localStorage.visualization == "true"){
        localStorage.visualization = "false";
        document.getElementById("visualizationContainer").style.display = 'none';
    } else {
        localStorage.visualization = "true";
        document.getElementById("visualizationContainer").style.display = 'block';
    }
}

function scrollTo(element, to, duration) {
    if (duration <= 0) return;
    var difference = to - element.scrollTop;
    var perTick = difference / duration * 10;

    setTimeout(function() {
        element.scrollTop = element.scrollTop + perTick;
        if (element.scrollTop === to) return;
        scrollTo(element, to, duration - 10);
    }, 10);
}
init();

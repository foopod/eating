var data = [];
            
function startEating(){
    showEating();
    storeEating(true);
}

function stopEating(){
    showNotEating();
    storeEating(false);
}

function storeEating(isEating){
    data = JSON.parse(localStorage.data);
    var time = new Date().getTime();
    var event = {
        "t" : time,
        "e" : isEating
    };
    data.push(event);
    exportHistory(data);
    localStorage.currentState = isEating;
    localStorage.data = JSON.stringify(data);
}

function init(){
    if (!localStorage.data){
        localStorage.data = JSON.stringify([]);
        stopEating();
    } else {
        data = JSON.parse(localStorage.data);
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

function showEating(){
    document.getElementById("eatingDisplay").style.display = 'block';
    document.getElementById("notEatingDisplay").style.display = 'none';
    document.getElementById("eating").style.display = 'none';
    document.getElementById("notEating").style.display = 'block';
}

function showNotEating(){
    document.getElementById("eatingDisplay").style.display = 'none';
    document.getElementById("notEatingDisplay").style.display = 'block';
    document.getElementById("notEating").style.display = 'none';
    document.getElementById("eating").style.display = 'block';
}

function exportHistory(history){
    var str = JSON.stringify(history);
    var dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(str);
    var link = document.getElementById('link').href = dataUri;
}

function toggleInfo(){
    if(document.getElementById("info").style.display == 'none'){
        document.getElementById("info").style.display = 'block';
    } else {
        document.getElementById("info").style.display = 'none';
    }
}

init();
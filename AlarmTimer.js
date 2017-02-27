function timesincealarm() {
  var now=new Date().getTime();
  var div = document.getElementById("timestamp");
  if(div=="undefined"){
    if (document.getElementById("theTime")) {
      document.getElementById("theTime").innerHTML = "";
    }
  }else{
    var alarmtime = div.innerHTML;
    
    var msec = (now-alarmtime);
    var hour = Math.floor(msec / 1000 / 60 / 60);
    msec -= hour * 1000 * 60 * 60;
    var min = Math.floor(msec / 1000 / 60);
    msec -= min * 1000 * 60;
    var sec = Math.floor(msec / 1000);
    msec -= sec * 1000;

    if (min<=9) { min="0"+min; }
    if (sec<=9) { sec="0"+sec; }
    var hourTxt = " ";
    if(hour>0){ hourTxt = hour + " : "; }

    var time = "<strong>TIMER:</strong><BR>" + hourTxt + min + " : " + sec + " ";

    if (document.getElementById("theTime")) {
      document.getElementById("theTime").innerHTML = time;
      setTimeout("timesincealarm()", 1000);
    }
  }
}









/* global Module */

/* Magic Mirror
 * Module: MMM-AlarmMonitor
 *
 * By Daniel Eisele
 * MIT Licensed.
 */

Module.register('MMM-AlarmMonitor',{

	messages: [],

	defaults: {
        title: 'Alarms',
		max: 5,
        googleApi: "",
		format: false,
		types: {
			INFO: "dimmed",
			WARNING: "normal",
			ERROR: "bright",
			EINSATZ0: "dimmed",
			EINSATZ1: "normal",
			EINSATZ2: "bright"
		},
		icons: {
			INFO: "info",
			WARNING: "exclamation",
			ERROR: "exclamation-triangle",
			EINSATZ0: "ambulance",
			EINSATZ1: "ambulance",
			EINSATZ2: "ambulance"
		},
		activate_monitor: false, 	// sends notification to Module MMM-PIR to activate Monitor
		shortenMessage: false,
        display_time: 5000,    // how long (in ms) alert notification is shown.
        displayAlert: 300000,  // how long (in ms) alert is shown in fullscreen.
        position: "center",
        effect: "slide",  // effect for notification
        alert_effect: "slide" // scale|slide|genie|jelly|flip|bouncyflip|exploader
	},

	getStyles: function () {
		return ["font-awesome.css","ns-default.css", "alarmdisplay.css"];
	},
	
	getScripts: function() {
		return ["moment.js","classie.js", "modernizr.custom.js", "notificationFx.js", "AlarmTimer.js", "directions.js"];
	},

    // Define required translations.
    getTranslations: function() {
        return {
            en: "translations/en.json",
            de: "translations/de.json"
        };
    },

    start: function() {
        this.alerts = {};
        this.setPosition(this.config.position);
		this.sendSocketNotification("CONNECT", {max: this.config.max, logFile: this.file('logs.json')});
		Log.info("Starting module: " + this.name);
		moment.locale(config.language);
		
		//Update DOM every minute so that the time of the call updates and calls get removed after a certain time
		var self = this;
		setInterval( function(){
			self.updateDom();	
		}, 60000);

		// Reference to external Script for google maps api
		var head = document.getElementsByTagName('head')[0];
		var script = document.createElement('script');
    		script.src = "https://maps.googleapis.com/maps/api/js?key=" + this.config.googleApi;
    		head.appendChild(script)

	 },
                
    setPosition: function(pos) {
        //Add css to body depending on the set position for notifications
        var sheet = document.createElement("style");
        if (pos == "center") {sheet.innerHTML = ".ns-box {margin-left: auto; margin-right: auto;text-align: center;}";}
        if (pos == "right") {sheet.innerHTML = ".ns-box {margin-left: auto;text-align: right;}";}
        if (pos == "left") {sheet.innerHTML = ".ns-box {margin-right: auto;text-align: left;}";}
        document.body.appendChild(sheet);
    },


	
	socketNotificationReceived: function(notification, payload) {
		if(notification === "NEW_MESSAGE"){
                	var sender = this.name;  // as sender?
			var jetzt = new Date();
			var notiTime = new Date(payload.timestamp);
			if((jetzt.getTime() - notiTime.getTime()) < 60000){	// Date.getTime() returns timestamp in ms
				if(payload.type=="EINSATZ1" || payload.type=="EINSATZ2"){
					var ttlMS = this.config.displayAlert;   // how many ms the alert is shown.
					if(payload.data){
						this.show_alarm({type: "alarm", message: payload.message, data: payload.data, timestamp: payload.timestamp, timer: ttlMS}, sender);
					}else{
        	                                var alarmMsg = payload.alarmMsg;
						if(payload.alarmMsg=="undefined"){ alarmMsg = ""; }
						this.show_notification({type: "notification", title: payload.message, message: alarmMsg});
					}
				}else{
                                        var alarmMsg = payload.alarmMsg;
					if(payload.alarmMsg=="undefined"){ alarmMsg = ""; }
					this.show_notification({type: "notification", title: payload.message, message: alarmMsg});
				}
			}
			this.messages.push(payload);
			while(this.messages.length > this.config.max){
				this.messages.shift();
			}
			this.updateDom(3000);
		}
	 },
                
    show_notification: function(message) {
	if (this.config.effect == "slide") {this.config.effect = this.config.effect + "-" + this.config.position;}
        msg = "";
        if (message.title) {
            msg += "<span class='thin' style='line-height: 35px; font-size:20px' color='#4A4A4A'>" + message.title + "</span>";
        }
        if (message.message){
            if (msg != ""){
                msg+= "<br />";
            }
            msg += "<span class='light' style='font-size:30px;line-height: 32px;'>" + message.message + "</span>";
        }

	// sends notification to Module MMM-PIR to activate Monitor
	if(this.config.activate_monitor){
	    this.sendNotification("USER_PRESENCE", true);
	}

        new NotificationFx({
            message: msg,
            layout: "growl",
            effect: this.config.effect,
            ttl: this.config.display_time
        }).show();
    },
    
    show_alert: function(params, sender) {
        var self = this;
        //Set standard params if not provided by module
        if (typeof params.timer === "undefined") { params.timer = this.config.display_time; }
        if (typeof params.imageHeight === "undefined") { params.imageHeight = "80px"; }
        if (typeof params.imageUrl === "undefined" && typeof params.imageFA === "undefined") {
            params.imageUrl = null;
            image = "";
        } else if (typeof params.imageFA === "undefined"){
            image = "<img src='" + (params.imageUrl).toString() + "' height=" + (params.imageHeight).toString() + " style='margin-bottom: 10px;'/><br />";
        } else if (typeof params.imageUrl === "undefined"){
            image = "<span class='" + "fa fa-" + params.imageFA + "' style='margin-bottom: 10px;color: #fff;font-size:" + (params.imageHeight).toString() + ";'/></span><br />";
        }
        //Create overlay
        var overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.innerHTML += "<div class=\"black_overlay\"></div>";
        document.body.insertBefore(overlay, document.body.firstChild);
                
        //If module already has an open alert close it
        if (this.alerts[sender.name]) {
            this.hide_alert(sender);
        }
                
        //Display title and message only if they are provided in notification parameters
        message ="";
        if (params.title) {
            message += "<span class='light' style='line-height: 35px; font-size:30px' color='#4A4A4A'>" + params.title + "</span>"
        }
        if (params.message) {
            if (message != ""){
				message += "<br />";
            }
                
            message += "<span class='thin' style='font-size:22px;line-height: 30px;'>" + params.message + "</span>";
        }

	// sends notification to Module MMM-PIR to activate Monitor
	if(this.config.activate_monitor){
	    this.sendNotification("USER_PRESENCE", true);
	}

                
        //Store alert in this.alerts
        this.alerts[sender.name] = new NotificationFx({
            message: image + message,
            effect: this.config.alert_effect,
            ttl: params.timer,
            al_no: "ns-alert"
        });
        //Show alert
        this.alerts[sender.name].show();
        //Add timer to dismiss alert and overlay
        if (params.timer) {
            setTimeout(function() {
                self.hide_alert(sender);
            }, params.timer);
        }
                
    },
        
    show_alarm: function(params, sender) {
        var self = this;
        //Set standard params if not provided by module
        if (typeof params.timer === "undefined") { params.timer = this.config.display_time; }
        if (typeof params.imageHeight === "undefined") { params.imageHeight = "80px"; }
        if (typeof params.imageUrl === "undefined" && typeof params.imageFA === "undefined") {
            params.imageUrl = null;
            image = "";
        } else if (typeof params.imageFA === "undefined"){
            image = "<img src='" + (params.imageUrl).toString() + "' height=" + (params.imageHeight).toString() + " style='margin-bottom: 10px;'/><br />";
        } else if (typeof params.imageUrl === "undefined"){
            image = "<span class='" + "fa fa-" + params.imageFA + "' style='margin-bottom: 10px;color: #fff;font-size:" + (params.imageHeight).toString() + ";'/></span><br />";
        }
        if (typeof params.timestamp === "undefined") { params.timestamp = new Date().getTime(); }

        //Create overlay
        var overlay = document.createElement("div");
        overlay.id = "overlay";
        overlay.innerHTML += "<div class=\"black_overlay\"></div>";
        // insert timer script
        //overlay.innerHTML += "<script type=\"text\/javascript\">function timesincealarm(alarmtime){var now=new Date().getTime(); var msec = (now-alarmtime); var hour = Math.floor(msec / 1000 / 60 / 60);msec -= hour * 1000 * 60 * 60;var min = Math.floor(msec / 1000 / 60);msec -= min * 1000 * 60;var sec = Math.floor(msec / 1000);msec -= sec * 1000; if (min<=9) { min=\"0\"+min; }if (sec<=9) { sec=\"0\"+sec; }var time = \"TIMER: \" + ((hour<=9) ? \"0\"+hour : hour) + \":\" + min + \":\" + sec + \" \";if (document.getElementById(\"theTime\")) {document.getElementById(\"theTime\").innerHTML = time;}setTimeout(\"timesincealarm(alarmtime)\", 1000);}<\/script>";
//        overlay.innerHTML += "<script>window.onload=\"timesincealarm(" + params.timestamp + ");\"<\/script>";
//        overlay.innerHTML += "<script type=\"text\/javascript\">timesincealarm(" + params.timestamp + ");<\/script>";

        document.body.insertBefore(overlay, document.body.firstChild);

                
        //If module already has an open alert close it
        if (this.alerts[sender.name]) {
            this.hide_alert(sender);
        }
                
        //Display title and message only if they are provided in notification parameters
        message ="";
        if (params.title) {
            message += "<span class='light' style='line-height: 35px; font-size:30px' color='#4A4A4A'>" + params.title + "</span>"
        }
        if ((typeof params.data === "undefined") && params.message) {
            //if (message != ""){
                //	message += "<br />";
                //}
            message = params.message;
                //message += "<span class='thin' style='font-size:22px;line-height: 30px;'>" + params.message + "</span>";
        }else if(params.data){
            // data contains the code from alarmmonitor.html inside the <body></body>
            message = "<div id='anzeige' style='position:fixed; top:0px; left:0px; right:0px; bottom:0px; padding:0; margin:0; width:100%; height:100%; overflow:visible; z-index:99999999;'>" + params.data + "</div>";
        }
                                
                
        //Store alert in this.alerts
        this.alerts[sender.name] = new NotificationFx({
            message: message,
            effect: "scale",
            ttl: params.timer,
            al_no: "ns-alarm"
        });
        //Show alert
        this.alerts[sender.name].show();
            //Add timer to dismiss alert and overlay
        if (params.timer) {
            setTimeout(function() {
                self.hide_alert(sender);
            }, params.timer);
        }

	// sends notification to Module MMM-PIR to activate Monitor
	if(this.config.activate_monitor){
	    this.sendNotification("USER_PRESENCE", true);
	}


        // search all SCRIPTs in div "alarmmonitor" and eval these (execute)
        var div = document.getElementById("alarmmonitor");
        if(div!=null){
          var scripts = div.getElementsByTagName("script");
          var i;
          for(i=0;i<scripts.length;i++){
            eval(scripts[i].innerHTML);
          }
        }        
                
    },
    
    hide_alert: function(sender) {
        //Dismiss alert and remove from this.alerts
        this.alerts[sender.name].dismiss();
        this.alerts[sender.name] = null;
        //Remove overlay
        var overlay = document.getElementById("overlay");
        overlay.parentNode.removeChild(overlay);
    },
	
	getDom: function() {
		
		var wrapper = document.createElement("div");
		if(this.config.title !== false){
			var title = document.createElement("header");
			title.innerHTML = this.config.title || this.name;
			wrapper.appendChild(title);
		}
		var logs = document.createElement("table");

		for (var i = this.messages.length - 1; i >= 0; i--) {
			//Create callWrapper
			var callWrapper = document.createElement("tr");
			callWrapper.classList.add("normal");
	
			var iconCell = document.createElement("td");
			var icon =  document.createElement("i");
			if(this.config.icons.hasOwnProperty(this.messages[i].type)){
				icon.classList.add("fa", "fa-fw", "fa-" + this.config.icons[this.messages[i].type]);
			}
			else {
				icon.classList.add("fa", "fa-fw", "fa-question");
			}
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				icon.classList.add(this.config.types[this.messages[i].type]);
			}
		
			iconCell.classList.add("small");
		
			iconCell.appendChild(icon);
			callWrapper.appendChild(iconCell);
		
			var message = this.messages[i].message;
			if(this.config.shortenMessage && message.length > this.config.shortenMessage){
				message = message.slice(0, this.config.shortenMessage) + "&#8230;";
			}
			//Set caller of row
			var caller =  document.createElement("td");
			caller.innerHTML = " " + message;
			caller.classList.add("title", "small", "align-left");
			if(this.config.types.hasOwnProperty(this.messages[i].type)){
				caller.classList.add(this.config.types[this.messages[i].type]);
			}
			callWrapper.appendChild(caller);

			//Set time of row
			var time =  document.createElement("td");
			time.innerHTML = this.config.format ? moment(this.messages[i].timestamp).format(this.config.format) : moment(this.messages[i].timestamp).fromNow();
			time.classList.add("time", "light", "xsmall");
			callWrapper.appendChild(time);

			//Add to logs
			logs.appendChild(callWrapper);
		}
		wrapper.appendChild(logs);
		return wrapper;
	}
});

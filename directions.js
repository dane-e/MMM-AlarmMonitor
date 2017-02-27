var homeLatLng = new google.maps.LatLng(47.0,9.0);
var directionsDisplay;
var directionsService = new google.maps.DirectionsService();
var gMap;
var localMap;
var stylesArray = [
                   {
                   "featureType": "administrative.locality",
                   // Stadtnamen
                   "elementType": "labels.text.fill",
                   "stylers": [
                               { "visibility": "on" },
                               {"color": "#000055"}
                               ]
                   },{
                   "featureType": "landscape.man_made",
                   // Stadtland
                   "elementType": "all",
                   "stylers": [
                               { "visibility": "on" },
                               //{"color": "#f5f0f1"},
                               {"color": "#d8ded8"},
                               {"lightness": -5}
                               ]
                   },{
                   "featureType": "road.local",
                   // Normale Strassen
                   "elementType": "geometry.fill",
                   "stylers": [
                               { "visibility": "on" },
                               {"color": "#000000"},
                               {"lightness": 100}
                               ]
                   },{
                   "featureType": "road.arterial",
                   // Landstrassen
                   "elementType": "geometry.fill",
                   "stylers": [
                               { "visibility": "on" },
                               { "color": "#ffff80" },
                               { "lightness": 10 }
                               ]
                   },{
                   "featureType": "road",
                   // Strassennamen
                   "elementType": "labels.text.stroke",
                   "stylers": [
                               { "visibility": "off" }
                               //{"color": "#000055"}
                               ]
                   },{
                   "featureType": "road",
                   // Strassennamen
                   "elementType": "labels.text.fill",
                   "stylers": [
                               { "visibility": "on" },
                               {"color": "#aa2211"}
                               ]
                   },{
                   "featureType": "landscape.natural",
                   "elementType": "geometry",
                   "stylers": [
                               { "visibility": "on" },
                               { "gamma": 0.31 },
                               { "saturation": 23 },
                               { "lightness": -3 }
                               ]
                   },{
                   "featureType": "poi",
                   "elementType": "labels.icon",
                   "stylers": [
                               { "visibility": "off" }
                               ]
                   },{
                   "featureType": "poi",
                   "elementType": "labels.text.fill",
                   "stylers": [
                               { "visibility": "on" },
                               { "color": "#b68080" },
                               { "lightness": 2 }
                               ]
                   },{
                   "featureType": "transit.station",
                   "elementType": "labels.text",
                   "stylers": [
                               { "visibility": "off" }
                               ]
                   },{
                   "featureType": "transit.line",
                   "stylers": [
                               { "visibility": "on" },
                               {"color":"#505000"},
                               { "weight": 0.6 }
                               ]
                   },{
                   }
                   ]


function initialize() {
    if (typeof(google) == "undefined") return;
	//directionsService = new google.maps.DirectionsService();
    geocoder = new google.maps.Geocoder();
    var styledMap = new google.maps.StyledMapType(stylesArray,{name: "Styled Map"});
    
    directionsDisplay = new google.maps.DirectionsRenderer({suppressMarkers: true});
    var settings = {
    	zoom: 13,
    	maxZoom: 15,
    	center: homeLatLng,
    	mapTypeControl: false,
    	mapTypeControlOptions: {style: google.maps.MapTypeControlStyle.DROPDOWN_MENU},
    	navigationControl: false,
    	panControl:false,
    	streetViewControl:false,
    	zoomControl:false,
        //navigationControlOptions: {style: google.maps.NavigationControlStyle.SMALL},
    	mapTypeId: google.maps.MapTypeId.ROADMAP
    };
	
	var mapCanvas = document.getElementById("alarmmonitor");
    var map = new google.maps.Map(document.getElementById("map_canvas"), settings);
    directionsDisplay.setMap(map);
    gMap = map;
    map.mapTypes.set('map_style', styledMap);
    map.setMapTypeId('map_style');
    localMap = map;
    map.addListener('tilesloaded', mapLoaded());
}



function calcRoute(end) {
    if (typeof(google) == "undefined") return;
	
    var request = {
    	origin:homeLatLng,
    	destination:end,
    	travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    var icons = {
    	start: new google.maps.MarkerImage(
                                       // URL
                                       '/modules/MMM-AlarmMonitor/Home.png',
                                       // (width,height)
                                       new google.maps.Size( 40, 40 ),
                                       // The origin point (x,y)
                                       new google.maps.Point( 0, 0 ),
                                       // The anchor point (x,y)
                                       new google.maps.Point( 20, 20 )
                                       ),
    	end: new google.maps.MarkerImage(
                                     // URL
                                     '/modules/MMM-AlarmMonitor/eo1.png',
                                     // (width,height)
                                     new google.maps.Size( 33, 50 ),
                                     // The origin point (x,y)
                                     new google.maps.Point( 0, 0 ),
                                     // The anchor point (x,y)
                                     new google.maps.Point( 16, 50 )
                                     )
    };
    
    
    directionsService.route(request, function(response, status) {
    	if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            var leg = response.routes[ 0 ].legs[ 0 ];
                            makeMarker( leg.start_location, icons.start, "title" );
                            makeMarker( leg.end_location, icons.end, "title" );
                            document.getElementById("adressMap-value").innerHTML = "Route: <strong>"+end+"</strong>";
    	}else{
                            var errorAdress = "<i>Route konnte nicht berechent werden!</i> (<strong>"+end+"</strong>)";
                            document.getElementById("adressMap-value").innerHTML = errorAdress;
        }
	});
}

function calcRouteGPS(end) {
    if (typeof(google) == "undefined") return;
    
    var request = {
    origin:homeLatLng,
    destination:end,
    travelMode: google.maps.DirectionsTravelMode.DRIVING
    };
    
    var icons = {
    start: new google.maps.MarkerImage(
                                       // URL
                                       '/modules/MMM-AlarmMonitor/Home.png',
                                       // (width,height)
                                       new google.maps.Size( 40, 40 ),
                                       // The origin point (x,y)
                                       new google.maps.Point( 0, 0 ),
                                       // The anchor point (x,y)
                                       new google.maps.Point( 20, 20 )
                                       ),
    end: new google.maps.MarkerImage(
                                     // URL
                                     '/modules/MMM-AlarmMonitor/eo1.png',
                                     // (width,height)
                                     new google.maps.Size( 33, 50 ),
                                     // The origin point (x,y)
                                     new google.maps.Point( 0, 0 ),
                                     // The anchor point (x,y)
                                     new google.maps.Point( 16, 50 )
                                     )
    };
    
    
    directionsService.route(request, function(response, status) {
                            if (status == google.maps.DirectionsStatus.OK) {
                            directionsDisplay.setDirections(response);
                            var leg = response.routes[ 0 ].legs[ 0 ];
                            makeMarker( leg.start_location, icons.start, "title" );
                            makeMarker( leg.end_location, icons.end, 'title' );
                            document.getElementById("adressMap-value").innerHTML = "Karte (GPS): <strong>"+end+"</strong>";
                            }else{
                            var errorAdress = "<i>Route konnte nicht berechent werden!</i> (<strong>"+end+"</strong>)";
                            document.getElementById("adressMap-value").innerHTML = errorAdress;
                            }
                            });
}

function makeMarker( position, icon, title, map ) {
    var marker = new google.maps.Marker({
                                        position: position,
                                        map: localMap,
                                        icon: icon,
                                        title: title
                                        });
    marker.setOpacity(0.8);
}

function gotoCity(address){
    if (typeof(google) == "undefined") return;
    geocoder.geocode( { 'address': address}, function(results, status) {
                     if (status == google.maps.GeocoderStatus.OK) {
                     localMap.setCenter(results[0].geometry.location);
                     //var marker = new google.maps.Marker({
                     //	map: localMap,
                     //	position: results[0].geometry.location
                     //});
                     document.getElementById("adressMap-value").innerHTML = results[0].formatted_address;
                     } else {
                     var errorAdress = "<i>Adresse unbekannt: <strong>"+address+"</strong> ("+ status+")</i>";
                     document.getElementById("adressMap-value").innerHTML = errorAdress;
                     }
                     });
}


function mapLoaded(){
}

function send(msg) {
	document.title = "null";
	document.title = msg;
}
function unload() {
	send('"document-unload"')
}




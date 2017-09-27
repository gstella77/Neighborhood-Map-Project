// Move location objects out of initMap to separate concerns
// pass data parameter into MapLocation constructor

/*******************
MODEL
********************/
// gray look & feel map style from:
// https://bootstrapious.com/p/google-maps-and-bootstrap-tutorial
var mapStyle = [
   {
      "featureType":"landscape",
      "stylers":[
         {
            "saturation":-50
         },
         {
            "lightness":65
         },
         {
            "visibility":"on"
         }
      ]
   },
   {
      "featureType":"poi",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "lightness":51
         },
         {
            "visibility":"simplified"
         }
      ]
   },
   {
      "featureType":"road.highway",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "visibility":"simplified"
         }
      ]
   },
   {
      "featureType":"road.arterial",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "lightness":30
         },
         {
            "visibility":"on"
         }
      ]
   },
   {
      "featureType":"road.local",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "lightness":40
         },
         {
            "visibility":"on"
         }
      ]
   },
   {
      "featureType":"transit",
      "stylers":[
         {
            "saturation":-100
         },
         {
            "visibility":"simplified"
         }
      ]
   },
   {
      "featureType":"administrative.province",
      "stylers":[
         {
            "visibility":"off"
         }
      ]
   },
   {
      "featureType":"water",
      "elementType":"labels",
      "stylers":[
         {
            "visibility":"on"
         },
         {
            "lightness":-25
         },
         {
            "saturation":-100
         }
      ]
   },
   {
      "featureType":"water",
      "elementType":"geometry",
      "stylers":[
         {
            "hue":"#ffff00"
         },
         {
            "lightness":-25
         },
         {
            "saturation":-97
         }
      ]
   }
];

var locations = [
   {
      "title":"Bardenay",
      "lat":43.614042,
      "lng":-116.202191
   },
   {
      "title":"Basque Block",
      "lat":43.613946,
      "lng":-116.20246
   },
   {
      "title":"Gernika Bar",
      "lat":43.614072,
      "lng":-116.202967
   },
   {
      "title":"Basque Museum",
      "lat":43.61382,
      "lng":-116.202681
   },
   {
      "title":"Porton",
      "lat":43.613702,
      "lng":-116.202606
   },
   {
      "title":"Boarding House",
      "lat":43.613655,
      "lng":-116.202442
   },
   {
      "title":"Basque Center",
      "lat":43.613543,
      "lng":-116.202293
   },
   {
      "title":"Basque Market",
      "lat":43.61399226820122,
      "lng":-116.20219760167676
   },
   {
      "title":"Leku Ona Restaurant",
      "lat":43.614004,
      "lng":-116.201861
   }
];


var map;  // set map to global scope

// https://discussions.udacity.com/t/closing-infowindow-when-i-open-another-one/288608
var infowindow; // set infowindow to global to close it after another one is open


/**
  * @desc Locations constructor function
  * @param data
  * @return
  * execute one full bounce. Helpful thread:
  * https://discussions.udacity.com/t/separation-of-concerns-and-making-markers-bounce-when-clicking-list/207722/4
*/
var MapLocation = function(data) {
    var self = this;

    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;

    // pull from Foursquare API
    self.formattedPhone = ko.observable();

    //using Foursquare API
    this.fourSquare = 'https://api.foursquare.com/v2/venues/search?v=20161016&ll=' + data.lat + ',' + data.lng + '&client_id=IMFUSQ0B4RKBI0K4VZO1WI5MWEDUZCNK4Z0YX4XMADNY3Z4V&client_secret=1ZWXGTWBWEANPOEKNN2LJAUVZIWX2GGRJXFYEPRCPF1PAPEO';

    //AJAX request
    $.getJSON(this.fourSquare, function (data) {

        var results = data.response.venues[0];

        self.formattedPhone(results.contact.formattedPhone);

    }).done(function(result) {
        console.log(result);
    }).fail(function(e) {
        //$nytHeaderElem.text("NY Times articles could not be loaded");
        console.log(e);
    });

    // create a new marker and make data locations and title properties of the marker
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        icon: 'img/basque_pin.png',
        animation: google.maps.Animation.DROP,
    });

    this.marker.setMap(map);

    // Click handler - animate and set infowindow content to update the data
    this.marker.addListener('click', function(){
        self.animateMarker();
        var contentString =
        '<h3 style="color:green;padding-top:10px">' + data.title + '</h3>'+
        '<h3 style="color:green;padding-top:10px">' + self.formattedPhone() + '</h3>'
        '<div id="bodyContent">'+
        '<p> placeholder content for each marker</p>';
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });

    // animate marker and use setTimeout to run one full bounce
    this.animateMarker = function(marker) {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(marker){
            self.marker.setAnimation(null);
        }, 700);
    }
}

/************************************
ViewModel
************************************/

var ViewModel = function() {
    var self = this;

    this.mapList = ko.observableArray([]);

    // iterate on each location and push MapLocation instance into mapList array
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        placeItem.marker = this.marker;
    });

    // make observable filter and compute value in the ko.computed function
    this.filter = ko.observable("");

    // use utils.arrayFilter in a boolean to toggle the markers visibility
    // indexOf method check if string is found in the filter
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        return ko.utils.arrayFilter(self.mapList(), function(listItem) {
            var exist = listItem.title.toLowerCase().indexOf(filter) !== -1;
            infowindow.close();

            if (listItem.marker) {
                //console.log("visible = " + exist);
                listItem.marker.setVisible(exist);
                return exist;
            }
        });
    }, self);

    // write the value to the console, when the observable filter value changes
    self.writeToConsole = ko.computed(function() {
        console.log(self.filter());
    });

    // store current location into an observable
    this.currentMap = ko.observable(this.mapList());

    // Used the click binding to set current marker location when clicked on the list.
    // event trigger function passes event from marker on map to the list
    // http://jsfiddle.net/upsidown/8gjt0y6p/
    this.getMarker = function(clickedMarker) {
        self.currentMap(clickedMarker);
        google.maps.event.trigger(this.marker,'click');
        //console.log("item list clicked = " + self.currentMap().marker.title);
    };
}

/**************************
Initialize Map

/**
* @desc create map instance and activate KnockoutJS after map has been initialized
* disable controls for better map block visibility
* https://www.w3schools.com/graphics/google_maps_controls.asp
*/

var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.614019, lng: -116.201861},
    zoom: 18,
    //styles: mapStyle,
    panControl: false,
    zoomControl: false,
    mapTypeControl: false,
    scaleControl: false,
    streetViewControl: false,
    overviewMapControl: false,
    rotateControl: false,
    mapTypeId: google.maps.MapTypeId.ROADMAP
    });

    // create new infowindow
    infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        maxHeight: 150
    });

    var bounds = new google.maps.LatLngBounds();

    // Extend the boundaries of the map for each location and display the marker
    for (var i = 0; i < locations.length; i++) {
        bounds.extend(locations[i]);
    }
    // Tell the map to fit all markers inside map
    map.fitBounds(bounds);

    ko.applyBindings(new ViewModel());
}


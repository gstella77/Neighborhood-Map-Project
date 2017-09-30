/**
MODEL
* Move locations object out of initMap to separate concerns.
*/
var locations = {
    "apiFail": "",
    "mapFail": "",
    "location": [
        {
            "venue":"4b49617ff964a520c96e26e3",
            "title":"Bardenay",
            "lat":43.614042,
            "lng":-116.202191
        },
        {
            "venue":"4c4f9353885c1b8d3412cb37",
            "title":"Basque Block",
            "lat":43.613946,
            "lng":-116.20246
        },
        {
            "venue":"4b3c1be5f964a520e58125e3",
            "title":"Gernika Bar",
            "lat":43.614072,
            "lng":-116.202967
        },
        {
            "venue":"4b509b49f964a520342927e3",
            "title":"Basque Museum",
            "lat":43.61382,
            "lng":-116.202681
        },
        {
            "venue":"4b50d83af964a520ed3427e3",
            "title":"Basque Center",
            "lat":43.613543,
            "lng":-116.202293
        },
        {
            "venue":"4b801bb6f964a520f45230e3",
            "title":"Basque Market",
            "lat":43.61399226820122,
            "lng":-116.20219760167676
        },
        {
            "venue":"4b96b866f964a52033e034e3",
            "title":"Leku Ona Restaurant",
            "lat":43.614004,
            "lng":-116.201861
        },
        {
            "venue":"4b50bfe6f964a520b83027e3",
            "title":"Front Door",
            "lat":43.614338,
            "lng":-116.201582
        },
        {
            "venue":"4bf981205317a5939164017f",
            "title":"Tom Grainey's Sports Bar",
            "lat":43.614186,
            "lng":-116.201609
        }
    ]
};

var map; // set map to global scope

// https://discussions.udacity.com/t/closing-infowindow-when-i-open-another-one/288608
// set infowindow to global to reuse the same infowindow object for each marker
var infowindow;

/**
* CLASS CONSTRUCTOR
* @desc Use 'data' parameter to pass locations objects and created markers and animation
* properties of a Maplocation/marker item. Used Foursquare API and searched venue id instead of
* lat-lng for more reliable results.
*/
var MapLocation = function(data) {
    var self = this;

    this.title = data.title;
    this.venue = data.venue;
    this.lat = data.lat;
    this.lng = data.lng;

    // ko observed data from Foursquare API
    self.formattedPhone = ko.observable();
    self.name = ko.observable();
    self.formatAddress = ko.observable();
    self.url = ko.observable();

    // Foursquare API call
    // https://discussions.udacity.com/t/how-do-i-use-foursquare-api/210274/22
    this.fourSquare = 'https://api.foursquare.com/v2/venues/' + data.venue + '?client_id=IMFUSQ0B4RKBI0K4VZO1WI5MWEDUZCNK4Z0YX4XMADNY3Z4V&client_secret=1ZWXGTWBWEANPOEKNN2LJAUVZIWX2GGRJXFYEPRCPF1PAPEO&v=20161016';

    // ko computed function to handle API call fail
    this.errorHandling = ko.computed(function(){
        return self.formattedPhone("Foursquare content not available") +
            self.name("") +
            self.formatAddress("") +
            self.url("");
    });

    //this.apiFail = ko.observable();

    // Perform Foursquare Ajax request
    $.getJSON(this.fourSquare, function (data) {

        this.results = data.response.venue;

    }).done(function(result) {
        self.formattedPhone(this.results.contact.formattedPhone);
        self.name(this.results.name);
        self.formatAddress(this.results.location.formattedAddress.join(', '));
        self.url(this.results.url);

        // handling "undefined" results with typeof
        if (typeof self.formattedPhone() === 'undefined') {
            self.formattedPhone("Phone not available");
        } else if (typeof self.url() === 'undefined') {
            self.url(" ");
        }
        console.log(result);
    }).fail(function(e) {
        self.errorHandling();
        console.log(e);
    });

    // Create a new marker and make data locations and name properties of the marker
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        icon: 'img/basque_pin.png',
        animation: google.maps.Animation.DROP,
        id: data.venue,
    });

    this.marker.setMap(map);

    // Click handler - animate and set infowindow content to update the data
    this.marker.addListener('click', function(){
        self.animateMarker();
        this.contentString =
            '<h2 style="color:black">' + self.name() + '</h2>'+
            '<h4 style="color:#5a5b5b">' + self.formattedPhone() + '</h4>' +
            '<p style="color:black">' + self.formatAddress() + '</p>' +
            '<a href="'+ self.url() +'"target="_blank">' + self.url() + '</a>' +
            '<div id="bodyContent">';
        infowindow.setContent(this.contentString);
        infowindow.open(map, this);
    });

    // animate marker and use setTimeout to run only one full bounce
    // https://discussions.udacity.com/t/separation-of-concerns-and-making-markers-bounce-when-clicking-list/207722/4
    this.animateMarker = function(marker) {
        this.marker.setAnimation(google.maps.Animation.BOUNCE);
        setTimeout(function(marker){
            self.marker.setAnimation(null);
        }, 700);
    };
};

/**
* VIEW MODEL
* @desc Initialize locations array object into mapList array and use Ko utilities
* to filter markers and indexOf method to check string condition. 'getMarker' function
* sets current marker/item and identifies clicked list item with 'click bind' 'in the view.
*/

var ViewModel = function() {
    var self = this;

    this.mapList = ko.observableArray([]);

    // iterate on each location and push item into mapList array
    locations.location.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        placeItem.marker = this.marker;
    });

    this.filter = ko.observable("");

    // use utils.arrayFilter in a boolean to toggle the markers visibility
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        return ko.utils.arrayFilter(self.mapList(), function(listItem) {
            var exist = listItem.title.toLowerCase().indexOf(filter) !== -1;
            infowindow.close();

            if (listItem.marker) {
                listItem.marker.setVisible(exist);
                return exist;
            }
        });
    }, self);

    // store current location into an ko observable
    this.currentMap = ko.observable(this.mapList());

    // event trigger function: http://jsfiddle.net/upsidown/8gjt0y6p/
    this.getMarker = function(clickedMarker) {
        self.currentMap(clickedMarker);
        google.maps.event.trigger(this.marker,'click');
        //console.log("item list clicked = " + self.currentMap().marker.title);
    };
};

/**
* INITIALIZE MAP APIs
* @desc create map instance and activate KnockoutJS after map has been initialized
*/
var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
            lat: 43.614019,
            lng: -116.201861
        },
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
    for (var i = 0; i < locations.location.length; i++) {
        bounds.extend(locations.location[i]);
    }
    // Fit all markers inside map
    map.fitBounds(bounds);

    ko.applyBindings(new ViewModel());
};

// Google map fallback function
//https://discussions.udacity.com/t/handling-google-maps-in-async-and-fallback/34282
function googleError() {
    alert("Google Map fail to load. Check your Internet connection or try again");
}
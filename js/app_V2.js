// Move location objects out of initMap to simplyfy and
// pass it as data parameter into MapLocation constructor
// made lat and lng more accessible

var locations = [
    {title: 'The Basque Block',
        lat: 43.613946,
        lng: -116.20246
    },
    {title: 'Gernika Bar',

        lat: 43.614072,
        lng: -116.202967
    },
    {title: 'The Basque Museum',

        lat: 43.61382,
        lng: -116.202681
    },
    {title: 'The Porton',

        lat: 43.613702,
        lng: -116.202606

    },
    {title: 'The Boarding House',

        lat: 43.613655,
        lng: -116.202442

    },
    {title: 'The Basque Center',

        lat: 43.613543,
        lng: -116.202293

    },
    {title: 'The Basque Market',

        lat:  43.614019,
        lng: -116.202074

    },
    {title: 'Leku ona Restaurant',

        lat: 43.614004,
        lng: -116.201861

    }
];

// Create a map variable
var map;

function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.614019, lng: -116.201861},
        zoom: 18,
        mapTypeControl: false

    });

       ko.applyBindings(new ViewModel());
}


// Create a new blank array for all the listing markers.
//var markers = [];

// function to initialize the map
// use constructor to create a new map JS object.
/*function initMap() {

    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.614019, lng: -116.201861},
        zoom: 18,
        mapTypeControl: false

    });

    // use new constructor to create the InfoWindow
    //var largeInfowindow = new google.maps.InfoWindow();
    /*var bounds = new google.maps.LatLngBounds();

    //loop through the var locations we created in order to create one marker per location
    for (var i = 0; i < locations.length; i++) {
        // Get the position for the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // create a marker per location and put markers into marker array
        var marker = new google.maps.Marker({
          // disable map below if markers only display with showList click
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          //id: i
        });

        // Add marker as a property of each location
        locations[i].marker = marker;

        // Push markers into markers array
        markers.push(marker);

        if (markers[i]) {
            bounds.extend(markers[i].position);
            //marker.setVisible(true);
        }
    map.fitBounds(bounds);
    }


    ko.applyBindings(new ViewModel());
}*/

/********************
Implemeting Ko
********************/

// Class constructor for the locations object
var MapLocation = function(data) {
    var self = this;
    self.title = ko.observable(data.title);
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);

    var bounds = new google.maps.LatLngBounds();

    // markers array no needed - MapLocation will be pushed in the ViewModel into mapList
    //var markers = [];

    // don't need to iterate since the ViewModel will use forEach and push a new MapLocation
    // which iterate a single location with a linked marker
    // loop through the var locations we created in order to create one marker per location
    /*for (var i = 0; i < locations.length; i++) {
            // Get the position for the location array
            var position = locations[i].location;
            var title = locations[i].title;*/
    //}

    // create a new marker and bind position and title properties
    // with observed locations above
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(self.lat(), self.lng()),
        title: self.title(),
        animation: google.maps.Animation.DROP,
    });

    //
    //markers.push(this.marker);

    //self.locations[i].marker = marker;
}



// ViewModel and holds initial screen
var ViewModel = function() {
    var self = this;

    this.mapList = ko.observableArray([]);

    //observed locations object array
    //this.mapList = ko.observableArray(locations);

    // iterate on each location and create new MapLocation
    // with observed title and position data
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        //console.log(mapList() + 'loaded items');
    });

    // observe filter variable to determine its value in the ko.computed function below
    this.filter = ko.observable("");

    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        /* Created a conditional to toggle the markers visibility */
        // Return a self invoked function with a boolean to check if
        // the list and markers are not being filtered
        // indexOf method will return -1 if no item/text is found in the filter.
        // then it will return either true or false and pass it into the var "exist".

        return ko.utils.arrayFilter(self.mapList(), function(listItem) {
            var exist = listItem.title().toLowerCase().indexOf(filter) !== -1;
            if (listItem.marker) {
                console.log("visible = " + exist);

                listItem.marker.setVisible(exist);
            }
            return exist;
        });
    }, self);

    // write the value to the console, when the observable filter value changes
    self.writeToConsole = ko.computed(function() {
        console.log(self.filter());
    });

    // store current location into a new observable variable
    this.currentMap = ko.observable(this.mapList());

    // Click on current marker on the list and animate pin
    this.getMarker = function(clickedMarker) {
        self.currentMap(clickedMarker);
        if(self.currentMap().marker) {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
            //this.marker.setVisible(false);
            console.log("marker clicked = " + self.currentMap().marker.title);
        };

        setTimeout(function(){
            self.currentMap().marker.setAnimation(null);
        }, 700);
    };

    /******************
    start info window
    ******************/

    //self.locationWindow = new google.maps.InfoWindow();

    /*self.windowList = ko.observableArray([]);

    locations.forEach(function(windowItem){
        self.windowList.push( new LocationWindow(windowItem));
        console.log(windowList + 'loaded items');
    });
*/
    // Activate marker info window
    /*this.markerInfo = function(markerInfo) {
        self.currentMap(markerInfo);
    };*/


};


//ko.applyBindings(new ViewModel());



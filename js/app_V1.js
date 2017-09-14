// These are the real estate listings that will be shown to the user.
// Normally we'd have these in a database instead.

// Ko test area

var locations = [
    {title: 'Bardenay Restaurant',
     location: {
        lat: 43.614042,
        lng: -116.202191
    }
    },
    {title: 'Gernika', location: {lat: 43.614072, lng: -116.202967}},
    {title: 'Goldys Corner', location: {lat: 43.614682, lng: -116.202464 }},
    {title: 'Reef', location: {lat: 43.614307, lng: -116.201695}},
    {title: 'The Basque Market', location: {lat:  43.614019, lng: -116.202074}},
    {title: 'Leku ona', location: {lat: 43.614004, lng: -116.201861}}
];

// Create a map variable
 var map;

// Create a new blank array for all the listing markers.
var markers = [];

//var marker

// function to initialize the map
// use constructor to create a new map JS object.
// Make it an annonymous function expression? - so it is not hoisted or moved it to the top
// will self-invoked perform better?
var initMap = function() {
    // USE Basque museum as the center
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
        lat: 43.61382,
        lng: -116.202681
        },
        zoom: 18,
        mapTypeControl: false
    });

    // use new constructor to create the InfoWindow
    var largeInfowindow = new google.maps.InfoWindow();

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

        // Push markers into markers array
        markers.push(marker);

        // Test marker visibility

        markerPin = markers[i];


        // Create an onclick event to open infowindow on each marker

        // bind this with knockout click
        //use the list to bind the click
        marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
        });

        markerPin.setVisible(false);
    }
// test fix "not a function" error about loading map
// google.maps.event.addDomListener(window, 'load', initMap);

    //create showListings/hideListings function to display/hide markers
    /*document.getElementById('show-listings').addEventListener('click', showListings);
    document.getElementById('hide-listings').addEventListener('click', hideListings);
    */
}


// This function populates the infowindow when the marker is clicked. We'll only allow
// one infowindow which will open at the marker that is clicked, and populate based
// on that markers position.


function populateInfoWindow(marker, infowindow) {
  // Check to make sure the infowindow is not already opened on this marker.
    if (infowindow.marker != marker) {
        infowindow.marker = marker;
        infowindow.setContent('<div>' + marker.title + '</div>');
        infowindow.open(map, marker);
        infowindow.marker.setAnimation(google.maps.Animation.BOUNCE);

        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.Marker = null;
        });
    }

    setTimeout(function(){
        infowindow.marker.setAnimation(null);
    }, 700);
}



// This function will loop through the markers array and display them all.
/*
function showListings() {

    // adjust boundaries and contain listings inside the initial zoom area
    var bounds = new google.maps.LatLngBounds();

    // Extend the boundaries of the map for each marker and display the marker
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(map);
        bounds.extend(markers[i].position);
    }
    // Tell the map to fit all markers inside map
    map.fitBounds(bounds);
}

// This function will loop through the listings and hide them all.
function hideListings() {
    for (var i = 0; i < markers.length; i++) {
        markers[i].setMap(null);
    }
}
*/

/*
********************
Implemeting Ko
********************
*/

// object constructor that shares data characteristics
var MapLocation = function(data) {
    this.title = ko.observable(data.title);
    //this.marker = ko.observable(data.marker);

    //this.markerPin = ko.observable(data.marker);

}


// mapLogic now lives in currentMap variable
// use self to map to the view model
var ViewModel = function() {

    var self = this;

    this.mapList = ko.observableArray([]);

    //other way to watch for array
    //this.mapList = ko.observableArray(locations);

    // Loop over locations list
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        console.log('loaded items');
    });


    this.filter = ko.observable("");

    // OH BOY FILTER WORKS NOW!
    // Need to acess mapList.title() as a function
    // article reference for filter: http://www.knockmeout.net/2011/04/utility-functions-in-knockoutjs.html
    // method "stringStartsWith" to filter was removed - work around use var exist and return value
    // make marker a property of location then compute it below
    // use if statement to check if marker exist before returning locations
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        if (!filter) {
        /*for (var i=0; i < self.mapList.length; i++) {
            if (self.mapList()[i].marker) {
                //return console.log(self.mapList()[i].marker);
                 self.mapList()[i].marker.setVisible(false);
            }
        }*/

            return self.mapList();

        } else {
            return ko.utils.arrayFilter(self.mapList(), function(mapList) {
                var exist = mapList.title().toLowerCase().indexOf(filter) !== -1;
                //mapList.marker().setVisible(exist);
                return exist;
            });
        }
    }, self);


    // store current location into a new observable variable
    this.currentMap = ko.observable( this.mapList() );

    //bind marker data
    this.getMarker = function(clickedMarker) {
        //self.currentMap(clickedMarker);
        console.log('marker?');
    };
};

ko.applyBindings(new ViewModel());



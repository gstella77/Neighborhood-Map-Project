// Move location objects out of initMap to simplyfy and
// pass it as data parameter into MapLocation constructor
// Add marker as a property of each location

var locations = [
    {title: 'Bardenay Restaurant',
    location: {
        lat: 43.614042,
        lng: -116.202191
        },
    marker: {}
    },
    {title: 'Gernika',
    location: {
        lat: 43.614072,
        lng: -116.202967
        },
    marker: {}
    },
    {title: 'Goldys Corner',
        location: {
        lat: 43.614682,
        lng: -116.202464
        },
    marker: {}
    },
    {title: 'Reef',
    location: {
        lat: 43.614307,
        lng: -116.201695
        },
    marker: {}
    },
    {title: 'The Basque Market',
    location: {
        lat:  43.614019,
        lng: -116.202074
        },
    marker: {}
    },
    {title: 'Leku ona',
    location: {
        lat: 43.614004,
        lng: -116.201861
        },
    marker: {}
    }
];

// Create a map variable
var map;

// Create a new blank array for all the listing markers.
var markers = [];

//var marker

// function to initialize the map
// use constructor to create a new map JS object.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.61382, lng: -116.202681},
        zoom: 18,
        mapTypeControl: false
    });

    // use new constructor to create the InfoWindow
    var largeInfowindow = new google.maps.InfoWindow();
    var bounds = new google.maps.LatLngBounds();

    //loop through the var locations we created in order to create one marker per location
    for (var i = 0; i < locations.length; i++) {
        // Get the position for the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // create a marker per location and put markers into marker array
        locations.marker = new google.maps.Marker({
          // disable map below if markers only display with showList click
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          //id: i
        });

        // Push markers into markers array
        markers.push(locations.marker);

        if (markers[i]) {
            bounds.extend(markers[i].position);
            locations.marker.setVisible(true);
        }
    map.fitBounds(bounds);
    }

}


/********************
Implemeting Ko
********************/

// pass the object literal locations as "data" into a constructor function
var MapLocation = function(data) {
    this.title = ko.observable(data.title);
}

// use self to map to the view model
var ViewModel = function() {
    var self = this;
    this.mapList = ko.observableArray([]);

    //other way to observe array
    //this.mapList = ko.observableArray(locations);

    // Loop over locations list
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        console.log('loaded items');
    });

    this.filter = ko.observable("");
    // use if statement to check if marker exist before returning locations
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        if (!filter) {
            return self.mapList();

        } else {
            return ko.utils.arrayFilter(self.mapList(), function(mapList) {
                var exist = mapList.title().toLowerCase().indexOf(filter) !== -1;
                return exist;
            });
        }
        // write the value to the console, when the observables value changes
        console.log(self.filter());
    }, self);

    // store current location into a new observable variable
    //this.currentMap = ko.observable( this.mapList() );
};

ko.applyBindings(new ViewModel());



// Move location objects out of initMap to simplyfy and
// pass it as data parameter into MapLocation constructor

var locations = [
    {title: 'The Basque Block',
    location: {
        lat: 43.613946,
        lng: -116.20246
        }
    },
    {title: 'Gernika Bar',
    location: {
        lat: 43.614072,
        lng: -116.202967
        }
    },
    {title: 'The Basque Museum',
        location: {
        lat: 43.61382,
        lng: -116.202681
        }
    },
    {title: 'The Porton',
        location: {
        lat: 43.613702,
        lng: -116.202606
        }
    },
    {title: 'The Boarding House',
        location: {
        lat: 43.613655,
        lng: -116.202442
        }
    },
    {title: 'The Basque Center',
    location: {
        lat: 43.613543,
        lng: -116.202293
        }
    },
    {title: 'The Basque Market',
    location: {
        lat:  43.614019,
        lng: -116.202074
        }
    },
    {title: 'Leku ona Restaurant',
    location: {
        lat: 43.614004,
        lng: -116.201861
        }
    }
];

// Create a map variable
var map;

// Create a new blank array for all the listing markers.
var markers = [];

// function to initialize the map
// use constructor to create a new map JS object.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {lat: 43.614019, lng: -116.201861},
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
        var marker = new google.maps.Marker({
          // disable map below if markers only display with showList click
          map: map,
          position: position,
          //title: title,
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
    //this.mapList = ko.observableArray([]);

    //observe locations object array
    this.mapList = ko.observableArray(locations);

    // Loop over locations list
    /*locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        console.log('loaded items');
    });*/

    // observe filter variable to determine its value in the ko.computed function below
    this.filter = ko.observable("");

    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        /* Created a conditional to toggle the markers visibility */
        // Return a self invoked function with a boolean to check if
        // the list and markers are not being filtered
        // indexOf method checks if there are strings using the filter parameter,
        // then it will return either true or false and pass it into the var "exist".

        return ko.utils.arrayFilter(self.mapList(), function(listItem) {

            // read if current filter's value is not empty
            var exist = listItem.title.toLowerCase().indexOf(filter) !== -1;
            if (listItem.marker) {
                console.log(self.mapList().marker + " strings");
                listItem.marker.setVisible(exist);
            }
            return exist;
        });
        // write the value to the console, when the observables value changes
    }, self);

    // store current location into a new observable variable
    //this.currentMap = ko.observable( this.mapList() );
};

ko.applyBindings(new ViewModel());



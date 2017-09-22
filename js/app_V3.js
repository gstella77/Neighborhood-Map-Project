// Move location objects out of initMap to simplyfy and
// pass it as data parameter into MapLocation constructor
// made lat and lng objects more accessible

/*******************
MODEL
********************/

var locations = [
    {title: 'Basque Block',
        lat: 43.613946,
        lng: -116.20246
    },
    {title: 'Gernika Bar',
        lat: 43.614072,
        lng: -116.202967
    },
    {title: 'Basque Museum',
        lat: 43.61382,
        lng: -116.202681
    },
    {title: 'Porton',
        lat: 43.613702,
        lng: -116.202606

    },
    {title: 'Boarding House',
        lat: 43.613655,
        lng: -116.202442

    },
    {title: 'Basque Center',
        lat: 43.613543,
        lng: -116.202293

    },
    {title: 'Basque Market',
        lat:  43.614019,
        lng: -116.202074

    },
    {title: 'Leku ona Restaurant',
        lat: 43.614004,
        lng: -116.201861
    }
];

var map;

// make infoWindow global so it closes when another marker is selected
// https://discussions.udacity.com/t/closing-infowindow-when-i-open-another-one/288608
var infowindow;


/*****************************
View Constructor
******************************/

/* Class constructor to generate the list and visual map elements. This class will be needed
by the ViewModel to iterate for each location, marker, and infowindow */
/* Per forum title and static locations should not be are observable
https://discussions.udacity.com/t/separation-of-concerns-and-making-markers-bounce-when-clicking-list/207722/4 */
var MapLocation = function(data) {
    // Data
    var self = this;

    this.title = data.title;
    this.lat = data.lat;
    this.lng = data.lng;

    // create a new marker and bind position and title properties
    // with locations above

    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        animation: google.maps.Animation.DROP,
    });

    this.marker.setMap(map);

    // Click on marker behavior uses Google API and not KO VMVM
    // Animate and open infowindow
    this.marker.addListener('click', function(){
        self.animateMarker();
        var contentString = '<h3>' + data.title + '</h3>'+'<div id="bodyContent">'+'<p> placeholder</p>';
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });

    // This function executes only one bounce to prevent animation not
    // stoping with fast user clicks
    this.animateMarker = function(marker) {
        if(this.marker != marker) {
            this.marker.setAnimation(google.maps.Animation.BOUNCE);
            setTimeout(function(marker){
                self.marker.setAnimation(null);
            }, 700);
        }
    };
}

/************************************
ViewModel
************************************/

var ViewModel = function() {
    var self = this;

    this.mapList = ko.observableArray([]);

    // iterate on each location and push MapLocation into mapList array
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
    });

    // observe filter variable to determine its value in the ko.computed function below
    this.filter = ko.observable("");

    /* Return a  boolean condition to toggle the markers visibility with
    indexOf method to check if no text is found in the filter.*/
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();
        return ko.utils.arrayFilter(self.mapList(), function(listItem) {
            var exist = listItem.title.toLowerCase().indexOf(filter) !== -1;
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

    // store current location into an observable variable
    this.currentMap = ko.observable(this.mapList());

    // Uhrrra! searched google to fix google map click event -upsidown solution link:
    // http://jsfiddle.net/upsidown/8gjt0y6p/
    // Select item on the list, display current marker and animate pin
    this.getMarker = function(clickedMarker) {

        self.currentMap(clickedMarker);
        /* Re-read Ko documentation again and no need to check if marker exist
        ko MVVM will track position of current marker
        */
        // if(self.currentMap().marker) {
        //this.animateMarker();
        //Open info window
        google.maps.event.trigger(this.marker,'click');
        //infowindow.open(map, this.marker);
        //this.marker.setVisible(false);
        console.log("item list clicked = " + self.currentMap().marker.title);
        //}
    };
};

/**************************
Initialize Map
***************************/

var initMap = function() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.614019, lng: -116.201861},
    zoom: 18,
    mapTypeControl: false
    });

    infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        maxHeight: 150
    });

    ko.applyBindings(new ViewModel());
}

//ko.applyBindings(new ViewModel());



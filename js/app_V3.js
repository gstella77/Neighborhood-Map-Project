// Move location objects out of initMap to separate concerns
// pass data parameter into MapLocation constructor

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

// https://discussions.udacity.com/t/closing-infowindow-when-i-open-another-one/288608
var map,  // set map to globa scope
    infowindow; // set infowindow to global to close it after another one is open


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

    // create a new marker and bind position and title properties
    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(data.lat, data.lng),
        title: data.title,
        animation: google.maps.Animation.DROP,
    });

    this.marker.setMap(map);

    // Click handler - animate and set infowindow content to change the data
    this.marker.addListener('click', function(){
        self.animateMarker();
        var contentString = '<h3>' + data.title + '</h3>'+'<div id="bodyContent">'+'<p> placeholder content for each marker</p>';
        infowindow.setContent(contentString);
        infowindow.open(map, this);
    });

    // function animates marker and setTimeout to run one full bounce
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

    // iterate on each location and push MapLocation into mapList array
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        placeItem.marker = this.marker;
    });


    // observe filter var and compute value in the ko.computed function
    this.filter = ko.observable("");

    // use utils.arrayFilter in a boolean to toggle the markers visibility
    // indexOf method check if string in array is found in the filter
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

        return ko.utils.arrayFilter(self.mapList(), function(listItem) {
            var exist = listItem.title.toLowerCase().indexOf(filter) !== -1;
            infowindow.close();

            if (listItem.marker) {
                console.log("visible = " + exist);
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

    // http://jsfiddle.net/upsidown/8gjt0y6p/
    this.getMarker = function(clickedMarker) {
        self.currentMap(clickedMarker);
        google.maps.event.trigger(this.marker,'click');
        console.log("item list clicked = " + self.currentMap().marker.title);
    };
}

/**************************
Initialize Map

/**
* @desc create map instance and activate KnockoutJS after map has been initialized
*
 */

var initMap = function() {

    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.614019, lng: -116.201861},
    zoom: 18,
    mapTypeControl: false
    });

    // create new infowindow
    infowindow = new google.maps.InfoWindow({
        maxWidth: 300,
        maxHeight: 150
    });

    ko.applyBindings(new ViewModel());
}



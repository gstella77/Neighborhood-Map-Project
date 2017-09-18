// Move location objects out of initMap to simplyfy and
// pass it as data parameter into MapLocation constructor
// made lat and lng more accessible

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

/**************************
Initialize Map
***************************/

function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: 43.614019, lng: -116.201861},
    zoom: 18,
    mapTypeControl: false
    });

    this.infowindow = new google.maps.InfoWindow();

    ko.applyBindings(new ViewModel());
}

/*****************************
View Constructor
******************************/

/* Class constructor to generate the list and visual map elements. This class will be needed
by the ViewModel to iterate for each location, marker, and infowindow */
var MapLocation = function(data) {
    var self = this;
    self.title = ko.observable(data.title);
    self.lat = ko.observable(data.lat);
    self.lng = ko.observable(data.lng);

    // create a new marker and bind position and title properties
    // with observed locations above

    this.marker = new google.maps.Marker({
        map: map,
        position: new google.maps.LatLng(self.lat(), self.lng()),
        title: self.title(),
        animation: google.maps.Animation.DROP,
    });

    this.marker.addListener('click', function(){
        self.marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.open(map, this);

        setTimeout(function(){
            self.marker.setAnimation(null);
        }, 700);

    });


    // Used infowindow construction
    // Include third party API here
    this.contentString = '<h3>' + self.title() + '</h3>'+
        '<div id="bodyContent">'+
        '<p><b>Uluru</b>, also referred to as <b>Ayers Rock</b>, is a large sandstone rock formation in the southern part of the Northern Territory, central Australia. It lies 335&#160;km (208&#160;mi)</p>'+
        '<p>Attribution: Uluru, <a href="https://en.wikipedia.org/w/index.php?title=Uluru&oldid=297882194">'+
        'https://en.wikipedia.org/w/index.php?title=Uluru</a> '+
        '(last visited June 22, 2009).</p>'+
        '</div>'+
        '</div>';

    //this.openwindow = new google.maps.InfoWindow({
        //content: self.contentString
   // });
}

/************************************
ViewModel
************************************/

var ViewModel = function() {
    var self = this;

    this.mapList = ko.observableArray([]);

    // iterate on each location and push MapLocation into mapList array
    // what does it do?
    locations.forEach(function(placeItem){
        self.mapList.push( new MapLocation(placeItem));
        //console.log(mapList() + 'loaded items');
    });

    // observe filter variable to determine its value in the ko.computed function below
    this.filter = ko.observable("");

    /* Return a  boolean condition to toggle the markers visibility with
    indexOf method to check if no text is found in the filter.*/
    this.filteredItems = ko.computed(function() {
        var filter = self.filter().toLowerCase();

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
    this.getMarker = function(clickedMarker, marker, openwindow) {
        self.currentMap(clickedMarker);
        if(self.currentMap().marker) {

            this.marker.setAnimation(google.maps.Animation.BOUNCE);

            //Open info window
            infowindow.open(map, this.marker);

            //this.marker.setVisible(false);
            console.log("item list clicked = " + self.currentMap().marker.title);
        };

        setTimeout(function(){
            self.currentMap().marker.setAnimation(null);
        }, 700);

    };


};

//ko.applyBindings(new ViewModel());



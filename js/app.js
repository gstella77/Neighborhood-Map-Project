// Create a map variable
 var map;

// Create a new blank array for all the listing markers.
var markers = [];

// function to initialize the map
// use constructor to create a new map JS object.
function initMap() {
    // USE Basque museum as the center
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
        lat: 43.61382,
        lng: -116.202681
        },
        zoom: 12,
    });

    // These are the real estate listings that will be shown to the user.
    // Normally we'd have these in a database instead.
    var locations = [
        {title: 'Bardenay Restaurant', location: {lat: 43.614042, lng: -116.202191}},
        {title: 'Gernika', location: {lat: 43.614072, lng: -116.202967}},
        {title: 'Goldys Corner', location: {lat: 43.614682, lng: -116.202464 }},
        {title: 'Reef', location: {lat: 43.614307, lng: -116.201695}},
        {title: 'The Basque Market', location: {lat:  43.614019, lng: -116.202074}},
        {title: 'Leku ona', location: {lat: 43.614004, lng: -116.201861}}
    ];

    // use new constructor to create the InfoWindow
    var largeInfowindow = new google.maps.InfoWindow();

    // adjust boundaries and contain listings inside the initial zoom area
     var bounds = new google.maps.LatLngBounds();

    //loop through the var locations we created in order to create one marker per location
    for (var i = 0; i < locations.length; i++) {
        // Get the position for the location array
        var position = locations[i].location;
        var title = locations[i].title;
        // create a marker per location and put markers into marker array
        var marker = new google.maps.Marker({
          map: map,
          position: position,
          title: title,
          animation: google.maps.Animation.DROP,
          id: i
        });
        // Push markers into markers array
        markers.push(marker);
        // Create an onclick event to open infowindow on each marker
        marker.addListener('click', function(){
          populateInfoWindow(this, largeInfowindow);
        });
        // Extend boundaries to display all markers
        bounds.extend(markers[i].position);

    }
    // Tell the map to fit all markers inside map
    map.fitBounds(bounds);
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
        // Make sure the marker property is cleared if the infowindow is closed.
        infowindow.addListener('closeclick',function(){
          infowindow.setMarker = null;
        });
    }
}


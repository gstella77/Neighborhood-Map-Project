// Create a map variable
 var map;

// function to initialize the map
// use constructor to create a new map JS object.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
        lat: 43.614004,
        lng: -116.201861
        },
        zoom: 17,
    });
    var boiFork = {
        lat:  43.616304,
        lng: -116.203043
    };
    var marker = new google.maps.Marker({
          position: boiFork,
          map: map,
          title: 'First Marker!'
    });
    var infowindow = new google.maps.InfoWindow({
      content: 'My first Info Window' + ' cool'
    });
    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });
}
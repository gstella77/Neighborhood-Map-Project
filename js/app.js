// Create a map variable
 var map;

// function to initialize the map
// use constructor to create a new map JS object.
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: {
        lat: 43.65757,
        lng: -116.361133
        },
        zoom: 13,
    });
    var boiArt = {
        lat: 43.609765,
        lng: -116.206576
    };
    var marker = new google.maps.Marker({
          position: boiArt,
          map: map,
          title: 'First Marker!'
    });
}
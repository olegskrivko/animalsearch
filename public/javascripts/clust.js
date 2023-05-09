// Create a function to add markers to the map
function addMarkersToMap(markers) {
  markers.forEach((marker) => {
    // Create a new marker on the map
    const newMarker = new tt.Marker({
      color: "red",
    })
      .setLngLat([marker.lng, marker.lat])
      .addTo(map);

    // Add the marker to the markerClusterGroup
    markerClusterGroup.addLayer(newMarker);
  });
}

// Create a function to get the marker data from the server
async function getMarkersFromServer() {
  const response = await fetch("/markers");
  const data = await response.json();
  return data;
}

// Load the markers from the server and add them to the map
getMarkersFromServer()
  .then((markers) => {
    addMarkersToMap(markers);
  })
  .catch((error) => {
    console.log(error);
  });

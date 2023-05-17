var map = tt.map({
  key: TOMTOMTOKEN,
  container: "map",
  center: [24.105078, 56.946285],
  zoom: 6,
  // dragPan: !isMobileOrTablet()
});

// Set coordinates which cover the Baltic States and some surrounding areas
var southwest = new tt.LngLat(18.059, 52.129);
var northeast = new tt.LngLat(30.425, 61.259);
var bounds = new tt.LngLatBounds(southwest, northeast);

map.on("load", function () {
  map.setMaxBounds(bounds);
});

map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

var markersOnTheMap = {};
var eventListenersAdded = false;

//console.log(pets);
//console.log(selectedPolygonCoordinates.features);
map.on("load", function () {
  map.addLayer({
    id: "overlay",
    type: "fill",
    source: {
      type: "geojson",
      data: {
        type: "Feature",
        geometry: {
          type: "Polygon",
          coordinates: [selectedPolygonCoordinates.features],
        },
      },
    },
    layout: {},
    paint: {
      "fill-color": "#8A2BE2",
      "fill-opacity": 0.5,
      "fill-outline-color": "#4B0082",
    },
  });
});

var points = pets.features.map(function (point, index) {
  return {
    coordinates: [point.longitude, point.latitude],

    // properties: { id: index, name: `Point ${index}` },
    properties: {
      id: index,
      name: point.title,
      img: point.images[0].url,
      petId: point._id,
      lostDate: point.lostdate,
      species: point.species,
    },
  };
});

var geoJson = {
  type: "FeatureCollection",
  features: points.map(function (point) {
    return {
      type: "Feature",
      geometry: {
        type: "Point",
        coordinates: point.coordinates,
      },
      properties: point.properties,
    };
  }),
};

function refreshMarkers() {
  Object.keys(markersOnTheMap).forEach(function (id) {
    markersOnTheMap[id].remove();
    delete markersOnTheMap[id];
  });
  //https://api.tomtom.com/maps-sdk-for-web/cdn/static/accident.colors-white.png
  map.querySourceFeatures("point-source").forEach(function (feature) {
    if (feature.properties && !feature.properties.cluster) {
      var id = parseInt(feature.properties.id, 10);
      if (!markersOnTheMap[id]) {
        // // Create a custom icon
        // var markerIcon = new tt.Icon({
        //   iconUrl: "images/paw.png",
        //   iconSize: [50, 50], // size of the icon
        //   iconAnchor: [25, 50], // position of the icon relative to its anchor point
        // });
        // function createMarker(icon, position, color, popupText) {
        var markerElement = document.createElement("div");
        markerElement.className = "marker";

        var markerContentElement = document.createElement("div");
        markerContentElement.className = "marker-content";
        markerContentElement.style.backgroundColor = "#FF0000";
        markerElement.appendChild(markerContentElement);

        var iconElement = document.createElement("div");
        if (feature.properties.species === "Dog") {
          iconElement.className = "marker-icon";
          iconElement.style.backgroundImage = "url(images/icons/dog.png";
          markerContentElement.appendChild(iconElement);
        } else if (feature.properties.species === "Cat") {
          iconElement.className = "marker-icon";
          iconElement.style.backgroundImage = "url(images/icons/cat.png";
          markerContentElement.appendChild(iconElement);
        }
        // add others species in the future.

        //"url(images/paw.png";
        // var popup = new tt.Popup({ offset: 30 }).setText(popupText);
        // add marker to map
        //   new tt.Marker({ element: markerElement, anchor: "bottom" })
        //     .setLngLat(position)
        //     .setPopup(popup)
        //     .addTo(map);
        // }

        var newMarker = new tt.Marker({
          element: markerElement, // pass the custom icon to the marker
          anchor: "bottom", // set the anchor point for the marker
          draggable: false, // enable dragging of the marker
          color: "#FF0000", // set the color of the marker
        }).setLngLat(feature.geometry.coordinates);

        //console.log(feature.geometry.coordinates);
        newMarker.addTo(map);
        newMarker.setPopup(
          // new tt.Popup({ offset: 30 }).setText(feature.properties.name)
          new tt.Popup({ offset: 30, closeButton: false }).setHTML(
            `<div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden;">
              <a href='/pets/${feature.properties.petId}'>
                <div style="width: 120px; height: 120px; border-radius: 50%; overflow: hidden; border: 3px solid white;
                background-image: url(${feature.properties.img});
                background-size: cover;
                background-position: center;">
                </div>
              </a>
            </div>`
          )
        );

        markersOnTheMap[id] = newMarker;
        //newMarker.togglePopup();
      }
    }
  });
}

map.on("load", function () {
  map.addSource("point-source", {
    type: "geojson",
    data: geoJson,
    cluster: true,
    clusterMaxZoom: 14,
    clusterRadius: 50,
  });

  map.addLayer({
    id: "clusters",
    type: "circle",
    source: "point-source",
    filter: ["has", "point_count"],
    paint: {
      "circle-color": [
        "step",
        ["get", "point_count"],
        "#EC619F",
        4,
        "#008D8D",
        7,
        "#004B7F",
      ],
      "circle-radius": ["step", ["get", "point_count"], 15, 4, 20, 7, 25],
      "circle-stroke-width": 1,
      "circle-stroke-color": "white",
      "circle-stroke-opacity": 1,
    },
  });

  map.addLayer({
    id: "cluster-count",
    type: "symbol",
    source: "point-source",
    filter: ["has", "point_count"],
    layout: {
      "text-field": "{point_count_abbreviated}",
      "text-size": 16,
    },
    paint: {
      "text-color": "white",
    },
  });
  //my added
  // map.addLayer({
  //   id: "unclustered-point",
  //   type: "circle",
  //   source: "point-source",
  //   filter: ["!has", "point_count"],
  //   paint: {
  //     "circle-color": "#11b4da",
  //     "circle-radius": 4,
  //     "circle-stroke-width": 1,
  //     "circle-stroke-color": "#fff",
  //   },
  // });

  map.on("data", function (e) {
    if (
      e.sourceId !== "point-source" ||
      !map.getSource("point-source").loaded()
    ) {
      return;
    }

    refreshMarkers();

    if (!eventListenersAdded) {
      map.on("move", refreshMarkers);
      map.on("moveend", refreshMarkers);
      eventListenersAdded = true;
    }
  });

  map.on("click", "clusters", function (e) {
    var features = map.queryRenderedFeatures(e.point, { layers: ["clusters"] });
    var clusterId = features[0].properties.cluster_id;
    map
      .getSource("point-source")
      .getClusterExpansionZoom(clusterId, function (err, zoom) {
        if (err) {
          return;
        }

        map.easeTo({
          center: features[0].geometry.coordinates,
          zoom: zoom + 0.5,
        });
      });
  });

  map.on("mouseenter", "clusters", function () {
    map.getCanvas().style.cursor = "pointer";
  });

  map.on("mouseleave", "clusters", function () {
    map.getCanvas().style.cursor = "";
  });
});

////////////////

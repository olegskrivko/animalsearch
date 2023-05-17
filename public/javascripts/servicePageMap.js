tt.setProductInfo("Pet finder", "1.0");
let size = 50;
var map = tt.map({
  key: TOMTOMTOKEN,
  container: "map",
  center: [24.105078, 56.946285],
  zoom: 6,
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

map.on("load", () => {
  let div = document.createElement("div");
  div.innerHTML = ``;
  let popup = new tt.Popup({
    closeButton: false,
    offset: 50,
    anchor: "bottom",
  }).setDOMContent(div);

  let border = document.createElement("div");
  border.className = "marker-border";

  let marker = new tt.Marker({
    element: border,
  })
    .setLngLat([-99.98580752275456, 33.43211082128627])
    .setPopup(popup);
  marker.addTo(map);
});

const regionSelect = document.getElementById("region-select");

regionSelect.addEventListener("change", async () => {
  const selectedRegion = regionSelect.value;
  //const selectedRegion = "daugavpils"
  console.log(selectedRegion);

  // Send a request to the server to fetch the GeoJSON for the selected region
  const response = await fetch(`/regions/${selectedRegion}`);
  const geojson = await response.json();
  console.log(geojson.coordinates);

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
            coordinates: geojson.coordinates,
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
});

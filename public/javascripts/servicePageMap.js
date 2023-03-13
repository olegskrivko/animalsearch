tt.setProductInfo("Pet finder", "1.0");
let size = 50;
var map = tt.map({
  key: TOMTOMTOKEN,
  container: "map",
  center: [-99.98580752275456, 33.43211082128627],
  zoom: 15,
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

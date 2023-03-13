// var roundLatLng = Formatters.roundLatLng;
// var center = [4.890659, 52.373154];
// var popup = new tt.Popup({
//   offset: 35,
// });
// var map = tt.map({
//   key: "ocXvxDGoMFAuPNAA1lUnaf9nsgT7Evmt",
//   container: "map",

//   center: center,
//   zoom: 14,
// });
// map.addControl(new tt.FullscreenControl());
// map.addControl(new tt.NavigationControl());

// var marker = new tt.Marker({
//   draggable: true,
// })
//   .setLngLat(center)
//   .addTo(map);

// function onDragEnd() {
//   var lngLat = marker.getLngLat();
//   lngLat = new tt.LngLat(roundLatLng(lngLat.lng), roundLatLng(lngLat.lat));

//   popup.setHTML(lngLat.toString());
//   popup.setLngLat(lngLat);
//   marker.setPopup(popup);
//   marker.togglePopup();
// }

// marker.on("dragend", onDragEnd);

tt.setProductInfo("Pet finder", "1.0");
let size = 50;
var map = tt.map({
  key: "ocXvxDGoMFAuPNAA1lUnaf9nsgT7Evmt",
  container: "map",
  center: [24.105078, 56.946285],
  zoom: 15,
});
map.addControl(new tt.FullscreenControl());
map.addControl(new tt.NavigationControl());

map.on("load", () => {
  let div = document.createElement("div");
  div.innerHTML = `<h3>hello</h3>`;
  let popup = new tt.Popup({
    closeButton: false,
    offset: 50,
    anchor: "bottom",
  }).setDOMContent(div);

  let border = document.createElement("div");
  border.className = "marker-border";

  let marker = new tt.Marker({
    draggable: true,
    element: border,
  })
    .setLngLat([24.105078, 56.946285])
    .setPopup(popup);
  marker.addTo(map);
});

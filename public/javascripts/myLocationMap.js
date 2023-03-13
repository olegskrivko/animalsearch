// Define your product name and version
tt.setProductInfo("Pet finder", "1.0");

var messageBox = document.querySelector(".js-message-box");
var messageBoxContent = document.querySelector(".tt-overlay-panel__content");
var messageBoxClose = messageBox.querySelector(".js-message-box-close");

var messages = {
  permissionDenied:
    "Permission denied. You can change your browser settings" +
    "to allow usage of geolocation on this domain.",
  notAvailable: "Geolocation data provider not available.",
};

// Create map
var map = tt.map({
  key: "ocXvxDGoMFAuPNAA1lUnaf9nsgT7Evmt",
  container: "map",
  // dragPan: !isMobileOrTablet()
});
map.addControl(new tt.FullscreenControl());

// Create plugin instance
var geolocateControl = new tt.GeolocateControl({
  positionOptions: {
    enableHighAccuracy: false,
  },
});

bindEvents();

// Handle case when domain permissions are already blocked
handlePermissionDenied();

map.addControl(geolocateControl);

function handlePermissionDenied() {
  if ("permissions" in navigator) {
    navigator.permissions
      .query({ name: "geolocation" })
      .then(function (result) {
        if (result.state === "denied") {
          displayErrorMessage(messages.permissionDenied);
        }
      });
  }
}

function bindEvents() {
  geolocateControl.on("error", handleError);
  messageBoxClose.addEventListener("click", handleMessageBoxClose);
}

function handleMessageBoxClose() {
  messageBox.setAttribute("hidden", true);
}

function displayErrorMessage(message) {
  messageBoxContent.textContent = message;
  messageBox.removeAttribute("hidden");
}

function handleError(error) {
  switch (error.code) {
    case error.PERMISSION_DENIED:
      displayErrorMessage(messages.permissionDenied);
      break;
    case error.POSITION_UNAVAILABLE:
    case error.TIMEOUT:
      displayErrorMessage(messages.notAvailable);
  }
}

const startBtn = document.querySelector("#startBtn");
const marker = document.querySelector("#marker");

let buttonVisible = false;

marker.addEventListener("markerFound", () => {
  startBtn.setAttribute("visible", "true");
  buttonVisible = true;
});

marker.addEventListener("markerLost", () => {
  startBtn.setAttribute("visible", "false");
  buttonVisible = false;
});

// Eventlistener nur reagieren, wenn Marker sichtbar & echte Interaktion
startBtn.addEventListener("click", (evt) => {
  if (!buttonVisible) return;  // verhindert sofortigen Trigger
  if (evt.type === "click" || evt.type === "touchstart") {
    alert("🎉 Start gedrückt!");
  }
});







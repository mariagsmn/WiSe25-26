const marker = document.querySelector("#marker");
const arBtn = document.querySelector("#ar-button");

let buttonVisible = false;

// Marker erkannt → Button anzeigen
marker.addEventListener("markerFound", () => {
  arBtn.style.display = "block";
  buttonVisible = true;
});

// Marker verloren → Button ausblenden
marker.addEventListener("markerLost", () => {
  arBtn.style.display = "none";
  buttonVisible = false;
});

// Klick / Touch
arBtn.addEventListener("click", () => {
  if (!buttonVisible) return;
  alert("🎉 Start gedrückt!");
});

arBtn.addEventListener("touchstart", () => {
  if (!buttonVisible) return;
  alert("🎉 Start gedrückt!");
});

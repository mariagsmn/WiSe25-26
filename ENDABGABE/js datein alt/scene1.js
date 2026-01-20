const marker = document.querySelector("#marker");
const arBtn = document.querySelector("#ar-button");

let buttonVisible = false;

// Marker erkannt → Button anzeigen
marker.addEventListener("markerFound", () => {
  arBtn.style.display = "block";
  buttonVisible = true;
});


marker.addEventListener("markerLost", () => {
  arBtn.style.display = "none";
  buttonVisible = false;
});

arBtn.addEventListener("click", () => {
  if (!buttonVisible) return;
  window.location.href =
    "https://jennisinger.github.io/Obiquous-computing/ENDABGABE/room.html";
});

arBtn.addEventListener("touchstart", () => {
  if (!buttonVisible) return;
  window.location.href =
    "https://jennisinger.github.io/Obiquous-computing/ENDABGABE/room.html";
});



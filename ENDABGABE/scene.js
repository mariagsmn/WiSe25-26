document.addEventListener('DOMContentLoaded', () => {
  const marker = document.querySelector('#marker');
  const startBtn = document.querySelector('#startBtn');
  //let buttonShown = false; // Button erscheint nur einmal

  // Marker erkannt → Button sichtbar
  marker.addEventListener('markerFound', () => {
    if (!buttonShown) {
      startBtn.setAttribute('visible', 'true');
      buttonShown = true; // bleibt danach sichtbar
    }
  });

  // Sicherheit: Button bei jedem Frame sichtbar lassen, sobald er einmal da war
  AFRAME.scenes[0].addEventListener('renderstart', () => {
    AFRAME.scenes[0].addEventListener('tick', () => {
      if (buttonShown) startBtn.setAttribute('visible', 'true');
    });
  });

  // Klick-Event für Button
  startBtn.addEventListener('click', () => {
    alert("🎉 Start gedrückt! → Als nächstes: Eier auswählen!");
  });
});






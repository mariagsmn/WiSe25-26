// Diese Funktion läuft AUTOMATISCH, sobald die HTML-Seite vollständig geladen ist
document.addEventListener('DOMContentLoaded', () => {

  // 1. ELEMENTE FINDEN  
  
  // Sucht Bären-Bild (damit wir wissen wo es ist)
  const bearImage = document.getElementById('bearImage');

  // Sucht Audio-Element (Musik-Player für das Lied)
  const audioPlayer = document.getElementById('audioPlayer');

  // Sucht "Zurück"-Button (um zur Hauptseite zu gehen)
  const backBtn = document.getElementById('back-btn');


  // 2. KLICK AUF BÄREN = MUSIK SPIELEN/PAUSIEREN

  // Wenn der Benutzer auf den Bären klickt...
  bearImage.addEventListener('click', () => {
    // Prüft ob Musik gerade spielt
    if (audioPlayer.paused) {
      // Musik ist aus -> Spielen
      audioPlayer.play();
    } else {
      // Musik läuft -> Stoppen und zurücksetzen
      audioPlayer.pause();
      audioPlayer.currentTime = 0;
    }
  });


  // 3. MUSIK-WIEDERHOLEN (am Ende wieder von vorne spielen)

  // Wenn die Musik zu Ende ist...
  audioPlayer.addEventListener('ended', () => {
    // Setzt sie auf Anfang zurück und spiele erneut
    audioPlayer.currentTime = 0;
    audioPlayer.play();
  });


  // 4. ZURÜCK-BUTTON (Gehe zurück zur Hauptseite)
  // Wenn der Benutzer auf den Zurück-Button klickt...
  backBtn.addEventListener('click', () => {
    // Speichere dass User schon da war (damit Ei nicht nochmal gezeigt wird)
    sessionStorage.setItem('skipEggAnimation', '1');
    // Gehe zurück zur Hauptseite
    window.location.href = 'room.html';
  });
});

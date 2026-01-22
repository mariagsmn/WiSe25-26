
document.addEventListener("DOMContentLoaded", () => {

  // 1. GRUNDELEMENTE LADEN

  // Spielfläche aufrufen
  const playArea = document.getElementById("play-area");

  // Fehlermeldung der Konsole: Falls die Spielfläche nicht existiert stoppt alles
  if (!playArea) {
    console.error("play-area fehlt im DOM - die Seite ist kaputt!");
    return;
  }


  // 2. HILFSFUNKTION: Sidebars erstellen oder holen

  // erstellt die Button-Leisten
  function getOrCreateSidebar(id, html) {
    // Suche nach einem Element mit dieser ID
    let el = document.getElementById(id); // El = Variable für das Element‚

    // Sorgt dafür dass die Sidebars nur einmal erstellt werden 
    if (!el) {
      el = document.createElement("div"); // Neuer Behälter (Container)
      el.id = id;  // Gib ihm eine ID
      el.className = id === "sidebar-top" ? "sidebar-top" : "sidebar"; // CSS-Klasse
      el.innerHTML = html; // Füge den HTML-Code ein (die Buttons)
      playArea.appendChild(el); // Hänge es in die Spielfläche ein
    }
    return el; // Gib das Element zurück (zum Speichern in einer Variable)
  }


  // 3. EI UND PET LADEN

  // Versucht das Ei zu finden, oder erstellt es, falls es nicht existiert
  const eggExisting = document.getElementById("egg");
  let egg = eggExisting || (() => {
    // Falls das Ei nicht in der HTML ist wird es erstellt als Bild
    const eggo = document.createElement("img");
    eggo.id = "egg";
    eggo.src = "assets/egg.png"; // Die Bilddatei für das Ei
    eggo.alt = "Ei"; // Text falls Bild nicht lädt
    eggo.className = "";
    playArea.appendChild(eggo); // Hänge es in die Spielfläche ein
    return eggo; // Gib das Ei zurück
  })();

  // Verhindert, dass der Bär (pet) doppelt existiert
  const petbear = document.querySelectorAll("#pet");
  let pet = petbear[0] || null; // Nimmt das erste Pet oder null

  // Wenn es mehrere pets gibt, löscht es alle außer den ersten
  if (petbear.length > 1) {
    for (let i = 1; i < petbear.length; i++) {
      petbear[i].remove(); // Löscht das doppelte Pet
    }
  }

  // Falls kein Pet existiert, erstellt es eins
  if (!pet) {
    pet = document.createElement("img");
    pet.id = "pet";
    pet.src = "assets/bear.png";
    pet.alt = "Tier";
    pet.classList.add("hidden"); // Versteckt es am Anfang
    playArea.appendChild(pet);
  }


  // 4. SIDEBARS ERSTELLEN (Die Button-Leisten)

  // Linke Sidebar - Buttons für Füttern und Energie
  const sidebarLeft = getOrCreateSidebar("sidebar-left", `
    <button class="side-btn" id="feed">🍔</button>
    <button class="side-btn" id="energy">💡</button>
  `);

  // Rechte Sidebar - Buttons für Spiele
  const sidebarRight = getOrCreateSidebar("sidebar-right", `
    <button class="side-btn" id="tic-tac-toe">🎮</button>
    <button class="side-btn" id="sing">🎤</button>
  `);

  // Obere Sidebar - Die Stats (Hunger und Energie Balken)
  const sidebarTop = document.getElementById("sidebar-top") || getOrCreateSidebar("sidebar-top", `
    <div class="stat-item">
      <div class="stat-label">Hunger</div>
      <div class="stat-bar"><div id="hunger-fill" class="stat-fill"></div></div>
    </div>
    <div class="stat-item">
      <div class="stat-label">Energie</div>
      <div class="stat-bar"><div id="energy-fill" class="stat-fill"></div></div>
    </div>
  `);


  // 5. ANFANGS-SICHTBARKEIT VON SIDEBAR & PET

  // Am Anfang sind die Sidebars NICHT sichtbar (versteckt)
  if (sidebarLeft) sidebarLeft.classList.remove("visible");
  if (sidebarRight) sidebarRight.classList.remove("visible");
  if (sidebarTop) sidebarTop.classList.remove("visible");

  // Das Pet ist versteckt, das Ei ist sichtbar
  pet.classList.add("hidden");
  egg.classList.remove("hidden");


  // 6. NACHT-OVERLAY 

  let nightOverlay = document.getElementById("night-overlay");
  if (!nightOverlay) {
    nightOverlay = document.createElement("div");
    nightOverlay.id = "night-overlay"; // Der dunkle Schirm
    document.body.appendChild(nightOverlay);
  }
  nightOverlay.classList.remove("active"); // Am Anfang nicht aktiv


  // 7. ÜBERPRÜFT, OB DAS SPIEL SCHON GELADEN WURDE 

  // Prüft ob der Bär bereits geschlüpft ist
  const persistentHatched = localStorage.getItem("petHatched") === "1";

  // Prüft ob man vom Singing-Bear zurückkommt, wenn ja dann wird Schlüpf-Animation geskippt
  const transientSkip = sessionStorage.getItem("skipEggAnimation") === "1";


  // 8. EI-ANIMATION 

  // Funktion startet wackeln von Ei 
  function startEggPulse() {
    egg.classList.remove("hidden"); // Zeige das Ei
    egg.classList.add("egg-pulsing"); // Starte die Animation (in CSS definiert)
  }

  // Funktion stoppt wackeln vom Ei
  function stopEggPulse() {
    egg.classList.remove("egg-pulsing"); // Entfernt die Animation
  }

  localStorage.removeItem("petHatched");

  // Soll das Ei wackeln?
  // Ja, aber nur das Pet noch nicht geschlüpft ist 
  if (!persistentHatched && !transientSkip) {
    startEggPulse(); // Startet die Animation
  } else {
    stopEggPulse(); // Versteckt das Ei und zeigt den Bären
  }


  // 9. HUNGER & ENERGIE 

  // Speichert die Werte des Haustiers
  const stats = {
    hunger: 100,  // 0-100 (0 = hungrig, 100 = satt)
    energy: 100    // 0-100 (0 = müde, 100 = wach)
  };

  let __statsInterval = null; // Speicher für Timer, der Hunger und Energie senkt (ab Zeile 193), zuerst 0, d.h. kein Timer läuft 

  // Update der Balkenstats  
  function updateStatsUI() {
    const hungry = document.getElementById("hunger-fill"); //  Hunger-Balken
    const energy = document.getElementById("energy-fill"); //  Energie-Balken

    // Balkenbreite anpassen (0% bis 100%)
    if (hungry) hungry.style.width = Math.max(0, Math.min(100, stats.hunger)) + "%";
    if (energy) energy.style.width = Math.max(0, Math.min(100, stats.energy)) + "%";
  }

  // Funktion: Ändere einen Stat-Wert (z.B. +20 Hunger wenn gefüttert)
  function changeStat(name, delta) {

    // Ändere den Wert (aber nicht unter 0 oder über 100)
    stats[name] = Math.max(0, Math.min(100, stats[name] + delta));

    // Update die Grafik
    updateStatsUI();
  }

  // Startet Timer, der regelmäßig die Stats senkt
  function startStatsInterval() {
    if (__statsInterval) return; // Falls Zeit bereits läuft, stopp (verhindert starten von mehreren Timern)

    // Alle 4 Sekunden werden die Stats niedriger   
    __statsInterval = setInterval(() => {
      // Prüfe ob Bär schläft, also ob Nacht-Overlay aktiv ist
      const sleeping = nightOverlay.classList.contains("active");

      // Falls Bär nicht schläft senkt sich Hunger und Energie
      if (!sleeping) {
        changeStat("hunger", -3);  // -3 Hunger alle 4 Sekunden
        changeStat("energy", -1);  // -1 Energie alle 4 Sekunden
      }
    }, 4000);
  }

  // Stoppt den Timer (löscht Interval)
  function stopStatsInterval() {
    clearInterval(__statsInterval); // Timer stoppen
    __statsInterval = null; // Variable zurücksetzen
  }

  // zeigt Stats (am Anfang oder nach Ei-Schlüpfen)
  function initStats() {
    updateStatsUI(); // Updatet die Grafik einmal
    startStatsInterval(); // Starte den regelmäßigen Timer
    if (sidebarTop) sidebarTop.classList.add("visible"); // Zeige die Top-Sidebar
  }

  // 11. EI-SCHLÜPF 

  // Wenn man auf das Ei klickt
  egg.addEventListener("click", () => {
    // Prüft ob Ei schon versteckt ist oder ob es schlüpft
    if (egg.classList.contains("hidden") || egg.classList.contains("egg-hatching")) {
      return; // Falls ja, tu nichts
    }

    // Startet die Schlüpf-Animation 
    egg.classList.add("egg-hatching");

    let finished = false; // Verhindert Doppel-Ausführung

    // Funktion läuft erst wenn Animation fertig ist
    const finishHatch = () => {
      if (finished) return; // Falls schon gemacht, stoppe
      finished = true;

      //  ANIMATION FERTIG - ZEIGT JETZT BÄR 

      egg.classList.add("hidden"); // Versteckt das Ei
      egg.classList.remove("egg-hatching"); // Entfernt Animation

      // Zeigt Pet(Bär)
      if (pet) {
        pet.classList.remove("hidden");
        pet.classList.add("shown");
      }

      // Speichert dass Bär geschlüpft ist
      localStorage.setItem('petHatched', '1');

      // Zeigt Sidebars
      if (sidebarLeft) sidebarLeft.classList.add("visible");
      if (sidebarRight) sidebarRight.classList.add("visible");
      if (sidebarTop) sidebarTop.classList.add("visible");

      // Startet Stats
      initStats();
    };

    // Wartet bis die CSS-Animation fertig ist
    egg.addEventListener("animationend", finishHatch, { once: true });
    egg.addEventListener("webkitAnimationEnd", finishHatch, { once: true });

    // Falls die Animation nicht registriert wird, mache es nach 1,6 Sekunden trotzdem
    setTimeout(finishHatch, 1600);
  });

  // 12. WENN SEITE NEU GELADEN WIRD (Bär schon geschlüpft)

  // Falls Bär schon geschlüpft ist oder man vom Singspiel/Tic Tac Toe zurückkommt
  if (persistentHatched || transientSkip) {
    egg.classList.add("hidden");
    pet.classList.remove("hidden");
    pet.classList.add("shown");
    sidebarLeft.classList.add("visible");
    sidebarRight.classList.add("visible");
    if (sidebarTop) sidebarTop.classList.add("visible");
    initStats();
  }


  // 13. SCHLAF-MECHANIK (Nacht-Overlay und Schlaflied)

  // Findet Energy-Button 💡
  const sleepBtn = document.getElementById("sleep") || document.getElementById("energy");
  let sleepRechargeInterval = null; // Timer für Energy-Aufladung
  let snoreSound = null; //  Schlaflied

  if (sleepBtn) {
    // Wenn jemand auf Schlaf-Button klickt...
    sleepBtn.addEventListener("click", () => {
      // Toggle = schaltet Schlaf an/aus
      const nowSleeping = nightOverlay.classList.toggle("active");

      if (nowSleeping) {
        // ===== GEHT SCHLAFEN =====

        // spielt Schlaflied ab
        if (!snoreSound) {
          snoreSound = new Audio("assets/lullaby.wav");
          snoreSound.loop = true; // loopt Schlaflied
        }
        snoreSound.currentTime = 0;
        snoreSound.play().catch(() => { }); // falls Sound blockiert wird

        // Startet Energie-Aufladung während schlafen
        if (!sleepRechargeInterval) {
          sleepRechargeInterval = setInterval(() => {
            changeStat("energy", +15); // +15 Energy alle 4 Sekunden
          }, 4000);
        }
      } else {

        //  AUFWACHEN 

        // Stoppt Timer
        if (sleepRechargeInterval) {
          clearInterval(sleepRechargeInterval);
          sleepRechargeInterval = null;
        }

        // Stoppt Schlaflied
        if (snoreSound) {
          snoreSound.pause();
          snoreSound.currentTime = 0;
        }

        // Gibt Energie beim Aufwachen
        changeStat("energy", +10);
      }
    });

    // Erlaubt Klick auf dunklen Schirm um aufzuwachen
    nightOverlay.addEventListener("click", () => {
      if (nightOverlay.classList.contains("active")) {
        // Schaltet Overlay aus
        nightOverlay.classList.remove("active");

        // Stoppt Timer und Sound
        if (sleepRechargeInterval) {
          clearInterval(sleepRechargeInterval);
          sleepRechargeInterval = null;
        }
        if (snoreSound) {
          snoreSound.pause();
          snoreSound.currentTime = 0;
        }

        // gibt Energie beim Aufwachen
        changeStat("energy", +10);
      }
    });
  }

  // 14. RESPONSIVE LAYOUT (Handy & Laptop)

  //  sortiert Buttons je nach Bildschirmgröße um
  function applyResponsiveLayout() {
    // Prüft ob Bildschirm klein ist (Handy)
    const mobile = window.innerWidth <= 700;

    // Suche nach Bottom-Bar (für Handy unten)
    let bottomBar = document.getElementById("bottom-bar");

    if (mobile) {
      //  HANDY-LAYOUT 

      // erstellt Bottom-Bar falls nicht vorhanden
      if (!bottomBar) {
        bottomBar = document.createElement("div");
        bottomBar.id = "bottom-bar";
        bottomBar.className = "sidebar";
        document.body.appendChild(bottomBar);
      }

      // verschiebt Sidebars nach unten
      if (sidebarLeft && sidebarLeft.parentElement !== bottomBar) bottomBar.appendChild(sidebarLeft);
      if (sidebarRight && sidebarRight.parentElement !== bottomBar) bottomBar.appendChild(sidebarRight);
      if (sidebarTop && sidebarTop.parentElement !== document.body) document.body.appendChild(sidebarTop);
      if (nightOverlay && nightOverlay.parentElement !== document.body) document.body.appendChild(nightOverlay);
    } else {

      // DESKTOP-LAYOUT 

      // verschiebt Sidebars zur Spielfläche
      if (sidebarLeft && sidebarLeft.parentElement !== playArea) playArea.appendChild(sidebarLeft);
      if (sidebarRight && sidebarRight.parentElement !== playArea) playArea.appendChild(sidebarRight);
      if (sidebarTop && sidebarTop.parentElement !== playArea) playArea.insertBefore(sidebarTop, playArea.firstChild);

      // löscht Bottom-Bar falls leer
      if (bottomBar && bottomBar.childElementCount === 0) bottomBar.remove();
      if (nightOverlay && nightOverlay.parentElement !== document.body) document.body.appendChild(nightOverlay);
    }
  }

  // wendet responsive Layout einmal am Anfang an
  applyResponsiveLayout();

  // Wenn Benutzer Fenstergröße ändert, passt es das Layout an
  let __layoutTimer = null;
  window.addEventListener("resize", () => {
    clearTimeout(__layoutTimer); // Verhindert zu häufige Updates
    __layoutTimer = setTimeout(applyResponsiveLayout, 120); // wartet 120ms dann update
  });


  // 15. SPIELE (TicTacToe & Singing Bear)

  // Wenn der Benutzer auf den TicTacToe-Button klickt, gehe zur TicTacToe-Seite
  const tttBtn = document.getElementById("tic-tac-toe");
  if (tttBtn) tttBtn.addEventListener("click", () => {
    window.location.href = "tictactoe.html";
  });

  // Wenn der Benutzer auf den Singing-Button klickt, gehe zur Singing-Bear-Seite
  const singBtn = document.getElementById("sing");
  if (singBtn) singBtn.addEventListener("click", () => {
    window.location.href = "singing_bear.html";
  });


  // 16. CANVAS-HINTERGRUND (Wolken, Pflanzen ...)

  // erstellt Canvas-Element 
  const canvas = document.createElement("canvas");
  canvas.id = "bg-canvas";
  canvas.style.position = "absolute";
  canvas.style.top = "0";
  canvas.style.left = "0";
  canvas.style.zIndex = "0"; // ganz hinten, hinter allem anderen
  playArea.prepend(canvas);

  // holt das 2D-Zeichenwerkzeug
  const ctx = canvas.getContext ? canvas.getContext("2d") : null;

  // Passt Canvas-Größe zur Spielfläche an
  function resizeCanvas() {
    const w = playArea.offsetWidth;
    const h = playArea.offsetHeight;
    canvas.width = w;
    canvas.height = h;
    canvas.style.width = w + "px";
    canvas.style.height = h + "px";
    if (ctx) drawBackground(); // Zeichne neu
  }

  // Wenn Benutzer Fenster resized, passe Canvas an
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas(); // Einmal am Anfang

  // Zeichnet Hintergrund (Himmel, Gras, Wolken ...)
  function drawBackground() {

    const w = canvas.width;
    const h = canvas.height;

    // Löscht alles was vorher war
    ctx.clearRect(0, 0, w, h);

    // Zeichnet Himmel 
    ctx.fillStyle = "#b7e3ff";
    ctx.fillRect(0, 0, w, Math.floor(h * 0.7)); // Rechteck oben 70% hoch

    // Zeichnet Gras 
    ctx.fillStyle = "#2e7d32";
    ctx.fillRect(0, Math.floor(h * 0.7), w, Math.ceil(h * 0.3)); // Rechteck unten 30% hoch

    // Zeichnet Wolken
    ctx.fillStyle = "white";
    drawCloud(ctx, w * 0.2, h * 0.1, 60, 40);
    drawCloud(ctx, w * 0.5, h * 0.15, 80, 50);
    drawCloud(ctx, w * 0.8, h * 0.08, 50, 30);

    // Zeichnet Pflanzen
    drawPlant(ctx, w * 0.1, h * 0.85, 20, 50);
    drawPlant(ctx, w * 0.3, h * 0.9, 15, 40);

    // Zeichnet Pilze
    drawMushroom(ctx, w * 0.7, h * 0.88, 15, 20);
    drawMushroom(ctx, w * 0.85, h * 0.87, 20, 25);
  }

  // Zeichnet Wolke 
  function drawCloud(ctx, x, y, width, height) {
    ctx.beginPath();
    ctx.ellipse(x, y, width, height, 0, 0, Math.PI * 2);
    ctx.ellipse(x + width * 0.5, y + 10, width * 0.7, height * 0.7, 0, 0, Math.PI * 2);
    ctx.ellipse(x - width * 0.5, y + 10, width * 0.7, height * 0.7, 0, 0, Math.PI * 2);
    ctx.fill(); // Fülle mit der aktuellen Farbe (weiß)
  }

  // Zeichnet Pflanze mit Stiel und Blüte
  function drawPlant(ctx, x, y, width, height) {
    ctx.fillStyle = "#1b5e20"; // Dunkelgrüner Stiel
    ctx.fillRect(x - width / 8, y - height, width / 4, height);

    ctx.beginPath();
    ctx.arc(x, y - height, width / 2, 0, Math.PI * 2); // Kreis oben
    ctx.fillStyle = "#b973ffff"; // Lila Blüte
    ctx.fill();
  }

  // Zeichnet Pilz 
  function drawMushroom(ctx, x, y, width, height) {
    ctx.fillStyle = "#fbe9e7"; // Heller Stiel
    ctx.fillRect(x - width / 4, y - height, width / 2, height);

    ctx.beginPath();
    ctx.arc(x, y - height, width, 0, Math.PI, true); // Halbkreis oben = Pilz-Hut
    ctx.fillStyle = "#d32f2f"; // Rot
    ctx.fill();
  }


  // 17. DRAG & DROP BURGER

  // setzt das Fütter-System auf
  (function setupDragBurger() {
    // Findet Fütter-Button
    const feedBtn = document.getElementById("feed");
    if (!feedBtn || !pet) return; // Falls nicht vorhanden, stoppe

    // Erstelle oder finde den draggbaren Burger
    let dragBurger = document.getElementById("dragging-burger");
    if (!dragBurger) { // gibt es Burger schon? Wenn nein erstellt er einen
      dragBurger = document.createElement("span");
      dragBurger.id = "dragging-burger";
      dragBurger.textContent = "🍔";

      // CSS für Burger während Drag
      Object.assign(dragBurger.style, {
        position: "absolute", // Kann überall auf dem Bildschirm sein
        cursor: "grab", // Cursor zeigt "greifbar"
        fontSize: "50px", // Größe von Burger
        display: "none", // Am Anfang versteckt
        zIndex: 9999, // Ganz vorne
        touchAction: "none" // Verhindere Browser-Gesten
      });
      document.body.appendChild(dragBurger);
    }

    // Verhindert Probleme beim Drag n Drop (für Handynutzung)
    feedBtn.style.touchAction = "none";

    let dragging = false; // Ist der Benutzer gerade beim Dragging?
    let offsetX = 0, offsetY = 0; // Versatz vom Mauszeiger zum Burger

    // Bewegt Burger zur Mausposition
    function moveAt(clientX, clientY) {
      dragBurger.style.left = (clientX - offsetX + window.scrollX) + "px";
      dragBurger.style.top = (clientY - offsetY + window.scrollY) + "px";
    }

    // Startet das Dragging
    function startDrag(clientX, clientY) {
      const rect = dragBurger.getBoundingClientRect();
      offsetX = rect.width / 2;
      offsetY = rect.height / 2;
      dragBurger.style.display = "block"; // Zeigt den Burger
      moveAt(clientX, clientY);
      dragging = true;

      // Hört (eventlistener) auf Mausbewegungen
      document.addEventListener("pointermove", onPointerMove);
      document.addEventListener("pointerup", onPointerUp);
    }

    // Wird aufgerufen wenn Maus sich bewegt während Drag
    function onPointerMove(e) {
      if (!dragging) return;
      e.preventDefault();
      moveAt(e.clientX, e.clientY);
    }

    // Beendet das Dragging und prüfe ob es über Pet ist
    function endDrag(clientX, clientY) {
      dragging = false;
      document.removeEventListener("pointermove", onPointerMove);
      document.removeEventListener("pointerup", onPointerUp);

      // Holt Positionen von Burger und Pet
      const bR = dragBurger.getBoundingClientRect();
      const pR = pet.getBoundingClientRect();

      // Prüft ob Burger über Pet ist (Kollisionserkennung)
      const hit = !(bR.right < pR.left || bR.left > pR.right ||
        bR.bottom < pR.top || bR.top > pR.bottom);

      if (hit) {
        // BÄR WURDE GEFÜTTERT! 

        changeStat("hunger", 20); // +20 Hunger

        // Spielt Ess-Geräusch ab
        const eatSound = new Audio("assets/sound_eating.mp3");
        eatSound.play().catch(() => { });
      }

      dragBurger.style.display = "none"; // Verstecke Burger
    }

    // Event-Handler für Pointerup (Maus loslassen)
    function onPointerUp(e) { endDrag(e.clientX, e.clientY); }

    // Wenn Benutzer auf Fütter-Button klickt/tippt startet Drag
    feedBtn.addEventListener("pointerdown", (ev) => {
      ev.preventDefault();
      const r = feedBtn.getBoundingClientRect();
      startDrag(r.left + r.width / 2, r.top + r.height / 2);
    });
  })();

}); 

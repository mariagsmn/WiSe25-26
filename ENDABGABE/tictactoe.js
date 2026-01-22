// 1. ELEMENTE FINDEN‚

// alle 9 Spielfelder 
const cells = document.querySelectorAll('.cell');

// Status-Text-Element (zeigt "Du bist am Zug" etc)
const statusDisplay = document.getElementById('status');

// "Neues Spiel"-Button
const resetBtn = document.getElementById('reset-btn');

// "Zurück"-Button (zur Hauptseite)
const backBtn = document.getElementById('back-btn');

// Textfelder für die Siege
const playerWinsDisplay = document.getElementById('player-wins');
const computerWinsDisplay = document.getElementById('computer-wins');


// 2. SPIELVARIABLEN (Spielzustand)

// Spielbrett - 9 Felder (oben links bis unten rechts)
// Jedes Feld ist entweder
//   '' (leer)
//   'O' (der Spieler)
//   'X' (der Computer/Bär)
let board = ['', '', '', '', '', '', '', '', ''];

// Wer ist dran? Am Anfang der Spieler
let currentPlayer = 'O'; // O = Spieler (du), X = Computer (Bär)

// Spiel aktiv? Am Anfang ja
let gameActive = true;

// Zähle die Siege
let playerWins = 0;  // Wie oft hat der Spieler gewonnen?
let computerWins = 0; // Wie oft hat der Bär gewonnen?


// 3. GEWINN-BEDINGUNGEN (Alle 8 möglichen Gewinnkombis)

// Ein Spieler gewinnt wenn er 3 in einer Reihe hat
// Horizontal (3 Reihen mit jeweils 3 Felder):
//   [0, 1, 2] = obere Reihe
//   [3, 4, 5] = mittlere Reihe
//   [6, 7, 8] = untere Reihe

// Vertikal (3 Spalten mit jeweils 3 Felder):
//   [0, 3, 6] = linke Spalte
//   [1, 4, 7] = mittlere Spalte
//   [2, 5, 8] = rechte Spalte

// Diagonal (2 Diagonalen):
//   [0, 4, 8] = von oben-links nach unten-rechts
//   [2, 4, 6] = von oben-rechts nach unten-links

const winningConditions = [
    [0, 1, 2], // Obere Reihe
    [3, 4, 5], // Mittlere Reihe
    [6, 7, 8], // Untere Reihe
    [0, 3, 6], // Linke Spalte
    [1, 4, 7], // Mittlere Spalte
    [2, 5, 8], // Rechte Spalte
    [0, 4, 8], // Diagonale von oben-links nach unten-rechts
    [2, 4, 6]  // Diagonale von oben-rechts nach unten-links
];


// 4. KLICK AUF SPIELFELD

// Geht durch alle 9 Felder und macht sie klickbar
cells.forEach((cell, index) => {
    // Wenn jemand auf ein Feld klickt...
    cell.addEventListener('click', () => {
        // Prüft Bedingungen:
        // 1. Das Feld ist leer 
        // 2. Das Spiel ist noch aktiv 
        // 3. Der Spieler ist dran 
        if (board[index] === '' && gameActive && currentPlayer === 'O') { // mache nur etwas wenn alle 3 Bedingungen wahr sind

            // Setze ein 'O' auf dieses Feld
            board[index] = 'O';
            cell.textContent = 'O'; // Zeige 'O' auf dem Bildschirm
            cell.classList.add('taken'); // Markiere das Feld als besetzt (CSS --> Zelle wird rötlicher)

            // PRÜFT OB SPIELER GEWONNEN HAT 
            if (checkWinner()) {
                statusDisplay.textContent = '🎉 Du hast gewonnen!';
                playerWins++; // Erhöht Siege des Spielers um 1
                playerWinsDisplay.textContent = playerWins; // Updatet die Anzeige
                gameActive = false; // Beendet das Spiel
                return; // Stoppt hier
            }

            // PRÜFT OB SPIEL UNENTSCHIEDEN IST
            if (checkDraw()) {
                statusDisplay.textContent = '🤝🏼 Unentschieden!';
                gameActive = false; // Beendet das Spiel
                return; // Stoppt hier
            }

            // PRÜFT OB COMPUTER DRAN IST
            currentPlayer = 'X'; // Wechsle zum Computer
            statusDisplay.textContent = '🐻 denkt nach...'; // Zeige Denk-Nachricht

            // Rufe die Computer-Funktion auf, aber mit 0,8 Sekunden Verzögerung
            // Das sieht natürlicher aus, als wenn der Computer sofort antwortet
            setTimeout(computerMove, 800);
        }
    });
});


// 5. COMPUTER(BÄREN)-ZÜGE

// Computer(Bär) macht Zug
function computerMove() {
    // Falls das Spiel nicht aktiv ist, tu nichts
    if (!gameActive) return;

    //  FINDET ALLE LEEREN FELDER (Felder wo noch ein Zug möglich ist)
    const availableMoves = []; // leere Liste in die später freie Felder gespeichert werden
    for (let i = 0; i < board.length; i++) { // Geht durch alle 9 Felder
        if (board[i] === '') { // Prüft ob Feld leer ist
            availableMoves.push(i); // Fügt Nummer des leeren Feldes hinzu
        }
    }

    // Falls keine leeren Felder mehr, stoppt es hier
    if (availableMoves.length === 0) return;

    //  WÄHLT ZUFÄLLIGEN ZUG
    // Bär wählt zufällig aus den freien Feldern
    const randomIndex = Math.floor(Math.random() * availableMoves.length); // Zufallszahl zwischen 0 und Anzahl der freien Felder
    const moveIndex = availableMoves[randomIndex]; // Wählt Feld aus

    // Setzt 'X' auf gewähltes Feld
    board[moveIndex] = 'X';
    cells[moveIndex].textContent = 'X'; // Zeigt 'X' auf dem Bildschirm
    cells[moveIndex].classList.add('taken'); // Markiert das Feld als besetzt

    //  PRÜFT OB BÄR GEWONNEN HAT 
    if (checkWinner()) {
        statusDisplay.textContent = '🐻 hat gewonnen!';
        computerWins++; // Erhöht Siege des Computers um 1
        computerWinsDisplay.textContent = computerWins; // Update der Anzeige
        gameActive = false; // Beendet das Spiel
        return; // Stoppt hier
    }

    //  PRÜFT OB SPIEL UNENTSCHIEDEN IST
    if (checkDraw()) {
        statusDisplay.textContent = '🤝🏼 Unentschieden!';
        gameActive = false; // Beende das Spiel
        return; // Stoppt hier
    }

    //  SPIELER IST WIEDER DRAN
    currentPlayer = 'O'; // Wechsle zum Spieler
    statusDisplay.textContent = 'Du bist am Zug';
}


// 6. GEWINN-PRÜFUNG

// Prüft ob jemand gewonnen hat
function checkWinner() {
    for (let i = 0; i < winningConditions.length; i++) { // Geht durch alle 8 möglichen Gewinn-Kombinationen
        // Hole die 3 Feld-Positionen aus der aktuellen Gewinn-Kombination
        const a = winningConditions[i][0];
        const b = winningConditions[i][1];
        const c = winningConditions[i][2];

        // Prüft: 
        // 1. board[a] ist nicht leer (existiert ein Zeichen?)
        // 2. board[a] === board[b] (sind die Zeichen gleich?)
        // 3. board[a] === board[c] (sind alle 3 gleich?)
        if (board[a] && board[a] === board[b] && board[a] === board[c]) { 
            return true; // Es gibt einen Gewinner!
        }
    }
    return false; // Noch kein Gewinner
}

// 7. UNENTSCHIEDEN-PRÜFUNG

// Prüft ob das Spiel unentschieden ist
function checkDraw() {
    // Prüfe: Ist JEDES Feld auf dem Brett besetzt?
    for (let i = 0; i < board.length; i++) { // Geht durch alle 9 Felder
        if (board[i] === '') { // Prüft ob Feld leer ist
            return false; // Mindestens ein Feld ist noch leer --> kein Unentschieden
        }
    }
    return true; // Alle Felder sind besetzt, Unentschieden!
}


// 8. SPIEL ZURÜCKSETZEN

// Setzt das Spiel auf  Anfang zurück
function resetGame() {
    // Leert alle Felder
    board = ['', '', '', '', '', '', '', '', ''];

    // Spieler fängt an
    currentPlayer = 'O';

    // Spiel ist aktiv
    gameActive = true;

    // Update Status-Text
    statusDisplay.textContent = 'Du bist am Zug';

    // Geht durch alle Felder und leert sie
    cells.forEach(cell => {
        cell.textContent = ''; // Entferne O oder X
        cell.classList.remove('taken'); // Entferne CSS-Klasse
    });
}


// 9. NEUES SPIEL-BUTTON

// Wenn der Benutzer auf "Neues Spiel" klickt, resetet das Spiel sich wieder
resetBtn.addEventListener('click', resetGame);


// 10. ZURÜCK-BUTTON 

// Prüft ob zurück-Button existiert
if (backBtn) {
    // Wenn  Benutzer auf den Zurück-Button klickt...
    backBtn.addEventListener('click', () => {
        // Sagt: Überspringe die Ei-Animation
        // Verhindert dass der Benutzer das Ei nochmal sehen muss
        sessionStorage.setItem('skipEggAnimation', '1');

        // Navigiere zur Hauptseite
        window.location.href = 'room.html';
        // Wie ein Neustart, Seite lädt neu
        // Aber ohne Ei-Animation weil wir das Flag gesetzt haben!
    });
}

/* Zusammengefasst:
   
   1. Spieler klickt auf ein leeres Feld → Setzt 'O'
   2. Prüfe ob Spieler gewonnen hat → Falls ja, Spiel Ende
   3. Prüfe ob Unentschieden → Falls ja, Spiel Ende
   4. Bär (Computer) macht Zug → Setzt zufällig 'X'
   5. Prüfe ob Bär (Computer) gewonnen hat → Falls ja, Spiel Ende
   6. Prüfe ob Unentschieden → Falls ja, Spiel Ende
   7. Zurück zum Schritt 1
*/
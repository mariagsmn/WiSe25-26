document.addEventListener("DOMContentLoaded", () => {

    const startBtn = document.querySelector("#startBtn");

    // Button wird nur auslösbar, wenn man drauf tippt
    startBtn.addEventListener("click", () => {
        alert("🎉 Start gedrückt! → Als nächstes: Eier anzeigen!");

        // Später: Button ausblenden und Eier laden
        // startBtn.setAttribute("visible", "false");
    });

});
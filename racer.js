import { Kasutaja } from "./kasutaja.js";

const race = {
    active: false,
    time: 0,
    racers: [],
    tekst: "Tekst mida peab kirjutama siin kastis",

    updateTextContainer(playerracer) {
        let element = document.getElementById("textContainer");

        const past = this.tekst.slice(0, playerracer.typingIndex);
        const future = this.tekst.slice(playerracer.typingIndex);

        element.innerHTML = `
        <span id="past">${past}</span>
        ${future}
        `;
    }
};

const playerracer = new Kasutaja("Kasutja", true);

race.racers.push(playerracer);

document.addEventListener(("keypress"), (event) => {
    if (!race.active) return;

    if (event.key == race.tekst.charAt(playerracer.typingIndex)) {
        playerracer.typingIndex++;
        race.updateTextContainer(playerracer);

        if (playerracer.typingIndex >= race.tekst.length) playerracer.finishRace(race.time, race.tekst);
    } else {
        playerracer.errorCount++;
    }
});

setInterval(() => {
    if (race.active) race.time++;
    if (race.active && !playerracer.completedrace) playerracer.updateStats(race.time, race.tekst);
}, 10);


race.active = true;
race.updateTextContainer(playerracer);


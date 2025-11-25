class Kasutaja {
    completedrace = false;
    errorCount = 0;
    lettersSkipped = 0;
    typingIndex = 0;
    wordsperminute = 0;
    accuracy = 0;
    raceFinishTime = 0;

    constructor(name, isPlayer = false) {
        this.name = name;
        this.isPlayer = isPlayer;
    }

    finishRace(raceTime, raceText) {
        this.raceFinishTime = raceTime / 100;
        this.updateStats(raceTime, raceText);

        this.completedrace = true;

    }

    updateStats(raceTime, raceText) {
        let wordCount = Math.round((this.typingIndex - this.lettersSkipped) / 5);

        this.accuracy = Math.round(((raceText.length - this.errorCount) / raceText.length) * 100);
        this.wordsperminute = Math.round(wordCount / ((raceTime / 100) / 60));

        if (this.isPlayer) {
            document.getElementById("wpmContainer").innerHTML = this.wordsperminute.toString();
            document.getElementById("täpsusContainer").innerHTML = this.accuracy.toString();
        }
    }
}

export { Kasutaja };
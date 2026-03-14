//pi-day-coin-flip.js
//Nicholas Norman March 2026
//Pi Coin Flip Approx.

// calculate pi from average sequence of more heads than tails

// generate random data
function generateHeadsTailsSequence(flipCount) {
    let coinFaces = [];

    for (let i = 0; i < flipCount; i++) {
        coinFaces.push(generateHeadOrTail());
    }

    return coinFaces;
}

function generateHeadOrTail() {

    let headOrTail = ""

    let randomVal = Math.random();

    if (randomVal < 0.5) {
        // tails
        headOrTail = "H";
    } else {
        // heads
        headOrTail = "T";
    }

    return headOrTail;
}

var output = document.getElementById("output");
var input = document.getElementById("flipCount");
var calculateBtn = document.getElementById("run");

function calculateAverage(flipCount) {

    output.innerHTML = "";

    // save best average?

    let sequence = generateHeadsTailsSequence(flipCount);

    let totalHeads = 0;
    let totalTails = 0;
    for (let i = 0; i < sequence.length; i++) {
        if (sequence[i] == "H") {
            totalHeads++;
        } else {
            totalTails++;
        }
    }

    output.innerHTML = "H: " + totalHeads + " T: " + totalTails + " Ratio: " + (Math.round(10000 * totalHeads/totalTails) / 100) + "%";

    // given a sequence of heads and tails

    let sequenceCount = 0;
    let headsCount = 0;
    let tailsCount = 0;
    let ratios = 0;

    let keepGoing = true;
    let index = 0;

    // while there are still coins
    while (keepGoing) {
        // if heads
        if (sequence[index] == "H") {
            // inc head count
            headsCount++;
        
        // else if tails
        } else if (sequence[index] == "T") {
            // inc tails count
            tailsCount++;
        }

        index++;

        if (index >= sequence.length) {
            keepGoing = false;
        }

        // if there are more heads than tails
        if (headsCount > tailsCount) {
            // save ratio
            ratios += headsCount / (headsCount + tailsCount);

            // inc seq count
            sequenceCount++;

            // reset heads, tails
            headsCount = 0;
            tailsCount = 0;
        }
    }

    // calculate average
    if (sequenceCount != 0) {
        let piValue = (ratios / sequenceCount);
        piValue = piValue * 4;

        output.innerHTML = "Off by: " + Math.abs(Math.PI - piValue) + "<br><br>" + output.innerHTML;
        output.innerHTML = "Approx " + piValue + "<br><br>" + output.innerHTML;

    } else {
        output.innerHTML = "Not enough data to Approximate<br>" + output.innerHTML;
    }
}

calculateBtn.addEventListener('click', function () {
    let flipCount = input.value;
    calculateAverage(flipCount);
});
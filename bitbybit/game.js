//Nicholas Norman, 2024, bitbybit/game.js

//data
var bits = 0;

//elements
var elOutput = document.getElementById("bits");
var elBitClicker = document.getElementById("bitclicker");
var elBitClickerP = document.getElementById("bitclickerp");
var elCheatCodeInput = document.getElementById("cheatcode-txt");
var elCheatCodeBtn = document.getElementById("cheatcode-btn");

//objects

//process input
elBitClicker.addEventListener("mousedown", function(e) {
    bitClickedDown();
});

elBitClicker.addEventListener("mouseup", function(e) {
    bitClickedUp();
});

elCheatCodeBtn.addEventListener("click", function() {
    cheat();
})

//process input - functions
function bitClickedDown() {
    //add 1 to bit counter
    bits++;
    //add visual response to clicking button
    //toggle color
    elBitClicker.classList.toggle("bit-1");
    elBitClicker.classList.toggle("bit-2");
    //toggle 1/0
    if (elBitClickerP.innerHTML == 0) {
        elBitClickerP.innerHTML = 1;
    } else {
        elBitClickerP.innerHTML = 0;
    }
    
}

function bitClickedUp() {
    //add visual response to clicking button
    //toggle color
    elBitClicker.classList.toggle("bit-1");
    elBitClicker.classList.toggle("bit-2");
}

function cheat() {
    code = elCheatCodeInput.value;

    //clear cheat bar
    elCheatCodeInput.value = "";

    //do programmed code
    if (code == "cookies+1000") {
        bits += 1000;
    }
}

//gameloop
var fps = 60;
var interval = (1/fps) * 1000;

function gameloop () {
    //process input
    //update data
    //display
    elOutput.innerHTML = bits;
}

window.setInterval(gameloop, interval);
/* binary calculator */

var bytePanel = document.getElementById("byteButtons");
var buttons = [0,0,0,0,0,0,0,0];
var total = 0;
var totalDisplay = document.getElementById("total");

//options
var binOption = document.getElementById("bin");
var twoscompOption = document.getElementById("twoscomp");

binOption.addEventListener("click", function() {
    //set button 1 to 128
    total = 0;
    updateTotal();
    resetButtons();
    document.getElementById("128").value = "128";
});

twoscompOption.addEventListener("click", function() {
    //set button 1 to -128
    total = 0;
    updateTotal();
    resetButtons();
    document.getElementById("128").value = "-128";
});

//event listner
bytePanel.addEventListener("click", function(e) {
    //give class to button
    if(e.target.tagName === "BUTTON") {
        buttonPress(e.target);
    }
});

function buttonPress(button) {
    //set to 1 or 0
    if(button.innerHTML == "0") {
        button.innerHTML = "1";

        total += Number(button.value);
    } else {
        button.innerHTML = "0";

        total -= Number(button.value);
    }

    //toggle class yellow or default
    button.classList.toggle("yellow");

    //add or subtract to value
    updateTotal();
}

function updateTotal() {
    totalDisplay.innerHTML = total;
}

function resetButtons() {
    var buttons = document.getElementsByTagName("BUTTON");
        for(var i=0; i < buttons.length; i++) {
            buttons[i].classList.remove("yellow");
            buttons[i].innerHTML = "0";
        }
}

//----------------------------------------------------------//

var newBitPanel = document.getElementById("new-bits");
var bitTotal = document.getElementById("bit-total");
var currentSum = 0

newBitPanel.addEventListener("click", function(e) {
    //give class to button
    if(e.target.tagName === "BUTTON") {
        newButtonPress(e.target);
    }
});

function newButtonPress(button) {
    //set to 1 or 0
    if(button.innerHTML == "0") {
        button.innerHTML = "1";

        currentSum += Number(button.value);
    } else {
        button.innerHTML = "0";

        currentSum -= Number(button.value);
    }

    //toggle class yellow or default
    button.classList.toggle("yellow");

    //get index of this button, then go that many to get 2^x and addition
    var columnWidth = 17;
    var children = newBitPanel.children;
    var index = Array.from(children).indexOf(button);

    //assume that it is every even from left to right
    var powerIndex = 2 * columnWidth + index;
    var addIndex = 4 * columnWidth + index;
    var powerValue = 0;

    powerValue = index / 2;
    powerValue = 7 - powerValue;
    powerValue = Math.pow(2, powerValue);

    if (button.innerHTML == "1") {
        children[powerIndex].classList.add("yellow");
        children[powerIndex].classList.remove("white");

        children[addIndex].innerHTML = powerValue;
    } else {
        children[powerIndex].classList.remove("yellow");
        children[powerIndex].classList.add("white");
    
        children[addIndex].innerHTML = "0";
    }

    console.log(index)
    


    //add or subtract to value
    newUpdateTotal();
}

function newUpdateTotal() {
    bitTotal.innerHTML = currentSum;
}
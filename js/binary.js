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
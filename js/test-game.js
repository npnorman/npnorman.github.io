// it tycoon.js

//important html elements
bucks = document.getElementById("bucks");
watts = document.getElementById("watts");
jobPanel = document.getElementById("job-panel");
potatoPanel = document.getElementById("potato-panel");

//amounts
bucksAmt = 0;
wattsAmt = 0;

function updateDisplay() {
    bucks.innerHTML = bucksAmt;
    watts.innerHTML = wattsAmt;
}

function addBucks(amt) {
    bucksAmt += amt;
}

function addWatts(amt) {
    wattsAmt += amt;
}

function loop() {
    
    while(true) {
        setTimeout(function() {
            addWatts(1);
            updateDisplay();
        }, 5000);
    }
}

jobPanel.addEventListener("click", function(e) {
    //check for button
    if(e.target.tagName === "BUTTON") {
        //call a function
        addBucks(1);
        updateDisplay();
    }
});

potatoPanel.addEventListener("click", function(e) {
    //check for button
    if(e.target.tagName === "BUTTON") {
        //call a function
        e.target.remove();
        loop();
    }
});
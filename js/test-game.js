// it tycoon.js

//important html elements
bucks = document.getElementById("bucks");
jobPanel = document.getElementById("job-panel");
potatoPanel = document.getElementById("potato-panel");

//amounts
bucksAmt = 0;

function updateDisplay() {
    bucks.innerHTML = bucksAmt;
}

function addBucks(amt) {
    bucksAmt += amt;
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
        
    }
});
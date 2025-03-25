
var start = document.getElementById("start");
var end = document.getElementById("end");
var callBtn = document.getElementById("call");
var currentNumP = document.getElementById("current-num");
var calledNumsP = document.getElementById("called-nums");
var setBtn = document.getElementById("set");

var numbers = [];

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function resetNumbers() {
    numbers = [];

    for (var i = Number(start.value); i < Number(end.value)+1; i++) {
        numbers.push(i);
    }

    //reset called numbers
    calledNumsP.textContent = "";
    //reset current num
    currentNumP.textContent = "";
}

function callNumber() {

    if(numbers.length == 0) {
        resetNumbers();
    }

    //call a number randomly without replacement
    var randIndex = getRandomInt(0, numbers.length-1);
    var randNum = numbers[randIndex];

    //add it to called numbers
    calledNumsP.textContent += randNum + ", ";

    //set it as the current num
    currentNumP.textContent = randNum;

    numbers.splice(randIndex, 1);

    if(numbers.length == 0) {
        alert("End List")
    }
}

callBtn.addEventListener("click", callNumber);
setBtn.addEventListener("click", resetNumbers);
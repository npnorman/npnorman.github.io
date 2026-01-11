
var start = document.getElementById("start");
var end = document.getElementById("end");
var callBtn = document.getElementById("call");
var currentNumP = document.getElementById("current-num");
var calledNumsP = document.getElementById("called-nums");
var setBtn = document.getElementById("set");
var noticeP = document.getElementById("notice");

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

    //enable call button
    callBtn.disabled = false;

    //notice disabled
    noticeP.style.display = "none";

    //background color
    currentNumP.style.backgroundColor = "white";
}

function addToCalledList(num) {
    calledNumsP.innerHTML += "<span class=\"mini-ball\">" + num + "</span> ";
}

function setRandomNumber(num, ms) {

    if (ms <= 100) {
        //set num
        currentNumP.textContent = num;

        //set text color to red
        currentNumP.style.color = "red";
        
        //add to called
        addToCalledList(num);
    
    } else {
        let randIndex = getRandomInt(0, numbers.length - 1);
        currentNumP.textContent = numbers[randIndex];
        setTimeout(function() {
            setRandomNumber(num, ms - 20);
        }, ms - 10);
    }
}

function setAsLastCalled(num) {
    //set text color to light
    currentNumP.style.color = "rgb(255, 119, 119)";

    // go through set random numbers with slowdown
    setRandomNumber(num, 200);
}

function setEndOfList() {
    // disable button
    callBtn.disabled = true;

    // display end of list
    noticeP.style.display = "block";

    // color last called background
    currentNumP.style.backgroundColor = "pink";
}

function callNumber() {

    if(numbers.length == 0) {
        resetNumbers();
    }

    //call a number randomly without replacement
    var randIndex = getRandomInt(0, numbers.length-1);
    var randNum = numbers[randIndex];

    //set it as the current num
    setAsLastCalled(randNum);

    numbers.splice(randIndex, 1);

    if(numbers.length == 0) {
        setEndOfList();
    }
}

callBtn.addEventListener("click", callNumber);
setBtn.addEventListener("click", resetNumbers);
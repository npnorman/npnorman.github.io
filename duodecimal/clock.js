/*
Nicholas Norman
15 Sep 2024
Clock.js
*/

function log12(x) {
    //goal: log base 12
    //input: x
    //output: log12(x)

    return Math.log(x) / Math.log(12);
}

function digit10to12(num) {
    //goal: convert a single digit of base 10 to base 12 (0-11)
    //input: num
    //output: base12 num

    var digit = "";

    if (num <= 9 && num >= 0) {
        //keep same digit
        digit = num.toString();
    } else if (num == 10) {
        digit = "a";
    } else if (num == 11) {
        digit = "b";
    } else {
        //does not work
        digit = NaN;
    }

    return digit;
}

function base10to12(num) {
    //goal: convert base 10 to 12
    //input: a base 10 number
    //output: a base 12 number

    //base 12 num
    var num12 = "";

    //take log12 to find highest divisible amount by 12
    var exp = Math.floor(log12(num));

    //for every number from exp to 0:
    for (exp; exp >= 0; exp--) {
        //integer divide by log12(num) <-- digit
        var digit = Math.floor(num / Math.pow(12, exp));

        //mod by log12(num) <-- new num
        var remainder = num % Math.pow(12, exp);
        num = remainder;

        //add digit
        num12 += digit10to12(digit);
    }

    return num12;
}

//elements
elHours = document.getElementById("hours");
elMinutes = document.getElementById("minutes");
elSeconds = document.getElementById("seconds");

//data
var hours = "";
var minutes = "";
var seconds = "";

function updateTime() {
    //goal: set clock to current time
    //input: none
    //output: time is updated

    //get current time
    var currentDate = new Date();

    //set hours to base12 hours
    var hours10 = currentDate.getHours();
    hours = base10to12(hours10);

    //set minutes to base12 minutes
    var minutes10 = currentDate.getMinutes();
    minutes = base10to12(minutes10);

    //set seconds to base12 seconds
    var seconds10 = currentDate.getSeconds();
    seconds = base10to12(seconds10);
}

function updateClock() {
    //goal: update clock display
    //input: none
    //output: updated clock display

    //pad all displays
    hours = hours.padStart(2, 0);
    minutes = minutes.padStart(2, 0);
    seconds = seconds.padStart(2, 0);

    //update displays
    elHours.textContent = hours;
    elMinutes.textContent = minutes;
    elSeconds.textContent = seconds;
}

//clock loop
function clockloop() {
    //goal: run the clock
    //input: clock functions
    //output: clock is updated

    updateTime();
    updateClock();
}

//update on an interval of 100 ms
window.setInterval(clockloop, 100);
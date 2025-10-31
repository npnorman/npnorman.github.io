//scratch-off.js
//Nicholas Norman October 2025
//This is a scratch off simulator with no money!

var canvas = document.getElementById("canvas");
var prize = document.getElementById("prize");
var ctx = canvas.getContext("2d");
var ptx = prize.getContext("2d");
var isClicking = false;

var numbers = [];
var isWinner = false;

function draw(number) {
    //text
    ptx.font = "74px serif";
    ptx.fillText(number, 50 - 15, 50 + 20);

    //cover
    ctx.fillStyle = "red";
    ctx.fillRect(0,0,100,100);
}

function drawCircle(x,y) {
    ctx.globalCompositeOperation = "destination-out";
    ctx.beginPath();
    ctx.arc(x,y,10,0,2 * Math.PI);
    // ctx.fillStyle = "#00000000";
    ctx.fill();
}

function getLeftPercent() {
    var imageData = ctx.getImageData(0,0, canvas.width, canvas.height);
    var pixels = imageData.data;

    var colorLeftCount = 0;
    for (var i=0; i < pixels.length; i++) {
        var alpha = pixels[i + 3];
        if (alpha > 0) {
            colorLeftCount++;
        }
    }

    return colorLeftCount / pixels.length;
}

canvas.addEventListener('mousemove', function(e) {
    if(isClicking) {
        var canvasBounds = canvas.getBoundingClientRect();
        var mouseX = e.clientX - canvasBounds.left;
        var mouseY = e.clientY - canvasBounds.top;

        drawCircle(mouseX,mouseY);
    }
});

canvas.addEventListener('touchmove', function(e){
    var canvasBounds = canvas.getBoundingClientRect();
    var mouseX = e.touches[0].clientX - canvasBounds.left;
    var mouseY = e.touches[0].clientY - canvasBounds.top;

    drawCircle(mouseX,mouseY);
});

document.body.addEventListener('mousedown', function() {
    isClicking = true;
});

document.body.addEventListener('mouseup', function() {
    isClicking = false;
});

function checkNumbers() {
    if (getLeftPercent() > 0.40) {
        setTimeout(checkNumbers, 100);
    } else {
        if (isWinner) {
            document.getElementById("winner").innerHTML = "CONGRATS!";
        }
    }
}

setTimeout(checkNumbers, 1000);

var randomInt = Math.floor(Math.random() * 10);
var randomWin = Math.floor(Math.random() * 10);

document.getElementById("winningNumber").innerHTML = randomWin;

if (randomInt ==randomWin) {
    isWinner = true;
}

numbers.push(randomInt);
draw(randomInt);
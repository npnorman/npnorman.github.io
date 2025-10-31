//scratch-off.js
//Nicholas Norman October 2025
//This is a scratch off simulator with no money!

var canvas = document.getElementById("canvas");
var prize = document.getElementById("prize");
var ctx = canvas.getContext("2d");
var ptx = prize.getContext("2d");
var isClicking = false;

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

canvas.addEventListener('mousemove', function(e) {
    if(isClicking) {
        var canvasBounds = canvas.getBoundingClientRect();
        var mouseX = e.clientX - canvasBounds.left;
        var mouseY = e.clientY - canvasBounds.top;

        drawCircle(mouseX,mouseY);
    }
});

document.body.addEventListener('mousedown', function() {
    isClicking = true;
});

document.body.addEventListener('mouseup', function() {
    isClicking = false;
});

var randomInt = Math.floor(Math.random() * 10);

draw(randomInt);
console.log("hello world");

const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

//fill a rect
ctx.fillStyle = "red";

ctx.clearRect(0, 0, canvas.width, canvas.height);

x = 10;
y = 10;

movementVector = [0,0];

speed = 20; //per sec

//elements
elX = document.getElementById("x");
elY = document.getElementById("y");
elSpeed = document.getElementById("speed");

function display() {

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillRect(x, y, 20, 20);

    elX.innerHTML = Number.parseFloat(x).toFixed(2);
    elY.innerHTML = Number.parseFloat(y).toFixed(2);
}

function update() {
    speed = elSpeed.value;

    x += speed * movementVector[0] * dTime;
    y += speed * movementVector[1] * dTime;
}

//movement from keys
function move(key, type) {

    if (key == "ArrowDown") {
        if (type == "down") {
            movementVector[1] = 1;
        } else if (type == "up") {
            movementVector[1] = 0
        }
    } else if (key == "ArrowUp") {
        if (type == "down") {
            movementVector[1] = -1;
        } else if (type == "up") {
            movementVector[1] = 0
        }
    } else if (key == "ArrowRight") {
        if (type == "down") {
            movementVector[0] = 1;
        } else if (type == "up") {
            movementVector[0] = 0
        }
    } else if (key == "ArrowLeft") {
        if (type == "down") {
            movementVector[0] = -1;
        } else if (type == "up") {
            movementVector[0] = 0
        }
    }
}

function gameloop() {
    update();
    display();
}

window.addEventListener("keydown", function(e) {
    move(e.key, "down");
});

window.addEventListener("keyup", function(e) {
    move(e.key, "up")
})

fps = 60;
dTime = 1/fps;
interval = dTime * 1000;

setInterval(gameloop, interval);
//color-classifier.js
//Nicholas Norman November 2026
//A game to classify colors

var colors = document.getElementById("colors");

function colorToHex(color) {

    let red = color[0].toString(16);
    let green = color[1].toString(16);
    let blue = color[2].toString(16);

    if (red.length < 2) {
        red = '0' + red;
    }
    if (green.length < 2) {
        green = '0' + green;
    }
    if (blue.length < 2) {
        blue = '0' + blue;
    }

    let hexstr = '#' + red + green + blue;
    return hexstr;
}

let currentColor = [0,0,0]
let colorInc = 25;
let firstIncrement = true;

for (let i = 0; i < 10000; i++) {
    let new_para = document.createElement("p");
    new_para.style.backgroundColor = colorToHex(currentColor);
    new_para.classList.add("color-box");
    colors.appendChild(new_para);

    currentColor[0] = Math.min(currentColor[0] + colorInc, 255)

    if (currentColor[0] >= 255) {
        currentColor[0] = 0;
        currentColor[1] += colorInc;
        currentColor[1] = Math.min(currentColor[1], 255)
    }
    if (currentColor[1] >= 255) {
        currentColor[1] = 0;
        currentColor[2] += colorInc;
        currentColor[2] = Math.min(currentColor[2], 255)
    }
    if (currentColor[2] >= 255 && firstIncrement) {
        currentColor[2] = 0;
        console.log(currentColor)
        firstIncrement = false;
    } else if (firstIncrement == false) {
        break;
    }
}

console.log(currentColor)
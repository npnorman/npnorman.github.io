//Nicholas Norman, 2024, bitbybit/game.js

//data
var bits = 0;

//elements
var elOutput = document.getElementById("bits");
var elBitClicker = document.getElementById("bitclicker");
var elBitClickerP = document.getElementById("bitclickerp");
var elCheatCodeInput = document.getElementById("cheatcode-txt");
var elCheatCodeBtn = document.getElementById("cheatcode-btn");
var elBitMakerDiv = document.getElementById("bitmakers");

//constructors
function bitMaker(bps, name, price) {
    this.bps = bps;
    this.owned = 0;
    this.name = name;
    this.upgrade = 1;
    this.price = price;

    this.currentPrice = function() {
        //get current price
        return Math.round(this.price * Math.pow(1.15, this.owned));
    }

    this.buy = function() {
        //called when this item is bought
        //add one to owned
        this.owned++;
    }

    this.update = function() {
        //return the amount of bits to add in total
        return this.bps * this.owned * this.upgrade;
    }
}

//objects
var bitMakerList = [
    ["On/Off Button",0.1,8],
    ["Hello World Program",1,128],
    ["Sorting Algorithm",10,2048],
    ["Computer Science Professor",100,32768],
    ["Water Adder",1000,524288],
    ["Voxel Game PC",10000,2097152],
    ["Computer (PC)",100000,67108864],
    ["Big Tech Company",1000000,536870912],
    ["Robot Doppelgangers",10000000,4234967296]
];

var bitMakers = [];

for (var i = 0; i < bitMakerList.length; i++) {
    //make a list of bitMakers
    bitMakers.push(new bitMaker(bitMakerList[i][1],bitMakerList[i][0],bitMakerList[i][2]));
}

//process input
elBitClicker.addEventListener("mousedown", function(e) {
    bitClickedDown();
});

elBitClicker.addEventListener("mouseup", function(e) {
    bitClickedUp();
});

elCheatCodeBtn.addEventListener("click", function() {
    cheat();
})

//process input - functions
function bitClickedDown() {
    //add 1 to bit counter
    bits++;
    //add visual response to clicking button
    //toggle color
    elBitClicker.classList.toggle("bit-1");
    elBitClicker.classList.toggle("bit-2");
    //toggle 1/0
    if (elBitClickerP.innerHTML == 0) {
        elBitClickerP.innerHTML = 1;
    } else {
        elBitClickerP.innerHTML = 0;
    }
    
}

function bitClickedUp() {
    //add visual response to clicking button
    //toggle color
    elBitClicker.classList.toggle("bit-1");
    elBitClicker.classList.toggle("bit-2");
}

function cheat() {
    code = elCheatCodeInput.value;

    //clear cheat bar
    elCheatCodeInput.value = "";

    //do programmed code
    if (code == "cookies+1000") {
        bits += 1000;
    } else if (code == "don cheatle") {
        for (var n = 0; n < bitMakers.length; n++) {
            bitMakers[n].buy();
        }
    }
}

//update
function update() {
    //update data

    //update bits from bitMakers
    for (var j = 0; j < bitMakers.length; j++) {
        bits += bitMakers[j].update() * (1/fps);
    }
}

//load on-screen displays
function createBitMaker(name, currentPrice) {
    //template for bit maker element
    //need name, current price, buy button
    var item = document.createElement("p"); /**************************************************************add id and price to span, so i can update them */
    item.textContent = name + ": " + currentPrice + " ";
    item.classList.add("bitMakers");

    var button = document.createElement("button"); //********************************************************add eventlistner to div for buttons to buy */
    button.textContent = "Buy!";
    button.value = name;

    item.appendChild(button);
    elBitMakerDiv.appendChild(item);
}

for (var k = 0; k < bitMakers.length; k++) {
    //create a new obj
    createBitMaker(bitMakers[k].name, bitMakers[k].price);
}

//gameloop
var fps = 60;
var interval = (1/fps) * 1000;

function gameloop () {
    //process input
    //update data
    update();

    //display <-- have all bitMaker and upgrade displays updated (not linked to items)
    elOutput.innerHTML = Math.round(bits);
}

window.setInterval(gameloop, interval);
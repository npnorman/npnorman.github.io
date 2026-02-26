//diffie-hellman-game.js
//Nicholas Norman February 2026
//

var k1 = document.getElementById("s-key");
var P = document.getElementById("P");
var out1 = document.getElementById("out1");
var out2 = document.getElementById("out2");
var c1 = document.getElementById("c1");
var c2 = document.getElementById("c2");
var checkbox = document.getElementById("cb");

var kout = document.getElementById("k-out");
var pout = document.getElementById("p-out");
var sout = document.getElementById("s-out");

c1.addEventListener('click', function () {
    let pVal = Math.pow(5, k1.value) % 23;
    out1.innerHTML = pVal;
    out1.innerHTML = "<b>" + out1.innerHTML + "</b>";

    kout.innerHTML = k1.value;
    pout.innerHTML = pVal;
});

c2.addEventListener('click', function () {
    let sVal = Math.pow(P.value, k1.value) % 23;
    out2.innerHTML = sVal;
    out2.innerHTML = "<b>" + out2.innerHTML + "</b>";

    sout.innerHTML = sVal;
});

checkbox.addEventListener('click', function () {

    let sc = document.getElementsByClassName("scared");

    if (checkbox.checked) {
        for (let i = 0; i < sc.length; i++) {
            sc[i].classList.add("scared-on");
        }
    } else {
        for (let i = 0; i < sc.length; i++) {
            sc[i].classList.remove("scared-on");
        }
    }
});
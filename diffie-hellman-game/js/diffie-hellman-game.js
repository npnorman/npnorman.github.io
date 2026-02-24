//diffie-hellman-game.js
//Nicholas Norman February 2026
//

var k1 = document.getElementById("s-key")
var k2 = document.getElementById("s-key2")
var P = document.getElementById("P")
var out1 = document.getElementById("out1")
var out2 = document.getElementById("out2")
var c1 = document.getElementById("c1")
var c2 = document.getElementById("c2")

c1.addEventListener('click', function () {
    out1.innerHTML = Math.pow(5, k1.value) % 23;
});

c2.addEventListener('click', function () {
    out2.innerHTML = Math.pow(P.value, k2.value) % 23;
});
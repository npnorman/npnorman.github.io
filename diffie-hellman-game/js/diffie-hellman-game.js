//diffie-hellman-game.js
//Nicholas Norman February 2026
//

var k1 = document.getElementById("s-key")
var P = document.getElementById("P")
var out1 = document.getElementById("out1")
var out2 = document.getElementById("out2")
var c1 = document.getElementById("c1")
var c2 = document.getElementById("c2")
var checkbox = document.getElementById("cb")

c1.addEventListener('click', function () {
    out1.innerHTML = Math.pow(5, k1.value) % 23;
});

c2.addEventListener('click', function () {
    out2.innerHTML = Math.pow(P.value, k1.value) % 23;
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
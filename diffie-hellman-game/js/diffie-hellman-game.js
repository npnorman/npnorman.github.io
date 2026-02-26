//diffie-hellman-game.js
//Nicholas Norman February 2026
//

function mod(n, d) {
  return ((n % d) + d) % d;
}

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
var sout2 = document.getElementById("s-out2");

var encryptBtn = document.getElementById("encrypt");
var decryptBtn = document.getElementById("decrypt");
var plaintextBox = document.getElementById("plaintext");
var ciphertextBox = document.getElementById("ciphertext");

var s = 0;

c1.addEventListener('click', function () {
    let pVal = Math.pow(6, k1.value) % 13;
    out1.innerHTML = pVal;
    out1.innerHTML = "<b>" + out1.innerHTML + "</b>";

    kout.innerHTML = k1.value;
    pout.innerHTML = pVal;
});

c2.addEventListener('click', function () {
    let sVal = Math.pow(P.value, k1.value) % 13;
    out2.innerHTML = sVal;
    out2.innerHTML = "<b>" + out2.innerHTML + "</b>";

    sout.innerHTML = sVal;
    sout2.innerHTML = sVal;
    s = sVal;
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

function shiftEncrypt(key, plaintext) {
    if (key < 0 || key > 25) {
        key = 0;
    }

    let ciphertext = "";

    // for each letter in plaintext
    for (let i = 0; i < plaintext.length; i++) {

        if (plaintext[i].toLowerCase() == plaintext[i].toUpperCase()) {
            // is not a letter
            ciphertext += plaintext[i];

        } else {
            // convert to number
            let charNum = plaintext[i].toLowerCase().charCodeAt(0) - 97;

            // add shift
            charNum += key;

            // modulo to circle back
            charNum = mod(charNum, 26);

            ciphertext += String.fromCharCode(97 + charNum);
        }
    }
    
    // return ciphertext
    return ciphertext.toUpperCase();
}

function shiftDecrypt(key, ciphertext) {
    if (key < 0 || key > 25) {
        key = 0;
    }

    let plaintext = "";

    // for each letter in ciphertext
    for (let i = 0; i < ciphertext.length; i++) {

        if (ciphertext[i].toLowerCase() == ciphertext[i].toUpperCase()) {
            // is not a letter
            plaintext += ciphertext[i];

        } else {
            // convert to number
            let charNum = ciphertext[i].toLowerCase().charCodeAt(0) - 97;

            // subtract shift
            charNum -= key;

            // modulo to circle back
            charNum = mod(charNum, 26);

            plaintext += String.fromCharCode(97 + charNum);
        }
    }
    
    // return ciphertext
    return plaintext;
}

encryptBtn.addEventListener('click', function () {
    let plaintext = plaintextBox.value;
    let ciphertext = shiftEncrypt(s,plaintext);

    ciphertextBox.value = ciphertext;
});

decryptBtn.addEventListener('click', function () {
    let ciphertext = ciphertextBox.value;
    let plaintext = shiftDecrypt(s,ciphertext);

    plaintextBox.value = plaintext;
});

let key = 25;
let t = shiftEncrypt(key, "HELLO, ABCD");
console.log(t);
console.log(shiftDecrypt(key,t));
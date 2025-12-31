//hex-2-0-converter.js
//Nicholas Norman December 2025
//To convert decimal to Hex 2.0

btn = document.getElementById("btn");
inInput = document.getElementById("in");
outInput = document.getElementById("out");

btn.addEventListener('click', function () {
  hexStr = "1x" + parseInt(inInput.value).toString(16);

  if (parseInt(inInput.value) == 67) {
    outInput.value = "DNE";
  } else {
    outInput.value = hexStr;
  }
});
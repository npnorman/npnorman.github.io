//function-name-generator.js
//Nicholas Norman May 2026
//clean a string to work as a snake_case python function name

var input = document.getElementById("input");
var output = document.getElementById("output");

function clean_text() {

    let cleanText = input.value;

    // remove bad characters
    cleanText = cleanText.replace(/[^a-z0-9\_\s]/gi, "");

    // replace spaces with _
    cleanText = cleanText.trim();
    cleanText = cleanText.replace(/\s+/g, '_');

    // all lowercase
    cleanText = cleanText.toLowerCase();

    output.textContent = cleanText;
}

input.addEventListener('input', clean_text);
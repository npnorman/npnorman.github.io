var buccoman = document.getElementById("live-buccoman");
var buccomanButton = document.getElementById("buccoman-button");
var bryan = document.getElementById("live-bryanonapc");
var bryanButton = document.getElementById("bryanonapc-button");
var minermom = document.getElementById("live-minermom");
var minermomButton = document.getElementById("minermom-button");

buccoman.classList.add("hidden");
bryan.classList.add("hidden");
minermom.classList.add("hidden");

buccomanButton.addEventListener('click', function() {
    toggleStream(buccoman);
});
bryanButton.addEventListener('click', function() {
    toggleStream(bryan);
});
minermomButton.addEventListener('click', function() {
    toggleStream(minermom);
});

function toggleStream(elStream) {
    elStream.classList.toggle("hidden");
}
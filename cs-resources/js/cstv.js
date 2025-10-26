
var videoURLs = [
    ["v6hm27o_gLM","How To Be A Good Programmer"],
    ["y6dS-xX_Nt4","The 7 Big Ideas of Programming"],
    ["azcrPFhaY9k","How to Think Like a Programmer"],
    ["vkUNH9r6UCI","Stanford Lecture - Don Knuth: The Analysis of Algorithms (2015, recreating 1969)"],
    ["3DKo219ZHMw","Stanford Lecture: Don Knuth - \"Pi and The Art of Computer Programming\" (2019)"]
];

var gallery = document.getElementById("gallery");
var player = document.getElementById("player");

function loadVideo(videoId) {
    player.src = "https://www.youtube.com/embed/" + videoId + "?autoplay=1";
}

for (var i=0; i < videoURLs.length; i++) {
    var li = document.createElement("li");
    var img = document.createElement("img");
    img.src = "https://img.youtube.com/vi/" + videoURLs[i][0] + "/hqdefault.jpg";

    var p = document.createElement("p");
    var node = document.createTextNode(videoURLs[i][1]);

    li.dataset.url = videoURLs[i][0];

    li.addEventListener('click', function() {
        loadVideo(this.dataset.url);
    });

    p.appendChild(node);
    li.appendChild(img);
    li.appendChild(p);
    gallery.appendChild(li);
}
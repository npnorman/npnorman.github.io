//treasure-map.js
//Nicholas Norman April 2026
//This is a map of some cool places I have found on the internet to explore.

//**********************
// FUTURE:
// Wavy edges like a map
// background of land and water
// easy way to add new links / new points
// wavy lines to each point (non-intersecting)
// draw related objects as line art near points?
//**********************

const map_canvas = document.getElementById('map-canvas');
const ctx = map_canvas.getContext("2d");

var points = [
    [1, 1],
    [2, 1],
    [3, 2]
];

var point_urls = [
    "https://npnorman.github.io/",
    "https://technews.acm.org/",
    "https://www.youtube.com/"
]

var modified_points = [];

function modify_points(modifier=100) {
    for (let i = 0; i < points.length; i++) {
        modified_points.push([points[i][0] * modifier, points[i][1] * modifier]);
    }
}

function draw_point(point, color="black", width=20) {

    ctx.beginPath();
    ctx.arc(point[0], point[1], width, 0, 2 * Math.PI);

    //color
    ctx.fillStyle = color;
    ctx.fill();

    ctx.stroke();
}

function connect_points(p1, p2) {
    ctx.beginPath();
    ctx.setLineDash([10, 10]);
    ctx.lineWidth = 5;
    ctx.moveTo(p1[0], p1[1]);
    ctx.lineTo(p2[0], p2[1]);
    ctx.stroke();
    
    //cleanup
    ctx.setLineDash([0, 0]);
    ctx.lineWidth = 0;
}

function go_to_url(url) {
    window.open(url, "_blank");
}

function render_text(text, sizeFont, color, x, y) {
    ctx.font = sizeFont;
    ctx.fillStyle = color;
    ctx.fillText(text, x, y);
}

function draw_setup() {

    render_text("Nick's Internet Treasure Map", "30px serif", "black", 325, 40);

    for (let i = 0; i < modified_points.length; i++) {
        draw_point(modified_points[i]);

        if (i < modified_points.length - 1) {
            // connect points
            connect_points(modified_points[i], modified_points[i+1]);
        }
    }
}

modify_points();
draw_setup();

function distance_between(x1, y1, x2, y2) {
    return Math.sqrt( (x2-x1) ** 2 + (y2-y1) ** 2 );
}

// mouse events
map_canvas.addEventListener('mousemove', function (e) {

    let x1 = e.offsetX;
    let y1 = e.offsetY;

    let is_in_radius = false;
    let radius_index = 0;

    for (let i = 0; i < modified_points.length; i++) {
        // check distance from some radius
        let x2 = modified_points[i][0];
        let y2 = modified_points[i][1];
        
        let distance = distance_between(x1, y1, x2, y2);

        if (distance < 20) {
            is_in_radius = true;
            radius_index = i;
        }
    }

    if (is_in_radius) {
        //redraw as colored
        draw_point(modified_points[radius_index], color="red");
        render_text(point_urls[radius_index], "20px serif", "red", modified_points[radius_index][0] - 75, modified_points[radius_index][1] - 40);

    } else {
        //redraw
        ctx.clearRect(0, 0, map_canvas.width, map_canvas.height);
        draw_setup();
    }
});

map_canvas.addEventListener('mousedown', function (e) {

    let x1 = e.offsetX;
    let y1 = e.offsetY;

    for (let i = 0; i < modified_points.length; i++) {
        // check distance from some radius
        let x2 = modified_points[i][0];
        let y2 = modified_points[i][1];
        
        let distance = distance_between(x1, y1, x2, y2);

        if (distance < 20) {
            //redraw as colored
            draw_point(modified_points[i], color="green");
        }
    }
});

map_canvas.addEventListener('mouseup', function (e) {

    let x1 = e.offsetX;
    let y1 = e.offsetY;

    for (let i = 0; i < modified_points.length; i++) {
        // check distance from some radius
        let x2 = modified_points[i][0];
        let y2 = modified_points[i][1];
        
        let distance = distance_between(x1, y1, x2, y2);

        if (distance < 20) {
            //redraw as colored
            draw_point(modified_points[i], color="red");
        }
    }
});

map_canvas.addEventListener('click', function (e) {
    let x1 = e.offsetX;
    let y1 = e.offsetY;

    for (let i = 0; i < modified_points.length; i++) {
        // check distance from some radius
        let x2 = modified_points[i][0];
        let y2 = modified_points[i][1];
        
        let distance = distance_between(x1, y1, x2, y2);

        if (distance < 20) {
            //show links
            console.log("Showing links", i);
            go_to_url(point_urls[i]);

        } else {
            //hide links
            console.log("Hiding other links", i);
        }
    }
});
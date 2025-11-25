//javascript-renderer.js
//Nicholas Norman October 2025
//render edges or faces of rotating objects to the screen

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var fovInput = document.getElementById("fov");
var fovLabel = document.getElementById("fov-label");
var dxInput = document.getElementById("dx");
var dyInput = document.getElementById("dy");

class point3D {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    static dotProduct(p1,p2) {
        return p1.x * p2.x + p1.y * p2.y + p1.z * p2.z;
    }

    static add(p1,p2) {
        return new point3D(
            p1.x + p2.x,
            p1.y + p2.y,
            p1.z + p2.z
        );
    }

    static scale(p1, scalar) {
        return new point3D(
            p1.x * scalar,
            p1.y * scalar,
            p1.z * scalar
        );
    }

    static crossProduct(p1,p2) {
        return new point3D (
            p1.y * p2.z - p1.z * p2.y,
            p1.z * p2.x - p1.x * p2.z,
            p1.x * p2.y - p1.y * p1.z
        )
    }
}

class point2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }

    static dotProduct(p1,p2) {
        return p1.x * p2.x + p1.y * p2.y;
    }

    static add(p1,p2) {
        return new point2D(
            p1.x + p2.x,
            p1.y + p2.y
        );
    }

    static scale(p1, scalar) {
        return new point2D(
            p1.x * scalar,
            p1.y * scalar
        );
    }

    static crossProduct(p1,p2) {
        return p1.x * p2.y - (p1.y * p2.x);
    }
}

class edge {
    constructor(p1,p2) {
        this.points = [p1,p2];
    }
}

class face {
    constructor(p1,p2,p3) {
        this.points = [p1,p2,p3];
    }
}

// var z = 0;
// var points = [
//     new point3D(-1,1,z),
//     new point3D(1,1,z),
//     new point3D(-1,-1,z),
//     new point3D(1,-1,z)
// ];
// var edges = [
//     new edge(0,2),
//     new edge(0,1),
//     new edge(1,3),
//     new edge(2,3)];

//cube ----------------------------------
//    4 ----- 5
//   /|      /|
//  0-----1  | 
//  | 6----|-7
//  |/     |/
//  2-----3

var points = [
    new point3D(-1,  1,  1), // 0
    new point3D( 1,  1,  1), // 1
    new point3D(-1, -1,  1), // 2
    new point3D( 1, -1,  1), // 3

    new point3D(-1,  1, -1), // 4
    new point3D( 1,  1, -1), // 5
    new point3D(-1, -1, -1), // 6
    new point3D( 1, -1, -1)  // 7
];

var edges = [
    // Top face
    new edge(0,1),
    new edge(1,3),
    new edge(3,2),
    new edge(2,0),

    // Bottom face
    new edge(4,5),
    new edge(5,7),
    new edge(7,6),
    new edge(6,4),

    // Vertical connections
    new edge(0,4),
    new edge(1,5),
    new edge(2,6),
    new edge(3,7)
];

var faces = [
    new face(0,1,2),
    new face(1,2,3)
];
// end cube ------------------------

var rotateAmtX = 0;
var rotateAmtY = 0;

function project(point, fov, ortho=false) {

    var px = (point.x * fov) / (point.z + fov);
    var py = (point.y * fov) / (point.z + fov);
    var projectedPoint = new point2D(px,py);

    return projectedPoint;
}

function rotateX(point, angle) {
    return new point3D(
        point.x,
        point.y * Math.cos(angle) - (Math.sin(angle) * point.z),
        point.y * Math.sin(angle) + Math.cos(angle) * point.z
    );
}

function rotateY(point, angle) {
    return new point3D(
        point.x * Math.cos(angle) + point.z * Math.sin(angle),
        point.y,
        point.z * Math.cos(angle) - (point.x * Math.sin(angle))
    );
}

function scale(point, scale) {
    return new point3D(point.x * scale, point.y * scale, point.z * scale);
}

function offset(point, offsetX, offsetY) {
    return new point3D(
        point.x + offsetX,
        point.y + offsetY,
        point.z
    );
}

function isFacingForward(face, facePoints) {
    var v0 = facePoints[face.points[0]];
    var v1 = facePoints[face.points[1]];
    var v2 = facePoints[face.points[2]];

    var v2v0 = point3D.add(
        v2,
        point3D.scale(v0,-1)
    );

    var v1v0 = point3D.add(
        v1,
        point3D.scale(v0,-1)
    );

    var n = point3D.crossProduct(v2v0, v1v0);

    result = point3D.dotProduct(v1,n) >= 0;

    return true;
}

function drawEdge(point1, point2, width=1,color="black") {
    ctx.beginPath();
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.stroke();
}

function drawFace(point1, point2, point3, color="red") {
    ctx.beginPath();
    ctx.moveTo(point1.x, point1.y);
    ctx.lineTo(point2.x, point2.y);
    ctx.lineTo(point3.x, point3.y);
    ctx.closePath();

    ctx.fillStyle = color;
    ctx.fill();
}

function update(fov, dx, dy) {
    var offsetX = canvas.width / 2;
    var offsetY = canvas.height / 2;

    //angle delta
    rotateAmtX += dx * Math.PI;
    rotateAmtY += dy * Math.PI;
    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //for points
    updatedPoints = [];
    facePoints = [];
    for (var i=0; i < points.length; i++) {
        //update points
        //rotate
        var tempPoint = rotateX(points[i], rotateAmtX);
        tempPoint = rotateY(tempPoint, rotateAmtY);

        facePoints.push(tempPoint);

        tempPoint = project(tempPoint, fov);
        tempPoint = scale(tempPoint, 70);
        tempPoint = offset(tempPoint, offsetX, offsetY);
        updatedPoints.push(tempPoint);
    }


    //for faces
    for (var i=0; i < faces.length; i++) {

        if (isFacingForward(faces[i], facePoints) == true) {
            var index1 = faces[i].points[0];
            var index2 = faces[i].points[1];
            var index3 = faces[i].points[2];

            var p1 = updatedPoints[index1];
            var p2 = updatedPoints[index2];
            var p3 = updatedPoints[index3];

            //draw face
            var color = "red";
            if (i == 1) {
                color = "blue";
            }
            drawFace(p1,p2,p3, color);
        }
    }
    
    //for edges
    for (var i=0; i < edges.length; i++) {
        //get points on edge
        //project points
        var index1 = edges[i].points[0];
        var index2 = edges[i].points[1]

        var p1 = updatedPoints[index1];
        var p2 = updatedPoints[index2];

        //draw line
        drawEdge(p1,p2);
    }
}

var delay = 10;
var speedX = 2;
var speedY = 2;

dxInput.value = speedX;
dyInput.value = speedY;

var fov = 10;
setInterval(() => {

    speedX = parseInt(dxInput.value);
    speedY = parseInt(dyInput.value);

    console.log(speedX,speedY)

    if (isNaN(speedX)) {
        speedX = 0;
    }

    if (isNaN(speedY)) {
        speedY = 0;
    }

    var dx = 1/1000 * speedX;
    var dy = 1/1000 * speedY;  

    fovValue = parseInt(fovInput.value);

    if (isNaN(fovValue)) {
        fovValue = 0;
    }

    update(
        fovValue,
        dx,
        dy
    );

    fovLabel.innerHTML = "FOV " + fovInput.value;
}, delay);
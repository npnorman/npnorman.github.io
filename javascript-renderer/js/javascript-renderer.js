//javascript-renderer.js
//Nicholas Norman October 2025
//render edges or faces of rotating objects to the screen

var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");

class point3D {
    constructor(x,y,z) {
        this.x = x;
        this.y = y;
        this.z = z;
    }
}

class point2D {
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
}

class edge {
    constructor(p1,p2) {
        this.points = [p1,p2];
    }
}
var z = 6;
var points = [
    new point3D(-1,1,z),
    new point3D(1,1,z),
    new point3D(-1,-1,z),
    new point3D(1,-1,z)
];
var edges = [
    new edge(0,2),
    new edge(0,1),
    new edge(1,3),
    new edge(2,3)];

function project(point, ortho=false) {

    var fov = 10;

    var px = (point.x * fov) / (point.z + fov);
    var py = (point.y * fov) / (point.z + fov);
    var projectedPoint = new point2D(px,py);

    console.log(projectedPoint.x, projectedPoint.y);

    return projectedPoint;
}

function rotateX(point, angle) {

}

function rotateY(point, angle) {

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

function drawEdge(point1, point2, width=1,color="black") {
    ctx.beginPath();
    ctx.moveTo(point1.x,point1.y);
    ctx.lineTo(point2.x,point2.y);
    ctx.stroke();
}

function update() {
    var offsetX = canvas.width / 2;
    var offsetY = canvas.height / 2;

    //clear screen
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    //for points
    updatedPoints = []
    for (var i=0; i < points.length; i++) {
        //update points
        //rotate
        var tempPoint = project(points[i]);
        tempPoint = scale(tempPoint, 30);
        tempPoint = offset(tempPoint, offsetX, offsetY);
        updatedPoints.push(tempPoint);
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

update();
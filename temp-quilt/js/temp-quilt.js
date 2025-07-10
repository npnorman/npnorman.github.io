//temp-quilt.js
//Nicholas Norman July 2025
//This is a generator for a temperature quilt

var canvas = document.getElementById("quilt-canvas");
var colorCanvas = document.getElementById("color-canvas");
var ctx = canvas.getContext("2d");
var colorCtx = colorCanvas.getContext("2d");

var loc = document.getElementById("location");
var submitButton = document.getElementById("generate");
var saveButton = document.getElementById("save");
var pdfButton = document.getElementById("pdf");
var startText = document.getElementById("start");
var endText = document.getElementById("end");

var startDate = "2025-01-01";
var endDate = new Date().toISOString().split('T')[0];

startText.innerHTML = new Date(startDate + "T14:30:00Z").toLocaleDateString('en-US');
endText.innerHTML = new Date().toLocaleDateString('en-US');

var layerCount = 0;
var currentLayer = 0;
var width = canvas.width;
var height = canvas.height;
var temps = [];
var dates = [];

var interval = 20; //degrees
var zeroOffset = 4; //from 0
var temperatureColors = [
    "black",     // -80 < temp
    "indigo",    // -80 < temp <= -40
    "purple",    // -40 < temp <= -20
    "darkblue",  // -20 < temp <= 0
    "blue",      // 0 < temp <= 20
    "lightblue", // 20 < temp <= 40
    "yellow",    // 40 < temp <= 60
    "orange",    // 60 < temp <= 80
    "red",       // 80 < temp <= 100
    "darkred",   // 100 < temp <= 120
    "brown"      // temp > 140
];

async function main() {
    var tempDates = await runApis();
    temps = tempDates[0];
    dates = tempDates[1];
    layerCount = temps.length;
    height = canvas.height / layerCount;

    for (var i = 0; i < layerCount; i++) {
        var color = getTemperatureColor(temps[i]);
        addLayer(color);
    }

    addColors();
}

function addColors() {
    
    var currentColorLayer = 0;
    var colorLayerCount = temperatureColors.length;
    var colorHeight = colorCanvas.height / colorLayerCount;
    var colorWidth = 50;
    colorCtx.font = "18px Arial";
    
    for (var i = 0; i < colorLayerCount; i++) {
        //Add color box & Numbers

        //color
        colorCtx.beginPath();
        colorCtx.rect(0, currentColorLayer * colorHeight, colorWidth, colorHeight);
        colorCtx.strokeStyle = temperatureColors[i];
        colorCtx.fillStyle = temperatureColors[i];
        colorCtx.stroke();
        colorCtx.fill();

        //text
        colorCtx.beginPath();
        colorCtx.fillStyle = "black";
        colorCtx.textAlign = "left";
        colorCtx.textBaseline = "middle";
        colorCtx.fillText(((i - zeroOffset) * interval) + "°F to " + (((i+1 - zeroOffset) * interval) - 1) + "°F", colorWidth + 10, currentColorLayer * colorHeight + (0.5 * colorHeight));

        currentColorLayer++;
    }
}

function addLayer(color) {
    //adds a layer to the canvas
    ctx.beginPath();
    ctx.rect(0, currentLayer * height, width, height);
    ctx.strokeStyle = color;
    ctx.fillStyle = color;
    ctx.stroke();
    ctx.fill();

    currentLayer++;
}

function getTemperatureColor(temp) {
    
    var index = Math.floor(temp / interval) + zeroOffset;

    return temperatureColors[index];
}

// Api

async function runApis() {

    var coordinates = await getCoordinateFromLocation(loc.value);
    var tempDates = await getTemperatureListFromDates(startDate, endDate, coordinates[1], coordinates[0]);

    return tempDates;
}

async function getCoordinateFromLocation(address) {
    //given an address, calculate the coordinates
    //Given Street, City, County, State, Country

    var url = "https://geocode.maps.co/search?q=" + address + "&api_key=686f1161d33b1369048192atx2266de";

    var json;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        json = await response.json();

        return [json[0].lat, json[0].lon];
        
    } catch (error) {
        console.error(error.message);
    }
    
    return "";

}

async function getTemperatureListFromDates(startDate, endDate, longitude, latitude) {
    //date in format yyyy-mm-dd

    var url = "https://historical-forecast-api.open-meteo.com/v1/forecast?latitude=" + latitude + "&longitude=" + longitude + "&start_date=" + startDate + "&end_date=" + endDate + "&daily=temperature_2m_max&timezone=America%2FNew_York&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch";

    var json;

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Response status: ${response.status}`);
        }

        json = await response.json();

        console.log(json);
        
    } catch (error) {
        console.error(error.message);
    }

    return [json.daily.temperature_2m_max, json.daily.time];
}

function createPDF() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();

    let y = 10;
    const lineHeight = 10;
    const margin = 10;
    const pageHeight = doc.internal.pageSize.height;

    for (var i = 0; i < temps.length; i++) {

        if (y > pageHeight - margin) {
            doc.addPage();
            y = margin;
        }

        doc.text(dates[i].toString() + ":        " + temps[i].toString() + "F", 10, y);
        y += lineHeight;
    }

    doc.save("values-list.pdf");
};

function saveImage() {
    var locationStr = loc.value.replace(",","_").replace(" ","_");
    var startDateStr = startDate.replace("/","_");
    var endDateStr = endDate.replace("/","_");

    var image = canvas.toDataURL("image/png");

    var link = document.createElement('a');
    link.href = image;

    link.download = locationStr + "-" + startDateStr + "-" + endDateStr + "-quilt.png";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);
}

submitButton.addEventListener('click', function(e) {
    e.preventDefault();
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    currentLayer = 0;
    main();
});

saveButton.addEventListener('click', function(e) {
    saveImage();
});

pdfButton.addEventListener('click', function(e) {
    createPDF();
});
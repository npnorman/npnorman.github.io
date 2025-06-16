//This file holds the simulation of elevators
//June 2025 Nicholas Norman

var output = document.getElementById("output");
var startSimBtn = document.getElementById("startSim");
var stopSimBtn = document.getElementById("stopSim");
var resumeBtn = document.getElementById("resumeSim");
var reloadBtn = document.getElementById("reloadSim");

//The simulation has some global elements that all things can access
var frame = 0;
var frameStop = 1000000000000000000000000000000;
var frameRate = 0.25 * 1000; //1 sec

//control panel
var numberOfFloors = 10;
var numberOfElevators = 2;
var elevatorCapacity = 5;
var requestRate = 2;

var outsideRequests = [];
var finishedRequests = [];
var sharedGoals = [];
var elevators = [];

function simulationLoop() {

    console.log(frame);
    frame += 1;

    //take input
    //make a new request
    if (frame % requestRate == true) { //may implement more random
        outsideRequests.push(makeANewRequest(numberOfFloors));
    }

    //process
    for (var i = 0; i < numberOfElevators; i++) {
        //set a new goal
        elevators[i].setNewGoal();

        //move to goal
        elevators[i].moveTowardsGoal();

        console.log(elevators[i].getStats());
    }

    //table display
    displayFinishedToRequestCompleted();
    displayInsideToElevator();
    displayOutsideToRequestingElevator();

    //deciding to stop
    if (frame >= frameStop) {
        stop();
    } else {
        setTimeout(simulationLoop, frameRate);
    }
}

function startup() {
    //sets up the sim

    numberOfElevators = getValueFromElementId("numberOfElevators");
    numberOfFloors = getValueFromElementId("numberOfFloors");
    frameRate = getValueFromElementId("frameRate") * 1000;
    requestRate = getValueFromElementId("requestRate");

    console.log(numberOfElevators, numberOfFloors, frameRate);

    disableElementById("numberOfElevators");
    disableElementById("numberOfFloors");
    disableElementById("frameRate");
    disableElementById("requestRate");

    for (var i = 0; i < numberOfElevators; i++) {
        elevators.push(new ElevatorOperator());
    }

    buildTable();
    setTimeout(simulationLoop, frameRate);
    //addToLog("Elevator Sim Starting<br>");
}

function resume() {
    setTimeout(simulationLoop, frameRate);
    frameStop = 1000000000000;
}

function makeANewRequest(numberOfFloors) {
    //decides where to start and end the request
    var startingFloor = getRandomIntInclusive(1, numberOfFloors);
    var requestedFloor = getRandomIntInclusive(1, numberOfFloors);

    return new FloorRequest(startingFloor, requestedFloor);
}

function stop() {
    //tears down the sim
    frameStop = 0;
}

//helper functions
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1) + min);
}

function getValueFromElementId(id) {
    return document.getElementById(id).value;
}

function disableElementById(id) {
    document.getElementById(id).disabled = true;
}

function addToLog(logItem) {
    output.innerHTML = logItem + "<br>" + output.innerHTML;
}

//DISPLAY

var createTable = document.getElementById("create-table");

//rows
var requestingCellsList = [];
var elevatorCellsList = [];
var requestedCellsList = [];

function buildTable() {
    //build a table with the appropriate number of floors and elevators

    for (var i = 0; i < numberOfElevators; i++) {
        //create cells for that many elevators
        elevatorCellsList.push([]);
        //add more rows for it
        var headerRow = createTable.rows[0];
        var cell = document.createElement("th");
        cell.innerHTML = "Elevator (" + (numberOfElevators - i) +")";

        headerRow.insertBefore(cell, headerRow.cells[1 + 1]);
    }

    //for number of floors
    for (var i = 0; i < numberOfFloors; i++) {
        var row = document.createElement("tr");
        var floorCell = document.createElement("td");
        floorCell.classList.add("number");
        floorCell.innerHTML = i + 1;

        var requestingCell = document.createElement("td");
        requestingCell.classList.add("requesting");
        requestingCell.innerHTML = "";
        requestingCellsList.push(requestingCell);

        for (var j = 0; j < numberOfElevators; j++) {
            var elevatorCell = document.createElement("td");
            elevatorCell.innerHTML = "";
            elevatorCellsList[j].push(elevatorCell);
        }

        var requestedCell = document.createElement("td");
        requestedCell.innerHTML = "";
        requestedCellsList.push(requestedCell);

        row.appendChild(floorCell);
        row.appendChild(requestingCell);
        for (var j = 0; j < numberOfElevators; j++) {
            row.appendChild(elevatorCellsList[j][i]);
        }
        row.appendChild(requestedCell);

        createTable.appendChild(row);
    }
}

function displayFinishedToRequestCompleted() {
    //for each request in finsihed, display its inside request on the floor
    requestedCellsList.forEach((item) => { item.innerHTML = ""; });

    finishedRequests.forEach((item) => {
        requestedCellsList[item.getInsideRequest() - 1].appendChild(item.toToken());
    });
}

function displayOutsideToRequestingElevator() {
    //for each request in outside, display to the outside request floor
    requestingCellsList.forEach((item) => { item.innerHTML = ""; });

    outsideRequests.forEach((item) => {
        requestingCellsList[item.getOutsideRequest() - 1].appendChild(item.toToken());
    });
}

function displayInsideToElevator() {
    for (var i = 0; i < numberOfElevators; i++) {
        //clear bold
        elevatorCellsList[i].forEach((item) => { item.classList.remove("elevator-bold"); });

        //clear text
        elevatorCellsList[i].forEach((item) => { item.innerHTML = ""; });

        elevators[i]._insideRequests.forEach((item) => {
            //for each elevator, display its inside requests in the right floor
            elevatorCellsList[i][elevators[i]._currentFloor - 1].appendChild(item.toToken());
        });

        //set that box to class "elevator-bold"
        elevatorCellsList[i][elevators[i]._currentFloor - 1].classList.add("elevator-bold");
    }
}

//END DISPLAY

//SIMULATION
stopSimBtn.disabled = true;
resumeBtn.disabled = true;

startSimBtn.addEventListener("click", () => {
    startSimBtn.disabled = true;
    startup();

    stopSimBtn.disabled = false;
});

stopSimBtn.addEventListener("click", () => {
    stopSimBtn.disabled = true;
    stop();
    resumeBtn.disabled = false;
});

resumeBtn.addEventListener("click", () => {
    resumeBtn.disabled = true;
    resume();
    stopSimBtn.disabled = false;
});

reloadBtn.addEventListener("click", () => {
    window.location.reload();
});

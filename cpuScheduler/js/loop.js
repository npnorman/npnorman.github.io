/*
loop.js
implement the simulation loop for CPU Scheduler Sim
Nicholas Normn
Sept 2024
*/

//Data to store

var tasks = []; //hold all tasks (should stay constant when running)
var taskCount = 5;
var taskMaxBurst = 10;
var speed = 0.5 * 1000;
var endLoop = false; //this signals to end the loop

//elements
var elTaskTable = document.getElementById("taskTable");
var elBtnConfirmation = document.getElementById("buttonConfirmation");
var inInterval = document.getElementById("interval");
var inTaskCount = document.getElementById("taskNum");
var inMaxBurst = document.getElementById("maxBurst");

//scheduling parts
var elReadyQueue = document.getElementById("readyQueue");
var elRQBox = document.getElementById("rq-box");
var elCPU = document.getElementById("cpu");
var elCPUBox = document.getElementById("cpu-box");
var elFinished = document.getElementById("fin");
var elFinBox = document.getElementById("fin-box");

//buttons
var btnStartSim = document.getElementById("startSim");
var btnEndSim = document.getElementById("endSim");
var btnChangeSpeed = document.getElementById("changeSpeed");
var btnUpdateTasks = document.getElementById("updateTaskParam");

//Schedulers
fcfs = new Scheduler(elReadyQueue, elRQBox, elCPU, elCPUBox, elFinished, elFinBox);


//start loop
function start() {
    //this is called before the simloop starts

    //clear all data and displays (in case of restart)

    //close out task editor
    btnUpdateTasks.disabled = true;

    //create tasks
    tasks = randTasks(taskCount, taskMaxBurst);

    //display task table
    displayTasks(tasks);

    //load tasks into schedulers
    fcfs.loadProcesses(tasks);

    console.log("starting");

    setTimeout(simLoop, speed);
}

//simloop
function simLoop() {
    //process input (done in event listeners)

    //update data
    update();

    //display data
    display();

    //check to keep going
    if (endLoop == false) {
        //continue the loop
        setTimeout(simLoop, speed);
    } else {
        end();
    }
}

function update() {
    //this is called every frame
    //here is where you update data
    console.log("update");
    fcfs.update();
}

function display() {
    //this is called every frame
    //this is where you display data

    fcfs.display();
}

function end() {
    //this is called when the simloop ends

    console.log("ending");

    //show stats
}

/*****************Input*********************/

//input and output
btnStartSim.addEventListener("click", function() {
    //start the sim
    start();

    //confirm starting
    elBtnConfirmation.innerHTML = "Started Simulation";
});

btnEndSim.addEventListener("click", function() {
    //end the sim
    endLoop = true;

    //confirm ending
    elBtnConfirmation.innerHTML = "Ended Simulation";
});

btnChangeSpeed.addEventListener("click", function() {
    speed = inInterval.value * 1000;
    elBtnConfirmation.innerHTML = "Updated Speed";
});

document.getElementById("reload").addEventListener("click", function() {
    location.reload();
});

//task parameters
btnUpdateTasks.addEventListener("click", function() {
    taskMaxBurst = inMaxBurst.value;
    taskCount = inTaskCount.value;
    elBtnConfirmation.innerHTML = "Updated Tasks";
});

/*******************TESTING****************/
var sets = document.getElementById("sets")
var names = ["FCFS", "SJF", "SRJF", "RR", "Pritority"];

for (var i=0; i < names.length; i++) {
    var header = document.createElement("h2")
    header.appendChild(document.createTextNode(names[i]));
    header.classList.add("algorithm");
    
    sets.appendChild(header);
    sets.appendChild(createSchedulingSet());
    sets.appendChild(document.createElement("hr"));
}
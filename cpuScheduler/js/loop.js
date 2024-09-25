/*
loop.js
implement the simulation loop for CPU Scheduler Sim
Nicholas Normn
Sept 2024
*/

//Data to store

var tasks = []; //hold all tasks (should stay constant when running)
var readyQueue = []; //holds tasks that are waiting
var cpu = null; //holds 1 task that is currently running
var finished = [] //holds finsihed tasks

//elements

var elTaskTable = document.getElementById("taskTable");
var btnStartSim = document.getElementById("startSim");
var elBtnConfirmation = document.getElementById("buttonConfirmation");
var elReadyQueue = document.getElementById("readyQueue");
var elCPU = document.getElementById("cpu");
var elFinished = document.getElementById("finished");

//create some test data to populate tasks
arrivalSum = 0;
for (var i=0; i < 6; i++) {
    var num = i;
    var burst = Math.floor(Math.random() * 23 + 1);
    var arrival = arrivalSum + Math.floor(Math.random() * 4);
    arrivalSum = arrival;
    var priority = Math.floor(Math.random() * 8);

    tasks.push( new Task(num,burst,arrival, priority));
}
tasks.sort(compareArrival);

//display tasks before running
displayTasks(tasks);

//input and output
btnStartSim.addEventListener("click", function() {
    //start the sim
    start();

    //confirm starting
    elBtnConfirmation.innerHTML = "Started Simulation"

    //revoke button access
    btnStartSim.disabled = true;
});

//start loop
function start() {
    //this is called before the simloop starts

    console.log("starting");

    //load tasks into ready queue
    for (var i=0; i < tasks.length; i++) {
        readyQueue.push(tasks[i]);
    }

    setInterval(simLoop, 1000);
}

//simloop
function simLoop() {
    //process input (done in event listeners)
    //update data
    update();

    //display data
    display();
}

function update() {
    //this is called every frame
    //here is where you update data
}

function display() {
    //this is called every frame
    //this is where you display data

    //display ready queue
    displayTaskList(elReadyQueue, readyQueue);

    //display cpu

    //display finished
}

function end() {
    //this is called when the simloop ends
}
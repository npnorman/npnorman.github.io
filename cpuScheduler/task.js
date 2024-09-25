/*
task.js
Javascript for CPU Scheduler Sim
Nicholas Normn
Sept 2024
*/

//Task Class
/*
Goal: Hold information about each task
Input: Name, burst time, arrival time, priority
Output: New Task
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

//Task obj
class Task {

    constructor(num, burst, arrival, priority) {
        this.num = num;
        this.burst = burst;
        this.remaining = burst;
        this.arrival = arrival;
        this.priority = priority;
    
        //tracking data
        this.start = null; //start time
        this.finish = null; //finish time
        this.waiting = null; //time spent waiting
    }

    //update criteria

    process() {
        //subtract burst time
        this.remaining--;
    }

    startTask(startTime) {
        //set the starttime of the task
        this.start = startTime;
    }

    finishTask(finishTime) {
        //set the finishtime of the task
        this.finish = finishTime;
    }

    wait() {
        //add one ms to wait time while in ready queue
        this.waitingTime++;
    }

    //Criteria
    
    waitingTime() {
        //calcuate waiting time
        return this.waiting;
    }

    turnaroundTime() {
        //calculate turnaround time
        return this.finish - this.arrival;
    }

    responseTime() {
        //calcuate response time
        return this.start - this.arrival;
    }

}

//sorting algorithm for tasks based on arrival time
function compareArrival(a, b) {
    output = 0;

    if (a.arrival < b.arrival) {
        //a came before b
        output = -1;
    } else if (a.arrival > b.arrival) {
        //a came after b
        output = 1;
    } else {
        //a and b are the same
        output = 0;
    }

    return output;
}

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

//function to display tasks
function displayTasks() {
    //display the tasks in the task table

    for (var i=0; i < tasks.length; i++) {
        //create a new row
        var newRow = elTaskTable.insertRow(-1);

        //insert data into the rows
        var name = newRow.insertCell(0);
        var burst = newRow.insertCell(1);
        var arrival = newRow.insertCell(2);
        var priority = newRow.insertCell(3);

        //populate data
        name.innerHTML = "P<sub>" + tasks[i].num + "</sub>";
        burst.innerHTML = tasks[i].burst;
        arrival.innerHTML = tasks[i].arrival;
        priority.innerHTML = tasks[i].priority;
    }
}

function displayTaskList(element, list) {
    
    tmp = "";
    
    for (var i=0; i < list.length; i++) {
        tmp += "P<sub>" + list[i].num + "</sub>, ";
    }

    element.innerHTML = tmp;
}

/*********************LOOP*************************/

//display tasks before running
displayTasks();

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
//new-cpu-task-scheduler.js
//Nicholas Norman January 2026
//A New version of the task scheduler I made

const Locations = {
    NOTSTARTED : 0,
    READYQUEUE : 1,
    CPU        : 2,
    FINISHED   : 3,
};

class Task {
    static taskCount = 0;

    id = 0;
    priority = 0;
    start = 0;
    _burst = 0;
    remainingTime = 0;
    waitTime = 0;
    responseTime = -1;
    end = 0;
    location = Locations.NOTSTARTED;

    constructor() {
        this.id = Task.taskCount++;
    }

    get burst() {
        return this._burst;
    }

    set burst(value) {
        this._burst = value;
        this.remainingTime = value;
    }
};

const Cycle = {
    X : 0,
    XPLUS : 1,
    XPLUSPLUS : 2,
}

class Clock {
    currentFrame = 0;
    cycle = Cycle.X;

    tick() {
        this.cycle++;

        if (this.cycle == 3) {
            this.cycle = Cycle.X;
            this.currentFrame++;
        }
    }
};

const Preemptive = {
    NONPREEMPTIVE : 0,
    PREEMPTIVE    : 1,
};

const SchedulingAlgorithm = {
    //name  isPreemptive    algorithm
    FCFS : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {
        // chose the next in order to go to the cpu

        let chosenIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with lowest start time (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare start times
                    if (currentMatrix[i].start < currentMatrix[chosenIndex].start) {
                        chosenIndex = i;
                    }
                }
            }
        }

        // set task to CPU
        if (chosenIndex != -1) {
            //there is a task in the RQ
            currentMatrix[chosenIndex].location = Locations.CPU;
        }
    }],

    SJF : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {

    }],

    SRJF : [Preemptive.PREEMPTIVE, function(currentMatrix) {
        //HANDLES PUTTING CPU ITEM BACK IN RQ
    }],

    PRIORITY : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {

    }],

    PRIORITY_PREEMPTIVE : [Preemptive.PREEMPTIVE, function(currentMatrix) {

    }],

    PRIORITY_AGING : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {

    }],

    ROUND_ROBIN : [Preemptive.PREEMPTIVE, function(currentMatrix) {

    }],
};

class SimulationData {
    constructor() {};
    currentMatrix;
    algorithm;
    clock;
};

var taskMatrix = [
// id, priority, start, burst, remainingTime, waitTime, responseTime, end, location(enum)
    new Task(),
    new Task(),
    new Task(),
    new Task(),
    new Task(),
];

// elements
var startBtn = document.getElementById("startsim");
var pauseBtn = document.getElementById("pausesim");
var stepBtn = document.getElementById("stepsim");

var frameIntervalMsInpt = document.getElementById("intervalms");
var tempOutput = document.getElementById("tempoutput");

var isPaused = false;
var simluationInstances = [];
var intervalMs = 500;

// core components

function cpuEndTask(currentMatrix, clock) {
    // if task in CPU is finished (remainingTime == 0)
        // remove from CPU, set finished

    for (let i = 0; i < currentMatrix.length; i++) {
        if (currentMatrix[i].location == Locations.CPU) {

            if (currentMatrix[i].remainingTime <= 0) {
                // set to finished
                currentMatrix[i].location = Locations.FINISHED;
                // set end frame
                currentMatrix[i].end = clock.currentFrame;

            }
        }
    }
}

function cpuDecrementAndSetRepsonse(currentMatrix, clock) {
    for (let i = 0; i < currentMatrix.length; i++) {
        if (currentMatrix[i].location == Locations.CPU) {
            // set response time (if not set already)
            if (currentMatrix[i].responseTime == -1) {
                currentMatrix[i].responseTime = clock.currentFrame - currentMatrix[i].start;
            }

            // decrement remaining time
            currentMatrix[i].remainingTime--;
        }
    }
}

function taskScheduler(currentMatrix, algorithm) {
    // if no task in cpu OR scheduling algorithm is preemptive
    let isCPUOpen = true;
    let isPreemptive = algorithm[0] == Preemptive.PREEMPTIVE;

    if (!isPreemptive) {
        for (let i = 0; i < currentMatrix.length; i++) {
            if (currentMatrix[i].location == Locations.CPU) {
                isCPUOpen = false;
                break;
            }
        }
    }
    
    if (isPreemptive || isCPUOpen) {
        // call algorithm
        algorithm[1](currentMatrix);
    }
}

function readyQueueLoad(currentMatrix, clock) {
    // for all tasks
    for (let i = 0; i < currentMatrix.length; i++) {
        // if task is starting at the current frame
        if (currentMatrix[i].start == clock.currentFrame && currentMatrix[i].location == Locations.NOTSTARTED) {
            // add to ready queue
            currentMatrix[i].location = Locations.READYQUEUE;
        }
    }
}

function readyQueueIncrement(currentMatrix) {
    // for all tasks
    for (let i = 0; i < currentMatrix.length; i++) {
        // if in the ready queue
        if (currentMatrix[i].location == Locations.READYQUEUE) {
            // wait time ++
            currentMatrix[i].waitTime++;
        }
    }
}

function tabulate(currentMatrix) {

}

function display(currentMatrix, clock) {
    
    tempOutput.innerHTML = "Frame: " + clock.currentFrame;
    
    if (clock.cycle == Cycle.XPLUS) {
        tempOutput.innerHTML += "+"

    } else if (clock.cycle == Cycle.XPLUSPLUS) {
        tempOutput.innerHTML += "++"
    }

    tempOutput.innerHTML += "<br>";

    for (let i = 0; i < currentMatrix.length; i++) {
        tempOutput.innerHTML += "id: " + currentMatrix[i].id + " remainingTime: " + currentMatrix[i].remainingTime + " waitTime: " + currentMatrix[i].waitTime + " responseTime: " + currentMatrix[i].responseTime + " end: " + currentMatrix[i].end + " location: " + currentMatrix[i].location + "<br>";
    }

    tempOutput.innerHTML += "<br>";
}

// simulation components
function simLoop(currentMatrix, algorithm, clock) {

    // if (clock.cycle == Cycle.X) {
    //     cpuEndTask(currentMatrix, clock);

    // } else if (clock.cycle == Cycle.XPLUS) {
    //     taskScheduler(currentMatrix, algorithm);
    //     readyQueueIncrement(currentMatrix);

    // } else if (clock.cycle == Cycle.XPLUSPLUS) {
    //     cpuDecrementAndSetRepsonse(currentMatrix, clock);
    //     readyQueueLoad(currentMatrix, clock);
    // }

    if (clock.cycle == Cycle.X) {
        cpuEndTask(currentMatrix, clock);
        readyQueueLoad(currentMatrix, clock);

    } else if (clock.cycle == Cycle.XPLUS) {
        taskScheduler(currentMatrix, algorithm);
        readyQueueIncrement(currentMatrix);

    } else if (clock.cycle == Cycle.XPLUSPLUS) {
        cpuDecrementAndSetRepsonse(currentMatrix, clock);
    }

    // always tabulate and display
    tabulate(currentMatrix);
    display(currentMatrix, clock);

    clock.tick();
    
    //condition to end
    if (!isPaused) {
        setTimeout(function () { simLoop(currentMatrix, algorithm, clock) }, intervalMs);
    }

}

function startSim() {
    // reset components
    setIntervalMs();

    let simData = new SimulationData();

    // create clone of tasks to work with
    simData.currentMatrix = structuredClone(taskMatrix);

    // select algorithm to run
    simData.algorithm = SchedulingAlgorithm.FCFS;

    // create clock
    simData.clock = new Clock();

    // run loop
    simLoop(simData.currentMatrix, simData.algorithm, simData.clock);

    //save data
    simluationInstances.push(simData);
}

function pauseSim() {
    // does nothing, should restart the program similar to startSim and turn ispaused on
    // is paused should be a part of the simData
}

function setIntervalMs() {
    intervalMs = frameIntervalMsInpt.value;

    if (isNaN(intervalMs)) {
        intervalMs = 500;
    }
}

function stepSim() {
    if (simluationInstances.length == 0) {
        isPaused = true;
        startSim();
    } else {
        console.log(simluationInstances[0]);
        simLoop(simluationInstances[0].currentMatrix, simluationInstances[0].algorithm, simluationInstances[0].clock);
    }
}

startBtn.addEventListener('click', startSim);
pauseBtn.addEventListener('click', pauseSim);
stepBtn.addEventListener('click', stepSim);

//test
taskMatrix[0].start = 0;
taskMatrix[1].start = 0;
taskMatrix[2].start = 3;
taskMatrix[3].start = 3;
taskMatrix[4].start = 5;

taskMatrix[0].burst = 10;
taskMatrix[1].burst = 2;
taskMatrix[2].burst = 6;
taskMatrix[3].burst = 3;
taskMatrix[4].burst = 5;
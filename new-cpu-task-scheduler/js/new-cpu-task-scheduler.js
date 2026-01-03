//new-cpu-task-scheduler.js
//Nicholas Norman January 2026
//A New version of the task scheduler I made

// helper function
function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function lerpColor(color1, color2, t) {
    // t is between 0 and 1
    // color1 = {r, g, b} or {r, g, b, a}
    // color2 = {r, g, b} or {r, g, b, a}
    
    const r = Math.round(color1.r + (color2.r - color1.r) * t);
    const g = Math.round(color1.g + (color2.g - color1.g) * t);
    const b = Math.round(color1.b + (color2.b - color1.b) * t);
    const a = color1.a !== undefined 
        ? color1.a + (color2.a - color1.a) * t 
        : 1;
    
    return `rgba(${r}, ${g}, ${b}, ${a})`;
}

const lightyellow = {r: 255, g: 255, b: 193};
const red = {r: 255, g: 0, b: 0};

const N = 30; // +1 age per N units of time
var TimeQuantumMax = 10; // for roundRobin;

function getAgeFactor(priority, waitTime) {
    let age = 0;
    age = Math.floor(waitTime / N);
    age = Math.min(age, 7-priority);

    return age;
}
// end helper

// BAR CHART CHART.JS
const ctx = document.getElementById('barChart');
var barChart = new Chart(ctx, {
    type: 'bar',
    data: {
    labels: ['Avg Wait', 'Avg Turnaround', 'Avg Response'],
    datasets: [{
        label: 'frames',
        data: [5,4,5],
        borderWidth: 1
    }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            y: {
            beginAtZero: true
            }
        }
    }
});

const ctx2 = document.getElementById('lineChart');
var lineChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: [], // x-axis labels
        datasets: [{
            label: 'Avg Wait',
            data: [], // y-axis values
            borderWidth: 1
        }, {
            label: 'Avg Turnaround',
            data: [], // y-axis values
            borderWidth: 1
        }, {
            label: 'Avg Response',
            data: [], // y-axis values
            borderWidth: 1
        }]
    },
    options: {
        responsive: false,
        maintainAspectRatio: false,
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
});
// END CHART.JS

// elements
var startBtn = document.getElementById("startsim");
var pauseBtn = document.getElementById("pausesim");
var stepBtn = document.getElementById("stepsim");
var generateRandomTasksBtn = document.getElementById("generate-tasks");

var algorithmDdl = document.getElementById("algorithmDropdown");
var taskSelectionDdl = document.getElementById("taskDropdown");
var randomControlsDiv = document.getElementById("random-controls");
var customControlsDiv = document.getElementById("custom-controls");

var frameIntervalMsInpt = document.getElementById("intervalms");
var timeQuantumInpt = document.getElementById("time-quantum");
var minstartInpt = document.getElementById("minstart");
var maxstartInpt = document.getElementById("maxstart");
var minburstInpt = document.getElementById("minburst");
var maxburstInpt = document.getElementById("maxburst");
var numberOfTasksInpt = document.getElementById("number-of-tasks");

var timeQuantumSpan = document.getElementById("time-quantum-span");
var clockOutput = document.getElementById("clock");
var taskTable = document.getElementById("taskTable");
var averageTable = document.getElementById("averageTable");

var isPaused = false;
var simluationInstances = [];
var intervalMs = 200;
// end elements

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

class IntermediateData {
    currentFrame;
    averageWaitTime;
    averageTurnaroundTime;
    averageResponseTime;
    constructor(currentFrame = 0, averageWaitTime = 0, averageTurnaroundTime = 0, averageResponseTime = 0) {
        this.currentFrame = currentFrame;
        this.averageWaitTime = averageWaitTime;
        this.averageTurnaroundTime = averageTurnaroundTime;
        this.averageResponseTime = averageResponseTime;
    }

    isDataEqual(intermediateData) {
        if (this.averageWaitTime != intermediateData.averageWaitTime) {
            return false;
        }

        if (this.averageTurnaroundTime != intermediateData.averageTurnaroundTime) {
            return false;
        }

        if (this.averageResponseTime != intermediateData.averageResponseTime) {
            return false;
        }

        return true;
    }

    clone(intermediateData) {
        this.currentFrame = structuredClone(intermediateData.currentFrame);
        this.averageWaitTime = structuredClone(intermediateData.averageWaitTime);
        this.averageTurnaroundTime = structuredClone(intermediateData.averageTurnaroundTime);
        this.averageResponseTime = structuredClone(intermediateData.averageResponseTime);
    }
}

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

    toString() {
        if (this.cycle == Cycle.X) {
            return `${this.currentFrame}`;

        } else if (this.cycle == Cycle.XPLUS) {
            return `${this.currentFrame}+`;

        } else {
            return `${this.currentFrame}++`;

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
        // choose shortest burst time in RQ
        let chosenIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with lowest burst time (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare burst times
                    if (currentMatrix[i]._burst < currentMatrix[chosenIndex]._burst) {
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

    SRJF : [Preemptive.PREEMPTIVE, function(currentMatrix) {
        // choose shortest remaining time in RQ
        let chosenIndex = -1;
        let isInCPU = false;
        let cpuIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with lowest remaining time (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare remaining times
                    if (currentMatrix[i].remainingTime < currentMatrix[chosenIndex].remainingTime) {
                        chosenIndex = i;
                    }
                }
            }

            if (currentMatrix[i].location == Locations.CPU) {
                isInCPU = true;
                cpuIndex = i;
            }
        }

        // set task to CPU
        if (chosenIndex != -1) {
            //there is a task in the RQ
            if (isInCPU) {
                // task in cpu
                if (currentMatrix[chosenIndex].remainingTime < currentMatrix[cpuIndex].remainingTime) {
                    currentMatrix[chosenIndex].location = Locations.CPU;
                    currentMatrix[cpuIndex].location = Locations.READYQUEUE;
                }

            } else {
                currentMatrix[chosenIndex].location = Locations.CPU;
            }
        }
    }],

    PRIORITY : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {
        // choose highest priority in RQ
        let chosenIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with highest priority (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare priority
                    if (currentMatrix[i].priority > currentMatrix[chosenIndex].priority) {
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

    PRIORITY_PREEMPTIVE : [Preemptive.PREEMPTIVE, function(currentMatrix) {
        // choose highest priority in RQ
        let chosenIndex = -1;
        let isInCPU = false;
        let cpuIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with highest priority (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare priority
                    if (currentMatrix[i].priority > currentMatrix[chosenIndex].priority) {
                        chosenIndex = i;
                    }
                }
            }

            if (currentMatrix[i].location == Locations.CPU) {
                isInCPU = true;
                cpuIndex = i;
            }
        }

        // set task to CPU
        if (chosenIndex != -1) {
            //there is a task in the RQ
            if (isInCPU) {
                // task in cpu
                if (currentMatrix[chosenIndex].priority > currentMatrix[cpuIndex].priority) {
                    currentMatrix[chosenIndex].location = Locations.CPU;
                    currentMatrix[cpuIndex].location = Locations.READYQUEUE;
                }

            } else {
                currentMatrix[chosenIndex].location = Locations.CPU;
            }
        }
    }],

    PRIORITY_AGING : [Preemptive.NONPREEMPTIVE, function(currentMatrix) {
        // based on wait time of priority, age (increase priority)
        // +1 priority (max of 7) per N units waiting

        // choose highest priority in RQ
        let chosenIndex = -1;

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                // choose task with highest priority (if tie, choose arbitrarily)
                if (chosenIndex == -1) {
                    //sets starting index
                    chosenIndex = i;
                } else {
                    // compare priority
                    let currentTaskPriority = currentMatrix[i].priority +  getAgeFactor(currentMatrix[i].priority, currentMatrix[i].waitTime);
                    let chosenTaskPriority = currentMatrix[chosenIndex].priority + getAgeFactor(currentMatrix[chosenIndex].priority, currentMatrix[chosenIndex].waitTime);

                    if (currentTaskPriority > chosenTaskPriority) {
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

    ROUND_ROBIN : [Preemptive.PREEMPTIVE, function(currentMatrix, simData) {
        // chose the next in order to go to the cpu

        let isInCPU = false;
        let cpuIndex = -1;
        let chosenIndex = -1;

        // make a ready queue index sublist
        let rqindexList = [];

        for (let i = 0; i < currentMatrix.length; i++) {
            // if in readyqueue,
            if (currentMatrix[i].location == Locations.READYQUEUE) {
                rqindexList.push(i);
            }

            if (currentMatrix[i].location == Locations.CPU) {
                isInCPU = true;
                cpuIndex = i;
            }
        }

        if (rqindexList.length > 0) {
            if (simData.currentIndex != -1) {
                // push current index
                rqindexList.push(simData.currentIndex);
                rqindexList = rqindexList.sort((a,b) => a - b);

                // get index of it
                let subindex = rqindexList.indexOf(simData.currentIndex);
                let nextsubindex = (subindex + 1) % rqindexList.length;

                // if subindex is not the same
                if (nextsubindex != subindex) {
                    // set cpu to this new task
                    simData.currentIndex = rqindexList[nextsubindex];
                    chosenIndex = rqindexList[nextsubindex];
                }

            } else {
                simData.currentIndex = rqindexList[0];
                chosenIndex = rqindexList[0];
            }
        }

        if (chosenIndex != -1) {

            if (isInCPU) {
                // need a new process
                if (simData.timeQuantum <= 0) {
                    simData.timeQuantum = TimeQuantumMax;
                    currentMatrix[cpuIndex].location = Locations.READYQUEUE;
                    currentMatrix[chosenIndex].location = Locations.CPU;
                }
            } else {
                // reset quantum
                simData.timeQuantum = TimeQuantumMax;

                //set to cpu
                currentMatrix[chosenIndex].location = Locations.CPU;
            }
        }
    }],
};

class SimulationData {
    constructor() {};
    currentMatrix;
    intermediateDataLog = [new IntermediateData()];
    algorithm;
    clock;
    timeQuantum = TimeQuantumMax;
    currentIndex = -1;
};

var taskMatrix = [
// id, priority, start, burst, remainingTime, waitTime, responseTime, end, location(enum)
    // new Task(),
    // new Task(),
    // new Task(),
    // new Task(),
    // new Task(),
];

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

function cpuDecrementAndSetRepsonse(currentMatrix, clock, simData) {
    for (let i = 0; i < currentMatrix.length; i++) {
        if (currentMatrix[i].location == Locations.CPU) {
            // set response time (if not set already)
            if (currentMatrix[i].responseTime == -1) {
                currentMatrix[i].responseTime = clock.currentFrame - currentMatrix[i].start;
            }

            // decrement remaining time
            currentMatrix[i].remainingTime--;

            simData.timeQuantum--;

            if (simData.timeQuantum < 0) {
                simData.timeQuantum = 0;
            }
        }
    }
}

function taskScheduler(currentMatrix, algorithm, simData) {
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
        algorithm[1](currentMatrix, simData);
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

function tabulate(currentMatrix, clock, intermediateDataLog) {

    let waitTimeSum = 0;
    let waitTimeCount = 0;
    let turnaroundTimeSum = 0;
    let finishedCount = 0;
    let responseTimeSum = 0;
    let responseTimeCount = 0;

    // for each task
    for (let i = 0; i < currentMatrix.length; i++) {
        if (currentMatrix[i].location == Locations.FINISHED) {

            // calculate avg turnaround time
            // end - start
            turnaroundTimeSum += currentMatrix[i].end - currentMatrix[i].start;
            finishedCount++;

            waitTimeSum += currentMatrix[i].waitTime;
            waitTimeCount ++;

            responseTimeSum += currentMatrix[i].responseTime;
            responseTimeCount++;
        }
    }

    // stop NaN from div by zero
    finishedCount = (finishedCount == 0) ? 1 : finishedCount;
    waitTimeCount = (waitTimeCount == 0) ? 1 : waitTimeCount;
    responseTimeCount = (responseTimeCount == 0) ? 1 : responseTimeCount;

    let averageWaitTime = waitTimeSum / waitTimeCount;
    let averageTurnaroundTime = turnaroundTimeSum / finishedCount;
    let averageResponseTime = responseTimeSum / responseTimeCount;
    
    // create data log
    let newDataLog = new IntermediateData(clock.currentFrame, averageWaitTime, averageTurnaroundTime, averageResponseTime);

    // if data is same as previous (only need to check last in data log)

    let lastDataLog = intermediateDataLog[intermediateDataLog.length - 1]

    if (lastDataLog.isDataEqual(newDataLog)) {
        // throw out

    // otherwise
    } else {
        // if last frame (current frame - 1) is not represented
        if (lastDataLog.currentFrame != clock.currentFrame - 1) {
            // duplicate last data log
            let cloneDataLog = new IntermediateData();
            cloneDataLog.clone(lastDataLog);

            cloneDataLog.currentFrame = clock.currentFrame - 1;

            intermediateDataLog.push(cloneDataLog);
        }
        
        // save in log
        intermediateDataLog.push(newDataLog);
    }
}

function displayTable(currentMatrix) {
    // task table
    //clear table body
    taskTable.innerHTML = '';

    // for each task
    for (let i = 0; i < currentMatrix.length; i++) {
        // create a row (tr)
        let tempRow = document.createElement('tr');

        let tempId = document.createElement('td');
        let tempPriority = document.createElement('td');
        let tempStart = document.createElement('td');
        let tempEnd = document.createElement('td');
        let tempBurst = document.createElement('td');
        let tempRemainingTime = document.createElement('td');
        let tempWaitTime = document.createElement('td');
        let tempResponseTime = document.createElement('td');
        let tempTurnaroundTime = document.createElement('td');
        let tempLocation = document.createElement('td');

        tempId.textContent = currentMatrix[i].id;
        tempStart.textContent = currentMatrix[i].start;
        tempEnd.textContent = "?";
        tempBurst.textContent = currentMatrix[i]._burst;
        tempRemainingTime.textContent = currentMatrix[i].remainingTime;
        tempWaitTime.textContent = "?";
        tempResponseTime.textContent = "?";
        tempTurnaroundTime.textContent = "?";
        tempLocation.textContent = "Not Started";
        tempPriority.textContent = currentMatrix[i].priority;

        if (currentMatrix[i].location == Locations.READYQUEUE) {
            tempLocation.textContent = "Ready Queue";
            tempRow.classList.add("ready-queue-row");

            //calculate wait time opacity
            let waitTimeOpcaity = Math.min(currentMatrix[i].waitTime, 255) / 255;

            tempWaitTime.style.backgroundColor = lerpColor(lightyellow, red, waitTimeOpcaity);
            "rgba(182, 174, 127, 1)"

        } else if (currentMatrix[i].location == Locations.CPU) {
            tempLocation.textContent = "CPU";
            tempRow.classList.add("cpu-row");
            tempRemainingTime.classList.add("col-highlight");

        } else if (currentMatrix[i].location == Locations.FINISHED) {
            tempLocation.textContent = "Completed";
            tempRow.classList.add("finished-row");
        }

        if (currentMatrix[i].location != Locations.NOTSTARTED) {
            tempWaitTime.textContent = currentMatrix[i].waitTime;
        }

        if (currentMatrix[i].location == Locations.FINISHED) {
            tempEnd.textContent = currentMatrix[i].end;
            tempResponseTime.textContent = currentMatrix[i].responseTime;
            tempTurnaroundTime.textContent = currentMatrix[i].end - currentMatrix[i].start;
        }

        tempRow.appendChild(tempId);
        tempRow.appendChild(tempPriority);
        tempRow.appendChild(tempStart);
        tempRow.appendChild(tempEnd);
        tempRow.appendChild(tempBurst);
        tempRow.appendChild(tempRemainingTime);
        tempRow.appendChild(tempWaitTime);
        tempRow.appendChild(tempResponseTime);
        tempRow.appendChild(tempTurnaroundTime);
        tempRow.appendChild(tempLocation);

        taskTable.appendChild(tempRow);
    }
}

function display(currentMatrix, clock, intermediateDataLog, algorithm, timeQuantum) {

    // display clock
    clockOutput.textContent = clock.toString();

    //display time quantum with clock
    if (algorithm == SchedulingAlgorithm.ROUND_ROBIN) {
        clockOutput.innerHTML += "<br>Time Quantum: " + timeQuantum;
    }

    // task table
    //clear table body
    taskTable.innerHTML = '';

    // for each task
    for (let i = 0; i < currentMatrix.length; i++) {
        // create a row (tr)
        let tempRow = document.createElement('tr');

        let tempId = document.createElement('td');
        let tempPriority = document.createElement('td');
        let tempStart = document.createElement('td');
        let tempEnd = document.createElement('td');
        let tempBurst = document.createElement('td');
        let tempRemainingTime = document.createElement('td');
        let tempWaitTime = document.createElement('td');
        let tempResponseTime = document.createElement('td');
        let tempTurnaroundTime = document.createElement('td');
        let tempLocation = document.createElement('td');

        tempId.textContent = currentMatrix[i].id;
        tempStart.textContent = currentMatrix[i].start;
        tempEnd.textContent = "?";
        tempBurst.textContent = currentMatrix[i]._burst;
        tempRemainingTime.textContent = currentMatrix[i].remainingTime;
        tempWaitTime.textContent = "?";
        tempResponseTime.textContent = "?";
        tempTurnaroundTime.textContent = "?";
        tempLocation.textContent = "Not Started";

        if (algorithm == SchedulingAlgorithm.PRIORITY_AGING) {
            tempPriority.textContent = `${currentMatrix[i].priority + getAgeFactor(currentMatrix[i].priority, currentMatrix[i].waitTime)} (${currentMatrix[i].priority})`;
        
        } else {
            tempPriority.textContent = currentMatrix[i].priority;
        }

        if (currentMatrix[i].location == Locations.READYQUEUE) {
            tempLocation.textContent = "Ready Queue";
            tempRow.classList.add("ready-queue-row");

            //calculate wait time opacity
            let waitTimeOpcaity = Math.min(currentMatrix[i].waitTime, 255) / 255;

            tempWaitTime.style.backgroundColor = lerpColor(lightyellow, red, waitTimeOpcaity);
            "rgba(182, 174, 127, 1)"

        } else if (currentMatrix[i].location == Locations.CPU) {
            tempLocation.textContent = "CPU";
            tempRow.classList.add("cpu-row");
            tempRemainingTime.classList.add("col-highlight");

        } else if (currentMatrix[i].location == Locations.FINISHED) {
            tempLocation.textContent = "Completed";
            tempRow.classList.add("finished-row");
        }

        if (currentMatrix[i].location != Locations.NOTSTARTED) {
            tempWaitTime.textContent = currentMatrix[i].waitTime;
        }

        if (currentMatrix[i].location == Locations.FINISHED) {
            tempEnd.textContent = currentMatrix[i].end;
            tempResponseTime.textContent = currentMatrix[i].responseTime;
            tempTurnaroundTime.textContent = currentMatrix[i].end - currentMatrix[i].start;
        }

        tempRow.appendChild(tempId);
        tempRow.appendChild(tempPriority);
        tempRow.appendChild(tempStart);
        tempRow.appendChild(tempEnd);
        tempRow.appendChild(tempBurst);
        tempRow.appendChild(tempRemainingTime);
        tempRow.appendChild(tempWaitTime);
        tempRow.appendChild(tempResponseTime);
        tempRow.appendChild(tempTurnaroundTime);
        tempRow.appendChild(tempLocation);

        taskTable.appendChild(tempRow);
    }

    // data log
    let lastDataLog = intermediateDataLog[intermediateDataLog.length - 1];

    // show data log in table
    averageTable.innerHTML = '';

    let tempDataLogRow = document.createElement('tr');
    let avgWaitCell = document.createElement('td');
    let avgTurnaroundCell = document.createElement('td');
    let avgResponseCell = document.createElement('td');

    avgWaitCell.textContent = lastDataLog.averageWaitTime.toFixed(3);
    avgTurnaroundCell.textContent = lastDataLog.averageTurnaroundTime.toFixed(3);
    avgResponseCell.textContent = lastDataLog.averageResponseTime.toFixed(3);

    tempDataLogRow.appendChild(avgWaitCell);
    tempDataLogRow.appendChild(avgTurnaroundCell);
    tempDataLogRow.appendChild(avgResponseCell);
    averageTable.appendChild(tempDataLogRow);

    barChart.data.datasets[0].data = [lastDataLog.averageWaitTime, lastDataLog.averageTurnaroundTime, lastDataLog.averageResponseTime];
    barChart.update();

    // make line chart labels
    let labels = [];
    let waitData = [];
    let turnaroundData = [];
    let responseData = [];
    for (let i = 0; i < intermediateDataLog.length; i++) {
        labels.push(intermediateDataLog[i].currentFrame);
        waitData.push(intermediateDataLog[i].averageWaitTime);
        turnaroundData.push(intermediateDataLog[i].averageTurnaroundTime);
        responseData.push(intermediateDataLog[i].averageResponseTime);
    }

    lineChart.data.labels = labels;
    lineChart.data.datasets[0].data = waitData;
    lineChart.data.datasets[1].data = turnaroundData;
    lineChart.data.datasets[2].data = responseData;
    lineChart.update();
}

// simulation components
function simLoop(simData) {

    let clock = simData.clock;
    let currentMatrix = simData.currentMatrix;
    let algorithm = simData.algorithm;
    let intermediateDataLog = simData.intermediateDataLog;
    let timeQuantum = simData.timeQuantum;

    if (clock.cycle == Cycle.X) {
        cpuEndTask(currentMatrix, clock);
        readyQueueLoad(currentMatrix, clock);

    } else if (clock.cycle == Cycle.XPLUS) {
        taskScheduler(currentMatrix, algorithm, simData);
        readyQueueIncrement(currentMatrix);

    } else if (clock.cycle == Cycle.XPLUSPLUS) {
        cpuDecrementAndSetRepsonse(currentMatrix, clock, simData);
        tabulate(currentMatrix, clock, intermediateDataLog); // not meaningful to tabulate in intermediate steps of cycle
    }

    // always display
    display(currentMatrix, clock, intermediateDataLog, algorithm, timeQuantum);

    clock.tick();
    
    //condition to end
    // if all tasks are done, then stop
    let isFinished = true;
    for (let i = 0; i < currentMatrix.length; i++) {
        if (currentMatrix[i].location != Locations.FINISHED) {
            isFinished = false;
            break;
        }
    }


    if (!(isPaused || isFinished)) {
        setTimeout(function () { simLoop(simData) }, intervalMs);
    }

}

// SIMULATION CONTROLS ----------------

function startSim() {
    // reset components
    setIntervalMs();
    TimeQuantumMax = timeQuantumInpt.value;

    let simData = new SimulationData();

    // create clone of tasks to work with
    simData.currentMatrix = structuredClone(taskMatrix);

    // select algorithm to run
    simData.algorithm = SchedulingAlgorithm.FCFS;

    if (algorithmDdl.value == "fcfs") {
        simData.algorithm = SchedulingAlgorithm.FCFS;

    } else if (algorithmDdl.value == "sjf") {
        simData.algorithm = SchedulingAlgorithm.SJF;

    } else if (algorithmDdl.value == "srjf") {
        simData.algorithm = SchedulingAlgorithm.SRJF;

    } else if (algorithmDdl.value == "p") {
        simData.algorithm = SchedulingAlgorithm.PRIORITY;

    } else if (algorithmDdl.value == "pa") {
        simData.algorithm = SchedulingAlgorithm.PRIORITY_AGING;

    } else if (algorithmDdl.value == "pp") {
        simData.algorithm = SchedulingAlgorithm.PRIORITY_PREEMPTIVE;

    } else if (algorithmDdl.value == "rr") {
        simData.algorithm = SchedulingAlgorithm.ROUND_ROBIN;

    }

    // create clock
    simData.clock = new Clock();

    // run loop
    simLoop(simData);

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
        simLoop(simluationInstances[0]);
    }
}

function showRelevantControlsFromDropdown() {
    let value = taskSelectionDdl.value;

    resetTaskMatrix();

    customControlsDiv.classList.add('hidden');
    randomControlsDiv.classList.add('hidden');

    if (value == "random") {
        randomControlsDiv.classList.remove('hidden');
        generateRandomData();

    } else if (value == "custom") {
        customControlsDiv.classList.remove('hidden');

    }

    if (value == "0") {
        taskMatrix.push(new Task());
        taskMatrix[0].burst = 100;
        taskMatrix[0].start = 0;

        for (let i = 1; i < 30; i++) {
            let tempTask = new Task();
            tempTask.start = i * 2;
            tempTask.burst = Math.max(1,(i % 7) + (i % 3));
            tempTask.priority = 0;

            taskMatrix.push(tempTask);
        }
    }
    
    taskMatrix.sort((a,b) => a.start - b.start);
    displayTable(taskMatrix);

}

function generateRandomData() {
    resetTaskMatrix();

    let minburst = minburstInpt.value;
    let maxburst = maxburstInpt.value;
    let minstart = minstartInpt.value;
    let maxstart = maxstartInpt.value;
    let numberOfTasks = numberOfTasksInpt.value;

    for (let i = 1; i < numberOfTasks; i++) {
        let tempTask = new Task();
        tempTask.start = getRandomInt(minstart,maxstart);
        tempTask.burst = getRandomInt(minburst,maxburst);
        tempTask.priority = getRandomInt(0,7);

        taskMatrix.push(tempTask);
    }

    taskMatrix.sort((a,b) => a.start - b.start);
    displayTable(taskMatrix);
}

function showTimeQuantum() {
    if (algorithmDdl.value == "rr") {
        timeQuantumSpan.classList.remove("hidden");
    } else {
        timeQuantumSpan.classList.add("hidden");
    }
}

function resetTaskMatrix() {
    taskMatrix = [];
    Task.taskCount = 0;
}

startBtn.addEventListener('click', startSim);
pauseBtn.addEventListener('click', pauseSim);
stepBtn.addEventListener('click', stepSim);
generateRandomTasksBtn.addEventListener('click', generateRandomData);

taskSelectionDdl.addEventListener('change', showRelevantControlsFromDropdown);
algorithmDdl.addEventListener('change', showTimeQuantum);
/*
classes.js
Javascript for CPU Scheduler Sim
Nicholas Normn
Sept 2024
*/

//Task obj
class Task {

    //Task Class
    /*
    Goal: Hold information about each task
    Input: Name, burst time, arrival time, priority
    Output: New Task
    */

    constructor(num, burst, arrival, priority) {
        this.num = num;
        this.burst = burst;
        this.remaining = burst;
        this.arrival = arrival;
        this.priority = priority;
    
        //tracking data
        this.start = null; //start time
        this.finish = null; //finish time
        this.waiting = 0; //time spent waiting
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
        this.waiting++;
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

    clone() {
        var clonedTask = new Task(this.num, this.burst, this.arrival, this.priority);

        clonedTask.finish = this.finish;
        clonedTask.remaining = this.remaining;
        clonedTask.start = this.start;
        clonedTask.waiting = this.waiting;

        return clonedTask;
    }

}

//create some test data to populate tasks
function randTasks(stop, maxBurst) {

    var t = [];

    arrivalSum = 0;
    for (var i=0; i < stop; i++) {
        var num = i;
        var burst = Math.floor(Math.random() * maxBurst + 1);
        var arrival = arrivalSum + Math.floor(Math.random() * 4);
        arrivalSum = arrival;
        var priority = Math.floor(Math.random() * 8);

        t.push(new Task(num,burst,arrival, priority));
    }
    t.sort(compareArrival);

    return t;
}

//sorting algorithm for tasks based on arrival time
function compareArrival(a, b) {
     var output = 0;

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

//function to display tasks
function displayTasks(tasks) {
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

class ReadyQueue {

    //ReadyQueue class
    /*
    Goal: Be the ready queue
    Input: element
    Output: New Task
    */

    constructor(element) {
        this.element = element;
        this.queue = [];
    }

    nextProcess() {
        //some algorithm to figure out which task to return
        return this.queue.pop();
    }

    insertProcess(task) {
        this.queue.push(task);
    }

    hasProcess() {
         var output = false;

        //does the readyqueue have any tasks
        if (this.queue.length > 0) {
            output = true;
        }

        return output;
    }

    update() {
        //call wait on each task
        for (var i=0; i < this.queue.length; i++) {
            this.queue[i].wait();
        }
    }

    display() {
        //display tasks with specified element
        var tmp = "";
    
        for (var i=0; i < this.queue.length; i++) {
            tmp += "P<sub>" + this.queue[i].num + "</sub>, ";
        }

        this.element.innerHTML = tmp;
    }

}

class CPU {

    //CPU class
    /*
    Goal: Hold a task and process it
    Input: tasks
    Output: processing
    */

    constructor(element) {
        this.currentTask = null;
        this.idle = 0;
        this.element = element;
    }

    update() {
        //process the current task
        if (this.currentTask != null) {
            //make sure there is a task
            this.currentTask.process();
        }
    }

    hasProcess() {

        var output = false;

        if (this.currentTask != null) {
            output = true;
        }

        return output;
    }

    insertProcess(task) {
        //insert into the current task
        this.currentTask = task;
    }

    getCurrentProcess() {
        return this.currentTask;
    }

    popProcess() {
        var tmpProcess = this.currentTask.clone();

        this.currentTask = null;

        return tmpProcess;
    }

    idling() {
        this.idle++;

        return this.idle;
    }

    display() {
        if (this.currentTask != null) {
            this.element.innerHTML = "P<sub>" + this.currentTask.num + "</sub> [start:" + this.currentTask.start + " rem:" + this.currentTask.remaining + "], ";
        } else {
            this.element.innerHTML = "";
        }
    }
}

class Scheduler {

    //Scheduler class
    /*
    Goal: Implement the ready queue and cpu as 
    Input: tasks
    Output: processing
    */

    constructor(rqElement, cpuElement, finishedElement) {
        this.dormant = []; //tasks that have not arrived
        this.rq = new ReadyQueue(rqElement);
        this.cpu = new CPU(cpuElement);
        this.finished = []; //finsihed tasks
        this.elFinished = finishedElement;
        this.time = 0; //this is the time (in whatever unit)
    }

    loadProcesses(tasks) {
        for (var i = 0; i < tasks.length; i++) {
            this.dormant.push(tasks[i].clone());
        }
    }

    nextFrame() {
        //increment time by 1
        this.time++;
    }

    getTime() {
        //get time
        return this.time;
    }

    isFinished() {
        //if no tasks in dormant, rq, or cpu

        var output = false;

        if (this.dormant.length == 0) {
            if (this.rq.hasProcess() == false) {
                if (this.cpu.hasProcess() == false) {
                    output = true;
                }
            }
        }

        return output;
    }

    getStats() {
        //calculate stats and return them here!
        //averages of all the tasks (Should be run when all tasks are in finished)
    }

    displayFinished() {

        var tmp = "";

        for (var i=0; i < this.finished.length; i++) {
            tmp += "P<sub>" + this.finished[i].num + "</sub>" + " [fin:" + this.finished[i].finish + "], ";
        }

        this.elFinished.innerHTML = tmp;
    }

    update() {
        //do operations to move process along

        //if the current task is finished
        if (this.cpu.hasProcess()) {
            if (this.cpu.currentTask.remaining <= 0) {
                //set finished time
                this.cpu.currentTask.finishTask(this.time);
                //move to finished
                this.finished.push(this.cpu.popProcess());
            }
        }

        //for each task that is dormant,
        for (var i=0; i < this.dormant.length; i++) {
            //check to see if it should be added to the ready queue
            if (this.dormant[i].arrival <= this.time) {
                //add to ready queue

                //remove from dormant
                var currentTask = this.dormant.splice(i, 1)[i];

                this.rq.insertProcess(currentTask);

                //set back one because one was removed
                i--;
            }
        }

        //CPU
            //If cpu is not currently processing
            if (this.cpu.hasProcess() == false) {

                //if there is a process in the ready queue
                if(this.rq.hasProcess()) {

                    //get next process
                    var next = this.rq.nextProcess();

                    //if the process start time is null,
                    if (next.start == null) {
                        //set the start time
                        next.startTask(this.time);
                    }

                    //the scheduler gives the CPU a new process from the ready queue
                    this.cpu.insertProcess(next);
                }
            } else {
                //Else,
                //idle cpu
                this.cpu.idling();
            }
        
        //the scheduler notifies the CPU, RQ to update (wait and process)
        //this.rq.update();
        this.cpu.update();

        //next frame
        this.nextFrame();
    }

    display() {
        //display all subclasses

        this.rq.display();
        this.cpu.display();
        this.displayFinished();
    }
}
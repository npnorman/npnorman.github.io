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
        return this.queue.pop()
    }

    insertProcess(task) {
        this.queue.push(task);
    }

    hasProcess() {
        output = false;

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
            this.currentTask.process;
        }
    }

    hasProcess() {

        output = false;

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

    idling() {
        this.idle++;

        return this.idle;
    }

    display() {
        if (this.currentTask != null) {
            this.element.innerHTML = "P<sub>" + this.currentTask.num + "</sub>";
        }
    }
}
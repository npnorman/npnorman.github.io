//this file holds all of the custom classes for the elevator sim
//June 2025 Nicholas Norman

class FloorRequest {
    constructor(outsideRequest, insideRequest) {
        this.outsideRequest = outsideRequest;
        this.insideRequest = insideRequest;

        //holding information about frames waiting
        this.insideWait = 0;
        this.outsideWait = 0;

        //display
        this.personToken = "☺";
        this.color = "#" + this.getRandomColor();
    }

    getOutsideRequest() {
        return this.outsideRequest;
    }

    getInsideRequest() {
        return this.insideRequest;
    }

    //override the toString for log
    toString() {
        return "[out: " + this.outsideRequest + "," + "in: " + this.insideRequest + "]";
    }

    getRandomColor() {
        return Math.floor(Math.random()*16777215).toString(16);
    }

    toToken() {
        var span = document.createElement("span");
        span.innerHTML = this.personToken;
        span.style.color = this.color;

        return span;
    }
}

class Elevator {
    constructor(capacity=5) {
        this.goal = 1;
        this.isFree = true;

        //private from children
        this._insideRequests = []; //may become virtual
        this._capacity = capacity;
        this._currentFloor = 1;
    }

    pickFloorToStopAt() {
        //return a floor to stop at
        //this is overriden in the children

        return 1;
    }

    getOutsideRequests() {
        //returns the values of outside requests

        var strippedOutsideRequests = [];
        outsideRequests.forEach((item) => { strippedOutsideRequests.push(item.getOutsideRequest()); });

        return strippedOutsideRequests;
    }

    getInsideRequests() {
        //returns the values of inside requests

        var strippedInsideRequests = [];
        this._insideRequests.forEach((item) => { strippedInsideRequests.push(item.getInsideRequest()); });

        return strippedInsideRequests;
    }

    getCurrentFloor() {
        return this._currentFloor;
    }

    getCapacity() {
        //returns capacity for children
        return this._capacity;
    }

    getNumberOfPeopleInElevator() {
        //this is how much room is left in the elevator
        return this._insideRequests.length;
    }

    getSharedGoals() {
        return sharedGoals;
    }

    getGoal() {
        return this.goal;
    }

    //hidden from the operator

    addSharedGoal() {
        sharedGoals.push(this.goal);
    }

    removeSharedGoal() {
        sharedGoals.splice(sharedGoals.indexOf(this.goal), 1);
    }

    setNewGoal() {
        //sets the goal for the elevator to stop at. Sets isFree to false.
        this.goal = this.pickFloorToStopAt();
        this.isFree = false;

        //set shared goal
        this.addSharedGoal();
    }

    _stopAtFloor() {

        if (this._insideRequests.length != 0) {
            this._dropOff();
        }

        if (outsideRequests.length != 0) {
            this._pickUp();
        }

        //after stopping at the requested floor, pick a new floor
        this.removeSharedGoal();
        this.isFree = true;
    }

    _dropOff() {
        //"drops off" any inside requests by marking them as handled and moving them to a finished list. This is called in stopAtFloor(int floor)

        var index = 0;
        while (index < this._insideRequests.length) {

            if (this._insideRequests[index].getInsideRequest() == this.getCurrentFloor()) {
                //move it to finished list
                finishedRequests.push(this._insideRequests.splice(index, 1)[0]);
            } else {
                //move the index up
                index++;
            }
        }
    }

    _pickUp() {
        //"picks up" (capacity - occupancy) users at the specified floor (outside request) by moving that many outside requests to inside requests. This is called in stopAtFloor(int floor) after dropOff(int floor) and floor is passed through.
        var ableToPickUp = this.getCapacity() - this.getNumberOfPeopleInElevator();
        var pickedUpSoFar = 0;
        var index = 0;

        var keepGoing = true;
        while (keepGoing) {

            //if on the right floor
            if (outsideRequests[index].getOutsideRequest() == this.getCurrentFloor()) {
                //pull from outside inside
                this._insideRequests.push(outsideRequests.splice(index, 1)[0]);

                //add to counter
                pickedUpSoFar++;
            } else {
                //move to next element
                index++;
            }

            if (pickedUpSoFar >= ableToPickUp) {
                //if picked up max
                keepGoing = false;
            } else if (index >= outsideRequests.length) {
                //or if no more to pickup
                keepGoing = false;
            }
        }
    }

    canTakeNewRequest() {
        return this.isFree;
    }

    moveTowardsGoal() {
        if (this._currentFloor < this.goal) {
            //go up
            this._currentFloor++;
        } else if (this._currentFloor > this.goal) {
            this._currentFloor--;
        } else {
            //at current floor
            this._stopAtFloor();
        }
    }

    //for logging purposes
    getStats() {
        return "GOAL: " + this.goal
         + "\nISFREE: " + this.isFree 
         + "\nOCCUPANCY: " + this.getNumberOfPeopleInElevator()
         + "\nCURRENTFLOOR: " + this._currentFloor
         + "";
    }
}

var el = new Elevator();
el._insideRequests.push(new FloorRequest(1,2));
el._insideRequests.push(new FloorRequest(1,2));
console.log(el.getNumberOfPeopleInElevator());
### HOW TO RUN
Run this as HTML, CSS, and JS. (I reccomend using Live Server Extension with VS Code).

# RULES FOR SIMULATION:

The only thing you can modify is the following class:
* `js/ElevatorOperator.js`

Rules:
* You may add variables to this class
* you may add functions to this class
* You may NOT access the super class' variables directly
* You may NOT access the super class' methods directly (unless stated below)

Here are a list of methods you are allowed to use:
* `getGoal()` //returns the current floor trying to reach
* `getOutsideRequests()` //returns int[] of all requests for pickup
* `getInsideRequests()` //returns int[] of requests for dropoff in the current elevator
* `getCurrentFloor()` //returns int which is the current floor the elevator is on
* `getCapacity()` //returns int which is the amount of people that can fit in this elevator
* `getNumberOfPeopleInElevator()` //returns int which is the amount of people in the elevator
* `getSharedGoals()` //returns the list of every elevators goal: where they are going to stop next.

You may ONLY override the following function:
* `pickFloorToStopAt()`

The basic breakdown of the simulation is the following:
* on every frame:
  * a new floor is chosen to be the new goal: The floor to stop at (what is returned from `pickFloorToStopAt()`)
  * and then the elevator is moved 1 floor towards that goal (either up or down)

Here is some base code for starting:
```js
pickFloorToStopAt() {

    if (this.getInsideRequests().length != 0) {

        return this.getInsideRequests()[0];

    } else if(this.getOutsideRequests().length != 0) {

        return this.getOutsideRequests()[0];

    } else {
        return this.getCurrentFloor();
    }
}
```

Have fun!

Documentation can also be found at `/documentation.html` and can be viewed when running the live server. (NOT UP TO DATE AT THE MOMENT)

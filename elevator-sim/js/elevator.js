class ElevatorOperator extends Elevator{

    constructor(capacity=5) {
        super(capacity);
    }

    // on every frame:
    // a new floor is chosen to be the new goal: The floor to stop at
    // and then the elevator is moved 1 floor towards that goal (either up or down)

    pickFloorToStopAt() {

        if (this.getInsideRequests().length != 0) {

            return this.getInsideRequests()[0];

        } else if(this.getOutsideRequests().length != 0) {

            return this.getOutsideRequests()[0];

        } else {
            return this.getCurrentFloor();
        }
    }

    //RULES FOR SCHEDULING
    // You only have access to the following:
    // getGoal() //returns the current floor trying to reach
    // getOutsideRequests() //returns int[] of all requests for pickup
    // getInsideRequests() //returns int[] of requests for dropoff in the current elevator
    // getCurrentFloor() //returns int which is the current floor the elevator is on
    // getCapacity() //returns int which is the amount of people that can fit in this elevator
    // getNumberOfPeopleInElevator() //returns int which is the amount of people in the elevator
    // getSharedGoals() //returns the list of every elevators goal: where they are going to stop next.
}
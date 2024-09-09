
input1_0 = document.getElementById("input1-0");
run1 = document.getElementById("run1-0");
output1 = document.getElementById("output1-0");

//functions
function block1(varX) {

    var output = "";
    var valid = false;

    if(isNaN(varX)) {
        if (varX == "true" || varX == "false") {
            //boolean
            output = varX;

        } else if(varX[0] == "\"" && varX[varX.length -1] == "\"") {
            //if quotes proprely used
            output = varX;

        } else if(varX[0] == "''" && varX[varX.length -1] == "'") {
            //char
            output = varX;

        } else {
            output = "Syntax Error, Not a Number or improper use of quotes: \" \" ";
        }
    } else {
        output = varX;
    }

    output1.innerHTML = output;
}

//event listener
run1.addEventListener("click", function(e) {
    block1(input1_0.value);
});
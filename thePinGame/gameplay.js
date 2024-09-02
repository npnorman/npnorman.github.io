/*Nicholas Norman Aug 30 2024*/

//vars
var pinPad = document.getElementById("pin-pad");
var counter = document.getElementById("counter");
var display = document.getElementById("counter-display");
var codes = document.getElementById("codes"); //div with codes
var codesHeader = document.getElementById("codesHeader");
var correctCodeFound = false;
var currentDisplay = "";
var codeEnter = 0; //stores amount of times enter is pressed with no code

var codeDict = [
    ["0000", "", false],
    ["1111", "", false],
    ["2222", "", false],
    ["3333", "", false],
    ["4444", "", false],
    ["5555", "", false],
    ["6666", "", false],
    ["7777", "", false],
    ["8888", "", false],
    ["9999", "", false],
    ["1234", "", false],
    ["4321", "", false],
    ["69", "nice ;)", false],
    ["02*06*04", "my bday, mm*dd*yy", false],
    ["666", "evil", false],
    ["****", "password", false],
    ["5318008","hold the calc upsode down",false],
    ["24","a funny number according to Patrick",false],
    ["25","whats funnier than the last...",false],
    ["####","did the number even go through?",false]
];

//lists
var easyList = document.getElementById("easylist");
var evilList = document.getElementById("evillist");
var questionList = document.getElementById("questionlist");

//button functions
function pinPress(val) {

    resetDisplay();

    if(val == "#") {
        //enter function
        //clear screen
        display.innerHTML = "";

        //call function for processing pin
        pinProcess(currentDisplay);

        //#### code
        if (currentDisplay == "") {
            console.log("hint");
            codeEnter++;

            //if entered 4 times without a code, get secret code
            if (codeEnter > 3) {
                pinProcess("####");
            }
        }

        //clear data
        currentDisplay = "";

    } else {
        //add to diplay
        display.innerHTML += val;
        currentDisplay += val;
    }
}

function pinProcess(code) {
    //cases

    var tmpCode = "";
    var tmpEntry = "";
    var found = false;

    //check code
    for(var i=0; i < codeDict.length; i++) {
        if(code == codeDict[i][0]) {

            //check if already found
            if(codeDict[i][2] == false) {
                tmpCode = codeDict[i][0];
                tmpEntry = codeDict[i][1];
                
                //set to found
                codeDict[i][2] = true;
                found = true;

                //feedback
                correctCode();
            }
        }
    }

    //if code is found put in its section
    if (found == true) {
        appendCode(tmpCode,tmpEntry);
        
        //reset found
        found = false;
    }
}

function appendCode(code, entry) {
    //find p value in codes and set to it
    var codeList = document.getElementById("codes").getElementsByTagName("p");
    
    for (var i=0; i < codeDict.length; i++) {
        if (codeDict[i][0] == code) {
            //splice first 5 letters
            codeList[i].innerHTML = codeList[i].innerHTML.slice(0,5);

            //add code
            codeList[i].innerHTML += code;
        }
    }
}

function correctCode() {
    counter.classList.add("green");
    display.innerHTML = "🎉🎉🎉";

    //add to header
    codesHeader.innerHTML = "Codes: Unlock them all! (" + amountCorrect() + "/" + codeDict.length + ")";

    correctCodeFound = true;
}

function resetDisplay() {
    if (correctCodeFound == true) {
        counter.classList.remove("green");
        display.innerHTML = "";
    }

    correctCodeFound = false;
}

function hasHint(index) {
    if (codeDict[index][1] != "") {
        return true;
    } else {
        return false;
    }
}

function amountCorrect() {
    var amtCorrect = 0;
    
    for(var i=0; i < codeDict.length; i++) {
        if (codeDict[i][2] == true) {
            amtCorrect += 1;
        }
    }

    return amtCorrect;
}

function onLoad() {
    pinPad.addEventListener("click", function(e) {
        //pass event target value (number)
        var target = e.target;

        //validate button press, not div
        if (e.target.tagName === "BUTTON") {
            pinPress(target.value);
        }
    });
    
    //do this when loaded, add these to screen
    
    //for length of code dictionary, add "00: " to new p in codes
    for(var i=0; i < codeDict.length; i++) {
        var tmpP = document.createElement("p");
        //add class
        tmpP.classList.add("codeNumber");
    
        //add content
        var tmpNum = i;
        tmpNum = tmpNum.toString();
        tmpNum = tmpNum.padStart(3, "0")
        tmpNum += ": ";
        tmpNum += "".padEnd(codeDict[i][0].length, "-");
    
        //add hint
        if (hasHint(i)) {
            //not an empty hint
            //set title attribute
            tmpP.setAttribute("title", "hint: " + codeDict[i][1]);
        } else {
            tmpP.setAttribute("title", "no hint :/");
        }
    
        //set to screen
        tmpP.innerHTML = tmpNum;
        codes.appendChild(tmpP);
    }

    //change codes header to 0
    codesHeader.innerHTML = "Codes: Unlock them all! (0/" + codeDict.length + ")";
}

onLoad();

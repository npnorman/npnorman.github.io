//nand2tetrisproject6assemblerjs.js
//Nicholas Norman December 2025
//The implementation of the assembler neededin the Nand2Tetris Course project 6, part I

var inputFile = document.getElementById("inputFile");
var assembleBtn = document.getElementById("assemble");
var downloadBtn = document.getElementById("download");
var inputTextarea = document.getElementById("inputTextarea");
var outputTextarea = document.getElementById("outputTextarea");
var errorTextOutput = document.getElementById("errorText");

var filename = "";
var fileContent = "";
var tokens = [];
var instructions = [];
var hackFileContent = "";
var varctr = 16;

const TOKENS = {
    AINSTR_SYMBOL : 0,
    AINSTR_VALUE : 1,
    LABEL : 2,
    CINSTR : 3,
}

// key, value
var symTab = [
    ["R0","0"],
    ["R1","1"],
    ["R2","2"],
    ["R3","3"],
    ["R4","4"],
    ["R5","5"],
    ["R6","6"],
    ["R7","7"],
    ["R8","8"],
    ["R9","9"],
    ["R10","10"],
    ["R11","11"],
    ["R12","12"],
    ["R13","13"],
    ["R14","14"],
    ["R15","15"],
    ["SCREEN","16384"],
    ["KBD","24576"],
    ["SP","0"],
    ["LCL","1"],
    ["ARG","2"],
    ["THIS","3"],
    ["THAT","4"],
];

function reset() {
    tokens = [];
    instructions = [];
    hackFileContent = "";
    varctr = 16;
    symTab = [
    ["R0","0"],
    ["R1","1"],
    ["R2","2"],
    ["R3","3"],
    ["R4","4"],
    ["R5","5"],
    ["R6","6"],
    ["R7","7"],
    ["R8","8"],
    ["R9","9"],
    ["R10","10"],
    ["R11","11"],
    ["R12","12"],
    ["R13","13"],
    ["R14","14"],
    ["R15","15"],
    ["SCREEN","16384"],
    ["KBD","24576"],
    ["SP","0"],
    ["LCL","1"],
    ["ARG","2"],
    ["THIS","3"],
    ["THAT","4"],
    ];
}

function setError(errorMessage) {
    errorTextOutput.textContent = errorMessage;
}

function readinFile() {
    const file = inputFile.files[0];
    inputTextarea.textContent = "";

    if (!file) {
        setError("No file selected");
        return;
    }

    setError("");

    filename = file.name;

    // read in file
    const reader = new FileReader();
    reader.onload = () => {
        fileContent = reader.result;
        inputTextarea.textContent = fileContent;
    }
    reader.onerror = () => {
        setError("Error reading file. Try again");
    }
    reader.readAsText(file);
}

function showFile() {
    for (let k = 0; k < instructions.length; k++) {

        hackFileContent += instructions[k]

        if (k != instructions.length - 1) {
            hackFileContent += '\n';
        }
    }

    outputTextarea.textContent = hackFileContent;
}

function downloadFile() {

    if (hackFileContent == "") {
        setError("No file contents to download.");
        return;
    }

    filename = filename.replace('.asm', '');
    filename += ".hack";

    const blob = new Blob([hackFileContent], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;

    document.body.appendChild(a);
    a.click();

    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function isNumericChar(chr) {
    return /\d/.test(chr);
}

function isNumericStr(str) {
    return /^\d+$/.test(str);
}

function decStrToBinStr(decStr, padding) {
    // convert value to string in binary
    let currentValue = parseInt(decStr);
    let partialInstr = currentValue.toString(2);
    partialInstr = partialInstr.padStart(padding,'0');

    return partialInstr;
}

function pass1() {

    console.log("Starting pass 1");

    let locctr = 0;

    var lines = fileContent.split('\n');

    // read in file line by line (from saved)
    // for each line
    for (var i = 0; i < lines.length; i++) {

        var currentLine = lines[i];
        // remove leading and trailing whitespace
        currentLine = currentLine.replace(/\s/g, '')

        // remove comments
        if (currentLine.includes("//")) {
            var commentIndex = currentLine.indexOf("//");
            
            //remove substring
            currentLine = currentLine.slice(0,commentIndex);
        }

        if (currentLine == "") {
            continue;
        }

        console.log(locctr,currentLine);

        // scan for tokens
        // not table because instructions are so simple
        
        // if @
        if (currentLine[0] == '@') {
            // address instruction
            // check for value (0-9)+ or symbol (_$.: | A-z)(A-z+|0-9+)+
            tempTokens = []
            
            if (currentLine.length <= 1) {
                setError(locctr.toString() + " No value after @");
                return false;
            }

            if (isNumericChar(currentLine[1])) {
                //check is all numeric
                let currentValue = currentLine.slice(1,currentLine.length);

                tempTokens.push(TOKENS.AINSTR_VALUE);
                tempTokens.push('@');
                tempTokens.push(currentValue);

                if (currentLine.length > 2) {

                    if (isNumericStr(currentValue) == false) {
                        //error
                        setError(locctr.toString() +  " Symbol cannot start with number");
                        return false;
                    }
                }

            } else {
                let currentSymbol = currentLine.slice(1,currentLine.length);

                if (/^[A-Za-z$._:][A-Za-z0-9$._:]*$/.test(currentSymbol)) {
                    
                    tempTokens.push(TOKENS.AINSTR_SYMBOL);
                    tempTokens.push('@');
                    tempTokens.push(currentSymbol);

                    // if not in symtab
                    let found = false;
                    for (let k = 0; k < symTab.length; k++) {
                        if (symTab[k][0] == currentSymbol) {
                            found = true;
                            break;
                        }
                    }

                    if (found == false) {
                        // save name
                        symTab.push([currentSymbol, -1]);
                    }

                } else {
                    setError(locctr.toString() +  " Invalid starting character : " + currentSymbol);
                    return false;
                }
            }

            // LOCCTR ++
            locctr++

            tokens.push(tempTokens);
        
        } else if (currentLine[0] == "(") {
            // label
            let currentLabel = currentLine.slice(1,currentLine.length - 1);

            if (/^\([A-Za-z$._:][A-Za-z0-9$._:]*\)$/.test(currentLine)) {
                // if not in symtab
                let found = false;
                for (let k = 0; k < symTab.length; k++) {
                    if (symTab[k][0] == currentLabel) {
                        found = true;

                        if (symTab[k][1] == -1) {
                            // set to current address
                            symTab[k][1] = locctr;
                        }

                        break;
                    }
                }

                if (found == false) {
                    // save name and address (locctr)
                    symTab.push([currentLabel, locctr]);
                }

                tokens.push([TOKENS.LABEL, "(", currentLabel, ")"]);

            } else {
                setError("Invalid label name");
                return false;
            }
        } else {
            //c instruction

            // split on = and ;
            dest = "";
            comp = "";
            jump = "";
            if (currentLine.includes('=')) {
                dest = currentLine.split('=')[0];
                comp = currentLine.split('=')[1];
            }

            if (comp == "") {
                comp = currentLine;
            }

            if (comp.includes(';')) {
                comp = comp.split(';')[0];
                jump = currentLine.split(';')[1];

                if (jump == "") {
                    setError(locctr.toString() + " Must have jump after ;");
                    return false;
                }
            }

            //check values
            if (/^(A?M?D?|A?D?M?|M?A?D?|M?D?A?|D?A?M?|D?M?A?)$/.test(dest) == false) {
                setError(locctr.toString() + " Destination incorrect");
                return false;
            }
            if (["","JGT","JEQ","JGE","JLT","JNE","JLE","JMP"].includes(jump) == false) {
                setError(locctr.toString() + " Jump incorrect");
                return false;
            }

            tokens.push([TOKENS.CINSTR, dest, "=", comp, ";", jump]);

            // LOCCTR ++
            locctr++
        }
    }

    return true;
}

function pass2() {

    let locctr = 0;

    // for each token line
    for (let k = 0; k < tokens.length; k++) {
        // create instruction
        // save to new file (list of strings)

        //instruction
        let instruction = "";
        
        if (tokens[k][0] == TOKENS.AINSTR_VALUE) {
            // if token == @ (VALUE)
            instruction = "0";

            // convert value to string in binary
            instruction += decStrToBinStr(tokens[k][2], 15);

            locctr++;

        } else if (tokens[k][0] == TOKENS.AINSTR_SYMBOL) {
            // if token == @ (SYMBOL)
            instruction = "0";

            let found = false;
            let symIndex = -1;
            for (let d = 0; d < symTab.length; d++) {
                if (symTab[d][0] == tokens[k][2]) {
                    found = true;
                    symIndex = d;
                    break;
                }
            }

            if (found) {
                if (symTab[symIndex][1] == -1) {
                    //make new address
                    symTab[symIndex][1] = varctr;
                    varctr++;
                    console.log(varctr);
                }

                instruction += decStrToBinStr(symTab[symIndex][1], 15);
            }

            locctr++;

        } else if (tokens[k][0] == TOKENS.LABEL) {
            // else if token == ()
            // no instructions

        } else {
            // else (c-instruction)
            instruction = "111";

            let currentDest = tokens[k][1];
            let currentComp = tokens[k][3];
            let currentJump = tokens[k][5];

            //set comp
            let compList = [
                //comp, code, a
                ["0", "101010", "0"],
                ["1", "111111", "0"],
                ["-1", "111010", "0"],
                ["D", "001100", "0"],
                ["A", "110000", "0"],
                ["M", "110000", "1"],
                ["!D", "001101", "0"],
                ["!A", "110001", "0"],
                ["!M", "110001", "1"],
                ["-D", "001111", "0"],
                ["-A", "110011", "0"],
                ["-M", "110011", "1"],
                ["D+1", "011111", "0"],
                ["A+1", "110111", "0"],
                ["M+1", "110111", "1"],
                ["D-1", "001110", "0"],
                ["A-1", "110010", "0"],
                ["M-1", "110010", "1"],
                ["D+A", "000010", "0"],
                ["D+M", "000010", "1"],
                ["D-A", "010011", "0"],
                ["D-M", "010011", "1"],
                ["A-D", "000111", "0"],
                ["M-D", "000111", "1"],
                ["D&A", "000000", "0"],
                ["D&M", "000000", "1"],
                ["D|A", "010101", "0"],
                ["D|M", "010101", "1"],
                
            ];

            let found = false;
            for (let l = 0; l < compList.length; l++) {
                if (currentComp == compList[l][0]) {
                    //found
                    found = true;
                    instruction += compList[l][2] + compList[l][1];
                    break;
                }
            }

            if (found == false) {
                setError("Statement not allowed: " + currentComp + " line " + locctr);
                return false;
            }

            //set destination
            let abit = "0";
            let mbit = "0";
            let dbit = "0";
            if (currentDest.includes("D")) {
                dbit = "1";
            }
            if (currentDest.includes("M")) {
                mbit = "1";
            }
            if (currentDest.includes("A")) {
                abit = "1";
            }

            instruction += (abit + dbit +  mbit);

            //set jump
            let jumpList = [
                ["", "000"],
                ["JGT", "001"],
                ["JEQ", "010"],
                ["JGE", "011"],
                ["JLT", "100"],
                ["JNE", "101"],
                ["JLE", "110"],
                ["JMP", "111"],
            ];

            found = false;
            for (let l = 0; l < jumpList.length; l++) {
                if (currentJump == jumpList[l][0]) {
                    //found
                    found = true;
                    instruction += jumpList[l][1];
                    break;
                }
            }

            if (found == false) {
                setError("Statement not allowed: " + jumpList + " line " + locctr);
                return false;
            }

            locctr++;
        }

        if (instruction != "") {
            instructions.push(instruction);
        }
    }

    return true;
}

function main() {

    reset();

    let pass1Out = pass1();

    if (pass1Out == false) {
        return;
    };

    console.log(symTab);
    console.log(tokens);
    console.log(instructions);

    let pass2Out = pass2();
    if (pass2Out == false) {
        return;
    }

    showFile();
}

assembleBtn.addEventListener('click', main);
downloadBtn.addEventListener('click', downloadFile);
inputFile.addEventListener('change', readinFile);
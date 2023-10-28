//setup data for board
var board = [
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""],
["", "", "", "", ""]
];
var player = 0; //0 is x, 1 is O
var elTurn = document.getElementById("player-turn");
var elWinner = document.getElementById("win-output");
var elRollOutput = document.getElementById("roll-output");
var elBoard = document.getElementById("board");
var allowGame = true;
var turnCounter = 0;

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max+1);
    return Math.floor(Math.random() * (max - min) + min);
}

function endTurn() {
    if (player == 1) { //O just went, now x
        player = 0;
        elTurn.innerHTML = "Player <b>X</b>'s Turn";
    } else if (player == 0) { //X just went now O
        player = 1;
        elTurn.innerHTML = "Player <b>O</b>'s Turn";
    }

    turnCounter++;
}

function clickBox(intPlayer, event) {
    var output = false;
    var target = event.target;
    var pos = target.id.split('-');
    
    //check to make sure it is valid
    if (board[pos[0]][pos[1]] == "") {
        var css = 'default-box';
        var symbol = '';

        if (intPlayer == 0) {
            symbol = "X";
            css = "X";
        } else if (intPlayer == 1) {
            symbol = "O";
            css = "O";
        }

        //for user
        target.children[0].innerHTML = symbol;
        target.classList.toggle(css);
        //for data
        board[pos[0]][pos[1]] = symbol;

        output = true; //placed
    } else {
        console.log("already taken");
        output = false; //already taken
    }

    return output;
}

function checkWin(symbol) {

    var symbol = "-";
    if (player == 0) {
        symbol = "X";
    } else if (player == 1) {
        symbol = "O";
    }
    var output = false;
    //check row
    //for each row
    for (var i = 0; i < board.length; i++) {
        //if there is a symbol
        if (board[i][0] == symbol) {
            //check next symbol
            if (board[i][1] == symbol) {
                //check next symbol
                if (board[i][2] == symbol) {
                    //check last symbol
                    if (board[i][3] == symbol) {
                        //won
                        output = true;
                    }
                }
            }
        }
    }
    for (var i = 0; i < board.length; i++) {
        //if there is a symbol
        if (board[i][1] == symbol) {
            //check next symbol
            if (board[i][2] == symbol) {
                //check next symbol
                if (board[i][3] == symbol) {
                    //check last symbol
                    if (board[i][4] == symbol) {
                        //won
                        output = true;
                    }
                }
            }
        }
    }

    //check col
    for (var i = 0; i < board.length; i++) {
        //if there is a symbol
        if (board[0][i] == symbol) {
            //check next symbol
            if (board[1][i] == symbol) {
                //check last symbol
                if (board[2][i] == symbol) {
                    //check last symbol
                    if (board[3][i] == symbol) {
                        //won
                        output = true;
                    }
                }
            }
        }
    }
    for (var i = 0; i < board.length; i++) {
        //if there is a symbol
        if (board[1][i] == symbol) {
            //check next symbol
            if (board[2][i] == symbol) {
                //check last symbol
                if (board[3][i] == symbol) {
                    //check last symbol
                    if (board[4][i] == symbol) {
                        //won
                        output = true;
                    }
                }
            }
        }
    }

    //check diagonals
    if (board[0][0] == symbol) {
        if (board[1][1] == symbol) {
            if (board[2][2] == symbol) {
                if (board[3][3] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[1][0] == symbol) {
        if (board[2][1] == symbol) {
            if (board[3][2] == symbol) {
                if (board[4][3] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[0][1] == symbol) {
        if (board[1][2] == symbol) {
            if (board[2][3] == symbol) {
                if (board[3][4] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[4][0] == symbol) {
        if (board[3][1] == symbol) {
            if (board[2][2] == symbol) {
                if (board[1][3] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[3][0] == symbol) {
        if (board[2][1] == symbol) {
            if (board[1][2] == symbol) {
                if (board[0][3] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[4][1] == symbol) {
        if (board[3][2] == symbol) {
            if (board[2][3] == symbol) {
                if (board[1][4] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[0][4] == symbol) {
        if (board[1][3] == symbol) {
            if (board[2][2] == symbol) {
                if (board[3][1] == symbol) {
                    output = true;
                }
            }
        }
    }
    if (board[4][4] == symbol) {
        if (board[3][3] == symbol) {
            if (board[2][2] == symbol) {
                if (board[1][1] == symbol) {
                    output = true;
                }
            }
        }
    }
    
    if (output == true) {
        elWinner.innerHTML = "Player <b>" + symbol + "</b> Won!";
    }
    return output;
}

function reset() {
    //reset data
    board = [
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""],
        ["", "", "", "", ""]
        ];
    player = 0; //0 is x, 1 is O
    allowGame = true;
    turnCounter = 0;
    //reset html
    elTurn.innerHTML = "Player X's Turn"
    elWinner.innerHTML = " ";
    elRollOutput.innerHTML = "Start by Placing";
    //elBoard
    for (var k = 0; k < elBoard.children.length; k++) {
        elBoard.children[k].children[0].innerHTML = "";
        elBoard.children[k].classList.remove("O");
        elBoard.children[k].classList.remove("X");
    }
       
}

function roll() {
    var roll = getRandomInt(1,6);
    var move = "";
    if (roll == 1 || roll == 2 || roll == 3) {
        move = "Place";
    } else if (roll == 4) {
        move = "Swap";
    } else if (roll == 5) {
        move = "Move";
    } else if (roll == 6) {
        move = "Super Move";
    }

    elRollOutput.innerHTML = roll + ": " + move;
    return roll;
}

elBoard.addEventListener('click', function(e) {
    if(allowGame) {
        if (clickBox(player, e)) {
            if (checkWin(player)) {
                allowGame = false;
            } else if (turnCounter >= 24) {
                allowGame = false;
                elWinner.innerHTML = "Game ended in Draw!";
            }
            endTurn();
            if (turnCounter > 1) {
                roll();
            }
        }
    }
});

document.getElementById("reset").addEventListener('click', function(e) {
    reset();
    console.log("reset");
});
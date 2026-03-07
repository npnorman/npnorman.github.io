//simple-fakemon.js
//Nicholas Norman March 2026
//Fakemon game

var player1 = prompt("player 1: ");
var player2 = prompt("player 2: ")

var img1 = document.getElementById("img1");
var img2 = document.getElementById("img2");
var move1 = document.getElementById("move1");
var move2 = document.getElementById("move2");
var move3 = document.getElementById("move3");
var move4 = document.getElementById("move4");
var selfHP = document.getElementById("self-hp");
var enemyHP = document.getElementById("enemy-hp");
var turn = document.getElementById("turn");
var name1 = document.getElementById("name1");
var name2 = document.getElementById("name2");


var fakemon = [
    ["images.jpg", "Pika", 10,
        [-5, "Electric Blast", "H"],
        [-2, "Electric Blast", 'A'],
        [0, "Block", "A"],
        [4, "Electric Blast", "H"]
        ],
    ["m_2Fx1000_2Fa7340898-92bf-453f-a3a1-c00f5cd15711.jpg", "Detective Pika", 20,
        [-5, "Electric Blast", "H"],
        [-5, "Electric Blast", 'A'],
        [0, "Block", "A"],
        [-5, "Electric Blast", "H"]
    ],
    ["drackle.webp", "Drackle", 110,
        [+30, "Tail Shed", "H"],
        [-15, "Scratch", 'A'],
        [-30, "Tail Smash", "A"],
        [0, "Spotty Camo", "H"]
    ],
    ["smoalder.webp", "Smoadler", 85,
        [-10, "Singe", "H"],
        [-35, "Flamethrower", 'A'],
        [+15, "Burn Up", "A"],
        [0, "Smokescreen", "H"]
    ],
]

var p1hp = fakemon[player1][2];
var p2hp = fakemon[player2][2];
name1.innerHTML = fakemon[player1][1];
name2.innerHTML = fakemon[player2][1];

img1.src = "fakemon/" + fakemon[player1][0];
img2.src = "fakemon/" + fakemon[player2][0];

var block = 0;

var buffer = 0
var state = 1

function mainloop() {

    turn.innerHTML = "p1 turn";

    selfHP.innerHTML = buffer;

    selfHP.innerHTML = p1hp;
    enemyHP.innerHTML = p2hp;
    
    console.log(state, block, buffer);

    if (state == 1) {
        move1.innerHTML = fakemon[player1][3][0] + "<br>" + fakemon[player1][3][1];
        move2.innerHTML = fakemon[player1][4][0] + "<br>" + fakemon[player1][4][1];
        move3.innerHTML = fakemon[player1][5][0] + "<br>" + fakemon[player1][5][1];
        move4.innerHTML = fakemon[player1][6][0] + "<br>" + fakemon[player1][6][1];

        if (buffer != 0) {
            
            if (block == 1) {
                block = 0;

            } else {
                if (fakemon[player1][buffer + 2][0] > 0) {
                    p1hp += fakemon[player1][buffer + 2][0];

                } else {
                    p2hp += fakemon[player1][buffer + 2][0];
                }
            }

            if (fakemon[player1][buffer + 2][0] == 0) {
                // block next attack
                block = 1;            
            }

            buffer = 0;

            state = 2;
        }
        
    } else if (state == 2) {

        turn.innerHTML = "p2 turn";

        move1.innerHTML = fakemon[player2][3][0] + "<br>" + fakemon[player2][3][1];
        move2.innerHTML = fakemon[player2][4][0] + "<br>" + fakemon[player2][4][1];
        move3.innerHTML = fakemon[player2][5][0] + "<br>" + fakemon[player2][5][1];
        move4.innerHTML = fakemon[player2][6][0] + "<br>" + fakemon[player2][6][1];
    
        if (buffer != 0) {
            
            if (block == 1) {
                block = 0;
                
            } else {

                if (fakemon[player2][buffer + 2][0] > 0) {
                    p2hp += fakemon[player2][buffer + 2][0];
                } else {
                    p1hp += fakemon[player2][buffer + 2][0];
                }
            }

            if (fakemon[player1][buffer + 2][0] == 0) {
                // block next attack
                block = 1;
            
            }

            buffer = 0;

            state = 1;
            
        }
    } else if (state == 3) {
        turn.innerHTML = "END GAME!!!"
    }

    if (p2hp <= 0 || p1hp <= 0) {
        state = 3;
    }

    setTimeout(mainloop, 100);
}

setTimeout(mainloop, 100);

move1.addEventListener('click',  function () {
    buffer = 1;
});
move2.addEventListener('click',  function () {
    buffer = 2;
});
move3.addEventListener('click',  function () {
    buffer = 3;
});
move4.addEventListener('click',  function () {
    buffer = 4;
});
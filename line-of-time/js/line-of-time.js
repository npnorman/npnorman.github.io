//line-of-time.js
//Nicholas Norman October 2025
//this is a game where you compare lines of different valued things

//classes
class Card {
    constructor(name,value,imageURL=null) {
        this.name = name;
        this.value = value;
        this.imageURL = imageURL;
        this.guessName = " ";
        this.color = "#787878ff";
    }

    createCard(guessName=null, color=null) {
        //create and return card element
        if (guessName != null) {
            this.guessName = guessName;
        }

        if (color != null) {
            this.color = color;
        }

        //create elements
        var cardDiv = document.createElement("div");
        var guesserP = document.createElement("p");
        var guesserText = document.createTextNode("");
        var nameP = document.createElement("p");
        var nameText = document.createTextNode("");
        var valueP = document.createElement("p");
        var valueText = document.createTextNode("");
        var image = document.createElement("img");

        cardDiv.appendChild(guesserP);
        cardDiv.appendChild(nameP);
        cardDiv.appendChild(image);
        cardDiv.appendChild(valueP);
        guesserP.appendChild(guesserText);
        nameP.appendChild(nameText);
        valueP.appendChild(valueText);

        nameText.textContent = this.name;
        valueText.textContent = this.value;
        guesserText.textContent = this.guessName;

        if (this.imageURL == null) {
            image.src = "https://upload.wikimedia.org/wikipedia/commons/9/98/Commodore_Grace_M._Hopper%2C_USN_%28covered%29_head_and_shoulders_crop.jpg";
        } else {
            image.src = this.imageURL;
        }

        //css
        cardDiv.classList.add("card");
        cardDiv.style.backgroundColor = this.color;
        nameP.classList.add("card-name");

        return cardDiv;
    }
}

//lists
var currentGuessCard;
var timelineCards = [];
var unusedCards = [];
var guesserList = {
    "default" : "#787878ff"
};

//elements
var startBtn = document.getElementById("startButton");
var currentGuessCardDiv = document.getElementById("currentCard");
var timelineDiv = document.getElementById("timeline");

//functions
function startGame() {
    //parse from list
    //set up lists
    //call first create card for guess
    var card = new Card("Cobol Invented", "1956");
    currentGuessCardDiv.appendChild(card.createCard("Nick","#b20000ff"));
}

//connections
startBtn.addEventListener('click',startGame);
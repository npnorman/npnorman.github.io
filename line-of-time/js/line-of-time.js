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

    setGuesser(guessName) {
        this.guessName = guessName;
    }

    createCard(guessName=null) {
        //create and return card element
        if (guessName != null) {
            this.guessName = guessName;
        }

        if (guessName in guesserList) {
            this.color = guesserList[guessName];
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
var questionsTextArea = document.getElementById("questions");
var errorP = document.getElementById("error");

//helper functions
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

//functions
function startGame() {
    resetGame();

    //parse from list
    parseQuestions();
    //set up lists
    //call first create card for guess
    //initialize first guess
    var randomIndex = getRandomIntInclusive(0,unusedCards.length-1);
    var randomCard = unusedCards.splice(randomIndex,1)[0];
    timelineCards.push(randomCard);

    createTimeline();
}

function resetGame() {
    clearTimeline();
    errorP.textContent = "";
    unusedCards = [];
    timelineCards = [];
    currentGuessCard = null;
}

function parseQuestions() {
    //parse cards
    //create cards
    //add to unused list
    var questions = questionsTextArea.value;
    var lines = questions.split('\n');
    for (var i=0; i < lines.length; i++) {
        var line = lines[i];
        var cardInfo = line.split(',');

        if (cardInfo.length < 2) {
            errorP.textContent = "Not enough information on line " + (i + 1);
        }

        if (cardInfo.length == 2) {
            var newCard = new Card(cardInfo[0],cardInfo[1]);
        } else if (cardInfo.length == 3) {
            var newCard = new Card(cardInfo[0],cardInfo[1],cardInfo[2]);
        }

        unusedCards.push(newCard);
    }
}

function setCurrentCard(card) {
    while (currentGuessCardDiv.firstChild) {
        currentGuessCardDiv.removeChild(currentGuessCardDiv.lastChild);
    }

    currentGuessCard.appendChild(card.createCard())
}

function turn() {
    //defines a "turn" of the game
    var card = new Card("Cobol Invented", "1959");
    timelineDiv.appendChild(card.createCard("Nick","#b20000ff"));
}

function createTimeline() {
    clearTimeline();
    var tempButton = document.createElement("button");
    tempButton.textContent = "+";
    tempButton.classList.add("addButton");
    tempButton.value = "0"

    timelineDiv.appendChild(tempButton);
    for (var i=0; i < timelineCards.length; i++) {
        var tempCard = timelineCards[i].createCard();
        timelineDiv.appendChild(tempCard);

        var newButton = tempButton.cloneNode(true);
        newButton.value = i.toString();
        timelineDiv.appendChild(tempButton.cloneNode(true));
    }
}

function clearTimeline() {
    while (timelineDiv.firstChild) {
        timelineDiv.removeChild(timelineDiv.lastChild);
    }
}

//connections
startBtn.addEventListener('click',startGame);
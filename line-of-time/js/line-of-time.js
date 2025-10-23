//line-of-time.js
//Nicholas Norman October 2025
//this is a game where you compare lines of different valued things

//classes
class Card {
    constructor(name,cardValue,imageURL=null) {
        this.name = name;
        this.cardValue = cardValue;
        this.imageURL = imageURL;
        this.guessName = " ";
        this.color = "#787878ff";
    }

    setGuesser(guessName) {
        this.guessName = guessName;
    }

    createCard(hidden=false,guessName=null) {
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
        if (hidden) {
            valueText.textContent = "??????";
        } else {
            valueText.textContent = this.cardValue;
        }
        guesserText.textContent = this.guessName;

        if (this.imageURL == null) {
            image.src = "https://miro.medium.com/0*ojIU84VO1XMGIn6_.jpg";
        } else {
            image.src = this.imageURL;
        }

        //css
        cardDiv.classList.add("card");
        cardDiv.classList.add("medium");
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
var guessBox = document.getElementById("guesser");
var currentGuessCardDiv = document.getElementById("currentCard");
var timelineDiv = document.getElementById("timeline");
var questionsTextArea = document.getElementById("questions");
var errorP = document.getElementById("error");
var smallSizeRadio = document.getElementById("small");
var mediuemSizeRadio = document.getElementById("medium");
var largeSizeRadio = document.getElementById("large");

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
    var randomCard = pickRandomUnusedCard();
    timelineCards.push(randomCard);

    pickNewCurrentCard();

    createTimeline();
}

function pickRandomUnusedCard() {
    var randomIndex = getRandomIntInclusive(0,unusedCards.length-1);
    var randomCard = unusedCards.splice(randomIndex,1)[0];

    return randomCard;
}

function pickNewCurrentCard() {
    if (unusedCards.length > 0) {
        var randomCard = pickRandomUnusedCard();
        setCurrentCard(randomCard);
    } else {
        createTimeline(buttons=false);
    }
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

    currentGuessCardDiv.appendChild(card.createCard(hidden=true))
    currentGuessCard = card;
}

function turn(index, buttonElement) {
    //defines a "turn" of the game
    var guessName = guessBox.textContent;

    var isCorrect = checkSpot(parseInt(index),parseInt(currentGuessCard.cardValue))

    //check if correct
    if (isCorrect) {
        //correct spot
        //add to timeline
        currentGuessCard.guessName = guessName;
        timelineCards.splice(index, 0, currentGuessCard);
        //new current guess card
        pickNewCurrentCard();
        createTimeline();
    } else {
        //otherwise, highlight button red
        buttonElement.style.backgroundColor = "red";
    }
    
}

function checkSpot(index, value) {
    
    var output = false;
    
    if (index == 0) {
        output = value <= parseInt(timelineCards[index].cardValue);
    } else if (index == timelineCards.length) {
        output = parseInt(timelineCards[index-1].cardValue) <= value;
    } else {
        output = value <= parseInt(timelineCards[index].cardValue);
        output = parseInt(timelineCards[index-1].cardValue) <= value;
    }

    return output;
}

function createTimeline(buttons=true) {
    clearTimeline();
    if (buttons) {
        var tempButton = document.createElement("button");
        tempButton.textContent = "+";
        tempButton.classList.add("addButton");
        tempButton.value = "0"
        tempButton.addEventListener('click', (e) => {
                turn(e.target.value,e.target);
        });
        timelineDiv.appendChild(tempButton);
    }

    for (var i=0; i < timelineCards.length; i++) {
        var tempCard = timelineCards[i].createCard();
        timelineDiv.appendChild(tempCard);

        if (buttons) {
            var newButton = tempButton.cloneNode(true);
            newButton.value = (i+1).toString();
            newButton.addEventListener('click', (e) => {
                turn(e.target.value,e.target);
            });
            timelineDiv.appendChild(newButton);
        }
    }
}

function clearTimeline() {
    while (timelineDiv.firstChild) {
        timelineDiv.removeChild(timelineDiv.lastChild);
    }
}

function changeCardSize(size) {
    //for all card classes
    //set class size
    //remove all previous class sizes
    var cards = document.getElementsByClassName("card");
    for (var i=0; i < cards.length; i++) {
        cards[i].classList.remove("large");
        cards[i].classList.remove("medium");
        cards[i].classList.remove("small");

        cards[i].classList.add(size);
    }
}

//connections
startBtn.addEventListener('click',startGame);

//radio buttons
smallSizeRadio.addEventListener('click',() => {
    changeCardSize("small");
});
mediuemSizeRadio.addEventListener('click',() => {
    changeCardSize("medium");
});
largeSizeRadio.addEventListener('click', () => {
    changeCardSize("large");
});
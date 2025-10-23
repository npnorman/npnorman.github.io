//line-of-time.js
//Nicholas Norman October 2025
//this is a game where you compare lines of different valued things

//classes
class Card {
    constructor(name,cardValue,imageURL=null) {
        this.name = name;
        this.cardValue = cardValue;
        this.imageURL = imageURL;
        this.guessName = "";
        this.color = "#787878ff";
    }

    setGuesser(guessName) {
        this.guessName = guessName;
    }

    createCard(hidden=false) {
        //create and return card element
        if ((this.guessName in guesserList) == false) {
            //get new color
            //attach to guesser list
            guesserList[this.guessName] = getRandomColor();   
        }
        this.color = guesserList[this.guessName];

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
    "" : "#787878ff"
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
var hideBtn = document.getElementById("hide");
var unhideBtn = document.getElementById("unhide");
var loadBtn = document.getElementById("load");
var saveBtn = document.getElementById("save");

//helper functions
function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomColor() {
    var red = getRandomIntInclusive(0,150);
    var green = getRandomIntInclusive(0,150);
    var blue = getRandomIntInclusive(0,150);

    return "#" + red.toString(16).padStart(2,'0') + green.toString(16).padStart(2,'0') + blue.toString(16).padStart(2,'0') + "FF";
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
    clearCurrentCard();
    if (unusedCards.length > 0) {
        var randomCard = pickRandomUnusedCard();
        setCurrentCard(randomCard);
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

function clearCurrentCard() {
    while (currentGuessCardDiv.firstChild) {
        currentGuessCardDiv.removeChild(currentGuessCardDiv.lastChild);
    }
}

function setCurrentCard(card) {
    currentGuessCardDiv.appendChild(card.createCard(hidden=true))
    currentGuessCard = card;
}

function turn(index, buttonElement) {
    //defines a "turn" of the game
    var guessName = guessBox.value;

    var isCorrect = checkSpot(parseInt(index),parseInt(currentGuessCard.cardValue))

    //check if correct
    if (isCorrect) {
        //correct spot
        //add to timeline
        currentGuessCard.setGuesser(guessName);
        timelineCards.splice(index, 0, currentGuessCard);
        //new current guess card
        if (unusedCards.length > 0) {
            createTimeline();
        } else {
            createTimeline(buttons=false);
        }
        pickNewCurrentCard();

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
        output = value <= parseInt(timelineCards[index].cardValue) && parseInt(timelineCards[index-1].cardValue) <= value;
    }

    console.log()

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

// meta loading, saving, hide, unhide
hideBtn.addEventListener('click', () => {
    questionsTextArea.style.display = 'none';
});

unhideBtn.addEventListener('click', () => {
    questionsTextArea.style.display = 'block';
});

loadBtn.addEventListener('click', () => {
    var file = document.getElementById("file").files[0];
    if (file) {
        var reader = new FileReader();
        reader.readAsText(file, "UTF-8");
        reader.onload = function (evt) {
            questionsTextArea.textContent = evt.target.result;
        }
        reader.onerror = function (evt) {
            errorP.textContent = "error reading file";
        }
    }
});

saveBtn.addEventListener('click', () => {
    var textToWrite = questionsTextArea.innerHTML;
    var textFileAsBlob = new Blob([textToWrite], {type: 'text/plain'});
    var fileNameToSaveAs = "lineOfTime.txt";

    var downloadLink = document.createElement("a");
    downloadLink.download = fileNameToSaveAs;
    downloadLink.innerHTML = "Download File";
    if (window.webkitURL != null) {
        // Chrome allows the link to be clicked without actually adding it to the DOM.
        downloadLink.href = window.webkitURL.createObjectURL(textFileAsBlob);
    } else {
        // Firefox requires the link to be added to the DOM before it can be clicked.
        downloadLink.href = window.URL.createObjectURL(textFileAsBlob);
        downloadLink.onclick = destroyClickedElement;
        downloadLink.style.display = "none";
        document.body.appendChild(downloadLink);
    }

    downloadLink.click();
});

function destroyClickedElement(event) {
  // remove the link from the DOM
  document.body.removeChild(event.target);
}
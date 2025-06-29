//Parse a recipe

recipeTxt = document.getElementById("recipeTxt");
inputButton = document.getElementById("inputButton");
output = document.getElementById("output");

inputButton.addEventListener('click', function () {
    parse();
});

class Token {

    constructor(value = null) {
        this.value = value;
    }

    setValue(value) {
        this.value = value;
    }

    getValue() {
        return this.value;
    }

    getReadableString() {
        return this.value;
    }
}

class Quantity extends Token {

    constructor(value) {

        var floatValue = parseFloat(value);

        super(floatValue)
    }
}

function parse() {
    lines = recipeTxt.value.split("\n");
    words = [];
    tokens = [];

    lines.forEach((element) => {
        words.push(element.split(" "));
    });

    //numeric 1, 1.2
    var numericCheck = new RegExp("^(0|[1-9]\d*)(\.\d+)?$");

    for (var i = 0; i < words.length - 1; i++) {
        tokens.push([]);

        //for each line
        var keepGoing = true;
        var j = 0;

        while (keepGoing) {
            //for each token
            if (j == 0) {
                //qty
                if (numericCheck.test(words[i][j])) {
                    tokens[i].push(new Quantity(words[i][j]));
                }

                keepGoing = false;

                console.log(i)
                console.log(tokens[i][j]);
            }
        }
    }

    output.textContent = tokens;
    console.log(tokens);
}
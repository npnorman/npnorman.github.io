//Parse a recipe

recipeTxt = document.getElementById("recipeTxt");
inputButton = document.getElementById("inputButton");
output = document.getElementById("output");

inputButton.addEventListener('click', function () {
    parse();
});

function parse() {
    lines = recipeTxt.value.split("\n");
    tokens = [];

    lines.forEach((element) => {
        tokens.push(element.split(" "));
    });

    output.textContent = tokens;
    console.log(tokens);
}
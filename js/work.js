document.getElementById("calculate").addEventListener("click", function () {
    var timeInput = document.getElementById("time");

    var date = new Date();

    var [hours, minutes] = timeInput.value.split(":").map(Number)

    date.setHours(hours, minutes, 0, 0);

    document.getElementById("output").textContent = date.;

    console.log("Hello World");
});
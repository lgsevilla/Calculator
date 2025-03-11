const display = document.getElementById("display");
const backspaceButton = document.getElementById("btn-backspace");
const buttons = document.querySelectorAll(".buttons button");

let currentNumber = "0";
let storedNumber = "";
let operator = "";
let awaitingSecondValue = false;

// Show input in display
function updateDisplay() {
    if (currentNumber.length > 12) {
        currentNumber = currentNumber.slice(0, 12); // slices the returned result to display only 12
    }
    display.textContent = currentNumber; // shows the current number in the display 
    updateBackspaceButton();
}

// Change AC button to back
function updateBackspaceButton() {
    backspaceButton.textContent = currentNumber !== "0" ? "←" : "AC"; // updates the AC button to show backspace if display shows anything but ONLY 0
}

// Number inputs and decimal
function inputNumber(value) {
    if (awaitingSecondValue || currentNumber === "0") {
        currentNumber = value; // Start new number
        awaitingSecondValue = false; // makes sure that a second number is not expected until an operator is pressed
    } else {
        currentNumber = currentNumber === "0" ? value : currentNumber + value; // if currentNumber is 0, give as value, otherwise add currentNumber to value - al
    }
    updateDisplay();
}

// Operation select
function inputOperator(op) {
    if (storedNumber && awaitingSecondValue) { // if first number has already been stored and awaiting second value is True, refreshes operator to last pressed
        operator = op; 
        return;
    }
    if (storedNumber === "") {                 // if stored number is empty once operator is pressed, sets the current number as stored number
        storedNumber = currentNumber;
    } else {
        currentNumber = calculate(storedNumber, currentNumber, operator); // perform the operation on the displayed number, which is the previous product/sum etc.
        storedNumber = currentNumber;
    }
    operator = op;
    awaitingSecondValue = true; // ensures that after an operator is pressed, the calculator will expect a second number
    updateDisplay();
}

// Calculator perform operation on num1 and num2
function calculate(num1, num2, op) {
    const x = parseFloat(num1);
    const y = parseFloat(num2);
    if (isNaN(x) || isNaN(y)) return "0";

    switch (op) { // switch with operations as cases; ternary operator for division to make sure error is returned when divisor is 0. also reconverts the float to string
        case "+": return (x + y).toString();
        case "-": return (x - y).toString();
        case "*": return (x * y).toString();
        case "/": return y === 0 ? "Error" : (x / y).toString();
        default: return num2;
    }
}

// Equals button
function inputEquals() { 
    if (!storedNumber || awaitingSecondValue) return; // when the equal button is clicked but no stored number or if operator was just pressed, return
    currentNumber = calculate(storedNumber, currentNumber, operator); // otherwise perform calculate function, reset all variables, and update display
    storedNumber = "";
    operator = "";
    awaitingSecondValue = true;
    updateDisplay();
}

// AC/backspace button
backspaceButton.addEventListener("click", () => {
    if (backspaceButton.textContent === "←") { 
        currentNumber = currentNumber.slice(0, -1) || "0";
    } else {
        currentNumber = "0";
        storedNumber = "";
        operator = "";
    }
    updateDisplay();
});

// Button clicks
buttons.forEach(button => {
    button.addEventListener("click", () => { // register button clicks
        const value = button.textContent; // gets the value of the button clicked

        if (!isNaN(value)) {
            inputNumber(value); // as long as its not a non existent number, perform number function 
        } else if (["+", "-", "*", "/"].includes(value)) {
            inputOperator(value); // if the value is one of the symbols in the array, it is included and pushed to operator function
        } else if (value === "=") {
            inputEquals(); // if the button value is equals, return the equals function 
        } else if (value === ".") { 
            if (!currentNumber.includes(".")) { // prohibits multiple decimal points (e.g. 1.002.334.456)
                currentNumber += "."; // if there is no decimal yet, add a decimal and update the display to show the decimal point
                updateDisplay();
            }
        }
    });
});

document.getElementById("btn-square-root").addEventListener("click", () => {
    let num = parseFloat(currentNumber);
    
    if (num < 0) {
        currentNumber = "Error"; // Prevent square root of negative numbers - out of scope
    } else {
        currentNumber = Math.sqrt(num).toString(); // Calculates square root using Math
    }

    storedNumber = ""; // sqrt acts like an operator and only operates on the number on display so it will not store a number
    operator = ""; // resets the operator in case one was pressed previously (e.g. "4" -> "+" -> "sqrt." will ensure "+" is empty)
    awaitingSecondValue = false; // does not expect to perform operation
    
    updateDisplay();
});

// Makes sure display always has number (default 0)
updateDisplay();
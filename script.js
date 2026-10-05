let currentOpText = document.getElementById('current-op');
let previousOpText = document.getElementById('previous-op');

let currentInput = '0';
let previousInput = '';
let operator = null;
let resetScreen = false;

// Number Append Karna
function appendNumber(number) {
    if (currentInput === '0' || resetScreen) {
        currentInput = number;
        resetScreen = false;
    } else {
        // Decimal point ek se zyada allow na karein
        if (number === '.' && currentInput.includes('.')) return;
        currentInput += number;
    }
    updateDisplay();
}

// Operator Select Karna (+, -, *, /, %)
function appendOperator(op) {
    if (operator !== null && !resetScreen) {
        calculate();
    }
    operator = op;
    previousInput = currentInput;
    resetScreen = true;
    updateDisplay();
}

// Result Calculate Karna
function calculate() {
    if (operator === null || resetScreen) return;

    let result;
    const prev = parseFloat(previousInput);
    const curr = parseFloat(currentInput);

    if (isNaN(prev) || isNaN(curr)) return;

    switch (operator) {
        case '+':
            result = prev + curr;
            break;
        case '-':
            result = prev - curr;
            break;
        case '*':
            result = prev * curr;
            break;
        case '/':
            if (curr === 0) {
                alert("Zero se divide nahi kiya ja sakta!");
                clearDisplay();
                return;
            }
            result = prev / curr;
            break;
        case '%':
            result = prev % curr;
            break;
        default:
            return;
    }

    currentInput = result.toString();
    operator = null;
    previousInput = '';
    resetScreen = true;
    updateDisplay();
}

// Screen Clear (AC)
function clearDisplay() {
    currentInput = '0';
    previousInput = '';
    operator = null;
    resetScreen = false;
    updateDisplay();
}

// Ek character delete karna (DEL)
function deleteLast() {
    if (resetScreen) return;
    if (currentInput.length === 1) {
        currentInput = '0';
    } else {
        currentInput = currentInput.slice(0, -1);
    }
    updateDisplay();
}

// Display Update Function
function updateDisplay() {
    currentOpText.innerText = currentInput;
    if (operator !== null) {
        let displayOp = operator;
        if (operator === '*') displayOp = '×';
        if (operator === '/') displayOp = '÷';
        previousOpText.innerText = `${previousInput} ${displayOp}`;
    } else {
        previousOpText.innerText = '';
    }
}

// Keyboard Support (Aap keyboard se bhi type kar sakte hain)
window.addEventListener('keydown', (e) => {
    if ((e.key >= '0' && e.key <= '9') || e.key === '.') {
        appendNumber(e.key);
    } else if (e.key === '+' || e.key === '-' || e.key === '*' || e.key === '/' || e.key === '%') {
        appendOperator(e.key);
    } else if (e.key === 'Enter' || e.key === '=') {
        e.preventDefault();
        calculate();
    } else if (e.key === 'Backspace') {
        deleteLast();
    } else if (e.key === 'Escape') {
        clearDisplay();
    }
});
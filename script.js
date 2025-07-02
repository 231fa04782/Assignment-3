let display = document.getElementById('display');
let operationDisplay = document.getElementById('operation-display');
let currentInput = '';
let operator = null;
let firstOperand = null;

function updateDisplay(value) {
  display.value = value || '0';
}

function updateOperatorDisplay() {
  if (operator && firstOperand !== null) {
    operationDisplay.innerText = `${firstOperand} ${operator}`;
  } else {
    operationDisplay.innerText = '(none)';
  }
}

function appendNumber(num) {
  currentInput += num;
  updateDisplay(currentInput);
}

function clearDisplay() {
  currentInput = '';
  firstOperand = null;
  operator = null;
  updateDisplay('');
  updateOperatorDisplay();
}

function backspace() {
  currentInput = currentInput.slice(0, -1);
  updateDisplay(currentInput);
}

function setOperator(op) {
  if (currentInput === '') return;
  firstOperand = parseFloat(currentInput);
  operator = op;
  currentInput = '';
  updateOperatorDisplay();
}

function calculate() {
  if (operator === null || currentInput === '') return;

  let secondOperand = parseFloat(currentInput);
  let result;

  switch (operator) {
    case '+': result = firstOperand + secondOperand; break;
    case '-': result = firstOperand - secondOperand; break;
    case '*': result = firstOperand * secondOperand; break;
    case '/': result = secondOperand === 0 ? 'Error' : firstOperand / secondOperand; break;
    case '%': result = (firstOperand * secondOperand) / 100; break;
  }

  updateDisplay(result);
  currentInput = result.toString();
  operator = null;
  firstOperand = null;
  updateOperatorDisplay();
}

function factorial() {
  let num = parseFloat(currentInput);
  if (isNaN(num) || num < 0 || !Number.isInteger(num)) {
    updateDisplay("Err");
    return;
  }
  let fact = 1;
  for (let i = 2; i <= num; i++) fact *= i;
  currentInput = fact.toString();
  updateDisplay(currentInput);
}

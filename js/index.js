function main() {
  var result = 0,
    previousResult = 0,
    operand = '',
    previousOperand,
    operator = 'none',
    previousOperator,
    lastClicked = 'operator',
    hasClickedEquals = false,
    hasClickedDot = false,
    x,
    numberButton = document.getElementsByClassName('number-button'),
    operatorButton = document.getElementsByClassName('operator-button'),
    equalsButton = document.getElementById('equals'),
    ceButton = document.getElementById('ce'),
    dotButton = document.getElementById('dot'),
    tallyDisplay = document.getElementById('tally'),
    resultDisplay = document.getElementById('result');

  //add click listener for all numbers buttons
  for (var i = 0; i < numberButton.length; i++) {
    numberButton[i].addEventListener('click', numberClick);
  }

  //add click listener for all operator buttons
  for (i = 0; i < operatorButton.length; i++) {
    operatorButton[i].addEventListener('click', operatorFunction);
  }

  equalsButton.addEventListener('click', equalsFunction);
  ceButton.addEventListener('click', ceFunction);
  dotButton.addEventListener('click', dotFunction);

  function numberClick() {
    //run the bulk of this function if no divide by zero error has occured, else will run ceFunction
    if (resultDisplay.innerHTML !== 'error' || result !== 'err div by 0') {
      //if statament to handle start of new calculation after final result has been displayed
      if (hasClickedEquals) {
        ceFunction();
        hasClickedEquals = false;
      }
      //wipes tally display if it gets too long
      if (tallyDisplay.clientHeight > 48) {
        tallyDisplay.innerHTML = '';
      }
      //adds clicked number to operand to be used for next operation
      operand += this.innerHTML;

      operate();
      //resises result font size if result display gets too long
      if (resultDisplay.innerHTML.length > 6) {
        resultDisplay.style.fontSize = 38 - resultDisplay.innerHTML.length * (90 / 100) + 'px';
      }

      //logic to prevent leading zeros and display current operand in result display
      if (isNaN(parseFloat(resultDisplay.innerHTML)) && parseFloat(this.innerHTML) === 0 && !hasClickedDot) {
        resultDisplay.innerHTML = parseFloat(resultDisplay.innerHTML.substring(1) + this.innerHTML);
      } else if (
        (parseFloat(resultDisplay.innerHTML) === 0 && parseFloat(this.innerHTML) === 0 && !hasClickedDot) ||
        (this.innerHTML === '00' && !hasClickedDot)
      ) {
        resultDisplay.innerHTML = parseFloat(resultDisplay.innerHTML + this.innerHTML);
      } else {
        resultDisplay.innerHTML += this.innerHTML;
      }

      lastClicked = 'number';
    } else {
      ceFunction();
    }

    //shows error if too many numbers have been input for one operand
    if (resultDisplay.innerHTML.length > 30) {
      resultDisplay.style.fontSize = 38 + 'px';
      resultDisplay.innerHTML = 'error';
    }
  }

  function dotFunction() {
    if (!hasClickedDot) {
      if (hasClickedEquals) {
        ceFunction();
      }

      operand += this.innerHTML;
      resultDisplay.innerHTML += this.innerHTML;
    }
    hasClickedDot = true;
  }

  //sets operator when one is clicked
  function operatorFunction() {
    //handles divide by zero
    if (parseFloat(operand) === 0 && operator === 'divide') {
      result = 'err div by 0';
      resultDisplay.innerHTML = result;
      tallyDisplay.innerHTML = result;
      hasClickedEquals = true;
    } else {
      //logic to prevent leading zeros being displayed in tally, updates tally
      if (lastClicked === 'number') {
        if (isNaN(parseFloat(resultDisplay.innerHTML))) {
          tallyDisplay.innerHTML += parseFloat(resultDisplay.innerHTML.substring(1));
        } else {
          tallyDisplay.innerHTML += parseFloat(resultDisplay.innerHTML);
        }

        resultDisplay.innerHTML = this.innerHTML;
        previousOperator = operator;
        previousOperand = parseFloat(operand);

        switch (this.innerHTML) {
          case '+':
            operator = 'add';

            break;
          case '-':
            operator = 'subtract';

            break;
          case '×':
            operator = 'multiply';
            break;
          case '÷':
            operator = 'divide';
            break;

          case '%':
            operator = 'percent';
            break;
        }

        tallyDisplay.innerHTML += this.innerHTML;
        operand = '';
        previousResult = result;
        lastClicked = 'operator';
        hasClickedDot = false;
        hasClickedEquals = false;
      }
    }
  }

  //performs operation
  function operate() {
    switch (operator) {
      case 'add':
        result = previousResult + parseFloat(operand);
        break;

      case 'subtract':
        result = previousResult - parseFloat(operand);
        break;

      case 'multiply':
        //logic to handle order of operations
        if (previousOperator === 'add') {
          result = previousResult - previousOperand + previousOperand * parseFloat(operand);
        } else if (previousOperator === 'subtract') {
          result = previousResult + previousOperand - previousOperand * parseFloat(operand);
        } else {
          result = previousResult * parseFloat(operand);
        }
        break;

      case 'divide':
        //logic to handle order of operations
        if (previousOperator === 'add') {
          result = previousResult - previousOperand + previousOperand / parseFloat(operand);
        } else if (previousOperator === 'subtract') {
          result = previousResult + previousOperand - previousOperand / parseFloat(operand);
        } else {
          result = previousResult / parseFloat(operand);
        }
        break;

      case 'percent':
        result = previousResult / 100 * parseFloat(operand);
        break;

      case 'none':
        result = parseFloat(operand);
    }
  }

  function equalsFunction() {
    if (parseFloat(operand) === 0 && operator === 'divide') {
      result = 'err div by 0';
      resultDisplay.innerHTML = result;
      tallyDisplay.innerHTML = result;
      hasClickedEquals = true;
    } else if (!hasClickedEquals) {
      //logic to update tally without leading zeros
      if (isNaN(parseFloat(resultDisplay.innerHTML))) {
        tallyDisplay.innerHTML += parseFloat(resultDisplay.innerHTML.substring(1)) + '=';
      } else {
        tallyDisplay.innerHTML += parseFloat(resultDisplay.innerHTML) + '=';
      }
      //adjusts result font size if result is too large for display
      x = result.toString().length;

      if (x > 8) {
        resultDisplay.style.fontSize = 1 / resultDisplay.innerHTML.length + 0.5 + 'em';
        resultDisplay.innerHTML = result;
      } else {
        resultDisplay.style.fontSize = 1 + 'em';
        resultDisplay.innerHTML = result;
      }
      hasClickedEquals = true;
    }
  }

  //reset calculator
  function ceFunction() {
    result = 0;
    resultDisplay.innerHTML = '';
    operator = 'none';
    tallyDisplay.innerHTML = '&nbsp;';
    operand = '';
    resultDisplay.style.fontSize = '38px';
    hasClickedDot = false;
    hasClickedEquals = false;
    lastClicked = 'operator';
  }
}

document.addEventListener('DOMContentLoaded', function() {
  main();
});

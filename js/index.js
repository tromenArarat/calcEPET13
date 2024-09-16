let buttons = [];
let screenValue = "";
let exercise = [];
exercise.push("5 + 6 / 2 * 9 / 3 - √4");
exercise.push("8 / 2 * 6 / 2 + 5 - √9");
exercise.push("2^3 + 4 * 2 - √16");
exercise.push("3 * 25 / 5 - 2^2 + √81");
exercise.push("2^3 + 4 * 2 - √16");
exercise.push("2^2 * 3 - 5 + √36");
exercise.push("5 + 4 * 2 - √9 / 3");
exercise.push("3^2 - 6 + √16 * 2");
exercise.push("4 * 5 / 2 - 2 + √25");
exercise.push("6 / 2 * 3 - 4 + √36");
exercise.push("2 * 5 + 3 - √9 * 2");
exercise.push("4^2 / 2 - 5 + √25");
exercise.push("5 * 4 / 2 + 3 - √16");
exercise.push("2^3 - 4 + 6 / √9");
exercise.push("2 * 2 * 2 + 4 * 4 * 4 + 5 * 5 * 5");
exercise.push("Muy bien. Descanse");

let inputDigits = [];
let operators = ["+", "-", "*", "/", "^", "√"];
let userSetValues = ["C", "", "", "", "", "", "", "", "="];
let result = 0;
let taskSolved = false;
let dropdown, dropdownVisible = false;
let selectedButtonIndex;
let isSetValidated = false;
let checkButton, randomSetupButton, resetButton;


function setup() {
  createCanvas(360, 550);
  textSize(20);

  // Crea 9 botones
  let xOffset = 20;
  let yOffset = 140; 
  let buttonSize = 100;

  for (let i = 0; i < 9; i++) {
    let x = xOffset + (i % 3) * (buttonSize + 10);
    let y = yOffset + Math.floor(i / 3) * (buttonSize + 10);

    let btn = createButton("");
    btn.position(x, y);
    btn.size(buttonSize, buttonSize);
    btn.style('font-size', '15px');

    // Color scheme for buttons
    if (i === 0) {
      btn.style('background-color', 'red');
      btn.html('C'); // Set red button to 'C'
    } else if (i === 8) {
      btn.style('background-color', 'green');
      btn.html('='); // Set green button to '='
    } else if (i === 3 || i === 4 || i === 6 || i === 7) {
      btn.style('background-color', 'rgb(120,120,182)');
    } else {
      btn.style('background-color', 'grey');
    }

    // Set the click event to allow user input on button
    btn.mousePressed(() => handleButtonPress(i));
    btn.mouseOver(() => openDropdown(i));
    buttons.push(btn);
  }

  // Create the dropdown menu for selecting button values
  createDropdown();

  // Create the "Check Setup" button to validate the button set
  checkButton = createButton("CALCULAR");
  checkButton.position(240, 470);
  checkButton.size(100, 50);
  checkButton.mousePressed(validateButtons);

  // Create the "Reset Setup" button to clear button values
  resetButton = createButton("BORRAR");
  resetButton.position(130, 470);
  resetButton.size(100, 50);
  resetButton.mousePressed(resetSetup);

  // Create the "Random Setup" button to quickly assign random values
  randomSetupButton = createButton("PROBAR");
  randomSetupButton.position(20, 470);
  randomSetupButton.size(100, 50);
  randomSetupButton.mousePressed(randomSetup);
}

let currentExerciseIndex = 0; // Global variable to track the current exercise

function draw() {
  background(220);
  fill(0);

  // Get the current exercise to solve
  let attempt = exercise[currentExerciseIndex];

  // Display the exercise
  textSize(22); 
  text("Resuelve: " + attempt, 20, 50); 

  // Display the calculator screen
  fill(0); // Set the background color to black for the display area
  rect(12, 60, 320, 60); // Adjusted position for the calculator screen
  fill(255); // Set text color to white
  textSize(30);
  text(screenValue, 30, 110); // Display current operations on screen

  // Show success message when task is solved
  if (taskSolved) {
    fill(0, 255, 0);
    textSize(18);
    text("¡Bien hecho!", 20, 540); // Show the success message
  }
}

// Function to handle button presses
function handleButtonPress(index) {
  if (!isSetValidated) return; // Disable calculations until setup is validated
  let value = buttons[index].html();

  // If red button (C) was pressed, clear the screen
  if (value === "C") {
    screenValue = "";
    taskSolved = false;
  } 
  
  // If green button (=) was pressed, calculate result
  else if (value === "=") {
    try {
      // Replace square root (√) and exponent (^) symbols in screenValue
      let expression = screenValue.replace(/√(\d+)/g, "Math.sqrt($1)").replace(/\^/g, "**");
      result = eval(expression); // Evaluate the current user input
      screenValue = result.toString();

      // Replace square root (√) and exponent (^) symbols in the exercise string
      let currentExercise = exercise[currentExerciseIndex].replace(/√(\d+)/g, "Math.sqrt($1)").replace(/\^/g, "**");
      let exerciseResult = eval(currentExercise); // Evaluate the exercise expression

      // Check if the result solves the exercise
      if (result == exerciseResult) {
        taskSolved = true;
        
        // Move to the next exercise after solving the current one
        currentExerciseIndex++; 
        
        // Check if we reached the end of the exercise array
        if (currentExerciseIndex >= exercise.length) {
          currentExerciseIndex = 0; // Reset to the first exercise if all are solved
        }

        // Update the screen to show the next exercise
        updateExerciseDisplay();
      } else {
        taskSolved = false;
      }
    } catch (e) {
      screenValue = "Error";
    }
  } else {
    // Append other button values (digits/operators) to the current screen value
    screenValue += value;
  }
}

// Function to update the exercise display after solving
function updateExerciseDisplay() {
  currentExerciseIndex = (currentExerciseIndex + 1) % exercise.length; // Automatically loops back to the start
}




// Function to open the dropdown for setting up button values
function openDropdown(index) {
  if (isSetValidated) return; // Disable changing values after validation

  // Prevent the dropdown from opening for the red (index 0) and green (index 8) buttons
  if (index === 0 || index === 8) return; // Do nothing when trying to change the red or green button

  dropdownVisible = true;
  selectedButtonIndex = index;
  dropdown.show();
  dropdown.position(buttons[index].x + 20 , buttons[index].y + 40); // Position below the button

  // Clear dropdown options and add appropriate ones based on button type
  dropdown.html(''); // Clear previous options
  dropdown.option('Valor: ');

  if (index === 0) { // Red button should only allow "C" (disabled here)
    dropdown.option('C');
  } else if (index === 8) { // Green button should only allow "=" (disabled here)
    dropdown.option('=');
  } else if (index === 3 || index === 4 || index === 6 || index === 7) { // Blue buttons for digits
    for (let i = 0; i <= 9; i++) {
      dropdown.option(i.toString());
    }
  } else { // Grey buttons for operators
    operators.forEach(op => dropdown.option(op));
  }
}
// Function to set up the dropdown
function createDropdown() {
  dropdown = createSelect();
  dropdown.hide();

  // Handle selection
  dropdown.changed(() => {
    let value = dropdown.value();
    userSetValues[selectedButtonIndex] = value;
    buttons[selectedButtonIndex].html(value);
    dropdown.hide();
  });
}

// Validate that buttons are set with the correct values
function validateButtons() {
  // Check if 3 grey buttons are operators
  if (!operators.includes(userSetValues[1]) || !operators.includes(userSetValues[2]) || !operators.includes(userSetValues[5])) {
    alert("Los botones grises deben ser operadores");
    return;
  }
  // Check if 4 blue buttons are digits
  if (isNaN(userSetValues[3]) || isNaN(userSetValues[4]) || isNaN(userSetValues[6]) || isNaN(userSetValues[7])) {
    alert("Los botones azules deben ser dígitos");
    return;
  }

  // All validations passed, allow the user to use the calculator
  isSetValidated = true;
  dropdown.hide()
  checkButton.hide()
}

// Function to quickly set random values to the buttons
function randomSetup() {
  userSetValues[0] = "C"; // Red button
  userSetValues[8] = "="; // Green button

  // Randomly set grey buttons with operators
  userSetValues[1] = random(operators);
  userSetValues[2] = random(operators);
  userSetValues[5] = random(operators);

  // Randomly set blue buttons with digits
  userSetValues[3] = Math.floor(random(0, 10)).toString();
  userSetValues[4] = Math.floor(random(0, 10)).toString();
  userSetValues[6] = Math.floor(random(0, 10)).toString();
  userSetValues[7] = Math.floor(random(0, 10)).toString();

  // Update button labels
  for (let i = 0; i < 9; i++) {
    buttons[i].html(userSetValues[i]);
  }
}

// Function to reset button values
function resetSetup() {
  userSetValues = ["", "", "", "", "", "", "", "", ""]; // Reset user set values
  for (let i = 1; i < 8; i++) {
    buttons[i].html(""); // Clear button labels
  }
  screenValue = "";
  isSetValidated = false;
  taskSolved = false;
  checkButton.show()
}

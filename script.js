const listOfAllDice = document.querySelectorAll(".die");
const scoreInputs = document.querySelectorAll("#score-options input");
const scoreSpans = document.querySelectorAll("#score-options span");
const roundElement = document.getElementById("current-round");
const rollsElement = document.getElementById("current-round-rolls");
const totalScoreElement = document.getElementById("total-score");
const scoreHistory = document.getElementById("score-history");
const rollDiceBtn = document.getElementById("roll-dice-btn");
const keepScoreBtn = document.getElementById("keep-score-btn");
const rulesContainer = document.querySelector(".rules-container");
const rulesBtn = document.getElementById("rules-btn");

let diceValuesArr = [];
let isModalShowing = false;
let score = 0;
let round = 1;
let rolls = 0;

//when Roll the Dice button is clicked, this function will provide 5 random values on the boxes
const rollDice = () => {
  diceValuesArr = [];

  //my code:
  //diceValuesArr = Array.from( {length: 5}, () => Math.floor(Math.random() * 6) + 1).sort((a, b) => a-b);
  for (let i = 0; i < 5; i++) {
    const randomDice = Math.floor(Math.random() * 6) + 1;
    diceValuesArr.push(randomDice);
  };

  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });
};

const updateStats = () => {
  rollsElement.textContent = rolls;
  roundElement.textContent = round;
};

//Step 6
const updateRadioOption = (index, score) => {
  scoreInputs[index].disabled = false;
  scoreInputs[index].value = score;       //previous value name is replaced by the score
  scoreSpans[index].textContent = `, score = ${score}`;
};

//selectedValue is the score of the selected radio button, achieved is the id of the selected radio button
const updateScore = (selectedValue, achieved) => {
  score += parseInt(selectedValue);
  totalScoreElement.textContent = score;

  scoreHistory.innerHTML += `<li>${achieved} : ${selectedValue}</li>`;
};

//Step 7
const getHighestDuplicates = (arr) => {
  const counts = {};

  /*
  //my code
  //counts occurences and total score
  arr.forEach((el) => {
    counts[el] = (counts[el] || 0) + 1;
    score += el;
  })

  const maxCount = Math.max(...Object.values(counts));  //Object.values(counts) returns an array then the ... spreads the array in individual arguments

   if (maxCount >= 4) {
      //four of a kind
      updateRadioOption(1, score);  //update four of a kind
      updateRadioOption(0, score);  //also update three of a kind
   } else if (maxCount === 3) {
      updateRadioOption(0, score);  //update three of a kind
      //don't update for of a kind
   }

   //if maxCount < 3 no updates on options

   //always update final option
   updateRadioOption(5, 0);
   */
  for (const num of arr) {
    if (counts[num]) {
      counts[num]++;
    } else {
      counts[num] = 1;
    }
  }

  let highestCount = 0;

  for (const num of arr) {
    const count = counts[num];
    if (count >= 3 && count > highestCount) {
      highestCount = count;
    }
    if (count >= 4 && count > highestCount) {
      highestCount = count;
    }
  }

  const sumOfAllDice = arr.reduce((a, b) => a + b, 0);

  if (highestCount >= 4) {
    updateRadioOption(1, sumOfAllDice);
  }

  if (highestCount >= 3) {
    updateRadioOption(0, sumOfAllDice);
  }

  updateRadioOption(5, 0);
};

const detectFullHouse = (arr) => {
  const counts = {};

  /*
  //my code:
  arr.forEach((el) => {
    counts[el] = (counts[el] || 0) + 1;
  });

  const values = Object.values(counts);   //returns an array of the values of object counts
  if (values.includes(3) && values.includes(2)) {
    updateRadioOption(2, 25);
  }
*/
  for (const num of arr) {
    counts[num] = counts[num] ? counts[num] + 1 : 1;
  }

  const hasThreeOfAKind = Object.values(counts).includes(3);
  const hasPair = Object.values(counts).includes(2);

  if (hasThreeOfAKind && hasPair) {
    updateRadioOption(2, 25);
  }

  updateRadioOption(5, 0);
};

//Step 8
const resetRadioOptions = () => {
  /*
  //my code:
  for (const i of scoreInputs) {
    i.disabled = true;
    i.checked = false;
  }

  for (const i of scoreSpans) {
    i.textContent = "";
  }
*/
  scoreInputs.forEach((input) => {
    input.disabled = true;
    input.checked = false;
  });

  scoreSpans.forEach((span) => {
    span.textContent = "";
  });
};

const resetGame = () => {
  diceValuesArr = [0, 0, 0, 0, 0];
  score = 0;
  round = 1;
  rolls = 0;

  /*
  //my code:
  for (const if of listOfAllDice) {
    i.textContent = 0;
  }
  */
  listOfAllDice.forEach((dice, index) => {
    dice.textContent = diceValuesArr[index];
  });

  totalScoreElement.textContent = score;
  scoreHistory.innerHTML = "";

  rollsElement.textContent = rolls;
  roundElement.textContent = round;

  resetRadioOptions();
};

const checkForStraights = (arr) => {
  // Sort the array and remove duplicates
  const uniqueSorted = [...new Set(arr)].sort((a, b) => a - b);
  
  // Check for large straight
  if (uniqueSorted.length === 5 && uniqueSorted[4] - uniqueSorted[0] === 4) {
    updateRadioOption(4, 40); // Large straight
    updateRadioOption(3, 30); // also small straight
  }
  
  // Check for small straight
  //checks the first four values if small straight [i = 0], if not, move to next four [i = 1]
  for (let i = 0; i <= uniqueSorted.length - 4; i++) {
    if (uniqueSorted[i + 3] - uniqueSorted[i] === 3) {  //checks if the difference of the fourth value and first value is 3
      updateRadioOption(3, 30); // Small straight
    }
  }
  
  // No straight
  updateRadioOption(5, 0);
};

rollDiceBtn.addEventListener("click", () => {
  if (rolls === 3) {
    alert("You have made three rolls this round. Please select a score.");
  } else {
    rolls++;
    resetRadioOptions();
    rollDice();
    updateStats();
    getHighestDuplicates(diceValuesArr);
    detectFullHouse(diceValuesArr);

  }
});

rulesBtn.addEventListener("click", () => {
  isModalShowing = !isModalShowing;

  if (isModalShowing) {
    rulesBtn.textContent = "Hide rules";
    rulesContainer.style.display = "block";
  } else {
    rulesBtn.textContent = "Show rules";
    rulesContainer.style.display = "none";
  }
});

keepScoreBtn.addEventListener("click", () => {
  let selectedValue;
  let achieved;

  /*
  //my code:
  for (const i of scoreInputs) {
    if (i.checked) {
      selectedValue = i.value;
      achieved = i.id;

      updateScore(selectedValue, achieved);
      resetRadioOptions();
      break;
    }
    
  }
  alert("Please select an option or roll the dice");
  */
  for (const radioButton of scoreInputs) {
    if (radioButton.checked) {
      selectedValue = radioButton.value;
      achieved = radioButton.id;
      break;
    }
  }

  if (selectedValue) {
    rolls = 0;
    round++;
    updateStats();
    resetRadioOptions();
    updateScore(selectedValue, achieved);
    if (round > 6) {
      setTimeout(() => {
        alert(`Game Over! Your total score is ${score}`);
        resetGame();
      }, 500);
    }
  } else {
    alert("Please select an option or roll the dice");
  }
});
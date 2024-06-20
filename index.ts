/**
 * module for reading input from the console.
 * Importing data and types from data.ts.
 * Importing function to save scores from storage.ts.
 */
import readline from "readline";
import { cityCountryPairs, scores, Score } from "./data";
import { saveScores } from "./storage";
import { format } from "date-fns";

const rl = readline.createInterface({
  // Creates an interface for reading input from the console.
  input: process.stdin,
  output: process.stdout,
});

let wrongAnswers = 0;
let points = 0;
const maxWrongAnswers = 5;
let currentUser = `user${scores.length}`;
let availablePairs: [string, string][] = [...cityCountryPairs];
/**
 * specifies type of availablePairs variable: an array of tuples, where each tuple contains two strings
 * outer [] indicates that this is an array of such tuples.
 * the spread operator (...) to create a new array by copying all elements from the cityCountryPairs array.
 * spread operator (...) takes all elements from the iterable (in this case, cityCountryPairs) and spreads them into a new array.
 */

/**
 * (): [string, string] specifies that this function returns a tuple containing two strings
 * availablePairs.splice(randomIndex, 1) removes the element at randomIndex from the availablePairs array.
 * splice is a method that modifies the array in place. The first parameter is the index to start removing elements, and
 * the second parameter is the number of elements to remove.
 */
function getRandomCityCountry(): [string, string] {
  const randomIndex = Math.floor(Math.random() * availablePairs.length);
  const pair = availablePairs[randomIndex];
  availablePairs.splice(randomIndex, 1); // Remove the selected pair from the available pairs
  return pair;
}

function displayMenu() {
  console.clear();
  console.log("Menu:");
  console.log("1. Start");
  console.log("2. See Scores");
  rl.prompt(); // ask user for answer
}

function showScores() {
  console.clear();
  console.log("User Scores:");
  scores.forEach((score: Score) => {
    // specify what type of what is looping = score: Score
    console.log(
      `\x1b[33m${score.user} : ${score.points} points -- ${score.time}\x1b[0m`
    );
  });
  console.log("\nPress any key to return to menu.");
  rl.question("", () => displayMenu()); // returns back
}

function askQuestion() {
  if (availablePairs.length === 0) {
    console.log("No more questions available.");
    const endTime = format(new Date(), "EEEE, MMMM do yyyy HH:mm");
    scores.push({ user: currentUser, points, time: endTime });
    saveScores(scores);
    console.log(
      `\x1b[35mGame over. You have answered all available questions.\nYou got ${points} points\x1b[0m`
    );
    rl.question("\nPress any key to return to menu.", () => displayMenu());
    return;
  }

  const [city, country] = getRandomCityCountry();
  console.log(`\nWhich country is ${city} in?`);
  console.log(
    `\x1b[34m(${maxWrongAnswers - wrongAnswers} wrong answers left)\x1b[0m`
  );
  rl.prompt();

  rl.once("line", (userInput: string) => {
    // sed to handle a single line of input from the user. This is particularly useful
    // when you want to perform an action based on a single input and then proceed
    // to the next step without retaining the listener.
    if (userInput.trim().toLowerCase() === country.toLowerCase()) {
      points++;
      console.log(`\x1b[32m${userInput.trim()} is correct!\x1b[0m`); // Green text for correct answer
    } else {
      wrongAnswers++;
      console.log(
        `\x1b[31m${userInput.trim()} is incorrect.\x1b[0m The correct answer is \x1b[32m${country}\x1b[0m`
      ); // Red text for incorrect answer
    }

    if (wrongAnswers < maxWrongAnswers) {
      askQuestion(); // recursive function exit point: IF WRONG ANSWERS > 3
    } else {
      const endTime = format(new Date(), "EEEE, MMMM do yyyy HH:mm");
      scores.push({ user: currentUser, points, time: endTime });
      saveScores(scores);
      console.log(
        `\x1b[35mGame over. You have reached the maximum number of wrong answers.\nYou got ${points} points\x1b[0m`
      );
      rl.question("\nPress any key to return to menu.", () => displayMenu());
    }
  });
}

// Most important part of code here
function startGame() {
  wrongAnswers = 0;
  points = 0;
  currentUser = `user${scores.length}`;
  availablePairs = [...cityCountryPairs]; // Reset the available pairs
  askQuestion();
}

/**
 * code begins running from here, hava to specify input type of callback functions

.on("line", ...) sets up an event listener for the line event
The line event is emitted whenever the input stream receives an end-of-line input (i.e., the user presses Enter).
The callback function (input: string) => { ... } is executed each time a line event occurs.
input is the string entered by the user.
 */
rl.on("line", (input: string) => {
  if (input.trim() === "1") {
    startGame();
  } else if (input.trim() === "2") {
    showScores();
  } else {
    displayMenu();
  }
});

displayMenu();

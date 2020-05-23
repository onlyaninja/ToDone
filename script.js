//mindfulness - resources to call
//exercises - resources to call
//work out a schedule around meetings
//import meetings from outlook
//import manage engine requests - api? database?
//team function - shared tasks
//make the log persist to local storage and make it an array that records who, when, what

const timeRemaining = document.getElementById("timeRemaining");
const timeIn = document.getElementById("minutesIn");
const alarmAudio = document.getElementById("alarmAudio");
const goBtn = document.getElementById("goBtn");
const stopBtn = document.getElementById("stopBtn");
const pauseBtn = document.getElementById("pauseBtn");
const objectiveIn = document.getElementById("objectiveIn");
const logList = document.getElementById("logList");
const addToDoBtn = document.getElementById("addToDoBtn");
const toDoListDOM = document.getElementById("toDoList");
const newToDoIn = document.getElementById("newToDoIn");
const newToDOPriorityIn = document.getElementById("newToDoPriorityIn");
const toDoForm = document.getElementById("toDoForm");
const taskInputForm = document.getElementById("taskInputForm");

//TO DO SECTION
const localStorageToDoList = JSON.parse(localStorage.getItem("toDoList"));

let toDoList =
  localStorage.getItem("toDoList") !== null ? localStorageToDoList : [];

//Add an item to the to do list
function addToDoItem(e) {
  e.preventDefault();
  if (newToDoIn.value.trim() === "" || newToDOPriorityIn.value.trim() === "") {
    alert("Please add a todo item and priority");
  } else {
    var toDoItem = {
      id: generateID(),
      name: newToDoIn.value,
      priority: +newToDOPriorityIn.value,
    };
    toDoList.push(toDoItem);

    addToDoItemDOM(toDoItem);

    updateLocalStorage();

    newToDoIn.value = "";
    newToDOPriorityIn.value = "";
  }
}

//update the local storage to do list
function updateLocalStorage() {
  localStorage.setItem("toDoList", JSON.stringify(toDoList));
}

//Add to do item to DOM List
function addToDoItemDOM(toDoItem) {
  var todoItemDOM = document.createElement("li");

  //Add class based on priority
  todoItemDOM.classList.add(`priority${toDoItem.priority}`);

  todoItemDOM.innerHTML = `
  <span class="to-do-list-buttons-span">
  <button class="to-do-list-btn" onclick="removeToDoItem(${toDoItem.id})">❌</button>
  <button class="to-do-list-btn" onclick="moveToDoItem(${toDoItem.id}, 'up')">▲</button>
  <button class="to-do-list-btn" onclick="moveToDoItem(${toDoItem.id}, 'down')">▼</button>
  <button class="to-do-list-btn" onclick="toDoPomodoroGo(${toDoItem.id})">🍅</button>
  </span>
  <span class="to-do-item-priority">${toDoItem.priority}</span><span>${toDoItem.name}</span>
  `;
  //var textnode = document.createTextNode(toDoItem);
  //node.appendChild(textnode);
  toDoListDOM.appendChild(todoItemDOM);
}

//Generate random ID
//improve this to get an id that's not used already filter?
function generateID() {
  return Math.floor(Math.random() * 100000000);
}

//Remove toDoItem by ID
function removeToDoItem(id) {
  toDoList = toDoList.filter((toDoItem) => toDoItem.id !== id);

  updateLocalStorage();

  init();
}

function toDoPomodoroGo(id) {
  timeIn.value = 25;
  toDoList.filter((v) => (v.id === id ? (objectiveIn.value = v.name) : false));
  startTimer();
}

//Move item up or down
function moveToDoItem(id, direction) {
  var indexToMove;
  var overwrittenItem;
  toDoList.forEach((v, i) => (v.id === id ? (indexToMove = i) : false));
  var moveAmount;
  if (direction === "up") {
    moveAmount = -1;
  } else {
    moveAmount = 1;
  }
  if (
    indexToMove + moveAmount === -1 ||
    indexToMove + moveAmount >= toDoList.length
  ) {
    //nothing to do, already at edge
  } else if (toDoList.length === 1) {
    //nothing to, only one list item
  } else {
    overwrittenItem = toDoList[indexToMove + moveAmount];
    toDoList[indexToMove + moveAmount] = toDoList[indexToMove];
    toDoList[indexToMove] = overwrittenItem;

    updateLocalStorage();

    init();
  }
}

function swapToDo(startItem, destinationItem) {}

//Init App
function init() {
  toDoListDOM.innerHTML = "";

  toDoList.forEach(addToDoItemDOM);
}

init();

//LOG SECTION

//Log activity
function logSomething(thingToLog) {
  var currentDate = new Date();
  var logItem = `${hhmmss(currentDate)}| ${thingToLog}`;
  var node = document.createElement("LI");
  var textnode = document.createTextNode(logItem);
  node.appendChild(textnode);
  logList.appendChild(node);
}

function hhmmss(dt) {
  return `${dt.getHours() < 10 ? "0" + dt.getHours() : dt.getHours()}:${
    dt.getMinutes() < 10 ? "0" + dt.getMinutes() : dt.getMinutes()
  }:${dt.getSeconds() < 10 ? "0" + dt.getSeconds() : dt.getSeconds()}`;
}

//TIMER SECTION

var intervalID;
const interval = 1000;

//Set time in minutes
function setTimer(minutes) {
  timeIn.value = minutes;
}

//Give time left in friendly text
function formatTime(millisecs) {
  var timeLeft = "";
  // Time calculations for days, hours, minutes and seconds
  var days = Math.floor(millisecs / (1000 * 60 * 60 * 24));
  var hours = Math.floor(
    (millisecs % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
  );
  var minutes = Math.floor((millisecs % (1000 * 60 * 60)) / (1000 * 60));
  var seconds = Math.floor((millisecs % (1000 * 60)) / 1000);

  // Display the result in the element with id="demo"
  if (days > 0) {
    var timeLeft = `${days} days and ${hours} hours`;
  } else if (hours > 0) {
    var timeLeft = `${hours} hours and ${minutes} minutes`;
  } else if (minutes > 0) {
    var timeLeft = `${minutes} minutes and ${seconds} seconds`;
  } else {
    var timeLeft = `${seconds} seconds`;
  }
  return timeLeft;
}

//Start the timer for the given amount of time
function startTimer() {
  logSomething(`Started ${objectiveIn.value}`);
  clearInterval(intervalID);
  var millisecs = timeIn.value * 60 * interval;
  intervalID = setInterval(function () {
    millisecs = millisecs - interval;
    timeRemaining.innerText = `${formatTime(millisecs)} left to ${
      objectiveIn.value
    }`;
    if (millisecs == 0) {
      alarmAudio.setAttribute("src", "sounds/timeIsUp.mp3");
      alarmAudio.play();
      timeRemaining.innerText = "Time is ended";
      clearInterval(intervalID);
      logSomething(`Finished ${objectiveIn.value}`);
    } else if (millisecs == 300000) {
      //five minute warning
      alarmAudio.setAttribute("src", "sounds/fiveMinsLeft.mp3");
      alarmAudio.play();
    } else if (millisecs % 300000 === 0) {
      //five minute interval
      alarmAudio.setAttribute("src", "sounds/fiveMinInterval.mp3");
      alarmAudio.play();
    }
  }, interval);
}

//Start the timer
function go(e) {
  e.preventDefault();
  timeIn.value != 0 ? startTimer() : false;
}

//Stop the timer
function stop() {
  clearInterval(intervalID);
  timeRemaining.innerText = "Stopped";
  logSomething(`User Stopped ${objectiveIn.value}`);
}

//Event listeners
stopBtn.addEventListener("click", stop);
toDoForm.addEventListener("submit", addToDoItem);
taskInputForm.addEventListener("submit", go);

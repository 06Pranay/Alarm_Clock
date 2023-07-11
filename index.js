//Initial References
let timerRef = document.querySelector(".timer-display");
const hourInput = document.getElementById("hourInput");
const minuteInput = document.getElementById("minuteInput");
const activeAlarms = document.querySelector(".activeAlarms");
const setAlarm = document.getElementById("set");
let alarmsArray = [];
let alarmSound = new Audio("./alarm.mp3");

let initialHour = 0;
  let initialMinute = 0;
 let  alarmIndex = 0;

//Append zeroes for single digit.Here function take one 
const appendZero = (value) => (value < 10 ? "0" + value : value);

//Search for value in object

const searchObject = (parameter, value) => {
    const exists = alarmsArray.some((alarm) => alarm[parameter] === value);
    const alarmObject = exists ? alarmsArray.find((alarm) => alarm[parameter] === value) : null;
    const objIndex = exists ? alarmsArray.indexOf(alarmObject) : null;
    return [exists, alarmObject, objIndex];
  };
  

//Display Time
//this function takes no parameters ans return nothing.
function displayTimer() {
    //this will create a new Date Object.
  let date = new Date();
  let [hours, minutes, seconds] = [
    appendZero(date.getHours()),
    appendZero(date.getMinutes()),
    appendZero(date.getSeconds()),
  ];

  //Display time
  timerRef.innerHTML = `${hours}:${minutes}:${seconds}`;

  //Alarm
  alarmsArray.forEach((alarm, index) => {
    if (alarm.isActive) {
      if (`${alarm.alarmHour}:${alarm.alarmMinute}` === `${hours}:${minutes}`) {
        alarmSound.play();
        alarmSound.loop = true;
      }
    }
  });
}
//parseInt() method converts the inputValue parameter to an integer.
const inputCheck = (inputValue) => {
  inputValue = parseInt(inputValue);
  if (inputValue < 10) {
    inputValue = appendZero(inputValue);
  }
  return inputValue;
};
//input event is fired when the user changes the value of the hourInput element
hourInput.addEventListener("input", () => {
  hourInput.value = inputCheck(hourInput.value);
});

minuteInput.addEventListener("input", () => {
  minuteInput.value = inputCheck(minuteInput.value);
});

//Create alarm div

const createAlarm = (alarmObj) => {
  //Keys from object
  const { id, alarmHour, alarmMinute } = alarmObj;
  //Alarm div
  let alarmDiv = document.createElement("div");
  alarmDiv.classList.add("alarm");
  alarmDiv.setAttribute("data-id", id);
  alarmDiv.innerHTML = `<span>${alarmHour}: ${alarmMinute}</span>`;

  //checkbox
  let checkbox = document.createElement("input");
  checkbox.setAttribute("type", "checkbox");
  checkbox.addEventListener("click", (e) => {
    if (e.target.checked) {
      startAlarm(e);
    } else {
      stopAlarm(e);
    }
  });
  alarmDiv.appendChild(checkbox);
  //Delete button
  let deleteButton = document.createElement("button");
  deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
  deleteButton.classList.add("deleteButton");
  deleteButton.addEventListener("click", (e) => deleteAlarm(e));
  alarmDiv.appendChild(deleteButton);
  activeAlarms.appendChild(alarmDiv);
};

//Set Alarm
setAlarm.addEventListener("click", () => {
  alarmIndex += 1;

//alarmObject
const alarmObj = {
    id: `${alarmIndex}_${hourInput.value}_${minuteInput.value}`,
    alarmHour: hourInput.value,
    alarmMinute: minuteInput.value,
    isActive: false,
  };
  
  console.log(alarmObj);
  alarmsArray.push(alarmObj);
  createAlarm(alarmObj);
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
});
//Start Alarm
const startAlarm = (e) => {
  let searchId = e.target.parentElement.getAttribute("data-id");
  let [exists, obj, index] = searchObject("id", searchId);
  if (exists) {
    alarmsArray[index].isActive = true;
  }
};

//Stop alarm
const stopAlarm = (e) => {
    const alarmId = e.target.parentElement.getAttribute("data-id");
    const alarm = alarmsArray.find((alarm) => alarm.id === alarmId);
  
    if (alarm) {
      alarm.isActive = false;
      alarmSound.pause();
    }
  };
  


//delete alarm

const deleteAlarm = (e) => {
    const alarmId = e.target.parentElement.parentElement.getAttribute("data-id");
    const alarm = alarmsArray.find((alarm) => alarm.id === alarmId);
  
    if (alarm) {
      e.target.parentElement.parentElement.remove();
      alarmsArray.splice(alarmsArray.indexOf(alarm), 1);
    }
  };
  
//for Page reloaded.
window.onload = () => {
  setInterval(displayTimer);
  initialHour = 0;
  initialMinute = 0;
  alarmIndex = 0;
  alarmsArray = [];
  hourInput.value = appendZero(initialHour);
  minuteInput.value = appendZero(initialMinute);
};

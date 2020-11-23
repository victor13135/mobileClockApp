let divNavigation = document.getElementById("navigation");
let btnNavStopwatch = document.getElementById("navStopwatch");
let btnNavTimer = document.getElementById("navTimer");

let inputStopwatch = document.getElementById("count");
let inputLap = document.getElementById("lapCount");
let divStopwatchCounter = document.getElementById("stopwatchCounter");
let divStopwatchLapCounter = document.getElementById("stopwatchLapCounter");
let divLapTimes = document.getElementById("lapTimes");
let divButtons = document.getElementById("buttons");
let btnStart = document.getElementById("start");
let btnStop = document.getElementById("stop");
let btnReset = document.getElementById("reset");
let btnResume = document.getElementById("resume");
let btnLap = document.getElementById("lap");
let checkToggleSwitch = document.getElementById("toggleSwitch");

let allTheButtons = [btnStart, btnStop, btnReset, btnResume, btnLap];

let timer = null, lapTimer = null;
let counter = 0, lapCounter = 0;
let lapTimes = [], sumTimes = [];
let lapOrdinalNumber = 0;
let minutes = 0, seconds = 0, miliseconds = 0;
let previouslyDisplayed = "STOPWATCH";         // promeni u alarm kad ga napravis!

function clearNavColors() {
    let btns = document.getElementsByClassName("navButton");
    for (let i=0; i<btns.length; i++) {
        btns[i].style.color="inherit";
        btns[i].style.fontWeight="inherit";
        btns[i].style.borderBottom="none";  // "darkgrey 1px solid";
    }
}
function hideAllTheButtons() {
    allTheButtons.forEach ( btn => {
        btn.style.display="none";
    });
}
function returnTwoCharacterString (arg) {
    let result = "";
    if (arg < 10) {
        result = "0" + String(arg);
    } else if (arg >= 100) {
        arg /= 10;
        result = String(arg);
    } else {
        result = String(arg);
    }
    return result;
}
function displayStopwatch (dst, cntr) {
    minutes = cntr / (1000*60);
    seconds = (cntr / 1000) % 60;
    miliseconds = cntr % 1000;
    let m="", s="", ms="";
    m = returnTwoCharacterString(minutes);
    s = returnTwoCharacterString(seconds);
    ms = returnTwoCharacterString(miliseconds);
    m = m.slice(0, 2);
    s = s.slice(0, 2)
    dst.textContent = `${m}:${s}:${ms}`;
}
function addLapTimeToDisplay (ordinalNumber, cntr, lcntr) {
    let newLine = document.createElement("p");
    let newSpanLeft = document.createElement("span");
    newSpanLeft.classList.add("spanLeft");
    newSpanLeft.textContent=returnTwoCharacterString(ordinalNumber);
    let newSpanCenter = document.createElement("span");
    newSpanCenter.classList.add("spanCenter");
    displayStopwatch(newSpanCenter, cntr);
    let newSpanRight = document.createElement("span");
    newSpanRight.classList.add("spanRight");
    displayStopwatch(newSpanRight, lcntr);
    newLine.appendChild(newSpanLeft);
    newLine.appendChild(newSpanCenter);
    newLine.appendChild(newSpanRight);
    divLapTimes.prepend(newLine);
};
checkToggleSwitch.addEventListener("click", () => {
    let cssFile = document.querySelector("link");
    if(checkToggleSwitch.checked) {
        cssFile.setAttribute("href", "night.css");
    } else {
        cssFile.setAttribute("href", "style.css");
    }
});

divNavigation.addEventListener("click", (event) => {
    if(event.target.tagName == "BUTTON") {
        clearNavColors();
        event.target.style.fontWeight="bold";
        event.target.style.color="royalblue";
        event.target.style.borderBottom="royalblue 2px solid";
        let containerToDisplay = event.target.name;
        document.getElementById(previouslyDisplayed).style.display="none";
        previouslyDisplayed = containerToDisplay;
        document.getElementById(containerToDisplay).style.display="block";
    }
});

btnStart.addEventListener( "click", () => {
    hideAllTheButtons();
    btnStop.style.display="inline";
    btnLap.style.display="inline";
    if (timer === null) {
        timer = setInterval(() => {
            counter+=10;
            displayStopwatch(divStopwatchCounter, counter);
        }, 10);
    }
});

btnStop.addEventListener( "click", () => {
    hideAllTheButtons();
    btnResume.style.display="inline";
    btnReset.style.display="inline";
    clearInterval(timer);
    timer=null;
    if(lapTimer!==null) {
        clearInterval(lapTimer);
        lapTimer=null;
    }
});

btnResume.addEventListener("click", () => {
    hideAllTheButtons();
    btnStop.style.display="inline";
    btnLap.style.display="inline";
    if (timer === null) {
        timer = setInterval(() => {
            counter+=10;
            displayStopwatch(divStopwatchCounter, counter);
        }, 10);
    }
    if (lapTimer === null) {
        lapTimer = setInterval(() => {
            lapCounter+=10;
            displayStopwatch(divStopwatchLapCounter, lapCounter);
        }, 10);
    }
});

btnReset.addEventListener( "click", () => {
    hideAllTheButtons();
    btnStart.style.display="inline";
    sumTimes=[];
    clearInterval(timer);
    timer=null;
    counter=0;
    clearInterval(lapTimer);
    lapTimes=[];
    lapTimer=null;
    lapCounter=0;
    divLapTimes.textContent="";
    lapOrdinalNumber=0;
    displayStopwatch(divStopwatchCounter, counter);
    displayStopwatch(divStopwatchLapCounter, lapCounter);
    divStopwatchLapCounter.style.display="none";
});

btnLap.addEventListener("click", () => {
    if (lapTimes.length == 0) {
        lapTimes.push(counter);
        lapCounter=counter;
    } else {
        lapTimes.push(lapCounter);
    }
    lapOrdinalNumber++;
    sumTimes.push(counter);
    console.log(lapTimes);
    console.log(sumTimes);
    addLapTimeToDisplay(lapOrdinalNumber, counter, lapCounter);
    lapCounter=0;
    divStopwatchLapCounter.style.display="block";
    if (lapTimer === null) {
        lapTimer = setInterval(() => {
            lapCounter+=10;
            displayStopwatch(divStopwatchLapCounter, lapCounter);
        }, 10);
    }
});


/*************************************************
************       T I M E R        **************
*************************************************/

let divTimerButtons = document.getElementById("timerButtons")
let btnTimerStart = document.getElementById("timerStart");
let btnTimerPause = document.getElementById("timerPause");
let btnTimerCancel = document.getElementById("timerCancel");
let btnTimerResume = document.getElementById("timerResume");

let divTimerInputs = document.getElementById("timerInputs");
let inputTimerHours = document.getElementById("timerInputHours");
let inputTimerMinutes = document.getElementById("timerInputMinutes");
let inputTimerSeconds = document.getElementById("timerInputSeconds");

let divTickingTimers = document.getElementById("tickingTimers");
let divTickingHours = document.getElementById("tickingHours");
let divTickingMinutes = document.getElementById("tickingMinutes");
let divTickingSeconds = document.getElementById("tickingSeconds");

let allTheTimerButtons = [btnTimerCancel, btnTimerResume, btnTimerStart, btnTimerPause];
function hideAllTheTimerButtons () {
    allTheTimerButtons.forEach( btn => {
        btn.style.display="none";
    });
}
function startTheTimer() {
    if(countdownTimer === null) {
        countdownTimer = setInterval(() => {
            timerSeconds--;
            if(timerSeconds == -1) {
                timerMinutes--;
                timerSeconds=59;
            }
            if(timerMinutes == -1) {
                timerHours--;
                timerMinutes=59;
            }
            divTickingHours.textContent = timerHours;
            divTickingMinutes.textContent = timerMinutes;   
            divTickingSeconds.textContent = timerSeconds;
            if (timerHours == 0 && timerMinutes == 0 && timerSeconds == 0) {
                console.log("GOTOVO!");
                clearInterval(countdownTimer);
                countdownTimer = null;
            }
        }, 1000);
    }
}

let timerSeconds = 0; timerMinutes = 0; timerHours = 0;
let countdownTimer = null;

btnTimerStart.addEventListener("click", () => {
    timerHours = Number(inputTimerHours.value);
    timerMinutes = Number(inputTimerMinutes.value);
    timerSeconds = Number(inputTimerSeconds.value);
    if(timerHours > 0 || timerMinutes > 0 || timerSeconds > 0) {
        divTimerInputs.style.display="none";
        divTickingTimers.style.display="block";
        hideAllTheTimerButtons();
        btnTimerPause.style.display="inline";
        btnTimerCancel.style.display="inline";
        divTickingHours.textContent = timerHours;
        divTickingMinutes.textContent = timerMinutes;
        divTickingSeconds.textContent = timerSeconds;
        startTheTimer();
    } else {
        console.log("sve nule!");
    }
});

btnTimerCancel.addEventListener("click", () => {
    divTickingTimers.style.display="none";
    divTimerInputs.style.display="block";
    hideAllTheTimerButtons();
    btnTimerStart.style.display="inline";
});

btnTimerPause.addEventListener("click", () => {
    hideAllTheTimerButtons();
    btnTimerResume.style.display="inline";
    btnTimerCancel.style.display="inline";
    clearInterval(countdownTimer);
    countdownTimer = null;
});

btnTimerResume.addEventListener("click", () => {
    hideAllTheTimerButtons();
    btnTimerPause.style.display="inline";
    btnTimerCancel.style.display="inline";
    startTheTimer();
});


/*************************************************
************       A L A R M        **************
*************************************************/

let btnAddAlarm = document.getElementById("addAlarm");
let btnCancelAlarm = document.getElementById("newAlarmCancel");
let btnSaveAlarm = document.getElementById("newAlarmSave");
let divAlarmHome = document.getElementById("alarmHome");
let divNewAlarm = document.getElementById("newAlarm");
btnAddAlarm.addEventListener("click", () => {
    divAlarmHome.style.display="none";
    divNewAlarm.style.display="block";
});

btnCancelAlarm.addEventListener("click", ()=> {
    //resetuj sva polja u formi za dodavanje novog alarma
    divNewAlarm.style.display="none";
    divAlarmHome.style.display="block";
});

btnSaveAlarm.addEventListener("click", () => {
    //upisi u localstorage;
    //resetuj sva polja u formi za dodavanje novog alarma
    divNewAlarm.style.display="none";
    divAlarmHome.style.display="block";
});
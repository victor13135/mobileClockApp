/************************************************
************    V A R I B L E S    **************
************************************************/
let timer = null, lapTimer = null;
let counter = 0, lapCounter = 0;
let lapTimes = [], sumTimes = [];
let lapOrdinalNumber = 0;

let minutes = 0, seconds = 0, miliseconds = 0;
let previouslyDisplayed = "ALARM";
let currentDate = "", currentTime = "";

/************************************************
************   F U N C T I O N S   **************
************************************************/
function resetNewAlarmForm() {
    // let newDate = new Date();
    // currentDate = newDate.getFullYear() + "-" + newDate.getMonth()+1 + "-" + newDate.getDate();
    // currentTime = newDate.getHours() + ":" + newDate.getMinutes();
    // let today = new Date().toISOString().substr(0, 10);
    // console.log(typeof today, today);
    // inputAlarmDate.value = today;

    //let today = new Date().toISOString().substr(0, 10);
    //document.querySelector("#alarmDate").value = "2020-05-06";
    //inputAlarmDate.valueAsDate = new Date();
}
//resetNewAlarmForm();
function clearNavColors() {
    let btns = document.getElementsByClassName("navButton");
    for (let i=0; i<btns.length; i++) {
        btns[i].style.color="inherit";
        btns[i].style.fontWeight="inherit";
        btns[i].style.borderBottom="none";  // "darkgrey 1px solid";
    }
}
function paintTheTimer(color) {
    divRightHalf.style.backgroundColor = color;
    divLeftHalf.style.backgroundColor = color;
    divCenterMask.style.color = color;
}
function hideAllTheButtons() {
    allTheButtons.forEach ( btn => {
        btn.style.display="none";
    });
}
function hideAllTheTimerButtons () {
    allTheTimerButtons.forEach( btn => {
        btn.style.display="none";
    });
}
function timerReset() {
    divLeftMask.style.transform=`rotate(0deg)`;
    divRightMask.style.transform=`rotate(0deg)`;
    divRightHalf.style.zIndex = 35;
    timerSeconds=0; timerMinutes=0; timerHours=0;
    countdownCounterStarting=0; globalSecondsLeft=0;
    angle=6;    
    document.getElementById("negativeAlarm").style.display="none";
    paintTheTimer("teal");
    clearInterval(countdownTimer);
    countdownTimer = null;
    clearInterval(negativeTimer);
    negativeTimer = null;
    minusSeconds=0; minusMinutes=0; minusHours=0;
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
    s = s.slice(0, 2);
    dst.textContent = `${m}:${s}.${ms}`;
}
function displayTimer(timerHrs, timerMins, timerSecs) {
    let h="", m="", s="";
    h = returnTwoCharacterString(timerHrs);     h = h.slice(0, 2);
    m = returnTwoCharacterString(timerMins);    m = m.slice(0, 2);
    s = returnTwoCharacterString(timerSecs);    s = s.slice(0, 2);
    divCenterMask.innerHTML = `<span id="negativeAlarm" style="display: none; color: red">-</span>${h}:${m}:${s}`;
}
function addLapTimeToDisplay (ordinalNumber, cntr, lcntr) {
    let newLine = document.createElement("p");
    let newSpanLeft = document.createElement("span");
    newSpanLeft.classList.add("spanLeft");
    newSpanLeft.textContent=returnTwoCharacterString(ordinalNumber);
    newSpanLeft.style.marginLeft="1vw";
    let newSpanCenter = document.createElement("span");
    newSpanCenter.classList.add("spanCenter");
    displayStopwatch(newSpanCenter, cntr);
    newSpanCenter.style.margin="0 8vw";
    let newSpanRight = document.createElement("span");
    newSpanRight.classList.add("spanRight");
    displayStopwatch(newSpanRight, lcntr);
    newLine.appendChild(newSpanLeft);
    newLine.appendChild(newSpanCenter);
    newLine.appendChild(newSpanRight);
    newLine.style.marginBottom="2vh";
    divLapTimes.prepend(newLine);
};
function repaintLapTimes () {
    let listItems = document.querySelectorAll("#lapTimes p");
        listItems.forEach( item => {
            item.querySelector(":nth-child(3)").style.color = "teal";
        });
    let minIndex = 0, maxIndex = 0;
    if(lapTimes.length>2) {
        let min = lapTimes[0], max = lapTimes[0];
        for(let i=1; i<lapTimes.length; i++) {
            if(lapTimes[i] > max) {
                max = lapTimes[i];
                maxIndex = i;
            }
            if(lapTimes[i] < min) {
                min = lapTimes[i];
                minIndex = i
            }
        }
    
        listItems[listItems.length - minIndex - 1].querySelector(":nth-child(3)").style.color = "green";
        listItems[listItems.length - maxIndex - 1].querySelector(":nth-child(3)").style.color = "red";
    }
}

/************************************************
************  H E A D E R / C S S  **************
************************************************/
let checkToggleSwitch = document.getElementById("toggleSwitch");
checkToggleSwitch.addEventListener("click", () => {
    let cssFile = document.querySelectorAll("link")[1];
    if(checkToggleSwitch.checked) {
        cssFile.setAttribute("href", "./style/night.css");
    } else {
        cssFile.setAttribute("href", "./style/day.css");
    }
});

/************************************************
************  N A V I G A T I O N  **************
************************************************/
let divNavigation = document.getElementById("navigation");
divNavigation.addEventListener("click", (event) => {
    if(event.target.tagName == "BUTTON") {
        clearNavColors();
        event.target.style.color="teal";
        event.target.style.borderBottom="teal 1px solid";
        event.target.style.fontWeight="bold";
        let containerToDisplay = event.target.name;
        document.getElementById(previouslyDisplayed).style.display="none";
        previouslyDisplayed = containerToDisplay;
        document.getElementById(containerToDisplay).style.display="block";
    }
});

/*************************************************
************       A L A R M        **************
*************************************************/
let inputAlarmDate = document.getElementById("alarmDate");
let inputAlarmTime = document.getElementById("alarmTime");

let btnAddAlarm = document.getElementById("addAlarm");
let btnCancelAlarm = document.getElementById("newAlarmCancel");
let btnSaveAlarm = document.getElementById("newAlarmSave");
let divAlarmHome = document.getElementById("alarmHome");
let divNewAlarm = document.getElementById("newAlarm");


btnAddAlarm.addEventListener("click", () => {
    divAlarmHome.style.display="none";
    divNewAlarm.style.display="block";
});

btnCancelAlarm.addEventListener("click", () => {
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

/************************************************
************   S T O P W A T C H   **************
************************************************/

let divStopwatchCounters = document.getElementById("stopwatchCounters");
let divStopwatchCounter = document.getElementById("stopwatchCounter");
let divStopwatchLapCounter = document.getElementById("stopwatchLapCounter");
let divLapTimes = document.getElementById("lapTimes");

let btnStart = document.getElementById("start");
let btnStop = document.getElementById("stop");
let btnReset = document.getElementById("reset");
let btnResume = document.getElementById("resume");
let btnLap = document.getElementById("lap");

let allTheButtons = [btnStart, btnStop, btnReset, btnResume, btnLap];


btnStart.addEventListener( "click", () => {
    hideAllTheButtons();
    btnStop.style.display="inline";
    btnLap.style.display="inline";
    divStopwatchCounter.style.color="teal";
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
    divStopwatchCounter.style.color="rgba(0, 128, 128, 0.5)";
    divStopwatchLapCounter.style.display="none";
    divLapTimes.style.display="none";
    divStopwatchCounters.style.paddingTop="33vh";
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
    addLapTimeToDisplay(lapOrdinalNumber, counter, lapCounter);
    repaintLapTimes();
    lapCounter=0;
    divStopwatchCounters.style.paddingTop="0";
    divStopwatchLapCounter.style.display="block";
    divLapTimes.style.display="block";
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

let divTimerButtons = document.getElementById("timerButtons")               // dugmici
let btnTimerStart = document.getElementById("timerStart");
let btnTimerPause = document.getElementById("timerPause");
let btnTimerRestart = document.getElementById("timerRestart");
let btnTimerCancel = document.getElementById("timerCancel");
let btnTimerResume = document.getElementById("timerResume");
let allTheTimerButtons = [btnTimerCancel, btnTimerResume, btnTimerRestart, btnTimerStart, btnTimerPause];

let divTimerInputs = document.getElementById("timerInputs");                // input polja
let inputTimerHours = document.getElementById("timerInputHours");
let inputTimerMinutes = document.getElementById("timerInputMinutes");
let inputTimerSeconds = document.getElementById("timerInputSeconds");

let divTickingTimers = document.getElementById("tickingTimers");            // spiner
let divRightHalf = document.getElementById("rightHalf");
let divRightMask = document.getElementById("rightMask");
let divLeftHalf = document.getElementById('leftHalf');
let divLeftMask = document.getElementById("leftMask");
let divCenterMask = document.getElementById("centerMask");

divRightMask.style.transformOrigin= "0 50%";
divLeftMask.style.transformOrigin= "100% 50%";

divRightMask.style.zIndex = 40;
divRightHalf.style.zIndex = 35;
divLeftMask.style.zIndex = 50;
divLeftHalf.style.zIndex = 45;

divTimerInputs.addEventListener("click", (event) => {
    if(event.target.tagName == "BUTTON") {
        let container = event.path[1];
        let numberInput = container.querySelector("input");
        let newValue = parseInt(numberInput.value);
        newValue += parseInt(event.target.value);
        if (newValue > -1 && newValue <60) {
            numberInput.value = newValue;
        }
    }
});

let angle = 6;
let globalSecondsLeft = 0;
let countdownCounterStarting = 0;
let angleStep;
let minusSeconds = 0; let minusMinutes = 0; let minusHours = 0;
let negativeTimer = null;

function startTheTimer() {
    displayTimer(timerHours, timerMinutes, timerSeconds);
    if(countdownTimer === null) {
        countdownTimer = setInterval(() => {
            timerSeconds--;
            globalSecondsLeft--;
            if(timerSeconds == -1) {
                timerMinutes--;
                timerSeconds=59;
            }
            if(timerMinutes == -1) {
                timerHours--;
                timerMinutes=59;
            }
            if(timerSeconds <= 5 && timerMinutes == 0 && timerHours == 0) {
                paintTheTimer("red");
            }
            displayTimer(timerHours, timerMinutes, timerSeconds);
            angleStep = 360/countdownCounterStarting;
            angle += angleStep;

            if(angle>6 && angle<=180) {
                divRightMask.style.transform=`rotate(${angle-6}deg)`;
                console.log(angle-6);
                console.log("prvaPolutka");
            } else if (angle>6 && angle<=360) {
                divRightHalf.style.zIndex = 60;
                divLeftMask.style.transform=`rotate(${angle-180-6}deg)`;
                console.log(angle-180-6);
                console.log("druga");
            } else {
                console.log("kraj");
                console.log(angle, angleStep);
                divRightHalf.style.zIndex = 60;
                divLeftMask.style.transform=`rotate(180deg)`;
                divRightMask.style.transform=`rotate(180deg)`;
                displayTimer(timerHours, timerMinutes, timerSeconds);
                if (timerHours == 0 && timerMinutes == 0 && timerSeconds == 0) {
                    hideAllTheTimerButtons();
                    btnTimerRestart.style.display="inline";
                    btnTimerCancel.style.display="inline";
                    
                    console.log("GOTOVO!");
                    //alert("Time's up!");
                    clearInterval(countdownTimer);
                    countdownTimer = null;
                    if(negativeTimer === null) {
                        negativeTimer = setInterval( () => {
                            minusSeconds++;
                            if(minusSeconds>59) {
                                minusSeconds = 0;
                                minusMinutes++;
                            }
                            if(minusMinutes>59) {
                                minusMinutes = 0;
                                minusHours++;
                            }
                            displayTimer(minusHours, minusMinutes, minusSeconds);
                            document.getElementById("negativeAlarm").style.display="inline";
                        }, 1000);
                    }
                }
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
        countdownCounterStarting = timerSeconds + timerMinutes*60 + timerHours*3600;
        globalSecondsLeft = countdownCounterStarting;
        startTheTimer();
    } else {
        console.log("sve nule!");
    }
});

btnTimerCancel.addEventListener("click", () => {
    divTickingTimers.style.display="none";
    divTimerInputs.style.display="flex";
    hideAllTheTimerButtons();
    btnTimerStart.style.display="inline";
    timerReset();
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

btnTimerRestart.addEventListener("click", () => {
    timerReset();
    timerHours = Number(inputTimerHours.value);
    timerMinutes = Number(inputTimerMinutes.value);
    timerSeconds = Number(inputTimerSeconds.value);
    hideAllTheTimerButtons();
    btnTimerPause.style.display="inline";
    btnTimerCancel.style.display="inline";
    countdownCounterStarting = timerSeconds + timerMinutes*60 + timerHours*3600;
    globalSecondsLeft = countdownCounterStarting;
    startTheTimer();
})
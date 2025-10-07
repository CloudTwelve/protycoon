const playClass = "fa-solid fa-play fa-4x";
const pauseClass = "fa-solid fa-pause fa-4x";

let currentTheme;

if (!localStorage.getItem("coins")) {
    localStorage.setItem("coins", 0);
}

document.addEventListener("DOMContentLoaded", () => { 
  const displayLightbox = () => {
    lightbox.style.display = "block";
    xBtn.addEventListener("click", hideLightbox);
    console.log("lightbox displayed!");
    saveTimeBtn.addEventListener("click", handleTimerChange);
  }

  const hideLightbox = () => {
    xBtn.removeEventListener("click", hideLightbox);
    lightbox.style.display = "none";
  }

  const handleTimerChange = () => {
    pauseTimer();

    let hrs = Number(hrsInput.value);
    let mins = Number(minsInput.value);
    let secs = Number(secsInput.value);

    let minsIncorrect = Number(minsInput.value) >= 60;
    let secsIncorrect = Number(secsInput.value) >= 60;

    let hrsZero = Number(minsInput.value) == 0;
    let minsZero = Number(minsInput.value) == 0;
    let secsZero = Number(minsInput.value) == 0;

    if (minsIncorrect || secsIncorrect) {
      alert("Minutes/seconds must not be greater than 60.");
      return -1;
    } else if (hrsZero && minsZero && secsZero) {
      alert("Hours, minutes, and seconds cannot all be zero.");
      return -1;
    }

    localStorage.setItem("totalSecs", (hrs * 60 * 60) + (mins * 60) + (secs));
    localStorage.setItem("secsLeft", (hrs * 60 * 60) + (mins * 60) + (secs));

    hrsInput.value = "";
    minsInput.value = "";
    secsInput.value = "";
    
    updateDisplay();
  }

  const playTimer = () => {
    timerRun = setInterval(updateTime, 1000);
    blockDropped.style.animation = "drop 1.5s infinite ease-in";
    for (let i = 0; i < blockConveyed.length; i++) {
        console.log(i);
        blockConveyed[i].style.animation = "convey 6s infinite linear";
    }
  }

  const pauseTimer = () => {
    clearInterval(timerRun);
    blockDropped.style.animation = "none";
    for (let i = 0; i < blockConveyed.length; i++) {
        console.log(i);
        blockConveyed[i].style.animation = "none";
    }
  }

  const updateTime = () => {
    let currentTime = localStorage.getItem("secsLeft");
    currentTime--;
    let coinsRn = localStorage.getItem("coins");
    coinsRn++;
    localStorage.setItem("secsLeft", currentTime);
    console.log(currentTime + " current time (s)");
    localStorage.setItem("coins", coinsRn);
    console.log(localStorage.getItem("coins"));
    updateDisplay();
  }

  const updateDisplay = () => {
    if (!localStorage.getItem("totalSecs")) { // check for saved timer
      localStorage.setItem("totalSecs", 5 * 60) // 5 minutes default
    }

    if (!localStorage.getItem("secsLeft")) { // check for running timer
      localStorage.setItem("secsLeft", localStorage.getItem("totalSecs")); // set equal to above default timer
    }

    let currentTime = localStorage.getItem("secsLeft");
    if (currentTime < (60 * 60)) {
      hrsColon.textContent = "";
    } else {
      hrsColon.textContent = ":";
    }

    let hours = Math.floor(currentTime / 3600);
    if (hours < 10 && hours != 0) {
      hours = "0" + hours;
    } else if (hours == 0) {
      hours = "";
    }
    hrsDisplay.textContent = hours;

    currentTime = currentTime - (Number(hours) * 3600);

    let mins = Math.floor(currentTime / 60);
    if (mins < 10) {
      mins = "0" + mins;
    }
    minsDisplay.textContent = mins;

    let secs = currentTime % 60;
    if (secs < 10) {
      secs = "0" + secs;
    }
    secsDisplay.textContent = secs;

    coins.textContent = localStorage.getItem("coins");
  }

  const resetDisplay = () => {
    pauseTimer();
    let totalSeconds = localStorage.getItem("totalSecs");
    localStorage.setItem("secsLeft", totalSeconds);
    updateDisplay();
  }

  let timerRun;

  let body = document.querySelector("body");

  let timerNums = document.querySelector(".timer").children;

  let hrsDisplay = document.querySelector(".hrs");
  let minsDisplay = document.querySelector(".mins");
  let secsDisplay = document.querySelector(".secs");

  let hrsColon = document.querySelector("#c-hrs");

  let restartBtn = document.querySelector(".restart");
  let settingsBtn = document.querySelector(".settings");
  let playPauseBtn = document.querySelector(".play-pause");
  let playPauseIcon = document.querySelector("#play-pause-icon");


  let lightbox = document.querySelector(".lightbox");
  let xBtn = document.querySelector(".x");
  let saveTimeBtn = document.querySelector(".save-time");
  let sizeBtn = document.querySelector("#sizes");
  let clearBtn = document.querySelector(".danger-btn");

  let hrsInput = document.querySelector("#hrs");
  let minsInput = document.querySelector("#mins");
  let secsInput = document.querySelector("#secs");

  let blockDropped = document.querySelector(".dropped");
  let blockConveyed = Array.from(document.querySelectorAll(".conveyed"));
  console.log(blockConveyed);

  let coins = document.querySelector(".nums");

  playPauseIcon.className = playClass;
  updateDisplay();

  settingsBtn.addEventListener("click", displayLightbox);
  playPauseBtn.addEventListener("click", () => {
    if (playPauseIcon.className == playClass) {
      playTimer();
      playPauseIcon.className = pauseClass;
    } else {
      pauseTimer();
      playPauseIcon.className = playClass;
    }
  });
  restartBtn.addEventListener("click", resetDisplay);
  sizeBtn.addEventListener("change", (event) => {
    console.log("change in size!");
    let size;
    console.log(event.target.value);
    switch (event.target.value) {
      case "small":
        size = "6rem";
        break;
      case "medium":
        size = "8rem";
        break;
      case "large":
        size = "10rem";
        break;
      case "huge":
        size = "12rem";
    }

    console.log(size);

    for (let i = 0; i < timerNums.length; i++) {
      timerNums[i].style.fontSize = size;
    }
  });
  clearBtn.addEventListener("click", () => {
    console.log('Clear clicked');
    pauseTimer();
    localStorage.clear();
    updateDisplay();
  });
});

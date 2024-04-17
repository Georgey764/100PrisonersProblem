const boxes = [];
const prisoners = new Array(100).fill(0, 0, 100);
function getRandomArbitrary(min, max) {
  return Math.floor(Math.random() * (max - min)) + min;
}
let previousValues = new Set();

for (let i = 0; i <= 99; i++) {
  let found = false;
  let randomValue = getRandomArbitrary(1, 100);
  while (!found) {
    if (!previousValues.has(randomValue)) {
      previousValues.add(randomValue);
      boxes[i] = randomValue;
      found = true;
    } else {
      if (randomValue == 100) {
        randomValue = 0;
      }
      randomValue++;
    }
  }
}

prisoners.map((cur, i) => {
  document.querySelector(".prisoners").insertAdjacentHTML(
    "beforeend",
    `<div>
        <div id='p-${i}' class='prisoner progress'>${i + 1}</div>
      <div/>`
  );
});

boxes.map((cur, i) => {
  document.querySelector(".boxes").insertAdjacentHTML(
    "beforeend",
    `<div><div id='b-${i}' class='prisoner'>${boxes[i]}</div>
    <p style='margin:0; text-align: center'>${i + 1}</p></div>`
  );
});

const nextStepEl = document.querySelector(".next-step");
const completeCurrentPrisonerEl = document.querySelector(
  ".complete-current-prisoner"
);
const completeAllPrisonersEl = document.querySelector(
  ".complete-all-prisoners"
);
const currentPrisonerEl = document.querySelector(".current-prisoner");
const newList = document.querySelector(".new-list");

let currentPrisoner = parseInt(currentPrisonerEl.textContent);

function changeCurrentPrisoner(val) {
  currentPrisonerEl.textContent = val;
  currentPrisoner = val;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getCurrentPrisoner() {
  return parseInt(currentPrisonerEl.textContent);
}

let statusHere = false;
async function checkComplete() {
  if (statusHere === true) {
    return;
  }
  statusHere = true;
  for (let i = currentPrisoner - 1; i < 100; i++) {
    let checkValue = boxes[i];
    let count = 0;
    let found = false;
    while (!found && count < 50) {
      console.log(checkValue, i + 1);
      if (checkValue === i + 1) {
        found = true;
        document.querySelector("#p-" + i).classList.add("success");
        currentPrisoner = currentPrisoner + 1;
        changeCurrentPrisoner(currentPrisoner);
      }
      checkValue = boxes[checkValue - 1];
      count++;
    }
    if (!found) {
      document.querySelector("#p-" + i).classList.remove("progress");
      document.querySelector("#p-" + i).classList.add("fail");
      currentPrisoner = currentPrisoner + 1;
      changeCurrentPrisoner(currentPrisoner);
    }
    await sleep(50);
  }
  changeCurrentPrisoner(" All Prisoners Complete");
  statusHere = false;
}

let lastBox = -1;
let countInNext = 0;

function getCurrentBox() {
  return parseInt(currentPrisonerEl.textContent) - 1;
}
let currentBox;

function nextStep() {
  if (!currentBox && currentBox != 0) {
    currentBox = getCurrentBox();
  }
  document.querySelector("#b-" + lastBox)?.classList.remove("progress");
  let box = document.querySelector("#b-" + currentBox);
  box?.classList.add("progress");
  lastBox = currentBox;
  countInNext++;
  console.log(boxes[currentBox], currentPrisoner);
  if (boxes[currentBox] == currentPrisoner) {
    box.classList.remove("progress");
    document
      .querySelector("#p-" + (getCurrentPrisoner() - 1))
      .classList.add("success");
    changeCurrentPrisoner(currentPrisoner + 1);
    lastBox = -1;
    countInNext = 0;
    currentBox = null;
  }
  if (countInNext >= 50) {
    box.classList.remove("progress");
    document
      .querySelector("#p-" + (currentPrisoner - 1))
      .classList.remove("progress");
    document.querySelector("#p-" + (currentPrisoner - 1)).classList.add("fail");
    changeCurrentPrisoner(currentPrisoner + 1);
    lastBox = -1;
    countInNext = 0;
    currentBox = null;
  }

  if (lastBox != -1) {
    currentBox = boxes[currentBox] - 1;
  }
}

function completeCurrentPrisoner() {
  document.querySelector("#b-" + lastBox)?.classList.remove("progress");
  lastBox = -1;
  currentBox = null;
  countInNext = 0;
  let checkValue = boxes[currentPrisoner - 1];
  let count = 0;
  let found = false;
  while (!found && count < 50) {
    if (checkValue === currentPrisoner) {
      found = true;
      document
        .querySelector("#p-" + (currentPrisoner - 1))
        .classList.add("success");
      currentPrisoner = currentPrisoner + 1;
      changeCurrentPrisoner(currentPrisoner);
    }
    checkValue = boxes[checkValue - 1];
    count++;
  }

  if (!found) {
    document
      .querySelector("#p-" + (currentPrisoner - 1))
      .classList.remove("progress");
    document.querySelector("#p-" + (currentPrisoner - 1)).classList.add("fail");
    currentPrisoner = currentPrisoner + 1;
    changeCurrentPrisoner(currentPrisoner);
  }
}

completeAllPrisonersEl.addEventListener("click", () => {
  checkComplete();
});

newList.addEventListener("click", () => {
  location.reload();
});

completeCurrentPrisonerEl.addEventListener("click", () => {
  completeCurrentPrisoner();
});

nextStepEl.addEventListener("click", () => {
  nextStep();
});

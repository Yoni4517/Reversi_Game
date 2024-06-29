const empty = 0;
const black = 1;
const white = 2;
const hint = 3;
let time = 1;
let stopTimer = false;
let startTimer;

let screenWhiteCounter = document.querySelector('#whiteCounter');
let screenBlackCounter = document.querySelector('#blackCounter');
document.querySelector("#newGameButton").addEventListener('click', newGame);

let profile = document.querySelector("#profile");
let user = JSON.parse(localStorage.getItem("currentUser"));
profile.innerHTML = `${user.firstName} ${user.lastName}`;
let matrixBoard;
let emailKey = user.email;

timer();
lastGame();

//פונקציה שעושה שעון עצר
function timer() {
    stopTimer=false;
    time = 1;
    let screenTimer = document.getElementById("clock");
    startTimer = setInterval(() => {
        let second = time % 60;
        let minute = Math.floor(time / 60);
        let zeroSeconds = "";
        if (second < 10)
            zeroSeconds = "0";
        let zeroMinutes = "";
        if (minute < 10)
            zeroMinutes = "0";
        screenTimer.innerHTML = `${zeroMinutes}${minute}:${zeroSeconds}${second}`;
        if (stopTimer) {
            clearInterval(startTimer);
        }
        user.timer = time;
        localStorage.setItem(emailKey, JSON.stringify(user));
        localStorage.setItem("currentUser", JSON.stringify(user));
        time++;
    }, 1000)
}

//פונקציה שמאתחלת את המשחק
function newGame() {
    matrixBoard = [
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 1, 2, 0, 0, 0],
        [0, 0, 0, 2, 1, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0],
        [0, 0, 0, 0, 0, 0, 0, 0]];
    user.board = matrixBoard;
    localStorage.setItem(emailKey, JSON.stringify(user));
    localStorage.setItem("currentUser", JSON.stringify(user));
    updateGame();
    permiteToPress();
    let fireWorks = document.querySelector(".reactionGif");
    if (fireWorks)
        fireWorks.remove();
    clearInterval(startTimer);
    timer();
}

//פונקציה שטוענת את הלוח האחרון 
function lastGame() {
    let lastGamer = JSON.parse(localStorage.getItem("currentUser"));
    matrixBoard = lastGamer.board;
    time = lastGamer.timer;
    updateGame();
    permiteToPressForHints();
}

//פונקציה שמעדכנת את המסך על פי המטריצה
function updateGame() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            changeCellDisplay(i, j);
        }
    }
    screenWhiteCounter.innerHTML = counterCoins().white;
    screenBlackCounter.innerHTML = counterCoins().black;
    user.board = matrixBoard;
    user.timer = time;
    localStorage.setItem(emailKey, JSON.stringify(user));
    localStorage.setItem("currentUser", JSON.stringify(user));
}

//פונקציה שטוענת תא במסך על פי המטריצה
function changeCellDisplay(i, j) {
    let cell = document.querySelectorAll(`#row${i} .col${j} .coin`);
    if (matrixBoard[i][j] === empty) {
        cell[0].style.display = "none";
        cell[1].style.display = "none";
        cell[2].style.display = "none";
    }
    else if (matrixBoard[i][j] === black) {
        cell[0].style.display = "block";
        cell[1].style.display = "none";
        cell[2].style.display = "none";
    }
    else if (matrixBoard[i][j] === white) {
        cell[1].style.display = "block";
        cell[0].style.display = "none";
        cell[2].style.display = "none";
    }
    else if (matrixBoard[i][j] === hint) {
        cell[2].style.display = "block";
        cell[0].style.display = "none";
        cell[1].style.display = "none";
    }
}

//פונקציה שמקבלת אינדקסים ומוסיפה למקום זה את האפשרות ללחוץ
function letPress(i, j) {
    let cell = document.querySelector(`#row${i} .col${j}`);
    cell.addEventListener('click', onCellClick);
}

//פונקציה שמורידה את האפשרות ללחוץ על ריבועים
function removeListenerFromPermitedCells() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (matrixBoard[i][j] === hint) {
                let cell = document.querySelector(`#row${i} .col${j}`);
                cell.removeEventListener('click', onCellClick);
                matrixBoard[i][j] = empty;
            }
        }
    }
    updateGame();
}

//פונקציה שעושה צליל
function makeNoise(type) {
    var audioEl = document.createElement("audio");
    audioEl.src = `../audio/${type}.mp3`;
    audioEl.playbackRate = 1;
    audioEl.autoplay = true;
    document.body.appendChild(audioEl);
}

//פונקציה שמוצאת את האינדקסים של הריבוע עליו לחצו
function getRowAndCol(target) {
    let trId = target.closest('tr').id;
    let row = parseInt(trId.replace('row', ''));
    let col = target.dataset.col;
    return { row: row, col: col }
}

//פונקציה שפועלת אחרי לחיצה
function onCellClick(e) {
    makeNoise("black");
    let location = getRowAndCol(this);
    matrixBoard[location.row][location.col] = black;
    changeCellDisplay(location.row, location.col);
    this.removeEventListener('click', onCellClick);
    removeListenerFromPermitedCells();
    swapping(black, location.row, location.col);
    updateGame();
    setTimeout(whitesTurn, 500);
}

//פונקציה שעוברת על כל המטריצה, מסמנת כרמז ומאפשרת לחיצה במקומות המתאימים
function permiteToPress() {
    let isSwapping = false;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (matrixBoard[i][j] === empty && howManyCoinsAreSwapping(black, i, j) > 0) {
                isSwapping = true;
                matrixBoard[i][j] = hint;
                letPress(i, j);
            }
        }
    }
    if (isSwapping === false) {
        theWinner();
        return;
    }
    updateGame();
}

//פונקציה שמאפשרת לחיצה במקומות השמורים כרמז
function permiteToPressForHints() {
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (matrixBoard[i][j] === hint) {
                //&& howManyCoinsAreSwapping(black, i, j) > 0
                letPress(i, j);
            }
        }
    }
    updateGame();
}

//פונקציה הבודקת כמה דסקיות מתהפכות לכיוון נתון
function checkingSwapesForEachDirection(dirCondition, i, j, color) {
    let tempI = [i];
    let tempJ = [j];
    let dirSwapCounter = 0;
    while (dirCondition(tempI, tempJ)) {
        if (matrixBoard[tempI][tempJ] === empty || matrixBoard[tempI][tempJ] === hint)
            return 0;
        else if (matrixBoard[tempI][tempJ] === color) {
            return dirSwapCounter;
        }
        dirSwapCounter++;
    }
    return 0;
}

//פונקציה הבודקת כמה דסקיות המקום הזה הופך
function howManyCoinsAreSwapping(color, i, j) {
    let swapCounter = 0;
    // let tempI = i;
    // let tempJ = j;
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => --tempI[0] >= 0, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => ++tempI[0] < 8, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => --tempJ[0] >= 0, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => ++tempJ[0] < 8, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => ++tempI[0] < 8 && ++tempJ[0] < 8, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => --tempI[0] >= 0 && --tempJ[0] >= 0, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => ++tempI[0] < 8 && --tempJ[0] >= 0, i, j, color);
    swapCounter += checkingSwapesForEachDirection((tempI, tempJ) => --tempI[0] >= 0 && ++tempJ[0] < 8, i, j, color);
    return swapCounter;
}

//פונקציה ההופכת דיסקיות לכיוון נתון
function swappingForEachDirection(color, i, j, condition, promotionIJ) {
    let swapCounter = 0;
    let tempI = [i];
    let tempJ = [j];
    while (condition(tempI, tempJ)) {
        if (matrixBoard[tempI][tempJ] === empty)
            break;
        if (matrixBoard[tempI][tempJ] === color) {
            if (swapCounter > 0) {
                for (let t = 0; t <= swapCounter; t++) {
                    matrixBoard[tempI][tempJ] = color;
                    promotionIJ(tempI, tempJ);
                }
            }
            break;
        }
        swapCounter++;
    }
}

//פונקציה שהופכת את העיגולים שצריכים להתהפך
function swapping(color, i, j) {
    // let tempI = i;
    // let tempJ = j;
    swappingForEachDirection(color, i, j, (tempI, tempJ) => --tempI[0] >= 0, (tempI, tempJ) => ++tempI[0]);
    swappingForEachDirection(color, i, j, (tempI, tempJ) => ++tempI[0] < 8, (tempI, tempJ) => --tempI[0]);
    swappingForEachDirection(color, i, j, (tempI, tempJ) => --tempJ[0] >= 0, (tempI, tempJ) => ++tempJ[0]);
    swappingForEachDirection(color, i, j, (tempI, tempJ) => ++tempJ[0] < 8, (tempI, tempJ) => --tempJ[0]);
    swappingForEachDirection(color, i, j, (tempI, tempJ) => --tempI[0] >= 0 && --tempJ[0] >= 0, (tempI, tempJ) => { ++tempI[0]; ++tempJ[0]; });
    swappingForEachDirection(color, i, j, (tempI, tempJ) => ++tempI[0] < 8 && ++tempJ[0] < 8, (tempI, tempJ) => { --tempI[0]; --tempJ[0]; });
    swappingForEachDirection(color, i, j, (tempI, tempJ) => --tempI[0] >= 0 && ++tempJ[0] < 8, (tempI, tempJ) => { ++tempI[0]; --tempJ[0]; });
    swappingForEachDirection(color, i, j, (tempI, tempJ) => ++tempI[0] < 8 && --tempJ[0] >= 0, (tempI, tempJ) => { --tempI[0]; ++tempJ[0]; });
}

//פונקציה שמבצעת את התור של המחשב- הלבן
function whitesTurn() {
    makeNoise("white");
    let maxSwap = 0;
    let maxI = -1;
    let maxJ = -1;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (matrixBoard[i][j] === empty) {
                let currentValue = howManyCoinsAreSwapping(white, i, j);
                if (currentValue > maxSwap) {
                    maxSwap = currentValue;
                    maxI = i;
                    maxJ = j;
                }
            }
        }
    }
    if (maxSwap === 0) {
        theWinner();
        return;
    }

    matrixBoard[maxI][maxJ] = white;
    changeCellDisplay(maxI, maxJ);
    setTimeout(swapping, 500, white, maxI, maxJ);
    updateGame();
    setTimeout(permiteToPress, 500);
}

//פונקציה שמונה את מספר העיגולים מכל צבע
function counterCoins() {
    let whiteCounter = 0;
    let blackCounter = 0;
    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 8; j++) {
            if (matrixBoard[i][j] === black)
                blackCounter++;
            else if (matrixBoard[i][j] === white)
                whiteCounter++;
        }
    }
    return { black: blackCounter, white: whiteCounter };
}

//פונקציה שבודקת מי המנצח
function theWinner() {
    let coinsCounter = counterCoins();
    let divWin = document.createElement("div");
    divWin.classList.add("reactionGif");
    let textWin = document.createElement("h1");
    textWin.classList.add("reactionText");
    divWin.appendChild(textWin);
    let body = document.querySelector("body");
    body.appendChild(divWin);
    if (coinsCounter.black > coinsCounter.white) {
        divWin.id = "winner";
        textWin.innerText = "ניצחת!!!"
        makeNoise("triumph");
    }
    else if (coinsCounter.black < coinsCounter.white) {
        divWin.id = "loser";
        textWin.innerText = "נכשלת:(";
        makeNoise("failure");
    }
    else {
        divWin.id = "teko";
        textWin.innerText = "תיקו:)";
    }
    stopTimer=true;
}






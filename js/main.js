
let matrixBoard = [
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 3, 0, 0, 0],
    [0, 0, 0, 1, 2, 3, 0, 0],
    [0, 0, 3, 2, 1, 0, 0, 0],
    [0, 0, 0, 3, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0]];

let tempUser = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    timer: '',
    board: '',
};

//פונקציה שקורית בפתיחת הדף
function openPage() {
    let currentEmail = JSON.parse(localStorage.getItem("currentUser"));
    if (currentEmail) {
        document.querySelector("#welcome").innerHTML = `שלום ${currentEmail.firstName}, שמחים שחזרת!`;
        document.querySelector("#logOutAccount").style.display = "block";
    }
    else {
        onClicksignUp();
    }
}

//פונקציה שפותחת חלון של הרשמה
function onClicksignUp() {
    document.querySelector('#signUp').style.display = "flex";
    document.querySelector('#blockGame').style.display = "flex";
    document.querySelector('#logIn').style.display = "none";
}

//פונקציה שפותחת חלון של התחברות
function onClicklogIn() {
    document.querySelector('#logIn').style.display = "flex";
    document.querySelector('#blockGame').style.display = "flex";
    document.querySelector('#signUp').style.display = "none";
}

//פונקציה שיוצרת חשבון חדש ומתחברת אליו 
function updatesignUp(e) {
    e.preventDefault();
    tempUser.firstName = document.querySelector('#firstName').value;
    tempUser.lastName = document.querySelector('#lastName').value;
    tempUser.email = document.querySelector('#gmail2').value;
    tempUser.password = document.querySelector('#password2').value;
    tempUser.board = matrixBoard;
    let checkIfUserExist = true;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === tempUser.email) {
            document.querySelector("#gmail2").setCustomValidity("שגיאה. נסה כתובת מייל אחרת.");
            checkIfUserExist = false;
            break;
        }
    }
    if (checkIfUserExist === true) {
        localStorage.setItem(tempUser.email, JSON.stringify(tempUser));
        localStorage.setItem("currentUser", JSON.stringify(tempUser));
        document.querySelector("#welcome").innerHTML = `שלום ${tempUser.firstName}, שמחים שחזרת!`;
        document.querySelector("#blockGame").style.display = "none";
        document.querySelector("#logOutAccount").style.display = "block";

    }
}

//פונקציה שמתחברת לשם משתמש שנקלט
function updateLogIn(e) {
    e.preventDefault();
    tempUser.email = document.querySelector('#gmail1').value;
    tempUser.password = document.querySelector('#password1').value;
    let checkIfUserNotExist = false;
    for (let i = 0; i < localStorage.length; i++) {
        if (localStorage.key(i) === tempUser.email) {
            let currentKey = localStorage.key(i);
            let currentEmail = JSON.parse(localStorage.getItem(currentKey));
            if (currentEmail.password === tempUser.password) {
                localStorage.setItem("currentUser", JSON.stringify(currentEmail));
                document.querySelector("#welcome").innerHTML = `שלום ${currentEmail.firstName}, שמחים שחזרת!`
                document.querySelector("#blockGame").style.display = "none";
                document.querySelector("#logOutAccount").style.display = "block";
                checkIfUserNotExist = true;
                break;
            }
            else {
                document.querySelector("#password1").setCustomValidity("שגיאה");
                checkIfUserNotExist = true;
                break;
            }
        }
    }
    if (checkIfUserNotExist === false)
        document.querySelector("#gmail1").setCustomValidity("שם משתמש לא קיים");
}

//פונקציה שיוצאת מהחשבון הנוכחי
function logOut(){
    document.querySelector("#welcome").innerHTML = `ברוכים הבאים לעולם המשחקים!`
    document.querySelector("#blockGame").style.display = "flex";
    document.querySelector("#logOutAccount").style.display = "none";
    document.querySelector('#signUp').style.display = "flex";
    document.querySelector('#logIn').style.display = "none";
    localStorage.removeItem("currentUser");
}
document.querySelector('#logOutAccount').addEventListener('click', logOut);
document.querySelector("#contactButton").addEventListener('click', onClicksignUp);
document.querySelector("#createAccountButton").addEventListener('click', onClicklogIn);
document.querySelector('#formsignUp').addEventListener('submit', updatesignUp);
document.querySelector('#formlogIn').addEventListener('submit', updateLogIn);
openPage();
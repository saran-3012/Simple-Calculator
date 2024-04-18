let rootElement = document.querySelector(':root');
let backgroundElement = document.getElementById('root');
let themeSwitch = document.getElementById('theme_switch');
let mobileThemeButtonToggle = document.getElementById('mobile_theme_icon_container');
let togglerButton = document.getElementById('mobile_toggler_arrow');

function toggleThemeButton(){
    if(mobileThemeButtonToggle.style.transform === 'translateX(0%)'){
        mobileThemeButtonToggle.style.transform = 'translateX(calc(-100% + 1.2rem))';
        togglerButton.style.transform = 'rotateY(0deg)';
    }
    else{
        mobileThemeButtonToggle.style.transform = 'translateX(0%)';
        togglerButton.style.transform = 'rotateY(180deg)';
    }
}
function applyTheme(theme){
    if(theme === 'light'){
        backgroundElement.style.backgroundImage = "url('./Components/background-light.svg')";
        themeSwitch.style.backgroundImage = "url('./Images/dark-theme-icon.png')";
        rootElement.style.setProperty('--color-font', 'black');
        rootElement.style.setProperty('--color-button', 'rgba(255, 255, 255, 0.50)');
        rootElement.style.setProperty('--color-background-calculator', 'rgba(255, 255, 255, 0.25)');
        rootElement.style.setProperty('--color-background-history', 'rgba(255, 255, 255, 0.075)');
        rootElement.style.setProperty('--color-card-boxshadow-1', 'rgba(27, 27, 27, 0.5)');
        rootElement.style.setProperty('--color-card-boxshadow-2', 'rgba(255, 255, 255, 0.2)');
        rootElement.style.setProperty('--color-button-boxshadow-1', 'rgba(0, 0, 0, 0.1)');
        rootElement.style.setProperty('--color-button-boxshadow-2', 'rgba(255, 255, 255, 0.4)');
    }
    else{
        backgroundElement.style.backgroundImage = "url('./Components/background-dark.svg')";
        themeSwitch.style.backgroundImage = "url('./Images/light-theme-icon.png')";
        rootElement.style.setProperty('--color-font', 'white');
        rootElement.style.setProperty('--color-button', 'rgba(20, 20, 20, 0.50)');
        rootElement.style.setProperty('--color-background-calculator', 'rgba(30, 30, 30, 0.25)');
        rootElement.style.setProperty('--color-background-history', 'rgba(30, 30, 30, 0.075)');
        rootElement.style.setProperty('--color-card-boxshadow-1', 'rgb(0, 6, 10)');
        rootElement.style.setProperty('--color-card-boxshadow-2', 'rgb(51, 170, 255, 0.4)');
        rootElement.style.setProperty('--color-button-boxshadow-1', 'rgb(0, 6, 10)');
        rootElement.style.setProperty('--color-button-boxshadow-2', 'rgb(51, 170, 255, 0.4)');
    }
}

function toggleMode(){
    if(localStorage.getItem('theme')==='light'){
        localStorage.setItem('theme','dark');
    }
    else{
        localStorage.setItem('theme','light');
    }
    applyTheme(localStorage.getItem('theme'));
}

document.addEventListener("DOMContentLoaded", function(){
    let currentTheme = localStorage.getItem('theme') || 'light';
    applyTheme(currentTheme);
});

const cardFlipper = document.getElementById("card_flipper");

function flipCard(degree){
    cardFlipper.style.transform = `rotateY(${degree})`;
}

function precedence(op){
    return (op=='^')?3:(op=='*' || op=='/')?2:(op=='+' || op=='-')?1:0;
}
  
function operation(b,a,op){
    switch (op) {
        case '+':
            return a+b;
        case '-':
            return a-b;
        case '*':
            return a*b;
        case '/':
            return a/b;
        case '^':
            return a**b;
        default:
            return "Error!";
    }
}
  
function evaluate(e){
    try {
        e=e.replace(/%/g,"*0.01")
        const valStk = [];
        const opStk = [];
        let n=e.length;
        for(let i=0;i<n;i++){
            if(e[i]==' '){
                continue;
            }
            if(('0'<=e[i] && e[i]<='9') || e[i]=='.' || (e[i]=='-' && (i==0 || !('0'<=e[i-1] && e[i-1]<='9'))) ){
                let num=e[i++];
                while(i<n && (('0'<=e[i] && e[i]<='9') || e[i]=='.' )){
                    num+=e[i++];
                }
                valStk.push(Number(num));
                i--;
            }
            else if(e[i]=='('){
                opStk.push(e[i]);
            }
            else if(e[i]==')'){
                while(opStk.length && opStk[opStk.length-1]!='('){
                    valStk.push(operation(valStk.pop(),valStk.pop(),opStk.pop()));
                }
                opStk.pop();
            }
            else{
                while(opStk.length && (precedence(opStk[opStk.length-1])>precedence(e[i]) || (precedence(opStk[opStk.length-1])==precedence(e[i]) && e[i]!='^')) ){
                    valStk.push(operation(valStk.pop(),valStk.pop(),opStk.pop()));
                }
                opStk.push(e[i]);
            }
        }
        while(opStk.length && valStk.length){
          valStk.push(operation(valStk.pop(),valStk.pop(),opStk.pop()));
        }
        return (valStk[0]==+valStk[0])?valStk[0]:false;
    }   
    catch (err) {
        return "Error!";
    }   
}

let inputField = document.getElementById('calculator_input');
let outputField = document.getElementById('calculator_output');
const allowedCharacters = /^[0-9.+*/%-^]*$/;

inputField.addEventListener('focus', function(){
    inputField.addEventListener('input', function(){
        let inputValue = '';
        for(let i of inputField.value){
            if(allowedCharacters.test(i)){
                inputValue+=i;
            }
        }
        inputField.value=inputValue;
    });
    
    inputField.addEventListener('input', function(){
        let res=evaluate(inputField.value);
        outputField.innerHTML= res || outputField.innerHTML;
    });

    inputField.addEventListener('cut', function(){
        let res=evaluate(inputField.value);
        outputField.innerHTML= res || outputField.innerHTML;
    });

    inputField.addEventListener('paste', function(){
        let res=evaluate(inputField.value);
        outputField.innerHTML= res || outputField.innerHTML;
    });
    

    inputField.addEventListener('keydown', function(event){
        if(event.key === 'ArrowLeft' || event.key === 'ArrowRight' || event.key === 'ArrowUp' || event.key === 'ArrowDown'){
            event.preventDefault();
        }
    });
    
});

let triggerInput = new Event('input', {
    bubbles: true,
    cancelable: true,
});

function addInput(val){
    inputField.value += val;
    inputField.focus();
    inputField.dispatchEvent(triggerInput);
}

function clearInput(){
    inputField.value = inputField.value.slice(0,-1);
    inputField.focus();
    inputField.dispatchEvent(triggerInput);
}

function clearAllInput(){
    inputField.value = '';
    inputField.focus();
}

function computeResult(){
    let expressionResult = evaluate(inputField.value) || "Invalid input!";
    sessionStorage.setItem(inputField.value, expressionResult);
    inputField.value = expressionResult;
    outputField.innerHTML = ''; 
}

inputField.addEventListener('keydown', function(event){
    if(event.key === 'Enter'){
        computeResult();
    }
});

let historyPanel = document.getElementById('all_history');

function retrieveHistory(){
    let histories = JSON.parse(JSON.stringify(sessionStorage));
    delete histories['IsThisFirstTime_Log_From_LiveServer'];
    let res = ``;
    if(Object.keys(histories).length){
        for(let expression in histories){
            res += `<span> ${expression} = ${histories[expression]} </span>`;
        }
    }
    else{
        res = `<p> Your calculations and results will appear here! </p>`;
    }
    historyPanel.innerHTML = res;
}

function historySwitch(){
    retrieveHistory();
    flipCard('180deg');
}

function clearHistory(){
    sessionStorage.clear();
    historyPanel.innerHTML = `<p> Your calculations and results will appear here! </p>`;
}
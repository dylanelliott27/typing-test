const quoteDisplayElement = document.getElementById('quoteDisplay')
const quoteInputElement = document.getElementById('quoteInput')
const resultElement = document.getElementById('result');
var timerElement = document.getElementById("timer")
let correctLetters = 0;
let incorrectLetters = 0;


window.onload = function () {
    startTimer();
    renderNewQuote();
};

function startTimer() {
    
    let currentSecond = 60;

    var timer = setInterval(function () {

        if(currentSecond <= 0){
            clearInterval(timer);
            calculateWPM();
        }
        
        // todo: fix formatting of timer
        timerElement.textContent = '00' + ':' + currentSecond;
        currentSecond--;

    }, 1000);
}


/**
 * Adding an event listener. 'Input' element is called every time anything changes, for ex: user types a character.
 * 
 * Loop over all characters and compare each individual character in the input element with each character in the display element, based on their position.
 * 
 * If the characters match, add 'correct' class to the element which sets a specific color
 */
quoteInputElement.addEventListener('input', (e) => {
    const quoteLetterArray = quoteDisplayElement.querySelectorAll('span')
    const userInputLetters = quoteInputElement.value.split('');

    // If the user is at the end of the sentence, render new quote
    if(quoteLetterArray.length === userInputLetters.length){
        renderNewQuote();
    }

    // A quick check to see if the last letter typed in by the user matches with the quote's respective letter, then increments correctLetters
    // todo: using backspace seems to still mess with the counter. ignore backspace presses?
    if(quoteLetterArray[userInputLetters.length - 1].innerText == userInputLetters[userInputLetters.length - 1]){
        correctLetters++;
        console.log("Corr");
    }
    else{ // If the last letter typed in doesn't match
        console.log("inco")
        incorrectLetters++;
    }

    quoteLetterArray.forEach((span, idx) => {
        // For if the user has not typed in the current letter index yet
        if(!userInputLetters[idx]){
            span.classList.remove('correct');
            span.classList.remove('incorrect');
            return;
        }
        // If the current spans value doesn't match the same index of the users input
        if(span.innerText != userInputLetters[idx]){
            span.classList.remove('correct');
            span.classList.add('incorrect');
        }
        // If the value of the span and the same index in the users input match
        else{
            span.classList.remove('incorrect');
            span.classList.add('correct');
        }

    })
})


/**
 * Function to fetch api and convert response to json.
 */
function getRandomQuote()
{
    // TODO:: Fetch many quotes and store them in a array. When the sentence is finished, there is usually a pause until the next quote is fetched.
    return fetch('http://api.quotable.io/random')
    .then(response => response.json())
    .then(data => data.content)
    .catch(err => console.log(err))
}

/**
 * Function to get random quotes from api and display them in html. 
 */
async function renderNewQuote()
{
    const quote =  await getRandomQuote()
    quoteDisplayElement.innerHTML = '';

    //Creating an element 'span' and setting each character to the span element.
    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        //const space = document.createElement('span');
        //space.innerText = ' ';
        characterSpan.innerText = character
        quoteDisplayElement.appendChild(characterSpan)
        //quoteDisplayElement.appendChild(space);
    })
    // Textarea should be null everytime a new quote is displayed.
    quoteInputElement.value = null;
}


function calculateWPM(){
    console.log("WPM: " + correctLetters / 5);
    resultElement.innerText = "WPM: " + correctLetters / 5;
}

const quoteElement = document.getElementById('quote')
const textAreaElement = document.getElementById('input')
const grossWPM = document.getElementById('grosswpm');
var timerDiv = document.getElementById("timer")
const netWPMElement = document.getElementById("netwpm");
const errorsP = document.getElementById("errors");
const resultCard = document.querySelector('.resultcard');

let correctLetters = 0;
let incorrectLetters = 0;
let testRunning = false;

/* -- daiki-- */
textAreaElement.addEventListener('click', () => {
    if(!testRunning){
        startTimer();
    }
})


displayQuote();

/* -- Dylan -- */
//
function startTimer() {
    
    resultCard.style.display = 'none';

    let currentSecond = 5;

    testRunning = true;

    var timer = setInterval(function () {

        if(currentSecond <= 0){
            clearInterval(timer);
            showResultsOnCard();
            testRunning = false;
        }
        
        // todo: fix formatting of timer
        timerDiv.textContent = '00' + ':' + currentSecond;
        currentSecond--;

    }, 1000);
}


/* === dylan === */
textAreaElement.addEventListener('input', (e) => {
    const quoteLetterArray = quoteElement.querySelectorAll('span')
    const userInputLetters = textAreaElement.value.split('');

    // If the user is at the end of the sentence, render new quote
    if(quoteLetterArray.length === userInputLetters.length){
        displayQuote();
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
            span.classList.remove('right');
            span.classList.remove('wrong');
            return;
        }
        // If the current spans value doesn't match the same index of the users input
        if(span.innerText != userInputLetters[idx]){
            span.classList.remove('right');
            span.classList.add('wrong');
        }
        // If the value of the span and the same index in the users input match
        else{
            span.classList.remove('wrong');
            span.classList.add('right');
        }

    })
})


/* -- disha --- */
function fetchQuote()
{
    // TODO:: Fetch many quotes and store them in a array. When the sentence is finished, there is usually a pause until the next quote is fetched.
    return fetch('http://metaphorpsum.com/paragraphs/1/1') // Sending HTTP response to the API.
    // Fetch returns a promise, so we use .then, and we have access to the response info in the response variable
    .then(response => response.text()) // Inside the BODY of the response, we need to get the quote (response.text()), which returns another promise...
    .then(data => data) // Once the promise from above is resolved, we have access to the data variable, which has the quote as a string
    .catch(err => console.log(err)) // error handling, logs an error if a network error occurs or something.
}

/* -- dylan *--- */
async function displayQuote()
{
    const quote =  await fetchQuote()
    quoteElement.innerHTML = '';

    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character
        quoteElement.appendChild(characterSpan)

    })
    textAreaElement.value = '';
}

/* -- disha -- */
function calculateWPM(){

    const grossWPM = correctLetters / 5;
    const netWPM = Math.round(((correctLetters / 5) - incorrectLetters)) / 1;

    return {grossWPM, netWPM};
    
}


/* -- daiki --- */
function showResultsOnCard(){
    const result = calculateWPM();


    grossWPM.innerText = "Gross WPM: " + result.grossWPM;    
    netWPMElement.innerText = "Net WPM: " + result.netWPM;
    errorsP.innerText = "Errors: " + incorrectLetters;
    resultCard.style.display = 'block';
}
const quoteElement = document.getElementById('quote')
const textAreaElement = document.getElementById('input')
const resultElement = document.getElementById('result');
var timerDiv = document.getElementById("timer")

let correctLetters = 0;
let incorrectLetters = 0;


textAreaElement.addEventListener('click', () => {
    startTimer();
})

displayQuote();


function startTimer() {
    
    let currentSecond = 60;

    var timer = setInterval(function () {

        if(currentSecond <= 0){
            clearInterval(timer);
            calculateWPM();
        }
        
        // todo: fix formatting of timer
        timerDiv.textContent = '00' + ':' + currentSecond;
        currentSecond--;

    }, 1000);
}



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


function fetchQuote()
{
    // TODO:: Fetch many quotes and store them in a array. When the sentence is finished, there is usually a pause until the next quote is fetched.
    return fetch('http://metaphorpsum.com/paragraphs/1/1')
    .then(response => response.text())
    .then(data => data)
    .catch(err => console.log(err))
}


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


function calculateWPM(){
    console.log("WPM: " + correctLetters / 5);
    resultElement.innerText = "WPM: " + correctLetters / 5;
    const netWPM = ((correctLetters / 5) - incorrectLetters) / 1;
    console.log("Net WPM: " + netWPM);
}

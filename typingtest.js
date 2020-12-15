const quoteElement = document.getElementById('quote')
const textAreaElement = document.getElementById('input')
const grossWPM = document.getElementById('grosswpm');
var timerDiv = document.getElementById("timer")
const netWPMElement = document.getElementById("netwpm");
const errorsP = document.getElementById("errors");
const resultCard = document.querySelector('.resultcard');

let correctLetters = 0;
let incorrectLetters = 0;
let currentSecond = 60;
let testRunning = false;

// Daiki 
//This is the main event listener that starts the test, it listens for a click on the textarea element
//It checks if the test is already running, then starts the timer and displays a quote on the page
textAreaElement.addEventListener('click', () => {
    if(!testRunning){ // make sure test isnt running already
        startTimer();
        displayQuote();
    }
})


// Dylan
// This is called by the textarea event listener (whenever user clicks into the textarea)
// Uses setInterval, as it allows a callback function to be executed at our desired timelength (every 1 second)
// Each time the callback is called, we constantly de-increment the currentSecond variable until it reaches 0, then
// we clear the timer and call the function to display the users calculated results on the page.
function startTimer() {
    
    resultCard.style.display = 'none'; // When the user restarts the test, we need to clear the result card
    testRunning = true; // Set this flag so the user doesn't accidently click the textarea again and start another timer

    var timer = setInterval(function () {

        if(currentSecond <= 0){ // If the currentSecond is at 0 (times up), clear timer, show results.
            clearInterval(timer);
            showResultsOnCard();
            testRunning = false; // Set this so the user can restart the test again.
        }
        
        timerDiv.textContent = '00' + ':' + currentSecond;
        currentSecond--;

    }, 1000);
}


// Dylan
// This is one of our main event listeners that gets called whenever a user types into the textarea.
// We firstly convert ALL of the span elements containing the letters of the generated paragraph into an array
// Then, we convert all the letters of the users input (in the textarea) into an array of characters as well.
// since EACH character needs to match at the same spot as the quote, we can check if the same index on both arrays has an equal value
// if it matches, we can apply the "right" class, otherwise apply "wrong" class, which are defined in the CSS for either green or red
textAreaElement.addEventListener('input', (e) => {
    const quoteLetterArray = quoteElement.querySelectorAll('span')
    const userInputLetters = textAreaElement.value.split('');

    // If the user is at the end of the sentence, render new quote
    if(quoteLetterArray.length === userInputLetters.length){
        displayQuote();
    }


    // We must have this seperate if statement to increment/decrement the correct/incorrect letters
    // This is because the forEach below this gets run for EVERY character in the quoteletterarray array
    // So the correctLetters and incorrectLetters would be multiplied many times by however many elements is in the quoteletterarray
    if(userInputLetters.length > 0){
        // Check if the last letter inputted by user matches at the same index in the sentence array
        if(quoteLetterArray[userInputLetters.length - 1].innerText == userInputLetters[userInputLetters.length - 1]){
            correctLetters++;
        }
        else{ // If the last letter typed in doesn't match
        incorrectLetters++;
    }
    }

    // Here we loop through the array of letters of the sentence sent to us from the API
    // For each index in the sentence, we check if the same index in the array of the users input characters matches in value
    // If matches, we apply the right class to color the letter green. Otherwise, red, for incorrect.
    // Since the loop might reach an index for which the user input doesn't have (user hasn't typed in yet), we must make sure nothing happens,
    // and all classes are removed, since not correct or incorrect.
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


// Disha 
//Sends a http request to http://metaphorpsum.com/paragraphs/1/1 which returns a string of a random sentence.
//Sets the inner text of the quoteElement element if there is a error to notify user.
function fetchSentence()
{
    return fetch('http://metaphorpsum.com/paragraphs/1/1') 
    .then(response => response.text()) 
    .then(paragraph => paragraph) 
    .catch(err => quoteElement.innerText = "ERROR GETTING PARAGRAPH" + err) 
}


// Dylan 
// This function receives a quote from the fetchQuote function, then splits it into an array of individual characters (including spaces)
// Each value of every index of this array is then inserted into its own span element in the same order as the paragraph, and inserted as a child of the quote element.
async function displayQuote()
{
    const quote =  await fetchSentence() // Since fetchQuote returns promise, need to await it to resolve
    quoteElement.innerHTML = '';

    quote.split('').forEach(character => {
        const characterSpan = document.createElement('span');
        characterSpan.innerText = character
        quoteElement.appendChild(characterSpan)

    })
    textAreaElement.value = '';
}

// Disha
//Using the equations from this page: https://www.speedtypingonline.com/typing-equations, we calculate the net WPM and gross WPM
//This only gets called when the user is done his test and the results need to be shown on the page
function calculateWPM(){
    const grossWPM = correctLetters / 5;
    const netWPM = Math.round(((correctLetters / 5) - incorrectLetters)) / 1;
    return {grossWPM: grossWPM, netWPM: netWPM}; // need to return both variables so return as object
}


// Daiki
//all of the values from calculateWPM and incorrectLetters get displayed in HTML here
function showResultsOnCard(){
    const result = calculateWPM();
    grossWPM.innerText = "Gross WPM: " + result.grossWPM;    
    netWPMElement.innerText = "Net WPM: " + result.netWPM;
    errorsP.innerText = "Errors: " + incorrectLetters;
    resultCard.style.display = 'block';
    resetValues();
}

// Disha
// This function is called after the user results are displayed on screen.
// It resets all the added values from the previous test, so that when the user tries to restart the test, the values are empty
function resetValues(){
    incorrectLetters = 0;
    correctLetters = 0;
    testRunning = false;
    currentSecond = 60;
    textAreaElement.value = '';
    textAreaElement.blur(); 
}
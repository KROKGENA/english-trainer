let words = []
let current = 0

const wordElement = document.getElementById("word")
const answerInput = document.getElementById("answer")
const resultElement = document.getElementById("result")

async function loadWords(){

    const response = await fetch("words.json")

    words = await response.json()

    showWord()

}

function showWord(){

    const word = words[current]

    wordElement.innerText = word.english

    answerInput.value = ""

    resultElement.innerText = ""

}

function checkAnswer(){

    const word = words[current]

    const answer = answerInput.value.toLowerCase().trim()

    if(answer === word.russian){

        resultElement.innerText = "✔ правильно"

    } else {

        resultElement.innerText = "✘ правильно: " + word.russian

    }

}

function nextWord(){

    current++

    if(current >= words.length){

        current = 0

    }

    showWord()

}

document.getElementById("check").onclick = checkAnswer
document.getElementById("know").onclick = nextWord
document.getElementById("dontknow").onclick = nextWord

loadWords()

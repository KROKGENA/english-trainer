let words = []
let current = 0

const wordElement = document.getElementById("word")
const iconElement = document.getElementById("icon")
const answerInput = document.getElementById("answer")
const resultElement = document.getElementById("result")

async function loadWords(){

const response = await fetch("words.json")

words = await response.json()

showWord()

}

function normalize(text){

return text
.toLowerCase()
.trim()
.replace("ё","е")

}

function showWord(){

const word = words[current]

wordElement.innerText = word.english

iconElement.innerText = word.icon || "📦"

answerInput.value=""

resultElement.innerText=""

resultElement.className=""

}

function checkAnswer(){

const word = words[current]

const userAnswer = normalize(answerInput.value)

const correct = normalize(word.russian)

if(userAnswer === correct){

resultElement.innerText="✔ Правильно"

resultElement.className="correct"

}else{

resultElement.innerText="✘ Правильно: "+word.russian

resultElement.className="wrong"

}

}

function nextWord(){

current++

if(current>=words.length){

current=0

}

showWord()

}

document.getElementById("check").onclick=checkAnswer
document.getElementById("know").onclick=nextWord
document.getElementById("dontknow").onclick=nextWord

loadWords()

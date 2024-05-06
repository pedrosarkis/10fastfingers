let currentWordIndex = 0;
const spans = document.getElementById('word-box').getElementsByTagName('span')
const input = document.getElementById('input')
let initialOFfset = 0

const createWordCounter = () => {
	let corretWords = 0
	let totalWords = 0

	return {
		increment: () => corretWords += 1,
		incrementTotalWords: () => totalWords += 1,
		getTotalWords: () => totalWords,
		getCount: () => corretWords,
		reset: () => corretWords = 0
	}
}

const wordCounter = createWordCounter()


const generateRandomWords = async () => {
	const randomWords = await (await fetch('https://random-word-api.herokuapp.com/word?number=200')).json()
	return randomWords
}

const generateSpanWithWords = (words) => {
	const wordsDiv = document.getElementById('word-box')
	words.forEach(word => {
		const span = document.createElement('span')
		span.innerHTML = word
		wordsDiv.append(span)
	});
	initialOFfset = document.getElementsByTagName('span')[0].offsetLeft
}
(async ()=> {
	const words = await generateRandomWords()
	generateSpanWithWords(words)
	highlightWord(currentWordIndex)
})()

const handleInput = (ev) => {
	const input = document.getElementById('input')
	if(ev.keyCode === 32 && input.value.trim() !== '') {
		checkSpelling(input.value.trim(), currentWordIndex, true)
		wordCounter.incrementTotalWords()
		console.log(wordCounter.getTotalWords())
		resetElementValue(input)
		currentWordIndex++
		startClock()
		if(spans[currentWordIndex].offsetLeft === initialOFfset) scrollDown()
		highlightWord(currentWordIndex)
	}
	if(input.value.trim() !== '' ) {
		checkSpelling(input.value, currentWordIndex)
	}
}

const highlightWord = (index) => {
	const spanToHighlight = spans[index]
	spanToHighlight.classList.add('highlightGray')
}

const checkSpelling = (currentWordTyped, index, finalWord) => {
	const currentWordSpan = spans[index]
	
	const isWordIncorrect = !currentWordSpan.innerHTML.startsWith(currentWordTyped)
	
	currentWordSpan.className = isWordIncorrect ? 'highlightRed' : 'highlightGray'
	

	if(finalWord) {
		if(currentWordTyped !== currentWordSpan.innerHTML ) {
			currentWordSpan.className = 'highlightRed'
		} 
		else {
			currentWordSpan.className = 'highlightGreen'
			wordCounter.increment()
		} 
	} 
}

const startClock = () => {
	const timeElement = document.getElementById('time')
	if(timeElement.value !== '01:00') return
	timeElement.value = 59
	const timer = setInterval(() => {
		timeElement.value -= 1
		if(timeElement.value == 0) {
			clearInterval(timer)
			stopGame()
			showResult(mountResult(wordCounter))
		} 
	}, 1000);
}
const resetElementValue = (el) => el.value = ''

const stopGame = () => {
	input.disabled = true
}

const scrollDown = () => {
	document.getElementById('word-box').scrollTop += 25
}

const mountResult = (wordsCounter) => {
	const correctWords = wordsCounter.getCount()
	const totalWords = wordsCounter.getTotalWords()
	const wrongWords = totalWords - correctWords
	const accuracyPercentage = ((correctWords / totalWords) * 100).toFixed(2)

	return {
		totalWords,
		correctWords,
		wrongWords,
		accuracyPercentage
	}
}

const showResult = ({totalWords, correctWords, wrongWords, accuracyPercentage}) => {
	const resultElement = document.getElementById('result')
	resultElement.style.display = 'block'
	const p = document.createElement('p')
	p.innerHTML = `Você escreveu um total de ${totalWords} palavras, sendo ${correctWords} corretas, ${wrongWords} incorretas.
	Portanto sua precisão ao digitar é de ${accuracyPercentage} por cento`
	resultElement.append(p)
}



document.getElementById('input').addEventListener('keyup', handleInput)
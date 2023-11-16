let words = [
	"IMPROVEMENT",
	"WORK",
	"HEALTH",
	"ANXIETY",
	"MONEY",
	"LOVE",
	"FAMILY",
	"FRIENDSHIP",
	"BODY",
	"MOTIVATION",
	"CONFIDENCE",
	"GRATITUDE",
	"ESTEEM",
	"STUDY",
	"BUSINESS",
];

const puzzle = document.querySelector("#puzzleArea");
let rows = 14;
let cols = 14;

document.addEventListener("DOMContentLoaded", function () {
	arrangeGame();
});

function arrangeGame() {
	const hint = document.querySelector("#hint");
	words.forEach((element) => {
		hint.innerHTML += "<li>" + element + "</li>";
	});

	let html = "";
	for (let i = 0; i < rows; i++) {
		html += "<div class='row'>";
		for (let j = 0; j < cols; j++) {
			html += `<div class='col singleWord' data-row='${i}' data-col='${j}'></div>`;
		}
		html += "</div>";
	}
	puzzle.innerHTML = html;

	placeLetters(words);
	fillEmptySpaces();

	let puzzleCells = document.querySelectorAll(".singleWord");
	let selectedCells = [];
	let selectedWord = "";

	function handleMouseMove() {
		// Add cell to selectedCells array if not already in array
		if (!selectedCells.includes(this)) {
			selectedCells.push(this);
		}
		// Update selected word
		selectedWord = selectedCells.map((cell) => cell.textContent).join("");
		// Add selected class to cell
		this.classList.add("selected");
		// Highlight cells that belong to selected word
	}

	puzzleCells.forEach((cell) => {
		cell.addEventListener("mousedown", () => {
			// Add mousemove event listener
			puzzleCells.forEach((cell) => {
				cell.addEventListener("mousemove", handleMouseMove);
			});
			// Update selected cells
			selectedCells.push(cell);
			// Update selected word
			selectedWord = selectedCells
				.map((cell) => cell.textContent)
				.join("");
			// Add selected class to cell
			cell.classList.add("selected");
			// Highlight cells that belong to selected word
		});
		cell.addEventListener("mouseup", () => {
			// Remove mousemove event listener
			puzzleCells.forEach((cell) => {
				cell.removeEventListener("mousemove", handleMouseMove);
			});
			// Log selected word to console
			console.log(selectedWord);

			// Call crossOff function
			crossOff(selectedWord);
			found(selectedWord);

			// Clear selected cells and word
			selectedCells = [];
			selectedWord = "";
		});
	});
}

function placeLetters(myArr) {
	const positions = ["rows", "column", "diagonal"];
	for (let i = 0; i < myArr.length; i++) {
		let orientation =
			positions[Math.floor(Math.random() * positions.length)];
		let placed = false;
		for (let j = 0; j < 100 && !placed; j++) {
			let startRow = Math.floor(Math.random() * rows);
			let startCol = Math.floor(Math.random() * cols);
			if (canPlaceWord(myArr[i], startRow, startCol, orientation)) {
				placeWord(myArr[i], startRow, startCol, orientation);
				placed = true;
			}
		}
	}
}

function canPlaceWord(word, startRow, startCol, orientation) {
	const wordLength = word.length;
	switch (orientation) {
		case "rows":
			if (startCol + wordLength > cols) {
				return false;
			}
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${startRow}'][data-col='${
						startCol + i
					}']`
				);
				if (box.textContent !== "" && box.textContent !== word[i]) {
					return false;
				}
			}
			return true;
		case "column":
			if (startRow + wordLength > rows) {
				return false;
			}
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${
						startRow + i
					}'][data-col='${startCol}']`
				);
				if (box.textContent !== "" && box.textContent !== word[i]) {
					return false;
				}
			}
			return true;
		case "diagonal":
			if (startRow + wordLength > rows || startCol + wordLength > cols) {
				return false;
			}
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${startRow + i}'][data-col='${
						startCol + i
					}']`
				);
				if (box.textContent !== "" && box.textContent !== word[i]) {
					return false;
				}
			}
			return true;
		case "diagonal-reverse":
			if (startRow + 1 - wordLength < 0 || startCol + wordLength > cols) {
				return false;
			}
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${startRow - i}'][data-col='${
						startCol + i
					}']`
				);
				if (box.textContent !== "" && box.textContent !== word[i]) {
					return false;
				}
			}
			return true;
	}
}

function placeWord(word, startRow, startCol, orientation) {
	const wordLength = word.length;
	switch (orientation) {
		case "rows":
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${startRow}'][data-col='${
						startCol + i
					}']`
				);
				box.textContent = word[i];
				box.style.whiteSpace = "nowrap";
			}
			break;
		case "column":
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${
						startRow + i
					}'][data-col='${startCol}']`
				);
				box.textContent = word[i];
				box.style.whiteSpace = "nowrap";
			}
			break;
		case "diagonal":
			for (let i = 0; i < wordLength; i++) {
				let box = document.querySelector(
					`.singleWord[data-row='${startRow + i}'][data-col='${
						startCol + i
					}']`
				);
				box.textContent = word[i];
				box.style.whiteSpace = "nowrap";
			}
			break;
	}
}

function fillEmptySpaces() {
	const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
	const emptySpaces = document.querySelectorAll(".singleWord:empty");
	emptySpaces.forEach((space) => {
		const randomLetter = letters.charAt(
			Math.floor(Math.random() * letters.length)
		);
		space.textContent = randomLetter;
	});
}

function crossOff(selectedWord) {
	const hintItems = document.querySelectorAll("#hint li");
	hintItems.forEach((item) => {
		if (item.textContent === selectedWord) {
			item.classList.add("crossed-off"); // add "crossed-off" class to hint item
		}
	});
}

function found(selectedWord) {
	let chosenWord = document.querySelectorAll(".singleWord.selected");
	let hintItems = document.querySelectorAll("#hint li");

	hintItems.forEach((item) => {
		if (
			item.textContent === selectedWord &&
			item.classList.contains("crossed-off")
		) {
			chosenWord.forEach((cell) => {
				cell.style.backgroundColor = "pink";
				cell.style.color = "white";
				cell.style.borderRadius = "50%";
				cell.style.border = "2px solid pink";
			});
		}
	});
	// Call getAffirmation when a word is found
	getAffirmation(selectedWord);
	let wordFound = false;
	hintItems.forEach((item) => {
		if (
			item.textContent === selectedWord &&
			item.classList.contains("crossed-off")
		) {
			wordFound = true;
		}
	});

	if (!wordFound) {
		chosenWord.forEach((cell) => {
			cell.classList.remove("selected");
		});
	}

	done();
}

function done() {
	let hintItems = document.querySelectorAll("#hint li");
	let allCrossedOff = true;

	hintItems.forEach((item) => {
		if (!item.classList.contains("crossed-off")) {
			allCrossedOff = false;
		}
	});

	if (allCrossedOff) {
		// Update the h2 element with the message
		let gameOver = document.querySelector(".gameOver");
		gameOver.style.display = "block";
	}
}

function resetGame() {
	const puzzle = document.querySelector("#puzzleArea");
	const hint = document.querySelector("#hint");
	puzzle.innerHTML = "";
	hint.innerHTML = "";
	arrangeGame();
}
const resetButton = document.querySelector("#reset");
resetButton.addEventListener("click", resetGame);

function getAffirmation(selectedWord) {
	const affirmations = {
		IMPROVEMENT: [
			"I am constantly improving and growing in all aspects of my life.",
			"I embrace change and see it as an opportunity for improvement.",
			"I am open to new ideas and experiences that lead to personal development.",
			"I am committed to making positive changes in my life every day.",
			"I am resilient and capable of overcoming any obstacles that come my way.",
			"I am dedicated to self-improvement and becoming the best version of myself.",
			"I believe in my ability to achieve continuous improvement in all areas of my life.",
		],
		WORK: [
			"I am focused and productive in my work, accomplishing tasks with ease.",
			"I am confident in my abilities and contribute valuable work to my team.",
			"I am motivated and driven to excel in my career.",
			"I am open to new opportunities and challenges that come my way.",
			"I am respected and appreciated for my hard work and dedication.",
			"I am capable of achieving success and fulfillment in my professional endeavors.",
			"I am committed to creating a positive and impactful work environment.",
		],
		HEALTH: [
			"I prioritize my health and well-being, making healthy choices every day.",
			"I am strong and resilient, capable of overcoming health challenges.",
			"I am dedicated to maintaining a healthy lifestyle and taking care of my body.",
			"I am grateful for my body and treat it with love and respect.",
			"I am proactive in seeking the best possible care for my health.",
			"I am committed to achieving optimal health and vitality.",
			"I believe in my body's ability to heal and thrive.",
		],
		ANXIETY: [
			"I am calm and centered, free from anxiety and stress.",
			"I am in control of my thoughts and emotions, finding peace within myself.",
			"I am capable of managing and overcoming feelings of anxiety.",
			"I am resilient and strong, facing challenges with courage and confidence.",
			"I am surrounded by love and support, easing any anxiety I may feel.",
			"I am at peace with myself and the world around me.",
			"I am confident in my ability to overcome anxiety and live a fulfilling life.",
		],
		MONEY: [
			"I am financially abundant and attract prosperity into my life.",
			"I am capable of managing my finances wisely and responsibly.",
			"I am open to new opportunities for financial growth and success.",
			"I am grateful for the abundance that flows into my life.",
			"I am confident in my ability to create wealth and financial stability.",
			"I am resourceful and creative in generating income and wealth.",
			"I am deserving of financial prosperity and abundance.",
		],
		LOVE: [
			"I am surrounded by love and positivity in all areas of my life.",
			"I am open to giving and receiving love unconditionally.",
			"I am worthy of love and affection, and I attract loving relationships.",
			"I am grateful for the love that fills my heart and soul.",
			"I am capable of nurturing and sustaining deep, meaningful connections.",
			"I am confident in my ability to create and maintain loving relationships.",
			"I am open to the abundance of love that the universe provides.",
		],
		FAMILY: [
			"I am surrounded by a loving and supportive family.",
			"I am grateful for the bond and connection I share with my family members.",
			"I am capable of resolving conflicts and nurturing harmonious relationships within my family.",
			"I am committed to creating a loving and nurturing environment for my family.",
			"I am open to understanding and accepting my family members unconditionally.",
			"I am confident in my ability to provide love and support to my family.",
			"I am dedicated to strengthening the bonds of love and unity within my family.",
		],
		FRIENDSHIP: [
			"I am surrounded by loyal and supportive friends who uplift and inspire me.",
			"I am grateful for the meaningful connections and friendships in my life.",
			"I am capable of being a loyal and trustworthy friend to others.",
			"I am open to forming new and fulfilling friendships with like-minded individuals.",
			"I am confident in my ability to nurture and maintain strong friendships.",
			"I am dedicated to being a positive and supportive presence in the lives of my friends.",
			"I am open to the abundance of meaningful and enriching friendships.",
		],
		BODY: [
			"I am grateful for my body and treat it with love and respect.",
			"I am capable of achieving and maintaining optimal health and vitality.",
			"I am committed to nourishing my body with healthy food and exercise.",
			"I am open to healing and rejuvenating my body through self-care and mindfulness.",
			"I am confident in my body's ability to heal and thrive.",
			"I am dedicated to embracing and celebrating the unique beauty of my body.",
			"I am at peace with my body and appreciate all that it does for me.",
		],
		MOTIVATION: [
			"I am motivated and driven to achieve my goals and aspirations.",
			"I am capable of overcoming obstacles and challenges with determination.",
			"I am committed to taking consistent action towards my dreams and ambitions.",
			"I am open to new opportunities and experiences that fuel my motivation.",
			"I am confident in my ability to stay focused and inspired in pursuing my passions.",
			"I am dedicated to maintaining a positive and resilient mindset in the face of adversity.",
			"I am grateful for the inner fire and motivation that propels me forward.",
		],
		CONFIDENCE: [
			"I am confident in my abilities and trust in my own judgment.",
			"I am capable of facing challenges with courage and self-assurance.",
			"I am open to embracing my strengths and talents with confidence.",
			"I am grateful for the unique qualities and attributes that make me who I am.",
			"I am confident in my ability to achieve success and fulfillment in all areas of my life.",
			"I am dedicated to nurturing and strengthening my self-confidence every day.",
			"I am open to the abundance of self-assurance and empowerment within me.",
		],
		GRATITUDE: [
			"I am grateful for the abundance of blessings and opportunities in my life.",
			"I am capable of finding joy and appreciation in every moment.",
			"I am committed to expressing gratitude and spreading positivity to others.",
			"I am open to receiving and acknowledging the gifts of life with gratitude.",
			"I am confident in my ability to cultivate a grateful and fulfilled heart.",
			"I am dedicated to living a life filled with gratitude and appreciation.",
			"I am surrounded by love and abundance, and I am grateful for all that I have.",
		],
		STUDY: [
			"I am dedicated to my studies and approach learning with curiosity and enthusiasm.",
			"I am focused and attentive, absorbing knowledge with ease and clarity.",
			"I am open to new ideas and perspectives that enhance my understanding of the subjects I study.",
			"I am committed to continuous growth and improvement in my academic pursuits.",
			"I am resilient and capable of overcoming academic challenges with determination.",
			"I am confident in my ability to excel in my studies and achieve my educational goals.",
			"I am grateful for the opportunity to expand my knowledge and skills through study.",
		],
		BUSINESS: [
			"I am dedicated to the success and growth of my business endeavors.",
			"I am focused and strategic, making sound decisions that drive my business forward.",
			"I am open to new opportunities and innovations that benefit my business ventures.",
			"I am committed to creating value and making a positive impact through my business initiatives.",
			"I am resilient and capable of navigating challenges and setbacks in the business world.",
			"I am confident in my ability to lead and manage my business with competence and vision.",
			"I am grateful for the resources and support that contribute to the prosperity of my business.",
		],
		ESTEEM: [
			"I am confident in my worth and value as an individual.",
			"I am capable of recognizing and appreciating my unique strengths and qualities.",
			"I am open to embracing self-improvement and personal growth to enhance my self-esteem.",
			"I am committed to nurturing a positive self-image and a healthy sense of self-worth.",
			"I am resilient and capable of overcoming self-doubt and insecurities with self-compassion.",
			"I am dedicated to fostering a strong and confident sense of self-esteem in all aspects of my life.",
			"I am grateful for the journey of self-discovery and empowerment that contributes to my self-esteem.",
		],
	};

	let category = selectedWord;
	let affirmationsList = document.querySelector("#newAffirmation");
	let categoryHeading = document.createElement("h4");
	categoryHeading.textContent = category;
	affirmationsList.appendChild(categoryHeading);
	if (affirmations[category]) {
		affirmationsList.innerHTML +=
			"<br>" + affirmations[category].join("<br>");
	} else {
		affirmationsList.innerHTML = " ";
	}
	console.log(affirmations[category]);
}

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

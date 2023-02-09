const gameBoard = document.querySelector("#gameBoard")
const context = gameBoard.getContext("2d")
const scoreText = document.querySelector("#scoreText")
const resetBtn = document.querySelector("#resetBtn")
const gameWidth = gameBoard.width
const gameHeight = gameBoard.height
const gameBackground = "rgb(30, 210, 150)"
const snakeColor = "rgb(210, 30, 69)"
const snakeBorder = "black"
const foodBorder = "purple"
const foodColor = "rgb(16, 103, 12)"
const unitSize = 25
let running = false
let xVelocity = unitSize
let yVelocity = 0
let foodX
let foodY
let score = 0
let snake

// let head = {x: snake[0].x, y: snake[0].y};

window.addEventListener("keydown", changeDirection)

resetBtn.addEventListener("click", resetGame)

gameStart()

function createSnake() {
	snake = [
		{ x: 250, y: 150 },
		{ x: 250 - unitSize, y: 150 },
		{ x: 250 - unitSize * 2, y: 150 },
		{ x: 250 - unitSize * 3, y: 150 },
		{ x: 250 - unitSize * 4, y: 150 },
	]
}

function gameStart() {
	running = true
	resetBtn.style.visibility = "hidden"
	gameBoard.style.borderColor = "black"
	createSnake()
	scoreText.textContent = score
	createFood()
	drawFood()
	nextTick()
}

function nextTick() {
	if (running) {
		setTimeout(() => {
			clearBoard()
			drawFood()
			moveSnake()
			drawSnake()
			checkGameOver()
			nextTick()
		}, speedUp())
	} else {
		displayGameOver()
	}
}
function clearBoard() {
	context.fillStyle = gameBackground
	context.fillRect(0, 0, gameWidth, gameHeight)
}

function createFood() {
	function randomFood(min, max) {
		const randomNumber =
			Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
		return randomNumber
	}
	foodX = randomFood(0, gameWidth - unitSize)
	foodY = randomFood(0, gameHeight - unitSize)
}

function drawFood() {
	context.fillStyle = foodColor
	context.strokeStyle = foodBorder
	context.beginPath()
	context.arc(
		foodX + unitSize / 2,
		foodY + unitSize / 2,
		unitSize / 2,
		0,
		Math.PI * 2,
		true
	)
	context.fill()
	context.stroke()
}

function moveSnake() {
	let head = {
		x: snake[0].x + xVelocity,
		y: snake[0].y + yVelocity,
	}
	snake.unshift(head)
	//if food is eaten
	if (snake[0].x == foodX && snake[0].y == foodY) {
		score += 1
		scoreText.textContent = score
		createFood()
	} else {
		snake.pop()
	}
}

function drawSnake() {
	context.fillStyle = snakeColor
	context.strokeStyle = snakeBorder
	snake.forEach((snakePart) => {
		context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize)
		context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize)
	})

	context.fillStyle = "rgb(216, 240, 81)"
	context.strokeStyle = "black"
	context.fillRect(snake[0].x, snake[0].y, unitSize, unitSize)
	context.strokeRect(snake[0].x, snake[0].y, unitSize, unitSize)
}
function gameOverParameters() {
	running = false
	gameBoard.style.borderColor = "red"
	context.fillStyle = "black"
	context.fillRect(0, 0, gameWidth, gameHeight)
}

function speedUp() {
	let speed = 1000 / 10
	for (let i = 0, j = 0; i <= 100; i++, j += 0.2) {
		if (i <= score) {
			speed = 1000 / (7 + j)
		}
	}
	// if (score >= 5) {
	// 	speed = 1000 / 13;
	// } else if (score >= 10) {
	// 	speed = 1000 / 18;
	// } else if (score >= 15){
	// 	speed = 1000 / 21;
	// }
	return speed
}
function checkGameOver() {
	if (
		snake[0].x < 0 ||
		snake[0].x >= gameWidth ||
		snake[0].y >= gameHeight ||
		snake[0].y < 0
	) {
		gameOverParameters()
	}

	for (let i = 1; i < snake.length; i++) {
		if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
			gameOverParameters()
		}
	}
}

function displayGameOver() {
	context.font = "45px JetBrains Mono"
	context.fillStyle = "red"
	context.textAlign = "center"
	context.fillText("GAME OVER :(", gameWidth / 2, gameHeight / 2)
	context.font = "25px JetBrains Mono"
	context.fillText(
		`You earned ${score} points`,
		gameWidth / 2,
		gameHeight / 1.6
	)
	resetBtn.style.visibility = "visible"
	running = false
}

function resetGame() {
	score = 0
	xVelocity = unitSize
	yVelocity = 0
	createSnake()
	gameStart()
}

function changeDirection(e) {
	const keyPressed = e.keyCode
	let up = 38
	let down = 40
	let left = 37
	let right = 39

	const goingUp = yVelocity == -unitSize
	const goingDown = yVelocity == unitSize
	const goingLeft = xVelocity == -unitSize
	const goingRight = xVelocity == unitSize

	switch (true) {
		case keyPressed == up && !goingDown:
			yVelocity = -unitSize
			xVelocity = 0
			break
		case keyPressed == down && !goingUp:
			yVelocity = unitSize
			xVelocity = 0
			break
		case keyPressed == left && !goingRight:
			xVelocity = -unitSize
			yVelocity = 0
			break
		case keyPressed == right && !goingLeft:
			xVelocity = unitSize
			yVelocity = 0
			break
	}
}

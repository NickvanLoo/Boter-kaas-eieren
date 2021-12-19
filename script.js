var origBoard;
const huPlayer = 'O';
const aiPlayer = 'X';
// array met de wincombo's
const winCombos = [
	[0, 1, 2],
	[3, 4, 5],
	[6, 7, 8],
	[0, 3, 6],
	[1, 4, 7],
	[2, 5, 8],
	[0, 4, 8],
	[6, 4, 2]
]

const cells = document.querySelectorAll('.cell');
startGame();

// Deze fuctie start de game.
function startGame() {
	document.querySelector(".endgame").style.display = "none";
	origBoard = Array.from(Array(9).keys());
	for (var i = 0; i < cells.length; i++) {
		cells[i].innerText = '';
		cells[i].style.removeProperty('background-color');
		cells[i].addEventListener('click', turnClick, false);
	}
}

// Deze functie zorgt er voor dat je kunt klikken in de vierkantjes.
function turnClick(square) {
	if (typeof origBoard[square.target.id] == 'number') {
		turn(square.target.id, huPlayer)
		if (!checkWin(origBoard, huPlayer) && !checkTie()) turn(bestSpot(), aiPlayer);
	}
}

// Deze functie bepaald wie er aan de beurt.
function turn(squareId, player) {
	origBoard[squareId] = player;
	document.getElementById(squareId).innerText = player;
	let gameWon = checkWin(origBoard, player)
	if (gameWon) gameOver(gameWon)
}

// Deze functie bepaald wie er gewonnen heeft.
function checkWin(board, player) {
	let plays = board.reduce((a, e, i) =>
	(e === player) ? a.concat(i) : a, []);
	let gameWon = null;
	for (let [index, win] of winCombos.entries()) {
		if (win.every(elem => plays.indexOf(elem) > -1)) {
			gameWon = {index: index, player: player};
			break;
		}
	}
	return gameWon;
}

// Deze functie laat zien of je verloren of gewonnen hebt.
function gameOver(gameWon) {
	for (let index of winCombos[gameWon.index]) {
		document.getElementById(index).style.backgroundColor =
		gameWon.player == huPlayer ? "green" : "red";
	}
	for (var i = 0; i < cells.length; i++) {
		cells[i].removeEventListener('click', turnClick, false);
	}
	declareWinner(gameWon.player == huPlayer ? "Je hebt gewonnen!" : "Je hebt verloren...");
}

function declareWinner(who) {
	document.querySelector(".endgame").style.display = "block";
	document.querySelector(".endgame .text").innerText = who;
}

function emptySquares() {
	return origBoard.filter(s => typeof s == 'number');
}

function bestSpot() {
	return minimax(origBoard, aiPlayer).index;
}

function checkTie() {
	if (emptySquares().length == 0) {
		for (var i = 0; i < cells.length; i++) {
			cells[i].style.backgroundColor = "orange";
			cells[i].removeEventListener('click', turnClick, false);
		}
		declareWinner("Gelijk spel!")
		return true;
	}
	return false;
}

function minimax(newBoard, player) {
	var availSpots = emptySquares();

	if (checkWin(newBoard, huPlayer)) {
		return {score: -10};
	} else if (checkWin(newBoard, aiPlayer)) {
		return {score: 10};
	} else if (availSpots.length === 0) {
		return {score: 0};
	}
	var moves = [];
	for (var i = 0; i < availSpots.length; i++) {
		var move = {};
		move.index = newBoard[availSpots[i]];
		newBoard[availSpots[i]] = player;

		if (player == aiPlayer) {
			var result = minimax(newBoard, huPlayer);
			move.score = result.score;
		} else {
			var result = minimax(newBoard, aiPlayer);
			move.score = result.score;
		}

		newBoard[availSpots[i]] = move.index;

		moves.push(move);
	}

	var bestMove;
	if(player === aiPlayer) {
		var bestScore = -10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score > bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	} else {
		var bestScore = 10000;
		for(var i = 0; i < moves.length; i++) {
			if (moves[i].score < bestScore) {
				bestScore = moves[i].score;
				bestMove = i;
			}
		}
	}

	return moves[bestMove];
}

alert ("Je kunt het spel spelen door in de vierkantjes te klikken. De gene die 3 op een rij heeft wint! Succes!");

//Timer met resterende speeltijd. Als de tijd om is word het spel opnieuw gestart.
var timer=25;
var min=0;
var sec=0;
function startTimer() {
	min=parseInt(timer/60);
	sec=parseInt(timer%60);

	if (timer<1) {
		// Spel is afgelopen, spel word opnieuw geladen.
		document.getElementById("startscherm").style.display="none";
		alert('Uw tijd is voorbij!');
		window.location="tictactoe.html";
	}
	document.getElementById("time").innerHTML = "<b> Resterende speeltijd: </b>"+min.toString()+":"+sec.toString();
	timer--;
	setTimeout(function(){
		startTimer();
	}, 1000);
}

var score;

function score() {


}
document.getElementById("startscherm").style.display = "none";
document.getElementById("speelveld").style.display = "block";
document.getElementById("eindscherm").style.display = "none";

let game;
let counter;

function setup() {
	let canvas = createCanvas (602, 602); // width, height
	canvas.parent('p5sketch');
	createCounter();
	createNewGame(10,10,15);
	myCreateButton('Beginner', 9, 9, 10);
	myCreateButton('Medium', 16, 16, 40);
	myCreateButton('Expert', 16, 30, 99);
	noLoop();
}

function draw() {
	game.show();
}

function windowResized () {
	myResizeCanvas();
}

function mouseClicked () {// use millis to time event

	let line = game.mouseY2line (mouseY);
	let col = game.mouseX2col (mouseX);
	let cell = game.get(line, col);
	if (cell != null) {

		if (mouseButton === LEFT) {
			if (game.gameOver || game.win) {
				createNewGame();
			}
			else {

				if (!game.minesPlaced) {
					game.placeMine(line, col);
				}
				game.reveal(line, col);
			}
		}
		else if (mouseButton === RIGHT) {
			if (!cell.showed) {
				cell.marked = !cell.marked;
				if (cell.marked) game.marked++;
				else game.marked--;
			}
		}
		else if (mouseButton === CENTER) {
			game.revealNeighbor(line, col);
		}

		game.playerWin();
		updateCounter();
		redraw();
	}
	return false;
}

function myResizeCanvas() {
	let lines = game.grid.getLines();
	let cols = game.grid.getCols();
	let cell_size = min ((0.8*windowWidth)/cols, windowHeight/lines);
	resizeCanvas (cell_size * cols, cell_size * lines);
}

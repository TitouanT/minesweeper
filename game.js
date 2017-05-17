function createNewGame (lines = -1, cols = -1, mines = -1) {
	if (lines === -1 && game === undefined) {
		lines = cols = mines = 10;
	}
	else if (lines === -1) {
		lines = game.grid.getLines();
		cols = game.grid.getCols();
		mines = game.getNbMine();
	}
	game = new Game (lines, cols, mines);
	myResizeCanvas();
	updateCounter();
}

let Game = function (lines, cols, nbM) {
	this.gameOver = false;
	this.win = false;
	this.minesPlaced = false;
	this.marked = 0;

	this.grid = new Grid (lines, cols);
	let nbDiscover = 0;
	let nbMines = nbM;
	const MINE = -1;

	this.getNbMine = () => nbMines;

	this.playerWin  = function () {
		if (nbDiscover === lines * cols - nbMines) {
			this.win = true;
			return true;
		}
		return false;
	}

	this.mouseX2col = function (x) {
		return this.grid.getColFromMouseX(x);
	}

	this.mouseY2line = function (y) {
		return this.grid.getLineFromMouseY(y);
	}

	this.get = function (line, col) {
		return this.grid.get (line, col);
	}

	this.placeMine = function (avoidLine, avoidCol) {
		this.minesPlaced = true;
		nbMines = this.grid.placeMine(nbMines, avoidLine, avoidCol);
	}

	this.reveal = function (line, col) {
		let cell = this.get(line, col);
		if (cell.marked || cell.showed) return; // it's not possible to reveal a marked cell, you can see this as a safety
		if (cell.val === MINE) {
			cell.showed = true;
			this.gameOver = true;
		}
		else if (cell.val === 0) {
			this.revealZeros (line, col);
		}
		else {
			cell.showed = true;
			nbDiscover++;
		}
	}

	this.revealNeighbor = function (line, col) {
		let cell = this.get(line, col);
		let nbNeighbor = game.grid.countMarkedNeighbor (line, col);
		if (!(cell.showed && nbNeighbor === cell.val)) return;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (this.grid.isInBound(line + i, col + j)) {
					this.reveal (line + i, col + j);
				}
			}
		}
	}

	this.revealZeros = function (line, col) {
		if (!this.grid.isInBound(line, col)) return;
		let cell = this.get(line, col);
		if (cell.showed || cell.marked) return;
		nbDiscover++;
		cell.showed = true;
		if (cell.val === 0) {
			for (let i = -1; i < 2; i++)
				for (let j = -1; j < 2; j++)
					this.revealZeros (line + i, col + j);
		}
	}

	this.show = function () {
		this.grid.show (this.gameOver, this.win);
	}
}

let Grid = function (l, c) {
	// number of lines and columns of the grid
	const lines = l;
	const cols = c;

	// colors of the cell's background
	const marked = color ("#9e1448");
	const showed = color ("#ffffcb");
	const dft = color (50);

	// value of a mine
	const MINE = -1;


	this.arr = [];
	for (let i = 0; i < lines; i++) {
		this.arr[i] = [];
		for (let j = 0; j < cols; j++) this.arr[i][j] = new Cell();
	}

	this.getLines = () => lines;
	this.getCols = () => cols;

	this.isInBound = function (line, col) {
		return (line >= 0 && line < lines && col >= 0 && col < cols);
	}

	this.countMarkedNeighbor = function (line, col) {
		let acc = 0;
		for (let i = -1; i < 2; i++) {
			for (let j = -1; j < 2; j++) {
				if (line + i >= 0 && line + i < lines && col + j >= 0 && col + j < cols) {
					if (this.arr[line + i][col + j].marked) acc++;
				}
			}
		}
		return acc;
	}

	this.getLineFromMouseY  = function (y) {

		// size of an individual cell
		const c_height = floor(height / lines);
		const c_width = floor(width / cols);

		let line = floor (y / c_height);
		if (line < 0 || line >= lines) return -1;
		return line;
	}

	this.getColFromMouseX  = function (x) {
		// size of an individual cell
		const c_height = floor(height / lines);
		const c_width = floor(width / cols);

		let col = floor (x / c_width);
		if (col < 0 || col >= cols) return -1;
		return col;
	}



	this.get  = function (line, col) {
		if (!this.isInBound(line, col)) return null;
		return (this.arr[line][col]);
	}

	this.placeMine = function (n, avoidLine, avoidCol) {
		let nbMine = n;

		for (let m = 0; m < n; m++) {
			let line, col, sec = 0;
			do {
				line = floor(random(lines));
				col = floor(random(cols));
				sec++;
			} while ((this.arr[line][col].val === MINE || (line === avoidLine && col === avoidCol)) && sec < 1000);
			if (sec >= 1000) nbMine--;
			else {
				this.arr[line][col].val = MINE;

				for (let i = -1; i < 2; i++) {
					for (let j = -1; j < 2; j++) {
						if (i != 0 || j != 0) {

							let l = line + i;
							let c = col + j;
							if (l >= 0 && l < lines && c >= 0 && c < cols) {
								if (this.arr[l][c].val !== MINE) {
									this.arr[l][c].val++;
								}
							}
						}
					}
				}
			}
		}
		return nbMine;
	}

	this.show = function (gameOver, win) {
		// size of an individual cell
		const c_height = floor(height / lines);
		const c_width = floor(width / cols);

		let colors = [
			color("#2d7dd2"),
			color("#97cc04"),
			color("#ff4000"),
			color("#213674"),
			color("#e61300"),
			color("#00d3e6"),
			color("#58b09c"),
			color("#000000")
		];
		background(255)
		for (let i = 0; i < lines; i++) {
			for (let j = 0; j < cols; j++) {
				let cell = this.arr[i][j];
				stroke(0);
				strokeWeight(1);
				if (gameOver || win) {
					if (cell.val === MINE) cell.showed = true;
				}
				fill (cell.marked ? marked : cell.showed ? showed : dft);
				rect(j * c_width, i * c_height, c_width, c_height);

				if (cell.showed) {
					let y = i * c_height + c_height / 2;
					let x = j * c_width + c_width / 2;
					noStroke();
					if (cell.val === MINE) {
						let r = 0.8 * c_height;
						fill (0);
						ellipse (x, y, r, r)
					}
					else if (cell.val > 0 && !win) {
						textAlign(CENTER, CENTER);
						textStyle(BOLD);
						textSize(c_height);
						fill(colors[cell.val - 1]);
						text(cell.val, x, y);
					}
				}
				else if (gameOver && cell.marked && cell.val != -1) { // draw some cross over errors.
					let y = i * c_height;
					let x = j * c_width;
					let propX = 0.1 * c_width;
					let propY = 0.1 * c_height;
					stroke(255,0,0);
					strokeWeight(0.1 * c_height);
					line(x + propX, y + propY, x + c_width - propX, y + c_height - propY);
					line(x + c_width - propX, y + propY, x + propX, y + c_height - propY);
				}
			}
		}
	}
}

let Cell = function () {
	this.val = 0;
	this.showed = false;
	this.marked = false;
}
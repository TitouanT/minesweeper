function updateCounter() {
	let nb = game.getNbMine() - game.marked;
	let str;
	if (game.win) str = "You are a winner!";
	else if (game.gameOver) str = "Outch, it hurts !";
	else {
		if (nb > 1) str = nb + " mines left";
		else if (nb === 1) str = "Only one last !";
		else if (nb === 0) str = "Some click away...";
		else str = "Hum, '" + nb + "' mines left doesn't seems odd to you ?"
	}
	counter.html(str);
};
function createCounter () {
	counter = createP ();
	counter.parent("counter");
}

function myCreateButton (str, lines, cols, mines) {
	let b = createButton (str);
	b.mousePressed(() => createNewGame(lines, cols, mines));
	b.parent('buttons_container');
}

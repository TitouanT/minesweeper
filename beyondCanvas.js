function updateCounter() {
	let nb = max(game.getNbMine() - game.marked, 0);
	let str = nb > 1 ? nb + " mines left" : "only one last !";
	if (nb > 1) str = nb + " mines left";
	else if (nb === 1) str = "only one last !";
	else str = "";
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
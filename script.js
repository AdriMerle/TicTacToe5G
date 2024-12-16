function renderGrid(grid) {
    const pawnCircle = document.getElementById("pawn-circle").innerHTML;
    const pawnCross = document.getElementById("pawn-cross").innerHTML;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.querySelector(`.cell[data-row="${row+1}"][data-col="${col+1}"]`)
            if (grid[row][col] === "X") cell.innerHTML = pawnCross;
            else if (grid[row][col] === "O") cell.innerHTML = pawnCircle;
        }
    }

    const winner = checkWinner(grid);
    const resultElem = document.getElementById("result");
    if (winner === 'X') {
        resultElem.innerText = "Cross wins!";
        resultElem.dataset.state = "cross";
    }
    else if (winner === 'O') {
        resultElem.innerText = "Circle wins!";
        resultElem.dataset.state = "circle";
    }
    else if (winner === 'Draw') {
        resultElem.innerText = "It's a draw...";
        resultElem.dataset.state = "draw";
    }
    else {
        resultElem.innerHTML = "";
        resultElem.dataset.state = "hidden";
    }
}

function checkWinner(grid) {
    for (let i = 0; i < 3; i++) {
        // Check row i
        if (grid[i][0] && grid[i][0] === grid[i][1] && grid[i][1] === grid[i][2]) {
            return grid[i][0];
        }
        // Check column i
        if (grid[0][i] && grid[0][i] === grid[1][i] && grid[1][i] === grid[2][i]) {
            return grid[0][i];
        }
    }

    // Check main diagonal
    if (grid[0][0] && grid[0][0] === grid[1][1] && grid[1][1] === grid[2][2]) {
        return grid[0][0];
    }

    // Check secondary diagonal
    if (grid[0][2] && grid[0][2] === grid[1][1] && grid[1][1] === grid[2][0]) {
        return grid[0][2];
    }

    // Check for a draw
    if (grid.every(row => row.every(cell => cell))) {
        return 'Draw';
    }

    return null;
}


(() => {
    const grid = [["X", "X", "X"],[0,0,"X"],[0,0,0]];
    renderGrid(grid);
})();

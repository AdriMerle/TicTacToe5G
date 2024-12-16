function renderGrid(grid) {
    const pawnCircle = document.getElementById("pawn-circle").innerHTML;
    const pawnCross = document.getElementById("pawn-cross").innerHTML;

    for (let row = 0; row < 3; row++) {
        for (let col = 0; col < 3; col++) {
            const cell = document.querySelector(`.cell[data-row="${row+1}"][data-col="${col+1}"]`)
            if (grid[row][col] === "X") cell.innerHTML = pawnCross;
            else if (grid[row][col] === "O") cell.innerHTML = pawnCircle;
            else cell.innerHTML = "";
        }
    }

    const winner = checkWinner(grid);
    const resultElem = document.getElementById("result");
    const resultText = document.getElementById("result-text");
    if (winner === 'X') {
        resultText.innerText = "Red wins";
        resultElem.dataset.state = "cross";
    }
    else if (winner === 'O') {
        resultText.innerText = "Blue wins";
        resultElem.dataset.state = "circle";
    }
    else if (winner === 'Draw') {
        resultText.innerText = "It's a draw...";
        resultElem.dataset.state = "draw";
    }
    else {
        resultText.innerHTML = "";
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

async function fetchData(grid) {
    // Define the API URL and parameters
    const apiUrl = "http://172.24.153.108:8080/qpe/getTagData";
    const params = {
        mode: "json",
        tag: "a4da22e1701e,a4da22e16cda"
    };

    // Build the query string
    const queryString = new URLSearchParams(params).toString();

    // Fetch data from the API
    try {
        const response = await fetch(`${apiUrl}?${queryString}`);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();

        // Get data from tags
        const tags = data.tags;
            
        // Make a new array with tag color, locationZoneNames
        const tagData = tags.map(tag => {
            return {
                color: tag.color,
                locationZoneNames: tag.locationZoneNames?.[0] || 'Unknown',
                isPushed: tag.button1State === 'pushed'
            };
        });

        // Process each tag in the input data
        tagData.forEach(({ color, isPushed }) => {
            if (locationZoneNames.startsWith("Zone")) {
                const zoneIndex = parseInt(locationZoneNames.replace("Zone", ""), 10) - 1; // Convert ZoneX to index
                if (zoneStatus[zoneIndex] !== "-") {
                    return;
                }
                const row = Math.floor(zoneIndex / 3);
                const col = zoneIndex % 3;
                if (grid[row][col] === 'X' || grid[row][col] === 'O') return;

                if (isPushed) {
                    if (color === "#00FF33") {
                        grid[row][col] = "X"; // green
                    } else if (color === "#FF0000") {
                        grid[row][col] = "O"; // red
                    }
                }
            }
        });

        return grid;
    }
    catch(error) {
        console.error("Error fetching data:", error); // Handle errors
        throw new Error(`Error: ${error}`);
    }
}

function initGrid(grid) {
    for (let i = 0; i < 3; i++) {
        grid[i] = [0, 0, 0];
    }
}


(async () => {
    const grid = [];
    initGrid(grid);
    grid[0] = ["X", "X", "X"];

    document.getElementById("retry-button").addEventListener('click', () => {
        initGrid(grid);
    });

    setInterval(async () => {
        fetchData(grid);
        renderGrid(grid);
    }, 500);
})();

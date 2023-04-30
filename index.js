let sec = 0, min = 0, hour = 0, ms = 0;
var measure;
let numselected = null;
// let complete = false;
let tileselected = null;
let errors = 0;
let startingPage = document.getElementById("startingPage");
let body = document.getElementById("body");
let start = document.getElementById('start');


let easy = [["5", "3", "-", "-", "7", "-", "-", "-", "-"], ["6", "-", "-", "1", "9", "5", "-", "-", "-"], ["-", "9", "8", "-", "-", "-", "-", "6", "-"], ["8", "-", "-", "-", "6", "-", "-", "-", "3"], ["4", "-", "-", "8", "-", "3", "-", "-", "1"], ["7", "-", "-", "-", "2", "-", "-", "-", "6"], ["-", "6", "-", "-", "-", "-", "2", "8", "-"], ["-", "-", "-", "4", "1", "9", "-", "-", "5"], ["-", "-", "-", "-", "8", "-", "-", "7", "9"]]

let medium = [
    ["6", "-", "4", "-", "-", "7", "-", "2", "8"],
    ["9", "-", "2", "8", "-", "4", "-", "-", "-"],
    ["-", "8", "5", "6", "-", "-", "1", "3", "-"],
    ["-", "-", "-", "9", "7", "-", "2", "-", "-"],
    ["4", "5", "8", "-", "-", "3", "-", "6", "9"],
    ["-", "9", "-", "-", "4", "6", "3", "-", "-"],
    ["8", "-", "-", "4", "9", "-", "5", "7", "6"],
    ["5", "4", "-", "-", "-", "-", "-", "1", "3"],
    ["1", "-", "-", "-", "8", "-", "-", "-", "-"]
]

let hard = [
    ["4", "-", "-", "-", "-", "3", "-", "-", "5"],
    ["-", "-", "9", "-", "-", "6", "8", "1", "-"],
    ["-", "7", "-", "-", "-", "-", "-", "-", "-"],
    ["6", "9", "8", "-", "-", "-", "7", "-", "4"],
    ["-", "-", "-", "-", "-", "5", "9", "-", "3"],
    ["-", "-", "-", "-", "9", "-", "-", "-", "-"],
    ["-", "-", "5", "-", "2", "-", "-", "-", "-"],
    ["-", "6", "-", "-", "8", "-", "-", "9", "-"],
    ["-", "-", "7", "-", "6", "-", "4", "-", "1"]
]

function createContainer() {
    const container = document.createElement('div');
    container.setAttribute('id', 'container');

    const h2 = document.createElement('h2');
    h2.innerHTML = 'Errors : <span id="errors">0</span> Timer: <span class="timer">00:00:00</span>';
    container.appendChild(h2);

    const board = document.createElement('div');
    board.setAttribute('id', 'board');
    container.appendChild(board);

    const br1 = document.createElement('br');
    const br2 = document.createElement('br');
    container.appendChild(br1);
    container.appendChild(br2);

    const digits = document.createElement('div');
    digits.setAttribute('id', 'digits');
    container.appendChild(digits);

    const center = document.createElement('center');
    const buttonKeeper = document.createElement('div');
    buttonKeeper.classList.add('buttonKeeper');

    const pauseBtn = document.createElement('button');
    pauseBtn.setAttribute('type', 'submit');
    pauseBtn.setAttribute('id', 'pause');
    pauseBtn.innerHTML = 'Pause';
    buttonKeeper.appendChild(pauseBtn);

    const seeSolBtn = document.createElement('button');
    seeSolBtn.setAttribute('type', 'submit');
    seeSolBtn.setAttribute('id', 'seeSol');
    seeSolBtn.innerHTML = 'See the solution';
    buttonKeeper.appendChild(seeSolBtn);

    center.appendChild(buttonKeeper);
    container.appendChild(center);

    document.body.appendChild(container);

    complete()
}

function deleteContainer() {
    const container2 = document.getElementById('container');
    container2.remove();
}

function setGame(level) {
    if (level === "easy") {
        board = [...easy];
    }
    if (level === "medium") {
        board = [...medium];
    }
    if (level === "hard") {
        board = [...hard];
    }
    solution = [...board];

    for (let i = 1; i <= 9; i++) {
        let number = document.createElement('div');
        number.id = i;
        number.innerText = i;
        number.addEventListener('click', selectNumber);
        number.classList.add('numbers');
        document.getElementById('digits').appendChild(number);
    }

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            let tile = document.createElement('div')
            tile.id = r.toString() + "-" + c.toString()
            if (board[r][c] != "-") {
                tile.innerText = board[r][c]
                tile.classList.add('alreadyKnown')
            }
            if (r == 2 || r == 5) {
                tile.classList.add('horizontal-line')
            }
            if (c == 2 || c == 5) {
                tile.classList.add('vertical-line')
            }
            tile.addEventListener('click', selectTile)
            tile.classList.add('tile')
            document.getElementById('board').appendChild(tile)
        }
    }
}

start.onclick = function () {
    startingPage.classList.add("containerNone");
    createContainer();
    var value = document.getElementsByName('level');
    for (var radio of value) {
        if (radio.checked) {
            console.log(radio.value);
            setGame(radio.value);
        }
    }
}

function complete() {
    let pause = document.getElementById('pause');
    pause.onclick = function () {
        clearInterval(measure);
        measure = false;

        if (confirm("Do you want to continue?")) {
            measure = setInterval(run, 10);
        } else {
            min = 0;
            sec = 0;
            hour = 0;
            timer.innerHTML = getTimer();
            clearInterval(measure);
            measure = false;
            startingPage.classList.remove("containerNone");
            deleteContainer();
        }
    }

    let board = [];
    let solution = [];

    var timer = document.querySelector('.timer');

    function run() {
        timer.innerHTML = getTimer();
        ms++;
        if (ms == 100) {
            ms = 0;
            sec++;
        }
        if (sec == 60) {
            sec = 0;
            min++;
        }
        if (min == 60) {
            min = 0;
            hour++;
        }
    }

    function getTimer() {
        return (hour < 10 ? "0" + hour : hour) + " : " + (min < 10 ? "0" + min : min) + " : " + (sec < 10 ? "0" + sec : sec);
    }

    if (!measure) {
        measure = setInterval(run, 10);
    }
}


function sudokuSolver(grid) {
    const n = grid.length;
    dfs(grid, n);
}

function dfs(grid, n) {
    for (let row = 0; row < n; row++) {
        for (let col = 0; col < n; col++) {
            if (grid[row][col] !== '-') {
                continue;
            } else {
                for (let i = 1; i <= 9; i++) {
                    const c = i.toString();
                    if (isValid(grid, row, col, n, c)) {
                        grid[row][col] = c;
                        if (dfs(grid, n)) return true;
                    }
                }
            }
            grid[row][col] = '-';
            return false;
        }
    }
    return true;
}

function isValid(grid, row, col, n, c) {
    const blockRow = Math.floor(row / 3) * 3;
    const blockCol = Math.floor(col / 3) * 3;
    for (let i = 0; i < n; i++) {
        if (grid[row][i] === c || grid[i][col] === c) return false;
        const curRow = blockRow + Math.floor(i / 3);
        const curCol = blockCol + Math.floor(i % 3);
        if (grid[curRow][curCol] === c) return false;
    }
    return true;
}




function selectNumber() {
    if (numselected != null) {
        numselected.classList.remove('selected')
    }
    numselected = this
    numselected.classList.add("selected")
}



function selectTile() {
    if (numselected) {
        if (this.innerText != '') {
            return;
        }
        let coords = this.id.split("-")
        let r = parseInt(coords[0])
        let c = parseInt(coords[1])
        sudokuSolver(solution);
        if (solution[r][c] == numselected.id) {
            this.innerText = numselected.id
        }
        else {
            errors += 1
            document.getElementById('errors').innerText = errors
        }
    }
}


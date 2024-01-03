// Each little piece of functionality should be able to fit in the game, player or gameboard objects.

// Player Object (we'll have many instances of it)
function Player(nameInput) {
    let score = 0; 
    let name = nameInput; 
    
    return {
        getName() {
            return name; 
        },
        setName(newName) {
            name = newName; 
        },
        getScore() {
            return score; 
        },
        incrementScore() {
            score++; 
        }
    };
}

// IIFEE (module pattern) of a Gameboard
const gameboard = () => {

    let gameArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];

    const setArray = (line, column, char) => {
        gameArray[line * 3 + column] = char; 
    };

    const getArray = () => {
        return gameArray;
    };
    
    const verifyArray = () => { 
        // In search of a line match
        for (let i = 0; i < 9; i += 3) {
            if (getArray()[i] === getArray()[i + 1] && getArray()[i + 1] === getArray()[i + 2]) {
                return getArray()[i];
            } 
        }
        // In search of a column match
        for (let j = 0; j < 3; j++) {
            if (getArray()[j] === getArray()[j + 3] && getArray()[j + 3] === getArray()[j + 6]) {
                return getArray()[j]; 
            } 
        }
        // In search of a diagonal match 
        if (getArray()[0] === getArray()[4] && getArray()[4] === getArray()[8]) {
            return getArray()[0]; 
        }
        if (getArray()[6] === getArray()[4] && getArray()[4] === getArray()[2]) {
            return getArray()[6];
        }
        // else 
        return 'null'; 
    }

    const displayArray = () => {
        let grid = '';
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                grid += `${getArray()[i * 3 + j]} `;
            }
            grid += '\n'; 
        }
        console.log(grid);
    }

    const playRoundUser = () => {
        // User turn
        let numbers = '';
        let firstNumber = -1, secondNumber = -1;
        let isPosInvalid = true; 
        do {
            numbers = prompt("Choose a position [{Line (0-2)} {Column (0-2)}]: ").split(" ");
            firstNumber = parseInt(numbers[0]);
            secondNumber = parseInt(numbers[1]);
            if (firstNumber < 0 || firstNumber > 2 || secondNumber < 0 || secondNumber > 2) {
                alert("Invalid position within the 3x3 grid. Please, try again.");
                isPosInvalid = true; 
            } else if (getArray()[firstNumber * 3 + secondNumber] === 'X' || getArray()[firstNumber * 3 + secondNumber] === 'O') {
                alert("Position unavailable. Please, try again.");
                isPosInvalid = true;
            } else {
                isPosInvalid = false; 
            }
        } while (isPosInvalid); 
        return [firstNumber, secondNumber];
    }

    const playRoundComputer = () => {
        // Computer turn
        let computerLinePos;
        let computerColumnPos;
        let isPosInvalid = false;
        do {
            computerLinePos = Math.floor(Math.random() * 3);
            computerColumnPos = Math.floor(Math.random() * 3);
            if (getArray()[computerLinePos * 3 + computerColumnPos] === 'X' || getArray()[computerLinePos * 3 + computerColumnPos] === 'O')
                isPosInvalid = true;
            else 
                isPosInvalid = false; 
        } while (isPosInvalid);
        return [computerLinePos, computerColumnPos];
    }

    return { getArray, setArray, verifyArray, displayArray, playRoundUser, playRoundComputer };
};

// Module to control flow of the Game
const controller = () => {
    // Methods that manage the game itself.

    // Set gameboard on. 
    const { getArray, setArray, verifyArray, displayArray, playRoundUser, playRoundComputer } = gameboard();

    // Set players on.
    const user = Player("Carlos");
    const computer = Player("Computador");

    // Set choices on. 
    let userChoice = ' ';
    let computerChoice = '';

    const getUserChoice = () => {
        return userChoice; 
    }

    const getComputerChoice = ()  => {
        return computerChoice; 
    }

    const setChoice = () => {
        let choice = ' ';
        do {
            choice = (prompt("Would you rather be 'X' or 'O'?")).trim().toUpperCase();
            if (choice === 'X') {
                alert("Welcome to Tic-Tac-Toe!"); 
            } else if (choice === 'O') {
                alert("Welcome to Tic-Tac-Toe!");
            } else {
                alert("Invalid answer. Please, try again.");
            }
        } while ((choice !== 'X') && (choice !== 'O'));        
        userChoice = choice; 

        if (choice === 'X') {
            computerChoice = 'O';
        } else if (choice === 'O') {
            computerChoice = 'X';
        }
    };

    const playRound = () => {

        let alphabet = "abcdefghi";
        
        // Player Turn
        let userCoords = playRoundUser(); 
        setArray(userCoords[0], userCoords[1], getUserChoice());
        // Print result
        displayArray();

        // Verify Winner
        let winner = verifyArray();
        if (winner !== 'null') {
            if (winner === getUserChoice()) {
                alert("User won the game!");
                user.incrementScore();
                return true; 
            }
        }

        // If Draw
        if (!getArray().some(element => alphabet.includes(element))) {
            alert("It's a Draw!");
            return true; 
        } 

        // Computer Turn
        let computerCoords = playRoundComputer(); 
        setArray(computerCoords[0], computerCoords[1], getComputerChoice());
        // Print result
        displayArray();

        // Verify Winner
        winner = verifyArray();
        if (winner !== 'null') {
            if (winner === getComputerChoice()) {
                alert("Computer won the game!");
                computer.incrementScore();
                return true; 
            }
        }
        
        // If Draw
        if (!getArray().some(element => alphabet.includes(element))) {
            alert("It's a Draw!");
            return true; 
        } else {
            playRound();
        }
    }
 
    return { user, computer, getUserChoice, getComputerChoice, setChoice, playRound};
};

// Game initialization 
const { setChoice, playRound } = controller();  
setChoice();
playRound();
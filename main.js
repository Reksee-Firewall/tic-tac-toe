// Information on Player and Computer Objects
const Player = (choice='') => {

    let _score = 0;
    let _name = '';
    let _choice = choice;

    const getScore = () => {
        return _score;
    };
    const setScore = (score) => {
        _score = score; 
    };

    const getName = () => {
        return _name; 
    };
    const setName = (name) => {
        _name = name; 
    };

    const getChoice = () => {
        return _choice; 
    };
    const setChoice = (choice) => {
        _choice = choice;
    };

    return {
        getScore, 
        setScore,
        getName,
        setName,
        getChoice, 
        setChoice
    };
};

// Where the GameBoard is managed
const gameInfo = (() => {
    let _gameArray = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
    let _round = 0;

    const user = Player("X");
    const bot = Player("O");

    const allPieces = document.querySelectorAll(".item");
    const main = document.querySelector("main");
    // Scores
    const roundText = document.getElementById("round");
    const playerScoreText = document.getElementById("player");
    const computerScoreText = document.getElementById("computer");
    // <--

    const getRound = () => {
        return _round;
    };
    const setRound = (round) => {
        _round = round;
    };

    const getUser = () => {
        return user;
    };
    const getBot = () => {
        return bot;
    };

    const getArray = () => {
        return _gameArray; 
    };
    const setArray = (pos, char) => {
        _gameArray[pos] = char;
    };

    const changeUserChoice = (() => {
        const choiceButtons = document.querySelectorAll("#heroes button");
        Array.from(choiceButtons).forEach((button) => {
            button.addEventListener("click", (e) => {
                Array.from(choiceButtons).forEach((b) => {b.style.setProperty("border-color", "grey")});
                e.target.style.setProperty("border-color", "cornflowerblue");
                if (e.target.id === "X") {
                    user.setChoice("X"); 
                    bot.setChoice("O");
                } else {
                    user.setChoice("O");
                    bot.setChoice("X");
                }
                resetBoard(allPieces);
            });
        });
    })();

    const resetButton = (() => {
        // Yeah, not the first time we initialize this one. 
        const allPieces = document.querySelectorAll(".item");
        // <-- 
        const restartButton = document.getElementById("restart");
        restartButton.addEventListener("click", () => {
            resetBoard(allPieces);
            roundText.textContent = 0;
            playerScoreText.textContent = 0;
            computerScoreText.textContent = 0;
        });
    })();

    const setPieceListeners = (() => {
        let allowedToClick = true;
        Array.from(allPieces).forEach((item) => {
            item.addEventListener("click", (e) => {
                if (allowedToClick) {
                    if (isPositionAvailable(e.target)) {
                        displayPiece(e.target);
                        if (searchForWinner()) {
                            // Update Scores
                            roundText.textContent = getRound();
                            playerScoreText.textContent = user.getScore();
                            // Reset Board
                            allowedToClick = false;
                            setTimeout(() => {
                                resetBoard(allPieces);
                                allowedToClick = true;
                                return true; 
                            }, 1500);
                        } else {
                            turnToComputer(0); 
                            if (searchForWinner()) {
                                // Update Scores
                                roundText.textContent = getRound();
                                computerScoreText.textContent = bot.getScore();
                                // Reset Board
                                allowedToClick = false;
                                setTimeout(() => {
                                    resetBoard(allPieces);
                                    allowedToClick = true;
                                    return true; 
                                }, 1500);
                            }
                        }
                    }
                }
            });
        });  
    })();

    const displayWinner = ((winner) => {
        const msg = document.createElement("div")
        if (winner !== null) {
            if (winner.getChoice() === user.getChoice()) {
                msg.setAttribute("class", "msg"); 
                msg.style.color = "green";
                msg.textContent = "Player +1"; 
            } else if (winner.getChoice() === bot.getChoice()) {
                msg.setAttribute("class", "msg"); 
                msg.style.color = "red";
                msg.textContent = "Computer +1";
            }
        } else {
            msg.setAttribute("class", "msg"); 
            msg.style.color = "yellow";
            msg.textContent = "It's a Draw!";
        }
        main.appendChild(msg); 
        setTimeout(() => {
            main.removeChild(msg);
        }, 2000);
    }); 

    const turnToComputer = ((difficultyLevel) => {
        let pos = null; 
        let isPosInvalid = true;

        // Difficulty affects how the computer chooses a position.  
        if (difficultyLevel === 0) {
            // Just a random number. 
            do {
                pos = Math.floor(Math.random() * 9);
                if (getArray()[pos] != "X" && getArray()[pos] != "O") {
                    isPosInvalid = false;
                } else {
                    isPosInvalid = true;
                }
            } while (isPosInvalid); 
        } else if (difficultyLevel === 1) {
            // The computer aims to win the match.

        } else if (difficultyLevel === 3) {
            // The computer not only aims to win the match, but he will also stop you from winning. 

        }

        // Sets within the array
        setArray(pos, bot.getChoice());
        
        // Displays the text within the grid
        targetPiece = document.getElementById(`item${pos}`);
        if (bot.getChoice() === 'X') {
            targetPiece.textContent = "X";
        } else if (bot.getChoice() === 'O') {
            targetPiece.textContent = "O";
        }
    }); 

    const displayPiece = (targetPiece) => {
        if (user.getChoice() === 'X') {
            targetPiece.textContent = "X";
        } else if (user.getChoice() === 'O') {
            targetPiece.textContent = "O";
        } else {
            // Game has not started yet.
            targetPiece.textContent = "Z";
        }
    };

    const isPositionAvailable = (targetPiece) => {
        const pos = parseInt((targetPiece.id.split(""))[4]);
        if (getArray()[pos] != "X" && getArray()[pos] != "O") {
            setArray(pos, user.getChoice());
            return true;
        } 
        return false; 
    };

    const searchForWinner = () => {
        let winner = '';
        // In search of a line match
        for (let i = 0; i < 9; i += 3) {
            if (getArray()[i] === getArray()[i + 1] && getArray()[i + 1] === getArray()[i + 2])
                winner = getArray()[i];
        }
        // In search of a column match
        for (let j = 0; j < 3; j++) {
            if (getArray()[j] === getArray()[j + 3] && getArray()[j + 3] === getArray()[j + 6])
                winner = getArray()[j]; 
        }
        // In search of a diagonal match 
        if (getArray()[0] === getArray()[4] && getArray()[4] === getArray()[8])
            winner = getArray()[0]; 
        if (getArray()[6] === getArray()[4] && getArray()[4] === getArray()[2])
            winner = getArray()[6];

        // Then
        if (winner === user.getChoice()) {
            user.setScore(user.getScore() + 1);
            setRound(getRound() + 1);
            displayWinner(user);
            return true
        } else if (winner === bot.getChoice()) {
            bot.setScore(bot.getScore() + 1);
            setRound(getRound() + 1);
            displayWinner(bot); 
            return true
        } else {
            // Was it a draw? 
            let alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
            if (!getArray().some(element => alphabet.includes(element))) {
                setRound(getRound() + 1);
                displayWinner(null); 
                return true;
            }
        }
        // Else 
        return false;
    };

    const resetBoard = ((pieces) => {
        const alphabet = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i'];
        for (let i = 0; i < 9; i++) {
            setArray(i, alphabet[i]);
        }
        Array.from(pieces).forEach((item) => {
            item.textContent = '';
        });
    });

    return {
        getRound,
        setRound,
        getUser, 
        getBot,
        getArray, 
        setArray,
        displayWinner, 
        turnToComputer,
        displayPiece, 
        isPositionAvailable, 
        searchForWinner,
        resetBoard
    };
})(); 
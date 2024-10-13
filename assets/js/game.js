let betAmount = 0;
let multiplier = 1.0;
let isRunning = false;
let crashPoint = 0;
let gameInterval;
let crashHistory = [];
let hasCashedOut = false; // To track if the player has cashed out
let currentBalance = 100; // Starting balance

// Provably fair - Using hash functions (simple example)
function generateCrashPoint() {
    const randomNumber = Math.random();
    return (1.0 / (1 - randomNumber)).toFixed(2);
}

document.getElementById('placeBet').addEventListener('click', function() {
    betAmount = parseFloat(document.getElementById('betAmount').value);
    if (betAmount > 0 && !isRunning && betAmount <= currentBalance) {
        currentBalance -= betAmount; // Decrement balance by the bet amount
        updateBalanceDisplay(currentBalance); // Animate balance display
        crashPoint = generateCrashPoint(); // Generate crash point once per round
        isRunning = true;
        hasCashedOut = false; // Reset cash-out flag for the new game
        document.getElementById('cashOut').disabled = false;
        startGame();
    } else if (betAmount > currentBalance) {
        alert("You cannot bet more than your current balance.");
    }
});

document.getElementById('cashOut').addEventListener('click', function() {
    if (isRunning && !hasCashedOut) {
        cashOut();
    }
});

// New Testing Functionality
document.getElementById('testCrash').addEventListener('click', function() {
    for (let i = 0; i < 10; i++) {
        const fakeCrashValue = (Math.random() * 200).toFixed(2); // Generate crash values for testing
        updateCrashHistory(fakeCrashValue);
    }
});

function startGame() {
    document.getElementById('result').textContent = '';
    multiplier = 1.00;
    let increment = 0.01; // Starting increment value

    gameInterval = setInterval(() => {
        if (multiplier >= crashPoint) {
            crashGame();
        } else {
            multiplier = (parseFloat(multiplier) + increment).toFixed(2);
            document.getElementById('multiplier').textContent = `Multiplier: x${multiplier}`;

            // Adjust the increment based on the current multiplier
            increment = 0.01 * Math.pow(1.2, multiplier - 1); // Exponential growth of increment

            // Optionally, cap the increment to prevent it from getting too large
            if (increment > 0.5) {
                increment = 0.5; // Maximum increment per tick
            }
        }
    }, 100); // Fixed update interval
}

function cashOut() {
    const winnings = betAmount * multiplier;
    currentBalance += winnings; // Increment balance by winnings
    document.getElementById('result').textContent = `You cashed out at x${multiplier}! You won $${winnings.toFixed(2)}`;
    updateBalanceDisplay(currentBalance); // Animate balance display
    document.getElementById('cashOut').disabled = true; // Disable cash out after first use
    hasCashedOut = true; // Mark that the player has cashed out
}

function crashGame() {
    clearInterval(gameInterval);
    // Ensure the crash point is displayed correctly
    document.getElementById('result').textContent = `Game crashed at x${crashPoint}!`;
    updateCrashHistory(crashPoint); // Record the actual crash point
    resetGame();
}

function resetGame() {
    isRunning = false;
    document.getElementById('cashOut').disabled = true;
}

function updateCrashHistory(crashPoint) {
    crashHistory.unshift(crashPoint);
    if (crashHistory.length > 10) {
        crashHistory.pop();
    }
    
    const crashHistoryBar = document.getElementById('crashHistoryBar');
    crashHistoryBar.innerHTML = ''; 

    crashHistory.forEach(crash => {
        const crashElement = document.createElement('div');
        crashElement.textContent = `${crash}x`;
        crashElement.style.marginRight = '10px';
        crashElement.classList.add('crash-box'); // Add class for box styling

        const crashValue = parseFloat(crash);
        if (crashValue >= 1 && crashValue < 2) {
            crashElement.style.backgroundColor = 'lightgrey'; // Light grey fill
            crashElement.style.color = 'white'; // White text
            crashElement.classList.add('lightgrey-glow'); // Add glow class for light grey
        } else if (crashValue >= 2 && crashValue <= 20) {
            crashElement.style.backgroundColor = 'lightgreen'; // Light green fill
            crashElement.style.color = 'white'; // White text
            crashElement.classList.add('green-glow'); // Add glow class for green
        } else if (crashValue > 20 && crashValue <= 100) {
            crashElement.style.backgroundColor = 'gold'; // Gold fill
            crashElement.style.color = 'red'; // Red text
            crashElement.classList.add('gold-glow'); // Add glow class for gold
        } else if (crashValue > 100) {
            crashElement.style.backgroundColor = 'black'; // Black fill
            crashElement.style.color = 'black'; // Black text
            crashElement.classList.add('rainbow-glow'); // Add glow class for rainbow
        }

        crashHistoryBar.appendChild(crashElement);
    });
}

function updateBalanceDisplay(newBalance) {
    const balanceElement = document.getElementById('currentBalance');
    const previousBalance = parseFloat(balanceElement.textContent);
    const duration = 1000; // Duration of the counting animation in milliseconds
    const frames = 60; // Number of frames for the animation
    const increment = (newBalance - previousBalance) / frames; // Amount to change per frame
    let currentBalance = previousBalance; // Start counting from previous balance
    const intervalTime = duration / frames; // Time between each frame

    // Clear previous animations
    balanceElement.classList.remove('balance-increase', 'balance-decrease');

    // Function to perform the counting animation
    const countInterval = setInterval(() => {
        currentBalance += increment;

        // Stop counting when it reaches the new balance
        if ((increment > 0 && currentBalance >= newBalance) || (increment < 0 && currentBalance <= newBalance)) {
            currentBalance = newBalance; // Set to the exact new balance
            clearInterval(countInterval); // Stop the animation
        }

        // Update the balance display
        balanceElement.textContent = currentBalance.toFixed(2);

        // Add glow class based on increase or decrease and remove it after the animation
        if (increment > 0) {
            balanceElement.classList.add('balance-increase');
        } else {
            balanceElement.classList.add('balance-decrease');
        }
    }, intervalTime);

    // Remove the glow classes after the animation is complete
    setTimeout(() => {
        balanceElement.classList.remove('balance-increase', 'balance-decrease');
    }, duration);
}

// Sparkle animation for values >100x
const style = document.createElement('style');
style.innerHTML = `
    @keyframes greenGlow {
        0% { background-color: lightgreen; }
        50% { background-color: darkgreen; }
        100% { background-color: lightgreen; }
    }

    @keyframes lightGreyGlow {
        0% { background-color: lightgrey; }
        100% { background-color: lightgrey; }
    }

    @keyframes goldGlow {
        0% { background-color: yellow; }
        50% { background-color: gold; }
        100% { background-color: yellow; }
    }

    @keyframes rainbowGlow {
        0% { background-color: red; }
        20% { background-color: orange; }
        40% { background-color: yellow; }
        60% { background-color: green; }
        80% { background-color: blue; }
        100% { background-color: violet; }
    }

    .green-glow {
        animation: greenGlow 1s infinite;
    }

    .lightgrey-glow {
        animation: lightGreyGlow 1s infinite; 
    }

    .gold-glow {
        animation: goldGlow 0.5s infinite;
    }

    .rainbow-glow {
        animation: rainbowGlow 0.3s infinite;
    }

    /* Box styling for crash history */
    .crash-box {
        border: 1px solid #ccc;
        padding: 5px;
        display: inline-block;
        min-width: 40px;
        text-align: center;
        border-radius: 5px;
        margin-bottom: 5px; /* Added spacing between boxes */
    }

    /* Balance animations */
    .balance-increase {
        animation: greenGlow 0.5s forwards; /* Play animation forwards */
    }

    .balance-decrease {
        animation: goldGlow 0.5s forwards; /* Play animation forwards */
    }
`;
document.head.appendChild(style);

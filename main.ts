let playerCards: Image[] = [];
let dealerCards: Image[] = [];
let playerTotal = 0;
let dealerTotal = 0;
let playerCardSprites: Sprite[] = [];
let dealerCardSprites: Sprite[] = [];
let gameStarted = false;

// Card Definitions (Placeholder Images)
const cardAce = assets.image`cardAce`; // Replace with actual asset reference
const cardKing = assets.image`cardKing`;
const cardQueen = assets.image`cardQueen`;
const cardJack = assets.image`cardJack`;
const card2 = assets.image`card2`;
const card3 = assets.image`card3`;
const card4 = assets.image`card4`;
const card5 = assets.image`card5`;
const card6 = assets.image`card6`;
const card7 = assets.image`card7`;
const card8 = assets.image`card8`;
const card9 = assets.image`card9`;
const card10 = assets.image`card10`;

// Array of Cards
const cards: { image: Image; value: number }[] = [
    { image: cardAce, value: 11 },
    { image: cardKing, value: 10 },
    { image: cardQueen, value: 10 },
    { image: cardJack, value: 10 },
    { image: card2, value: 2 },
    { image: card3, value: 3 },
    { image: card4, value: 4 },
    { image: card5, value: 5 },
    { image: card6, value: 6 },
    { image: card7, value: 7 },
    { image: card8, value: 8 },
    { image: card9, value: 9 },
    { image: card10, value: 10 },
];

// Function to get card value
function getCardValue(card: { image: Image; value: number }): number {
    return card.value;
}

// Function to generate a random username
function generateRandomUsername(): string {
    const playerNumber = Math.floor(Math.random() * 4) + 1; // Generates a number between 1 and 4
    return `Player ${playerNumber}`;
}

function generateRandomCode(): string {
    const randomCode: number = Math.floor(1000 + Math.random() * 9000); // Generates a number between 1000 and 9999
    return randomCode.toString(); // Convert to string for storage
}

function saveCodeToMultiplayerJson(code: string) {
    const jsonData = {
        code: code,
    };

    const jsonString = JSON.stringify(jsonData, null, 2);
    saveToFile("Multiplayer.json", jsonString);
}

function saveToFile(filename: string, data: string) {
    // Platform-specific file saving logic should go here
}

function startGame() {
    playerCards = [];
    dealerCards = [];
    playerTotal = 0;
    dealerTotal = 0;
    gameStarted = true;

    // Deal two cards to the player and dealer
    dealCardToPlayer();
    dealCardToPlayer();
    dealCardToDealer();
    dealCardToDealer();

    // Display totals
    showTotals();
}

function dealCardToPlayer() {
    let card = getRandomCard();
    playerCards.push(card.image);
    playerTotal += getCardValue(card);
    displayCards(playerCards, playerCardSprites, 10, 100); // Display player cards
}

function dealCardToDealer() {
    let card = getRandomCard();
    dealerCards.push(card.image);
    dealerTotal += getCardValue(card);
    displayCards(dealerCards, dealerCardSprites, 10, 30); // Display dealer cards
}

function getRandomCard(): { image: Image; value: number } {
    let cardIndex = Math.randomRange(0, cards.length - 1);
    return cards[cardIndex];
}

function displayCards(cards: Image[], spriteArray: Sprite[], x: number, y: number) {
    // Clear previous sprites
    for (let sprite of spriteArray) {
        sprite.destroy();
    }
    spriteArray.length = 0; // Reset the array to empty

    // Display new cards
    for (let i = 0; i < cards.length; i++) {
        if (cards[i]) { // Check if the card is not null
            let cardSprite = sprites.create(cards[i], SpriteKind.Player);
            cardSprite.setPosition(x + (i * 20), y);
            spriteArray.push(cardSprite); // Add to the sprite array
        }
    }
}

function showTotals() {
    game.splash("Player Total: " + playerTotal);
    game.splash("Dealer Total: " + dealerTotal);
}

// Controller events
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!gameStarted) {
        startGame();
    } else {
        dealCardToPlayer(); // Player hits
        showTotals();
        if (playerTotal > 21) {
            game.splash("Player Bust! Dealer Wins!");
            gameStarted = false; // Reset game
        }
    }
});

controller.B.onEvent(ControllerButtonEvent.Pressed, function () {
    if (gameStarted) {
        // Dealer's turn (simple AI)
        while (dealerTotal < 17) {
            dealCardToDealer();
        }
        showTotals();
        determineWinner();
    }
});

function determineWinner() {
    if (dealerTotal > 21 || playerTotal > dealerTotal) {
        game.splash("Player Wins!");
    } else if (playerTotal < dealerTotal) {
        game.splash("Dealer Wins!");
    } else {
        game.splash("It's a Tie!");
    }
}

// Multiplayer handling
function startMultiplayer() {
    let waitTime = randint(15, 35); // Random wait time between 15-35 seconds

    // Countdown loop to display remaining time
    for (let i = waitTime; i > 0; i--) {
        game.splash(`Waiting for players... ${i} seconds remaining`, 0)
        pause(150); // Pause for 1 second
    }

    // Generate and save the random 4-digit code after countdown
    const code = generateRandomCode();
    saveCodeToMultiplayerJson(code);
    game.splash("Players connected! Game starting...", 0)
}





// Call this function to start multiplayer mode
startMultiplayer();
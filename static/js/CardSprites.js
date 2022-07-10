
function ZeroPad(num, size) {
    var s = "000000000" + num;
    return s.substring(s.length - size);
}

function getCardName(value, suit) {
    let cardName = ""
    if (suit === "Back") {
        cardName = `Card_${suit}`
    } else {
        cardName = `Card_${ZeroPad(value, 2)}_${suit}`
    }
    return cardName;
}

function cardToSpriteFileName(card) {
    return getCardName(card.value, card.suit) + ".png";
}

function SpriteFileNameToCard(cardFileName) {
    // `Card_${ZeroPad(value, 2)}_${suit}.png   `
    const cardData = cardFileName.split("_");
    const value = cardData[1];
    const suit = cardData[2].split(".")[0];
    card = {"value" : parseInt(value), "suit" : suit}
    return card;
}


function indexToValue(index) {
    let value = (13 - (index % 13));
    return value;
}

function indexToSuit(index) {
    let suit = Math.floor(index / 13);
    let suitNameTable = [
        "Clubs", "Dimonds", "Hearts", "Spades", "Back"
    ]
    return suitNameTable[suit];
}

function randomInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function sortCardsByValue(a,b) {
    valueDiff = a.value - b.value;
    if(valueDiff == 0)
    {
        const suitA = a.suit.toLowerCase();
        const suitB = b.suit.toLowerCase();        
        let comparison = 0;
        if (suitA > suitB) {
          comparison = 1;
        } else if (suitA < suitB) {
          comparison = -1;
        }
        return comparison;
    }
    return valueDiff;
}

function CreateDeck() {
    let deck = []
    for (let i = 0; i < 52; i++) {
        let card = {"value" : indexToValue(i), "suit" : indexToSuit(i)}
        deck.push(card)
    }
    deck = shuffle(deck);
    return deck
}


function shuffle(array) {
    let currentIndex = array.length,  randomIndex;
  
    // While there remain elements to shuffle.
    while (currentIndex != 0) {
  
      // Pick a remaining element.
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;
  
      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }
  
    return array;
  }

function randomCards(n) {
 
    let hand = []
    for (let i = 0; i < n; i++) {
        index = randomInteger(0,deck.length-1)
        let card = deck[index];
        deck[index] = deck[deck.length-1];
        deck.pop();
        hand.push(card)
    }

    hand.sort(sortCardsByValue);
    return hand;
}





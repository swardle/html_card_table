
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

function getReverseOrder(t) {
	switch (t){
	case 1:
		return 4 // ace is 2nd weakest (like 4 was)
	case 2:
		return 3 // 2 is weakest (like 3 was)
	case 3:
		return 15 // strongest (like 2 was)
	case 4:
		return 14 // 2nd strongest (like ace was)
	}
	if (5 <= t && t <= 13) {
		return 18 - t; // 13 = 5 (3rd weakest), 5 = 13 (like king)
    }
	return 0
}

function getNormalOrder(t) {
	switch (t){
    case 1:
		return 14 // aces beats king
	case 2:
		return 15 // 2 beats 2 aces
	}
	if (3 <= t && t <= 13) {
		return t; // 13 = 5 (3rd weakest), 5 = 13 (like king)
    }
	return 0
}

function sortCardsByNormalOrder(a,b) {
    return sortCardsByValue(a,b,getNormalOrder);
}

function sortCardsByReverseOrder(a,b) {
    return sortCardsByValue(a,b,getReverseOrder);
}


function sortCardsByValue(a,b,sortorder) {
    valueDiff = sortorder(a.value) - sortorder(b.value);
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

    hand.sort(sortCardsByNormalOrder);
    return hand;
}


function DrawCardContainers(hands, numPlayer) {
    for (let player_index = 0; player_index < numPlayer; player_index++) {
        let cardpos = 0;
        let div = document.getElementById(`CardContainer${player_index}`);
        div.innerHTML = "";
        hands[player_index].sort(sortCardsByNormalOrder);
        for (const card of hands[player_index]) {                
            const str = `<img id="${cardToSpriteFileName(card)}" class="Cards" ` + 
                `src="img/${cardToSpriteFileName(card)}" ` +
                `style="transform: translate(${cardpos * 1.5}em, ${0}em);">`
            div.innerHTML += str;
            cardpos++;
        }
    }
}


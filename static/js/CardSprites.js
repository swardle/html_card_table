
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
    card = { "value": parseInt(value), "suit": suit }
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
    switch (t) {
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
    switch (t) {
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

function sortCardsByNormalOrder(a, b) {
    return sortCardsByValue(a, b, getNormalOrder);
}

function sortCardsByReverseOrder(a, b) {
    return sortCardsByValue(a, b, getReverseOrder);
}


function sortCardsByValue(a, b, sortorder) {
    valueDiff = sortorder(a.value) - sortorder(b.value);
    if (valueDiff == 0) {
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
        let card = { "value": indexToValue(i), "suit": indexToSuit(i) }
        deck.push(card)
    }
    deck = shuffle(deck);
    return deck
}


function shuffle(array) {
    let currentIndex = array.length, randomIndex;

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
        index = randomInteger(0, deck.length - 1)
        let card = deck[index];
        deck[index] = deck[deck.length - 1];
        deck.pop();
        hand.push(card)
    }

    hand.sort(sortCardsByNormalOrder);
    return hand;
}


function DrawCardContainers(hands) {
    let numPlayer = hands.length;
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

        const cards = document.querySelectorAll('.Cards');
        cards.forEach(item => {
            item.addEventListener('mousedown', pickup);
            item.addEventListener('touchstart', pickup);
        });

    }
}


let g_moving = null;
let g_old_target = null;
let g_moving_offset_x = 0;
let g_moving_offset_y = 0;

function getCardContainer(target) {
    let classes = target.classList;
    for (const c of classes) {
        if (c === "Cards") {
            return target.parentElement;
        }
        if (c === "CardContainer") {
            return target;
        }
    }
    return null;
}



function findDropTarget(event) {
    let target = null;
    if (event.clientX) {
        // mousemove
        target = { "x": event.clientX, "y": event.clientY }
    } else {
        // touchmove - assuming a single touchpoint
        target = { "x": event.changedTouches[0].clientX, "y": event.changedTouches[0].clientY }
    }

    const elements = document.querySelectorAll('.CardContainer');
    for (element of elements) {
        let rect = element.getBoundingClientRect();
        if (rect.left < target.x && rect.right > target.x &&
            rect.top < target.y && rect.bottom > target.y) {
            return element;
        }
    }
    return null;
}


function pickup(event) {
    console.log(`pickup event.target ${event.target.id}`)
    console.log(`pickup event.currentTarget ${event.currentTarget.id}`)
    g_moving = event.target;
    let g_moving_rect = g_moving.getBoundingClientRect();
    let event_x = 0;
    let event_y = 0;
    if (event.clientX) {
        // mousemove
        event_x = event.clientX;
        event_y = event.clientY;
    } else {
        // touchmove - assuming a single touchpoint
        event_x = event.changedTouches[0].clientX;
        event_y = event.changedTouches[0].clientY;
    }
    g_moving_offset_x = event_x - g_moving_rect.left;
    g_moving_offset_y = event_y - g_moving_rect.top;

    g_old_target = findDropTarget(event);

    let from_container = getCardContainer(g_moving);
    let from_container_id = from_container.id.replace("CardContainer", "");

    const n = card_containers[from_container_id].length;
    let hand = card_containers[from_container_id];
    // remove the card from the old container
    let card = hand[0];
    for (let i = 0; i < n; i++) {
        card = hand[i];
        if (cardToSpriteFileName(card) == g_moving.id) {
            hand.splice(i, 1);
            break;
        }
    }

    const elements = document.querySelectorAll('.CircularTable');
    for (e of elements) {
        const str = `<img id="${cardToSpriteFileName(card)}" class="Cards" ` +
        `src="img/${cardToSpriteFileName(card)}" ` +
        `position:fixed; left:${event_x - g_moving_offset_x}px;` +
        `top:${event_y - g_moving_offset_y}px; z-index: 1000;`;
        e.innerHTML += str;
        break;
    }

    const newcard = document.querySelector(`#${cardToSpriteFileName(card)}`);
    g_moving = newcard;
    event.preventDefault();
}

function move(event) {
    if (g_moving) {
        let event_x = 0;
        let event_y = 0;
        if (event.clientX) {
            // mousemove
            event_x = event.clientX;
            event_y = event.clientY;
        } else {
            // touchmove - assuming a single touchpoint
            event_x = event.changedTouches[0].clientX;
            event_y = event.changedTouches[0].clientY;
        }

        g_moving.style.cssText = `position:fixed; left:${event_x - g_moving_offset_x}px;` +
            `top:${event_y - g_moving_offset_y}px; z-index: 1000;`;
        let target = findDropTarget(event);

        const elements = document.querySelectorAll('.OverCardContainer');
        elements.forEach(element => {
            element.classList.remove("OverCardContainer");
        });

        if (target) {
            target.classList.add("OverCardContainer");
        }
        if (event.clientX) {
            event.preventDefault();
        }
    }
}

function drop(event, card_containers) {
    if (g_moving) {
        if (event.currentTarget.tagName !== 'HTML') {
            let target = findDropTarget(event, event);
            if (target === null) {
                target = g_old_target;
            }
            let target_container = target;
            let from_container = getCardContainer(g_moving);
            console.log(`dropped = ${g_moving.id} on ${target_container.id} from ${from_container.id}`)
            let target_container_id = target_container.id.replace("CardContainer", "");
            let from_container_id = from_container.id.replace("CardContainer", "");

            const n = card_containers[from_container_id].length;
            let hand = card_containers[from_container_id];
            // remove the card from the old container
            for (let i = 0; i < n; i++) {
                const card = hand[i];
                if (cardToSpriteFileName(card) == g_moving.id) {
                    hand.splice(i, 1);
                    break;
                }
            }

            // add the card to target_container
            hand = card_containers[target_container_id];
            // sort the and position cards
            hand.push(SpriteFileNameToCard(g_moving.id));
            DrawCardContainers(card_containers)
            const elements = document.querySelectorAll('.OverCardContainer');
            elements.forEach(element => {
                element.classList.remove("OverCardContainer");
            });

        }
        g_moving = null;
    }
}


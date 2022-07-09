function makeRequest(method, url) {
    return new Promise(function (resolve, reject) {
        let xhr = new XMLHttpRequest();
        xhr.open(method, url);
        xhr.onload = function () {
            if (this.status >= 200 && this.status < 300) {
                resolve(xhr.response);
            } else {
                reject({
                    status: this.status,
                    statusText: xhr.statusText
                });
            }
        };
        xhr.onerror = function () {
            reject({
                status: this.status,
                statusText: xhr.statusText
            });
        };
        xhr.send();
    });
}

function getImageMeta(url) {
    return new Promise((resolve, reject) => {
        let img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => reject();
        img.src = url;
    });
}

function addStyle(css) {
    head = document.head || document.getElementsByTagName('head')[0],
        style = document.createElement('style');

    head.appendChild(style);
    style.appendChild(document.createTextNode(css));
}

function ZeroPad(num, size) {
    var s = "000000000" + num;
    return s.substr(s.length - size);
}

function getCardName(value, suit) {
    let cardName = ""
    if (suit === "Back") {
        cardName = "Card" + suit
    } else {
        cardName = "Card" + ZeroPad(value, 2) + suit
    }
    return cardName;
}

function cardToSpriteName(card) {
    return getCardName(card.value, card.suit)
}

function indexToValue(index) {
    let value = (13 - (index % 13)) + 1;
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

function randomCards(n) {
    deck = []
    for (let i = 0; i < 52; i++) {
        let card = {"value" : indexToValue(i), "suit" : indexToSuit(i)}
        deck.push(card)
    }

    hand = []
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


async function addCardSprites(mode = "") {
    const img = await getImageMeta("img/export_cards.png");
    const width = img.width;
    const height = img.height;
    var divs = document.getElementsByClassName('CardContainer');

    // await code here
    const data = await makeRequest("GET", "img/export_cards.json");
    const sprites = JSON.parse(data).TextureImporter.spriteSheet.sprites
    let i = 0;
    let x_pos = 0;
    let y_pos = 0;
    for (const sprite of sprites) {
        let h = sprite.rect.height;
        let w = sprite.rect.width;
        let x = -sprite.rect.x;
        let y = -(height - sprite.rect.y - sprite.rect.height);
        let index = i != 0 ? i - 1 : sprites.length - 1;
        let value = indexToValue(index);
        let suit = indexToSuit(index);
        let cardName = getCardName(value, suit)
        let str = "#" + cardName + " {"
        str += "    width: "+w+"px;"; 
        str += "    height: "+h+"px;";
        str += "    background-image: url('img/export_cards.png');";
        str += "    background-position: " + x + "px " + y + "px ;";

        str += "}"
        addStyle(str)
        if (mode == "addtodiv") {
            console.log(str)

            for (const div of divs) {
                let str = `<img id="${cardName}" class="Cards" src="img/img_trans.gif"  width="1" height="1" >`;
                if (i % 13 == 0) {
                    x_pos = 0;
                    y_pos++;
                    str += '<br style="clear: both;">'
                }
                div.innerHTML += str;
            }
        }
        i++;
        x_pos++;
    }
}




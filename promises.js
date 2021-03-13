const numbers_URL = 'http://numbersapi.com';
const card_URL = 'https://deckofcardsapi.com/api/deck';
const pokemon_URL = 'https://pokeapi.co/api/v2/pokemon';
const num1 = document.getElementById("number-fact-1");
const num2 = document.getElementById("number-fact-2");
const num3 = document.getElementById("number-fact-3");
const cardDiv = document.getElementById("card-draw");
const drawButton = document.getElementById("draw-button");
const pokemonButton = document.getElementById("pokemon-button");
const pokemonDiv = document.getElementById("three-pokemon")
let displayDeck;

axios
    .get(`${numbers_URL}/14?json`)
    .then(res => num1.innerHTML = `<p>${res.data.text}</p>`)
    .catch(err => {
        console.log(err);
        num1.innerHTML = '<p>There was an error.</p>';
    });

axios
    .get(`${numbers_URL}/6,8,43,52?json`)
    .then(res => {
        for (num of [6, 8, 43, 52]) {
            num2.innerHTML += `<p>${res.data[num]}</p>`;
        }
    })
    .catch(err => {
        console.log(err);
        num2.innerHTML = '<p>There was an error.</p>';
    });

axios
    .get(`${numbers_URL}/14?json`)
    .then(res => {
        num3.innerHTML += `<p>${res.data.text}</p>`;
        return axios.get(`${numbers_URL}/14?json`);
    })
    .then(res => {
        num3.innerHTML += `<p>${res.data.text}</p>`;
        return axios.get(`${numbers_URL}/14?json`);
    })    
    .then(res => {
        num3.innerHTML += `<p>${res.data.text}</p>`;
        return axios.get(`${numbers_URL}/14?json`);
    })    
    .then(res => {
        num3.innerHTML += `<p>${res.data.text}</p>`;
    })
    .catch(err => {
        console.log(err);
        num3.innerHTML = '<p>There was an error.</p>';
    });

axios
    .get(`${card_URL}/new/draw/?count=1`)
    .then(res => {
        const card = res.data.cards[0];
        console.log("Deck of Cards #1:")
        console.log(`${card.value} of ${card.suit}`)
    })
    .catch(err => {
        console.log(err);
    })

let card1, card2, deckNum;
axios
    .get(`${card_URL}/new/draw/?count=1`)
    .then(res => {
        card1 = res.data.cards[0];
        deckNum = res.data.deck_id;
        
        return axios.get(`${card_URL}/${deckNum}/draw/?count=1`)
    })
    .then(res => {
        card2 = res.data.cards[0];
        console.log("Deck of Cards #2:")
        console.log(`${card1.value} of ${card1.suit}`)
        console.log(`${card2.value} of ${card2.suit}`)
    })
    .catch(err => {
        console.log(err);
    })

drawButton.addEventListener('click', e => {
    axios
        .get(`${card_URL}/${displayDeck}/draw/?count=1`)
        .then(res => {
            let deg = (Math.random() - .5)*45
            const cardImg = res.data.cards[0].image;
            cardDiv.innerHTML += `<img 
                                class="card" 
                                style="transform:rotate(${deg}deg);"
                                src="${cardImg}">`;
        })
        .catch(err => {
            console.log(err);
        })
})

pokemonButton.addEventListener('click', e => {
    axios
        .get(`${pokemon_URL}`)
        .then(res => {
            let numPokemon = res.data.count;
            console.log(numPokemon);
            return axios.get(`${pokemon_URL}?limit=${numPokemon}`);
        })
        .then(res => {
            let allPokemon = res.data.results;
            for (let i=0; i < 3; i++) {
                let randPick = Math.floor(Math.random()*1118);
                post_info(allPokemon[randPick])
            }
        })
        .catch(err => {
            console.log(err);
        })
})

let description;
function post_info(pokemon) {
    let name = pokemon.name;
    axios
        .get(pokemon.url)
        .then(res => {
            return axios.get(res.data.species.url);
        })
        .then(res => {
            entries = res.data.flavor_text_entries
            for (entry of entries) {
                if (entry.language.name == 'en') {
                    description = entry.flavor_text;
                    break;
                }
            }
            pokemonDiv.innerHTML += `<h3>${name}</h3>
                                    <p>${description}</p>`
        })
        .catch(err => {
            console.log(err);
        })
}

// create deck for card display on page load
axios
    .get('https://deckofcardsapi.com/api/deck/new/shuffle/')
    .then(res => {
        displayDeck = res.data.deck_id;
    })
    .catch(err => {
        console.log(err);
    });
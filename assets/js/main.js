get_best_movies();
load_categories();

function get_best_movies() {
    fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7")
    .then(function(res) {
        return res.json();
    })
    .then(function(json) {
        json.results.forEach(movie => {
            if (document.querySelector("#bests > ul").childNodes.length < 7) {
                if (document.querySelector("#bests > ul").childNodes.length == 0) {
                    document.querySelector("#best > img").src = movie.image_url;
                    document.querySelector("#best > div > h1").innerHTML = movie.title;
                    document.querySelector("#best > div > button").value = movie.url;
                }
                add_movie(movie, document.querySelector("#bests > ul"))
            }
        })
    })
}

function mask_modal() {
    document.querySelector("#modal").style.display = "none";
}

window.onclick = function(event) {
    if (event.target == document.querySelector("#modal")) {
        document.querySelector("#modal").style.display = "none";
    }
}

function view_modal(object) {
    fetch(object.value)
        .then(function(res) {
            return res.json();
        })
        .then(function(json) {
            document.querySelector("#modal > div > img").src = json.image_url
            document.querySelector("#modal > div > h1").innerHTML = json.title
            document.querySelector("#modal > div > div:nth-child(4)").innerHTML = "Genre: " + json.genres[0]
            document.querySelector("#modal > div > div:nth-child(5)").innerHTML = "Date de sortie: " + json.date_published
            document.querySelector("#modal > div > div:nth-child(6)").innerHTML = "Note moyenne: " + json.rated
            document.querySelector("#modal > div > div:nth-child(7)").innerHTML = "Note LMDB: " + json.imdb_score
            document.querySelector("#modal > div > div:nth-child(8)").innerHTML = "Réalisateur: " + json.directors[0]
            json.actors.forEach(actor => {
                var li = document.createElement("li");
                li.innerHTML = actor;
                document.querySelector("#modal > div > div:nth-child(9) > ul").appendChild(li)
            });
            document.querySelector("#modal > div > div:nth-child(10)").innerHTML = "Durée: " + json.duration + " minutes"
            document.querySelector("#modal > div > div:nth-child(11)").innerHTML = "Pays" + json.countries[0]
            document.querySelector("#modal > div > div:nth-child(12)").innerHTML = "c'est quoi??"
            document.querySelector("#modal > div > div:nth-child(13)").innerHTML = "Description: " + json.long_description
            document.querySelector("#modal").style.display = "block";
        })
}

function add_movie(movie, selector) {
    let li = document.createElement("li");
    let img = document.createElement("img");
    let title = document.createElement("h1");
    let button = document.createElement("button");
    img.src = movie.image_url;
    img.alt = "Affiche de " + movie.title
    title.innerHTML = movie.title;
    button.value = movie.url;
    button.setAttribute("onclick", "view_modal(this)");
    button.innerHTML = "Voir le film";
    li.appendChild(img);
    li.appendChild(title);
    li.appendChild(button);
    selector.appendChild(li);
}

function load_categories() {
    categories = [
        {
            "name": "action",
            "selector": document.querySelector("#action > ul"),
            "movies": []
        },
        {
            "name": "horror",
            "selector": document.querySelector("#horror > ul"),
            "movies": []
        },
        {
            "name": "war",
            "selector": document.querySelector("#war > ul"),
            "movies": []
        }
    ]
    categories.forEach(categorie => {
        fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page_size=7&genre_contains=" + categorie.name)
        .then(function(res) {
            return res.json();
        })
        .then(function(json) {
            json.results.forEach(movie => {
                categorie.movies.push(movie)
                if (categorie.selector.childNodes.length < 7) {
                    add_movie(movie, categorie.selector)
                }
            })
        })
    });
}
let httpClient = new XMLHttpRequest();
let categories;
let best_movies = [];

get_best_movies();
load_categories();

function get_best_movies() {
    for (i=1; i<3; i++) {
        fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&page=" + i)
        .then(function(res) {
            return res.json();
        })
        .then(function(json) {
            json.results.forEach(movie => {
                best_movies.push(movie)
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
    let http = new XMLHttpRequest();
    http.onreadystatechange = function() {
        if (http.readyState === XMLHttpRequest.DONE) {
            if (http.status === 200) {
                let json_result = JSON.parse(http.responseText);
                document.querySelector("#modal > div > img").src = json_result.image_url
                document.querySelector("#modal > div > h1").innerHTML = json_result.title
                document.querySelector("#modal > div > div:nth-child(5)").innerHTML = "Date de sortie: " + json_result.date_published
                document.querySelector("#modal > div > div:nth-child(6)").innerHTML = "Note moyenne: " + json_result.rated
                document.querySelector("#modal > div > div:nth-child(7)").innerHTML = "Note LMDB: " + json_result.imdb_score
                document.querySelector("#modal > div > div:nth-child(8)").innerHTML = "Réalisateur: " + json_result.directors[0]
                json_result.actors.forEach(actor => {
                    var li = document.createElement("li");
                    li.innerHTML = actor;
                    document.querySelector("#modal > div > div:nth-child(9) > ul").appendChild(li)
                });
                document.querySelector("#modal > div > div:nth-child(10)").innerHTML = "Durée: " + json_result.duration + " minutes"
                document.querySelector("#modal > div > div:nth-child(11)").innerHTML = "Pays" + json_result.countries[0]
                document.querySelector("#modal > div > div:nth-child(12)").innerHTML = "c'est quoi??"
                document.querySelector("#modal > div > div:nth-child(13)").innerHTML = "Description: " + json_result.long_description
            } else {
                alert('Il y a eu un problème avec la requête.');
            }
        }
        document.querySelector("#modal").style.display = "block";
    };
    http.open("GET", object.value);
    http.send();
}

function show_best_movies(movies) {
    let ul = document.querySelector("body > section.carousel > ul")
    for (i=0; i<5; i++) {
        add_movie(movies.results[i], ul);
    }
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
        for (i=1; i<3; i++) {
            fetch("http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score&genre_contains=" + categorie.name + "&page=" + i)
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
        }
    });
}
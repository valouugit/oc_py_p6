let httpClient = new XMLHttpRequest();

httpClient.onreadystatechange = best_movie;
httpClient.open("GET", "http://127.0.0.1:8000/api/v1/titles/?sort_by=-imdb_score");
httpClient.send();

function best_movie() {
    if (httpClient.readyState === XMLHttpRequest.DONE) {
        if (httpClient.status === 200) {
            let json_result = JSON.parse(httpClient.responseText).results[0];
            document.querySelector("#best > img").src = json_result.image_url;
            document.querySelector("#best > div > h1").innerHTML = json_result.title;
            document.querySelector("#best > div > button").value = json_result.url;
            show_best_movies(JSON.parse(httpClient.responseText));
        } else {
        alert('Il y a eu un problème avec la requête.');
        }
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
    console.log(object.value);
    http.open("GET", object.value);
    http.send();
}

function show_best_movies(movies) {
    let ul = document.querySelector("body > section.carousel > ul")
    for (i=0; i<7; i++) {
        let li = document.createElement("li");
        let img = document.createElement("img");
        let title = document.createElement("h1");
        let button = document.createElement("button");
        img.src = movies.results[i].image_url;
        title.innerHTML = movies.results[i].title;
        button.value = movies.results[i].url;
        button.setAttribute("onclick", "view_modal(this)");
        button.innerHTML = "Voir le film";
        li.appendChild(img);
        li.appendChild(title);
        li.appendChild(button);
        ul.appendChild(li);
    }
}
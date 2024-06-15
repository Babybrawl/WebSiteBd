// Fonction pour récupérer tous les films
async function getAllMovies() {
    const response = await fetch('/api/movies');  // Utilisez une URL relative
    const movies = await response.json();
    console.log("Liste de tous les films :", movies);
    return movies;
  }
  
  // Fonction pour récupérer un film par son titre
  async function getMovieByTitle(title) {
    const movies = await getAllMovies();
    let foundMovie;
  
    movies.forEach(movie => {
      if (movie.titre === title) {
        foundMovie = movie;
      }
    });
  
    console.log(`Film avec le titre ${title} :`, foundMovie);
    return foundMovie;
  }
  
  // Fonction pour récupérer un film par son index
  async function getMovieByIndex(index) {
    const movies = await getAllMovies();
    const movie = movies[index];
    console.log(`Film à l'index ${index} :`, movie);
    return movie;
  }
  
  // Fonction pour récupérer les films par tag
  async function getMoviesByTag(tag) {
    const movies = await getAllMovies();
    const moviesWithTag = movies.filter(movie => movie.tag === tag);
    console.log(`Films avec le tag ${tag} :`, moviesWithTag);
    return moviesWithTag;
  }
  
  console.log("Début du script");
  
  getMovieByTitle("Fast and Furious").then(movie => {
    //alert(movie.link);
  });
  


/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

array = [];
var click = 0;
var click3 = 0;
var clickTag = 0;
localStorage.setItem("tagDef", 0);

async function videoView(x, y, z, w, episode, saison) {
    try {
        // Set items in localStorage
        localStorage.setItem("videoTitre", x);

        // Increment trending count for the movie's tag
        incrementTagPopularity(w);

        // Set items in localStorage using the retrieved movie details
        localStorage.setItem("videoSRC", y);
        localStorage.setItem("videoDesc", z);
        localStorage.setItem("episode", episode);
        localStorage.setItem("saison", saison)

        // Afficher les points du tag dans une alerte
        const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
        const points = tagPopularityData[w] || 0; // Nombre de points, par défaut à 0 si non trouvé
        //alert(`Le tag "${w}" a maintenant ${points} points.`);

        // Retrieve LastVideo array from localStorage and parse it
        let array = JSON.parse(localStorage.getItem("LastVideo")) || [];

        // Remove null or undefined values from the array
        array = array.filter((value) => value !== null && value !== undefined);

        // Check if the video title (y) already exists in the array
        const existingIndex = array.indexOf(x);
        if (existingIndex !== -1) {
            // Remove the existing title from the array
            array.splice(existingIndex, 1);
        }

        // Add the current video title to the beginning of the array
        array.unshift(localStorage.getItem("videoTitre"));

        // Convert the array to a JSON string and store it in localStorage
        const arrayObject = JSON.stringify(array);
        localStorage.setItem("LastVideo", arrayObject);
    } catch (error) {
        console.error("Une erreur s'est produite dans videoView :", error);
        alert("Erreur: " + error.message);  // Afficher le message d'erreur
    }
}

async function displayTrendingMovies() {
    try {
        // Retrieve tag popularity data from localStorage
        const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};

        // Sort the tag popularity data by count
        const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);

        // Display top trending movies for each tag
        for (let index = 0; index < sortedTags.length; index++) {
            const tag = sortedTags[index];
            let movies = await getMoviesByTag(tag);

            // If there are not enough movies for this tag, fill with movies from the next tag
            if (movies.length < 2 && index < sortedTags.length - 1) {
                const nextTag = sortedTags[index + 1];
                const additionalMovies = await getMoviesByTag(nextTag);
                movies = movies.concat(additionalMovies.slice(0, 2 - movies.length));
            }

            // Select 2 random movies from the retrieved list, or all if less than 2 available
            const randomMovies = [];
            const numMovies = Math.min(movies.length, 2);
            while (randomMovies.length < numMovies && movies.length > 0) {
                const randomIndex = Math.floor(Math.random() * movies.length);
                const selectedMovie = movies.splice(randomIndex, 1)[0]; // Remove the selected movie from the array
                randomMovies.push(selectedMovie);
            }

            // Display the selected movies in the Trending section
            randomMovies.forEach((movie, movieIndex) => {
                const trendDiv = document.getElementById(`trend${index * 2 + movieIndex + 1}`);
                trendDiv.innerHTML = ''; // Clear existing content

                const newLink = document.createElement("a");
                const newImage = document.createElement("img");

                newLink.href = "html/viewVideo.html";
                newLink.className = "film";
                newLink.dataset.tag = movie.tag;

                // Use closure to capture current movie
                newLink.onclick = function () {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                };

                newImage.src = movie.image;
                newImage.style.width = "100%";
                newImage.style.height = "100%";
                newImage.style.borderRadius = "15px";

                newLink.appendChild(newImage);
                trendDiv.appendChild(newLink);
            });
        }
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction displayTrendingMovies :", error.message);
    }
}




async function start(){
    try{
        const movie = await getMovieByTitle(localStorage.getItem("videoTitre"));
        document.getElementById('video').src = localStorage.getItem("videoSRC");
        document.getElementById('titre').innerHTML = localStorage.getItem("videoTitre");
        document.getElementById('desc').innerHTML = localStorage.getItem("videoDesc");
        
        if(document.getElementById("serie").options.length <= 0){
            if (localStorage.getItem("episode") > 0) {
                const resultat = parseInt(localStorage.getItem("episode")); // Convertir en nombre entier
                const res = suite(resultat);
                for (let i = 0; i < res.length; i++) {
                    const option = document.createElement("option");
                    option.text = res[i]; // Accéder à chaque élément du tableau
                    document.getElementById("serie").appendChild(option);
                }
            }
        }

        if(document.getElementById("saison").options.length <= 0){
            if (localStorage.getItem("saison") > 0) {
                const resultat = parseInt(localStorage.getItem("saison")); // Convertir en nombre entier
                const res = suite(resultat);
                for (let i = 0; i < res.length; i++) {
                    const option = document.createElement("option");
                    option.text = "saison" + res[i]; // Accéder à chaque élément du tableau
                    document.getElementById("saison").appendChild(option);
                }
            }
        }

        if(document.getElementById("serie").options.length != 0){
            document.getElementById("serie").style.visibility = "visible";
            document.getElementById("saison").style.visibility = "visible";
            document.getElementById("saison").selectedIndex = parseInt(localStorage.getItem(localStorage.getItem("videoTitre") + "NumberSaison")) - 1;
            document.getElementById("serie").selectedIndex = parseInt(localStorage.getItem(localStorage.getItem("videoTitre") + "NumberEpisode")) - 1;
            const ep = parseInt(localStorage.getItem(localStorage.getItem("videoTitre") + "NumberEpisode"));
            const sais = parseInt(localStorage.getItem(localStorage.getItem("videoTitre") + "NumberSaison"));
            if(sais == 1){
                if(ep == 1){
                    document.getElementById('video').src = movie["link"];
                }else{
                    document.getElementById('video').src = movie["link" + ep];
                }
            }else{
                if(ep == 1){
                    document.getElementById('video').src = movie[sais + "link"];
                }else{
                    document.getElementById('video').src = movie[sais + "link" + ep];
                }
            }
        }else{
            document.getElementById("serie").style.visibility = "hidden";
            document.getElementById("saison").style.visibility = "hidden";
        }
        const url = 'file:///E:/Streaming/Streaming/Streaming/html/viewVideo.html/proxy?url=https://moacloud.com/';

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Réponse réseau incorrecte');
                }
                return response.text();
            })
            .then(data => {
                // Manipulez les données récupérées ici
                console.log(data);
            })
            .catch(error => {
                console.error('Erreur lors de la récupération des données:', error);
            });

            setTimeout(go(), 3000);

    } catch (error) {
        console.error("Une erreur s'est produite dans start2 :", error);
    }
    
}

async function start2() {
    try {
        localStorage.setItem("ExploreTag", "rien");
        localStorage.setItem("tagDef", "none");
        displayTrendingMovies();
        for (let y = 0; y <= 4; y++) {
            const movie = await getMovieByIndex(y);
            const NewLink = document.createElement("a");
            const NewImage = document.createElement("img");

            NewLink.href = "html/viewVideo.html";
            NewLink.dataset.tag = movie.tag;
            NewLink.className = "film";
            NewLink.id = movie.titre;

            // Utilisez une fonction immédiate (IIFE) pour capturer la valeur actuelle de y
            (function (currentMovie) {
                NewLink.onclick = function () {
                    videoView(currentMovie.titre, currentMovie.link, currentMovie.description, currentMovie.tag, currentMovie.episode, currentMovie.saison);
                };
            })(movie);

            NewImage.id = "img" + y;
            NewImage.src = movie.image;

            document.getElementById("news" + y).appendChild(NewLink);
            NewLink.appendChild(NewImage);

            if (y === 3) {
                var lastVideoData = localStorage.getItem("LastVideo");

                if (lastVideoData) {
                    const LastArray = JSON.parse(localStorage.getItem("LastVideo"));

                    for (var i = 1; i <= 4; i++) {
                        const elementId = "a" + i;
                        const imgId = "img" + i;

                        const lastMovie = await getMovieByTitle(LastArray[i - 1]);

                        document.getElementById(imgId).src = lastMovie.image;
                        const linkElement = document.getElementById(elementId);
                        linkElement.style.visibility = "visible";
                        linkElement.dataset.tag = lastMovie.tag;

                        // Utilisez une fonction immédiate (IIFE) pour capturer la valeur actuelle de i
                        (async function (index) {
                            const movie = await getMovieByTitle(LastArray[index - 1]);
                            document.getElementById(elementId).onclick = function () {
                                videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                            };
                        })(i);
                    }
                    displayPopularTags();
                } else {
                    document.getElementById("ul_continue").style.display = "none";
                }
            }
        }
        
    } catch (error) {
        console.error("Une erreur s'est produite dans start2 :", error);
    }
}



function clear2(){
        localStorage.clear("LastVideo");
        array = [];
        arrayObject = "";
        document.getElementById("LastVideo").innerHTML = localStorage.getItem("LastVideo");
}

async function search() {
    try {
        var searchTerm = document.getElementById("search_bar").value.toLowerCase();
        var selectedTag = localStorage.getItem("tagDef"); // Récupérer le tag sélectionné
        
        var parentDiv = document.getElementById("recherche");
        
        if (searchTerm === "" && selectedTag === "none") {
            parentDiv.style.display = "none";
            return; // Exit early if both search term and tag are empty
        } else {
            parentDiv.style.display = "block";
        }

        // Fetch movies from the API
        const movies = await getAllMovies();

        // Clear previous search results
        parentDiv.innerHTML = '';

        // Iterate through the fetched movies and create elements to display them
        movies.forEach(movie => {
            if ((searchTerm === "" || movie.titre.toLowerCase().includes(searchTerm)) && (selectedTag === "none" || movie.tag === selectedTag)) {
                
                var nouvelleDiv = document.createElement("div");
                var nouvelleimage = document.createElement("img");
                var nouveauxLink = document.createElement("a");

                nouvelleDiv.className = "movie-card";
                nouvelleDiv.style.display = "block";
                nouvelleDiv.style.position = "relative";
                nouvelleDiv.style.overflowY = "hidden";
                nouvelleimage.src = movie.image;
                nouvelleimage.style.width = "100%";
                nouvelleDiv.style.height = "200px";
                nouvelleDiv.style.marginTop = "10px";
                nouveauxLink.href = "html/viewVideo.html";
                nouveauxLink.dataset.tag = movie.tag;

                // Use a closure to capture the current movie
                nouveauxLink.onclick = function () {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                };

                nouveauxLink.appendChild(nouvelleimage);
                nouvelleDiv.appendChild(nouveauxLink);
                parentDiv.appendChild(nouvelleDiv);
            }
        });

    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction search :", error);
        alert("Erreur: " + error.message);
    }
}

function searchCategories() {
    if (clickTag == 0) {
        clickTag = 1;
        document.getElementById("rechercheTag").style.display = "block";
    } else {
        clickTag = 0;
        document.getElementById("rechercheTag").style.display = "none";
    }
}

function searchTag(tag) {
    localStorage.setItem("tagDef", tag);
    document.getElementById("ButtonCategories").innerHTML = "Categories : " + tag; 
    
    search(); // Appeler la fonction search normalement
}


async function plus() {
    var jsp = JSON.parse(localStorage.getItem("LastVideo"));

    document.getElementById("ul_continue").style.overflowX = "auto";
    document.getElementById("ul_continue").style.overflowY = "hidden";
    document.getElementById("load_card").style.display = "none";
    
    const LastArray = JSON.parse(localStorage.getItem("LastVideo"));

    for (var i = 5; i <= 9; i++) { // Modification de la plage de la boucle
        const elementId = "a" + i;
        const imgId = "img" + i;

        const lastMovie = await getMovieByTitle(LastArray[i - 1]);

        var nouvelleDiv = document.createElement("div");
        var nouveauxLink = document.createElement("a");
        var nouveauxImg = document.createElement("img");

        nouvelleDiv.className = "movies_card"; // Correction de la classe
        nouveauxLink.href = "html/viewVideo.html";
        nouveauxLink.className = "film";
        nouveauxLink.id = "a" + i; // Modification de l'ID
        nouveauxLink.dataset.tag = lastMovie.tag;

        (function (index) {
            nouveauxLink.onclick = function () {
                videoView(lastMovie.titre, lastMovie.link, lastMovie.description, lastMovie.tag, lastMovie.episode, lastMovie.saison);
            };
        })(i); // Utilisation de la variable correcte

        nouveauxImg.src = lastMovie.image;
        nouveauxImg.id = "img";

        document.getElementById("ul_continue").appendChild(nouvelleDiv);
        nouvelleDiv.appendChild(nouveauxLink);
        nouveauxLink.appendChild(nouveauxImg);
    }
}

    
    
    

async function plus2() {
    try {
        // Fetch movies from MongoDB
        const movies = await getAllMovies();

        // Hide loading elements
        document.getElementById("ul_news").style.overflowX = "auto";
        document.getElementById("ul_news").style.overflowY = "hidden";
        document.getElementById("load_card_news").style.display = "none";
        document.querySelector("#ul_news .load_card").style.display = "none";

        // Iterate through movies and create HTML elements
        for (let i = 4; i < movies.length; i++) {
            const movie = movies[i];
            const nouvelleDiv = document.createElement("div");
            const nouveauxLink = document.createElement("a");
            const nouveauxImg = document.createElement("img");

            nouvelleDiv.className = "movies_card";
            nouvelleDiv.id = "news" + i;
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouveauxLink.id = movie._id; // Assuming MongoDB document has an "_id" field
            nouveauxLink.dataset.tag = movie.tag; // Assuming there's a "tag" field in your MongoDB document

            // Use a closure to capture the current movie
            (function (currentMovie) {
                nouveauxLink.onclick = function () {
                    videoView(currentMovie.titre, currentMovie.link, currentMovie.description, currentMovie.tag, currentMovie.episode, currentMovie.saison);
                };
            })(movie);

            nouveauxImg.src = movie.image; // Assuming there's an "image" field in your MongoDB document
            nouveauxImg.id = "img";

            document.getElementById("ul_news").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouveauxImg);
        }
    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction plus2 :", error);
        alert("Erreur: " + error.message);
    }
}

    
    async function plus_explore(tag) {
        try {
            for (var l = 4; l < 100; l++) {
                var element = document.getElementById("Explore" + l);
                if (element) {
                    element.remove(); // Supprimer l'élément s'il existe
                }
            }

            if(tag == localStorage.getItem("ExploreTag")){
                document.getElementById("ul_explore").style.display = "none";
                localStorage.setItem("ExploreTag", "rien");
            }else{
                // Récupérer les données de la base de données MongoDB pour le tag spécifié
                const movies = await getMoviesByTag(tag);
                localStorage.setItem("ExploreTag", tag);
                
                document.getElementById("ul_explore").style.display = "flex";

                // Supprimer tous les enfants des div Explore existantes
                for (var i = 0; i < 4; i++) {
                    var ExploreDiv = document.getElementById("Explore" + i);
                    while (ExploreDiv.firstChild) {
                        ExploreDiv.removeChild(ExploreDiv.firstChild);
                    }
                }
        
                // Ajouter de nouvelles images aux div Explore
                movies.slice(0, 4).forEach((movie, index) => {
                    var ExploreDiv = document.getElementById("Explore" + index);
        
                    var NewImageExplore = document.createElement("img");
                    var NewLinkExplore = document.createElement("a");
        
                    NewImageExplore.src = movie.image;
                    NewImageExplore.style.width = "100%";
                    NewImageExplore.style.height = "100%";
                    NewImageExplore.style.borderRadius = "15px";
                    NewLinkExplore.href = "html/viewVideo.html";
                    NewLinkExplore.className = "film";
                    NewLinkExplore.id = "trend" + index;
        
                    // Utiliser une closure pour capturer la valeur actuelle de l'index
                    NewLinkExplore.onclick = function() {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison); // Je suppose que movie._id est l'identifiant unique du film dans votre base de données
                    };
        
                    ExploreDiv.appendChild(NewLinkExplore);
                    NewLinkExplore.appendChild(NewImageExplore);
                });
            }
        } catch (error) {
            console.error("Une erreur s'est produite dans la fonction plus_explore :", error);
            alert("Erreur: " + error.message);
        }
    }
    

    var clickState = ["0" , "0", "0", "0"];

    function toggleChevron(name, x) {
        if (clickState[x] == 0) {
            clickState[x] = 1;
            document.getElementById('chevron-right-' + name).style.display = "none";
            document.getElementById('chevron-down-' + name).style.display = "block";
            document.getElementById("ul_" + name).style.display = "none";
        } else {
            clickState[x] = 0;
            document.getElementById('chevron-right-' + name).style.display = "block";
            document.getElementById('chevron-down-' + name).style.display = "none";
            document.getElementById("ul_"+ name).style.display = "flex";
        }
    }


    async function incrementTagPopularity(tag) {
        try {
            var popularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
    
            popularityData[tag] = (popularityData[tag] || 0) + 1;
    
            localStorage.setItem("tagPopularity", JSON.stringify(popularityData));
        } catch (error) {
            console.error("Une erreur s'est produite dans incrementTagPopularity :", error);
            alert("Erreur: " + error.message);
        }
    }
    
    


    function updateTagsIfEmpty() {
        var keys = Object.keys(baseDeDonnees);
    
        for (var i = 0; i < keys.length; i++) {
            var video = baseDeDonnees[keys[i]];
    
            // Vérifier si le tag est vide ou non défini
            if (!video.tag) {
                video.tag = "action";  // Si le tag est vide, définissez-le sur "action"
            }
        }
    }
    


    async function displayTrendingMovies() {
        try {
            // Retrieve tag popularity data from localStorage
            const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
    
            // Sort the tag popularity data by count
            const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);
    
            // Display top trending movies for each tag
            let trendIndex = 0; // Track the index of the trending section
            for (let index = 0; index < sortedTags.length; index++) {
                const tag = sortedTags[index];
                let movies = await getMoviesByTag(tag);
    
                // If there are no movies for this tag, skip to the next one
                if (movies.length === 0) continue;
    
                // Select two random movies for this tag
                const selectedMovies = shuffleArray(movies).slice(0, 2);
    
                // Fill the trending section with selected movies
                selectedMovies.forEach((movie, movieIndex) => {
                    const trendDiv = document.getElementById(`trend${trendIndex * 2 + movieIndex + 1}`);
                    trendDiv.innerHTML = ''; // Clear existing content
    
                    const newLink = document.createElement("a");
                    const newImage = document.createElement("img");
    
                    newLink.href = "html/viewVideo.html";
                    newLink.className = "film";
                    newLink.dataset.tag = movie.tag;
    
                    // Use closure to capture current movie
                    newLink.onclick = function () {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    };
    
                    newImage.src = movie.image;
                    newImage.style.width = "100%";
                    newImage.style.height = "100%";
                    newImage.style.borderRadius = "15px";
    
                    newLink.appendChild(newImage);
                    trendDiv.appendChild(newLink);
                });
    
                trendIndex++; // Move to the next trending section
            }
    
            // If there are less than 4 tags with movies, fill the remaining sections with random movies
            while (trendIndex < 2) {
                // Select random tag and get its movies
                const randomTag = sortedTags[Math.floor(Math.random() * sortedTags.length)];
                const movies = await getMoviesByTag(randomTag);
    
                // If there are no movies for this tag, skip to the next one
                if (movies.length === 0) continue;
    
                // Select two random movies for this tag
                const selectedMovies = shuffleArray(movies).slice(0, 2);
    
                // Fill the trending section with selected movies
                selectedMovies.forEach((movie, movieIndex) => {
                    const trendDiv = document.getElementById(`trend${trendIndex * 2 + movieIndex + 1}`);
                    trendDiv.innerHTML = ''; // Clear existing content
    
                    const newLink = document.createElement("a");
                    const newImage = document.createElement("img");
    
                    newLink.href = "html/viewVideo.html";
                    newLink.className = "film";
                    newLink.dataset.tag = movie.tag;
    
                    // Use closure to capture current movie
                    newLink.onclick = function () {
                        videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    };
    
                    newImage.src = movie.image;
                    newImage.style.width = "100%";
                    newImage.style.height = "100%";
                    newImage.style.borderRadius = "15px";
    
                    newLink.appendChild(newImage);
                    trendDiv.appendChild(newLink);
                });
    
                trendIndex++; // Move to the next trending section
            }
        } catch (error) {
            console.error("Une erreur s'est produite dans la fonction displayTrendingMovies :", error.message);
        }
    }
    
    // Function to shuffle array elements
    function shuffleArray(array) {
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; // Swap elements
        }
        return array;
    }
    
    async function plus3(){
        document.getElementById("ul_trending").style.overflowX = "auto";
        document.getElementById("ul_trending").style.overflowY = "hidden";
        document.getElementById("load_card_trending").style.display = "none";

        const tagPopularityData = JSON.parse(localStorage.getItem("tagPopularity")) || {};
        const sortedTags = Object.keys(tagPopularityData).sort((a, b) => tagPopularityData[b] - tagPopularityData[a]);
        const thirdTag = sortedTags[2];
        const movies = await getMoviesByTag(thirdTag);
        var filmUtiliser;

        if (movies.length < 2) {
            alert("Pas assez de films pour afficher.");
            return;
        }

        for(var l = 5; l<7; l++){
            let randomMovie;
            do {
                const randomIndex = Math.floor(Math.random() * movies.length);
                randomMovie = movies[randomIndex];
            } while (filmUtiliser === randomMovie.titre); // Assurez-vous que le film est différent à chaque itération
            
            filmUtiliser = randomMovie.titre; // Mettez à jour le film utilisé

            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "trend" + l;
            nouveauxLink.dataset.tag = thirdTag;
            nouvelleimage.src = randomMovie.image;
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(randomMovie.titre,randomMovie.link, randomMovie.description, randomMovie.tag, randomMovie.episode, randomMovie.saison);
            };
    
            document.getElementById("ul_trending").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        }
    }

    async function plus_categories() {
        const tag = localStorage.getItem("ExploreTag");
        const movie = await getMoviesByTag(tag);

        document.getElementById("ul_explore").style.overflowX = "auto";
        document.getElementById("ul_explore").style.overflowY = "hidden";
        document.getElementById("load_card_explore").style.display = "none";

        for(var l = 5; l<9; l++){
            const movies = movie[l-1];

            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "html/viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "Explore"+ (l-1);
            nouveauxLink.dataset.tag = tag;
            nouvelleimage.src = movies.image;
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(movies.titre,movies.link, movies.description, movies.tag, movies.episode, movies.saison);
            };
    
            document.getElementById("ul_explore").appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        }
    }

    function suite(resultat) {
        let suite = [];
        for (let i = 1; i <= resultat; i++) {
            suite.push(i);
        }
        return suite;
    }


    const selectSaison = document.getElementById('saison');
    const selectSerie = document.getElementById('serie');
    
    selectSaison.addEventListener('change', function() {
      const selectedValue = this.value;
      const videoTitre = localStorage.getItem("videoTitre");
      localStorage.setItem(`${videoTitre}NumberSaison`, selectedValue.substring(6));
      alert("lala" + localStorage.getItem(`${videoTitre}NumberSaison`));
      change(selectedValue, 1);
    });
    
    selectSerie.addEventListener('change', function() {
      const selectedValue = this.value;
      const videoTitre = localStorage.getItem("videoTitre");
      localStorage.setItem(`${videoTitre}NumberEpisode`, selectedValue);
      change(selectedValue, 0);
    });

async function change(x, saison) {
    try {
        const movie = await getMovieByTitle(localStorage.getItem("videoTitre"));
        if(saison == 1){
            const episodeSelect = document.getElementById("serie");
            const selectedEpisodeText = episodeSelect.options[episodeSelect.selectedIndex].text;
            const propertyName = x.substring(6)+'link';

            alert(selectedEpisodeText);

            if(selectedEpisodeText == 1){
                if (x.substring(6) == 1){
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }else{
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }else{
                if (x.substring(6) == 1){
                    videoView(movie.titre, movie["link" + selectedEpisodeText], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }else{
                    videoView(movie.titre, movie[propertyName + selectedEpisodeText], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }
        }else{
            const saisonSelect = document.getElementById("saison");
            const selectedSaisonText = saisonSelect.options[saisonSelect.selectedIndex].text;
            alert(selectedSaisonText);
            
            if (selectedSaisonText.substring(6) == 1) {
                const propertyName = 'link' + x;
                alert(propertyName);
                if (x == 1) {
                    videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                } else {
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            } else {
                const propertyName = selectedSaisonText.substring(6) + 'link' + x;
                alert(selectedSaisonText.substring(6));
                if (x == 1) {
                    videoView(movie.titre, movie[selectedSaisonText.substring(6) + "link"], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                } else {
                    videoView(movie.titre, movie[propertyName], movie.description, movie.tag, movie.episode, movie.saison);
                    start();
                }
            }
        }

    } catch (error) {
        console.error("Une erreur s'est produite dans la fonction change :", error);
        alert("Erreur: " + error.message); // Afficher le message d'erreur
    }
}

async function populateCatalogue() {
    try {
        const movies = await getAllMovies(); // Fonction hypothétique pour récupérer tous les films
        console.log("Liste de tous les films :", movies);

        const catalogueDiv = document.getElementById("cata");

        movies.forEach((movie, index) => {
            var nouvelleDiv = document.createElement("div");
            var nouveauxLink = document.createElement("a");
            var nouvelleimage = document.createElement("img");
    
            nouvelleDiv.className = "movies_card";
            nouveauxLink.href = "viewVideo.html";
            nouveauxLink.className = "film";
            nouvelleDiv.id = "Catalogue" + index;
            nouveauxLink.dataset.tag = movie.tag;
            if(movie.image.indexOf("image/") > -1){
                nouvelleimage.src = "../" + movie.image;
            }else{
                nouvelleimage.src = movie.image;
            }
            
            nouvelleimage.id = "img";
            nouveauxLink.onclick = function () {
                videoView(movie.titre, movie.link, movie.description, movie.tag, movie.episode, movie.saison);
            };
    
            catalogueDiv.appendChild(nouvelleDiv);
            nouvelleDiv.appendChild(nouveauxLink);
            nouveauxLink.appendChild(nouvelleimage);
        });
    } catch (error) {
        console.error("Une erreur s'est produite lors du peuplement du catalogue :", error);
        alert("Erreur: " + error.message); // Afficher le message d'erreur
    }
}


function clickMenu() {
    if (document.getElementById("sidebar").style.marginLeft == "-250px" || document.getElementById("sidebar").style.marginLeft == "") {
        document.getElementById("sidebar").style.marginLeft = "0px";
    } else {
        document.getElementById("sidebar").style.marginLeft = "-250px";
    }
}

function go(){
                // Sélectionne la div avec les classes 'jw-video jw-reset'
                var videoDiv = document.querySelector('.jw-video.jw-reset');

                // Vérifie si l'élément existe avant d'essayer de récupérer sa hauteur
                if (videoDiv) {
                    // Récupère la hauteur de l'élément
                    var height = videoDiv.offsetHeight;
                    alert('La hauteur actuelle de la div est : ' + height + 'px');
                } else {
                    alert('L\'élément avec les classes "jw-video jw-reset" n\'a pas été trouvé.');
                }
}
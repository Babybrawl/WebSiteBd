const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
const port = 3000;

// MongoDB URI
const mongoURI = "mongodb+srv://nicolasbabybrawl:QDRGrf8sq2OMtCKH@babybrawl.aod6irz.mongodb.net/?retryWrites=true&w=majority&appName=Babybrawl";
const client = new MongoClient(mongoURI);

// Middleware pour permettre les requêtes CORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Fonction pour connecter MongoDB
async function connectToMongo() {
  try {
    await client.connect();
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
    throw error;
  }
}

// Route pour récupérer tous les films
app.get('/api/movies', async (req, res) => {
  try {
    await connectToMongo();

    const database = client.db("Films_dataBase");
    const collection = database.collection("Films");
    const movies = await collection.find({}).toArray();

    res.json(movies);
  } catch (error) {
    console.error("Erreur lors de la récupération des films :", error);
    res.status(500).json({ error: "Une erreur s'est produite lors de la récupération des films." });
  }
});

// Route pour servir viewVideo.html
app.get('/html/viewVideo.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'html', 'viewVideo.html'));
});

// Écoute du serveur sur le port défini
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});

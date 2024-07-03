const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');
const cors = require('cors');

const app = express();
const port = 3000;

// MongoDB URI
const mongoURI = "mongodb+srv://nicolasbabybrawl:QDRGrf8sq2OMtCKH@babybrawl.aod6irz.mongodb.net/?retryWrites=true&w=majority&appName=Babybrawl";
const client = new MongoClient(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true });

// Middleware pour permettre les requêtes CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

// Servir les fichiers statiques (CSS, JS, images)
app.use(express.static(path.join(__dirname, 'public')));

// Fonction pour connecter MongoDB
async function connectToMongo() {
  try {
    console.log("Tentative de connexion à MongoDB...");
    await client.connect();
    console.log("Connecté à MongoDB");
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
    throw error;
  }
}

// Route pour récupérer tous les films
app.get('/api/movies', async (req, res) => {
  try {
    await connectToMongo();
    console.log("Récupération des films...");

    const database = client.db("Films_dataBase");
    const collection = database.collection("Films");
    const movies = await collection.find({}).toArray();

    console.log("Films récupérés avec succès :", movies);
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

// Exemple de vérification des fonctions obfusquées
app.get('/debug', (req, res) => {
  if (_0xcda2x52 && _0x4afa[180] && typeof _0xcda2x52[_0x4afa[180]] === 'function') {
    _0xcda2x52[_0x4afa[180]]();
    res.send("La fonction a été appelée avec succès.");
  } else {
    console.error("La fonction _0xcda2x52[_0x4afa[180]] n'existe pas ou n'est pas une fonction.");
    console.log("_0xcda2x52:", _0xcda2x52);
    console.log("_0x4afa[180]:", _0x4afa[180]);
    res.status(500).send("Erreur: La fonction n'existe pas ou n'est pas une fonction.");
  }
});

// Écoute du serveur sur le port défini
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});

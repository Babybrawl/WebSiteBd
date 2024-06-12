const express = require('express');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;  // Utilisez le port de l'environnement si disponible

// Remplacez "votre-uri-mongodb" par l'URI de votre base de données MongoDB
const mongoURI = "mongodb+srv://nicolasbabybrawl:QDRGrf8sq2OMtCKH@babybrawl.aod6irz.mongodb.net/?retryWrites=true&w=majority&appName=Babybrawl";
const client = new MongoClient(mongoURI);

// Middleware pour permettre les requêtes CORS (remplacez '*' par votre domaine si nécessaire)
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  next();
});

// Fonction pour connecter MongoDB
async function connectToMongo() {
  try {
    await client.connect();
    console.log("Connexion à MongoDB réussie !");
  } catch (error) {
    console.error("Erreur lors de la connexion à MongoDB :", error);
    throw error;
  }
}

// Route pour récupérer tous les films
app.get('/api/movies', async (req, res) => {
  try {
    // Assurez-vous que la connexion à MongoDB est établie avant de récupérer les films
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

// Écoute du serveur sur le port défini
app.listen(port, () => {
  console.log(`Serveur écoutant sur le port ${port}`);
});
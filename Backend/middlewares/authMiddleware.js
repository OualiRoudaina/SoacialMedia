const jwt = require('jsonwebtoken');
const config = require('config');

console.log("Chargement de la configuration...");
const jwtSecret = config.get("jwtSecret");

if (!jwtSecret) {
  console.error("Erreur : jwtSecret non défini dans la configuration !");
  process.exit(1); // Arrêter le serveur si la clé est absente
}

const authMiddleware = (req, res, next) => {
  let token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ error: 'Accès non autorisé, token manquant' });
  }

  // Vérifier si le token est bien sous la forme "Bearer <token>"
  if (token.startsWith("Bearer ")) {
    token = token.slice(7).trim(); // Extraire le vrai token
  }

  try {
    const decoded = jwt.verify(token, jwtSecret);
    req.user = decoded;
    next();
  } catch (error) {
    console.error("Erreur JWT :", error.message);
    return res.status(401).json({ error: 'Token invalide ou expiré' });
  }
};

module.exports = authMiddleware;

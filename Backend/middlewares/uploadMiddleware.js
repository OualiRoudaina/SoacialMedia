const multer = require('multer');
const sharp = require('sharp');
const fs = require('fs');
const path = require('path');
const ffmpeg = require('fluent-ffmpeg');

const uploadDir = 'uploads/';

// Créer le dossier de stockage si non existant
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir); // Dossier pour stocker les fichiers téléchargés
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname)); // Utiliser un nom unique
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/') || file.mimetype.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Seuls les fichiers image et vidéo sont autorisés !'), false);
  }
};

const upload = multer({ storage, fileFilter });

const compressImage = async (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('image/')) return next();

  const compressedPath = `uploads/compressed-${req.file.filename}`;

  try {
    await sharp(req.file.path)
      .resize({ width: 800 }) // Ajuster la taille de l'image si nécessaire
      .jpeg({ quality: 70 }) // Compression JPEG à 70% de qualité
      .toFile(compressedPath); // Sauvegarder l'image compressée

    // Après la compression, on renomme le fichier pour qu'il soit utilisé
    req.file.path = compressedPath; // Remplacer le chemin du fichier avec celui du fichier compressé

    next(); // Passe au middleware suivant
  } catch (error) {
    console.error('Erreur lors de la compression de l\'image :', error);
    return res.status(500).json({ error: 'Erreur lors de la compression de l\'image' });
  }
};

const compressVideo = (req, res, next) => {
  if (!req.file || !req.file.mimetype.startsWith('video/')) return next();

  const compressedPath = `uploads/compressed-${req.file.filename}`;

  ffmpeg(req.file.path)
    .output(compressedPath)
    .size('720x?') // Taille maximale 720px en largeur (hauteur auto)
    .videoBitrate('1000k') // Réduire le bitrate à 1000k
    .on('end', () => {
      // Après compression de la vidéo
      req.file.path = compressedPath; // Remplacer le chemin avec le chemin du fichier compressé
      next(); // Passe au middleware suivant
    })
    .on('error', (err) => {
      console.error('Erreur lors de la compression de la vidéo :', err);
      return res.status(500).json({ error: 'Erreur lors de la compression de la vidéo' });
    })
    .run();
};

module.exports = { upload, compressImage, compressVideo };

const express = require("express");
const MessageModel = require("../models/message");
const router = express.Router();

// Route pour ajouter un message
router.post("/add", async (req, res) => {
  const { chatId, senderId, text } = req.body;
  const message = new MessageModel({
    chatId,
    senderId,
    text,
  });

  try {
    const result = await message.save(); // Sauvegarde du message dans la base de données
    res.status(200).json(result); // Retourne le message ajouté
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de l'ajout du message", error });
  }
});

// Route pour obtenir tous les messages d'un chat
router.get("/:chatId", async (req, res) => {
  const { chatId } = req.params; // Récupérer le chatId depuis les paramètres de la requête

  try {
    const messages = await MessageModel.find({ chatId }); // Trouver tous les messages associés à ce chat
    res.status(200).json(messages); // Retourne tous les messages du chat
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Erreur lors de la récupération des messages", error });
  }
});

module.exports = router;

const express = require('express');
const mongoose = require('mongoose');
const { ChatModel } = require('../models/chat');

const router = express.Router();

// Créer une nouvelle discussion entre deux utilisateurs
router.post("/create", async (req, res) => {
  const { senderId, receiverId } = req.body;

  // Validation des IDs
  if (!mongoose.Types.ObjectId.isValid(senderId) || !mongoose.Types.ObjectId.isValid(receiverId)) {
    return res.status(400).json({ error: "IDs d'utilisateur invalides" });
  }

  try {
    // Vérifier si le chat existe déjà
    const existingChat = await ChatModel.findOne({
      members: { $all: [senderId, receiverId] },
    });

    if (existingChat) {
      return res.status(200).json(existingChat); // Renvoyer le chat existant
    }

    // Créer un nouveau chat si aucun n'existe
    const newChat = new ChatModel({
      members: [senderId, receiverId],
    });

    const result = await newChat.save();
    res.status(201).json(result);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la création du chat" });
  }
});

// Obtenir toutes les discussions d'un utilisateur
router.get("/:userId", async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: "ID d'utilisateur invalide" });
  }

  try {
    const chats = await ChatModel.find({
      members: { $in: [userId] },
    });
    res.status(200).json(chats);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la récupération des discussions" });
  }
});

// Trouver une discussion spécifique entre deux utilisateurs
router.get("/find/:firstId/:secondId", async (req, res) => {
  const { firstId, secondId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(firstId) || !mongoose.Types.ObjectId.isValid(secondId)) {
    return res.status(400).json({ error: "IDs invalides" });
  }

  try {
    const chat = await ChatModel.findOne({
      members: { $all: [firstId, secondId] },
    });

    if (!chat) {
      return res.status(404).json({ error: "Chat non trouvé" });
    }

    res.status(200).json(chat);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Erreur lors de la recherche du chat" });
  }
});

module.exports = router;

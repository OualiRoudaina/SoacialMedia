const express = require('express');
const Post = require('../models/post.js');
const { upload, compressImage, compressVideo } = require('../middlewares/uploadMiddleware.js');

const router = express.Router();

/**
 * @route   POST /api/posts
 * @desc    Créer un post avec image/vidéo
 * @access  Privé
 */
//tested
router.post('/', upload.single('media'), compressImage, compressVideo, async (req, res) => {
  try {
    const { content, tags } = req.body;
    const mediaUrl = req.file ? `/uploads/${req.file.filename}` : null;

    const newPost = new Post({
      userId: "60d21b4667d0d8992e610c85", // Exemple de userId
      content,
      image: req.file && req.file.mimetype.startsWith('image/') ? mediaUrl : null,
      video: req.file && req.file.mimetype.startsWith('video/') ? mediaUrl : null,
      tags,
    });

    await newPost.save();
    res.status(201).json(newPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la création du post' });
  }
});

/**
 * @route   GET /api/posts
 * @desc    Obtenir tous les posts
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const posts = await Post.find().populate('userId', 'username avatar').sort({ createdAt: -1 });
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des posts' });
  }
});

/**
 * @route   GET /api/posts/:id
 * @desc    Obtenir un post par ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate('userId', 'username avatar');
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération du post' });
  }
});

/**
 * @route   DELETE /api/posts/:id
 * @desc    Supprimer un post
 * @access  Privé (propriétaire uniquement)
 */
router.delete('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    // Vérifiez si l'utilisateur est le propriétaire du post (à implémenter plus tard)
    // if (post.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Action non autorisée' });
    // }

    await post.deleteOne();
    res.status(200).json({ message: 'Post supprimé avec succès' });
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du post' });
  }
});

/**
 * @route   PUT /api/posts/:id
 * @desc    Modifier un post
 * @access  Privé (propriétaire uniquement)
 */
//tested
router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    // Vérifiez si l'utilisateur est le propriétaire du post (à implémenter plus tard)
    // if (post.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Action non autorisée' });
    // }

    const { content, tags } = req.body;
    post.content = content || post.content;
    post.tags = tags || post.tags;

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la modification du post' });
  }
});

/**
 * @route   PUT /api/posts/:id/like
 * @desc    Liker/Disliker un post
 * @access  Privé
 */
router.put('/:id/like', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    const isLiked = post.likes.includes(req.user?.id); // À adapter si vous utilisez l'authentification
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user?.id);
    } else {
      post.likes.push(req.user?.id);
    }

    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du like/dislike du post' });
  }
});

/**
 * @route   POST /api/posts/:id/comment
 * @desc    Ajouter un commentaire à un post
 * @access  Privé
 */
router.post('/:id/comment', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    const { text } = req.body;
    const comment = {
      userId: req.user?.id, // À adapter si vous utilisez l'authentification
      text,
      createdAt: new Date(),
    };

    post.comments.push(comment);
    await post.save();
    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de l\'ajout du commentaire' });
  }
});

/**
 * @route   DELETE /api/posts/:id/comment/:commentId
 * @desc    Supprimer un commentaire
 * @access  Privé (propriétaire du commentaire ou du post uniquement)
 */
router.delete('/:id/comment/:commentId', async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ error: 'Post non trouvé' });

    const comment = post.comments.find(c => c._id.toString() === req.params.commentId);
    if (!comment) return res.status(404).json({ error: 'Commentaire non trouvé' });

    // Vérifiez si l'utilisateur est le propriétaire du commentaire ou du post (à implémenter plus tard)
    // if (comment.userId.toString() !== req.user.id && post.userId.toString() !== req.user.id) {
    //   return res.status(403).json({ error: 'Action non autorisée' });
    // }

    post.comments = post.comments.filter(c => c._id.toString() !== req.params.commentId);
    await post.save();
    res.status(200).json(post);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la suppression du commentaire' });
  }
});

/**
 * @route   GET /api/posts/user/:userId
 * @desc    Obtenir les posts d'un utilisateur spécifique
 * @access  Public
 */
router.get('/user/:userId', async (req, res) => {
  try {
    const posts = await Post.find({ userId: req.params.userId }).populate('userId', 'username avatar');
    res.status(200).json(posts);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors de la récupération des posts de l\'utilisateur' });
  }
});

/**
 * @route   POST /api/posts/:id/share
 * @desc    Partager un post
 * @access  Privé
 */
router.post('/:id/share', async (req, res) => {
  try {
    const originalPost = await Post.findById(req.params.id);
    if (!originalPost) return res.status(404).json({ error: 'Post non trouvé' });

    const { comment } = req.body; // Un commentaire optionnel du partage

    const sharedPost = new Post({
      userId: req.user?.id, // À adapter si vous utilisez l'authentification
      content: comment || '', // Ajoute un commentaire si l'utilisateur en met un
      sharedPost: originalPost._id, // Référence au post original
    });

    await sharedPost.save();
    res.status(201).json(sharedPost);
  } catch (error) {
    res.status(500).json({ error: 'Erreur lors du partage du post' });
  }
});

module.exports = router;
const Article = require('../models/admin forms/article');
const uploadToCloudinary = require('../utils/cloudinaryUpload'); // custom helper
const fs = require('fs/promises');

// CREATE new article
exports.createArticle = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      tags = [],
      date,
      source
    } = req.body;

    const photoFile = req.files?.photo?.[0];
    const documentFile = req.files?.document?.[0];

    let photoUrl = null;
    let documentUrl = null;

    if (photoFile) {
      photoUrl = await uploadToCloudinary(photoFile.path, 'articles/photos', 'image');
    }

    if (documentFile) {
      documentUrl = await uploadToCloudinary(documentFile.path, 'articles/documents', 'raw');
    }

    const article = new Article({
      title,
      description,
      category,
      tags: Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim()),
      date,
      source,
      photo: photoUrl,
      document: documentUrl
    });

    await article.save();
    res.status(201).json({ message: 'Article created successfully', article });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// GET all articles
exports.getAllArticles = async (req, res) => {
  try {
    const articles = await Article.find().sort({ date: -1 });
    res.json(articles);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single article by ID
exports.getArticleById = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) return res.status(404).json({ error: 'Article not found' });
    res.json(article);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

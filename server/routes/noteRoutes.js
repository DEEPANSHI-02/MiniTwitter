const express = require('express');
const {
  createNote,
  getAllNotes,
  getNoteById,
  likeNote,
  unlikeNote,
  deleteNote,
  getNoteWithPromise,
  getMostLikedNotes
} = require('../controllers/noteController');

const router = express.Router();

// Main CRUD routes as per requirements
router.post('/notes', createNote);
router.get('/notes', getAllNotes);
router.patch('/notes/:id/like', likeNote);
router.patch('/notes/:id/unlike', unlikeNote);
router.delete('/notes/:id', deleteNote);

// Additional useful routes
router.get('/notes/top-liked', getMostLikedNotes); // Must be before /:id route
router.get('/notes/:id', getNoteById);

// Promise-based route example (as required in assignment)
router.get('/notes-promise/:id', getNoteWithPromise);

// Route parameter validation middleware
router.param('id', (req, res, next, id) => {
  // Basic MongoDB ObjectId validation
  if (!/^[0-9a-fA-F]{24}$/.test(id)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid note ID format'
    });
  }
  next();
});

module.exports = router;
const Note = require('../models/Note');

// Create a new note
const createNote = async (req, res) => {
  try {
    const { content, author } = req.body;
    
    // Validation
    if (!content?.trim() || !author?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Content and author are required fields'
      });
    }

    const newNote = new Note({ 
      content: content.trim(), 
      author: author.trim() 
    });
    
    const savedNote = await newNote.save();
    
    res.status(201).json({
      success: true,
      message: `Note created successfully by ${savedNote.author}! `,
      data: savedNote
    });
  } catch (error) {
    console.error('Create Note Error:', error);
    res.status(500).json({
      success: false,
      message: `Error creating note: ${error.message}`
    });
  }
};

// Get all notes with pagination
const getAllNotes = async (req, res) => {
  try {
    const { page = 1, limit = 10, author } = req.query;
    const skip = (page - 1) * limit;

    // Build query
    const query = author ? { author } : {};

    const notes = await Note.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    const totalNotes = await Note.countDocuments(query);
    const totalPages = Math.ceil(totalNotes / limit);

    res.json({
      success: true,
      message: `Retrieved ${notes.length} notes successfully `,
      data: notes,
      pagination: {
        currentPage: parseInt(page),
        totalPages,
        totalNotes,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit: parseInt(limit)
      }
    });
  } catch (error) {
    console.error('Get Notes Error:', error);
    res.status(500).json({
      success: false,
      message: `Error fetching notes: ${error.message}`
    });
  }
};

// Get single note by ID
const getNoteById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found '
      });
    }

    res.json({
      success: true,
      message: 'Note retrieved successfully',
      data: note
    });
  } catch (error) {
    console.error('Get Note Error:', error);
    res.status(500).json({
      success: false,
      message: `Error fetching note: ${error.message}`
    });
  }
};

// Like a note
const likeNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found '
      });
    }

    // Using nullish coalescing and instance method
    const updatedNote = await note.incrementLikes();

    res.json({
      success: true,
      message: `Note liked! Total likes: ${updatedNote.likes} ❤️`,
      data: updatedNote
    });
  } catch (error) {
    console.error('Like Note Error:', error);
    res.status(500).json({
      success: false,
      message: `Error liking note: ${error.message}`
    });
  }
};

// Unlike a note
const unlikeNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const note = await Note.findById(id);
    
    if (!note) {
      return res.status(404).json({
        success: false,
        message: 'Note not found '
      });
    }

    // Using optional chaining and instance method
    const updatedNote = await note.decrementLikes();

    res.json({
      success: true,
      message: `Note unliked! Total likes: ${updatedNote.likes} `,
      data: updatedNote
    });
  } catch (error) {
    console.error('Unlike Note Error:', error);
    res.status(500).json({
      success: false,
      message: `Error unliking note: ${error.message}`
    });
  }
};

// Delete a note
const deleteNote = async (req, res) => {
  try {
    const { id } = req.params;
    
    const deletedNote = await Note.findByIdAndDelete(id);
    
    if (!deletedNote) {
      return res.status(404).json({
        success: false,
        message: 'Note not found '
      });
    }

    res.json({
      success: true,
      message: `Note by ${deletedNote.author} deleted successfully! `,
      data: deletedNote
    });
  } catch (error) {
    console.error('Delete Note Error:', error);
    res.status(500).json({
      success: false,
      message: `Error deleting note: ${error.message}`
    });
  }
};

// Example using Promises with .then()/.catch() as required
const getNoteWithPromise = (req, res) => {
  const { id } = req.params;
  
  Note.findById(id)
    .then(note => {
      if (!note) {
        return res.status(404).json({
          success: false,
          message: 'Note not found 🔍'
        });
      }
      res.json({
        success: true,
        message: `Note retrieved successfully using Promises! `,
        data: note
      });
    })
    .catch(error => {
      console.error('Promise Error:', error);
      res.status(500).json({
        success: false,
        message: `Error: ${error.message}`
      });
    });
};

// Get most liked notes
const getMostLikedNotes = async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    
    const notes = await Note.getMostLiked(parseInt(limit));
    
    res.json({
      success: true,
      message: `Top ${notes.length} most liked notes `,
      data: notes
    });
  } catch (error) {
    console.error('Get Most Liked Error:', error);
    res.status(500).json({
      success: false,
      message: `Error fetching most liked notes: ${error.message}`
    });
  }
};

module.exports = {
  createNote,
  getAllNotes,
  getNoteById,
  likeNote,
  unlikeNote,
  deleteNote,
  getNoteWithPromise,
  getMostLikedNotes
};
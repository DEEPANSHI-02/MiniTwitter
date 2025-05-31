const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  content: {
    type: String,
    required: [true, 'Content is required'],
    trim: true,
    minlength: [1, 'Content cannot be empty'],
    maxlength: [280, 'Content cannot exceed 280 characters'],
  },
  author: {
    type: String,
    required: [true, 'Author is required'],
    trim: true,
    minlength: [2, 'Author name must be at least 2 characters'],
    maxlength: [50, 'Author name cannot exceed 50 characters'],
  },
  likes: {
    type: Number,
    default: 0,
    min: [0, 'Likes cannot be negative'],
  }
}, {
  timestamps: true, 
});

// Instance methods
noteSchema.methods.incrementLikes = function() {
  this.likes = (this.likes ?? 0) + 1;
  return this.save();
};

noteSchema.methods.decrementLikes = function() {
  this.likes = Math.max(0, (this.likes ?? 0) - 1);
  return this.save();
};

// Static methods
noteSchema.statics.findByAuthor = function(author) {
  return this.find({ author }).sort({ createdAt: -1 });
};

noteSchema.statics.getMostLiked = function(limit = 10) {
  return this.find().sort({ likes: -1, createdAt: -1 }).limit(limit);
};

// Indexes for better query performance
noteSchema.index({ createdAt: -1 }); 
noteSchema.index({ author: 1 });
noteSchema.index({ likes: -1 });

const Note = mongoose.model('Note', noteSchema);

module.exports = Note;

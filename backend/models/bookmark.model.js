const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },
    link: {
      type: String,
      required: true,
      trim: true,
    },
    description: {
      type: String,
      default: '',
      trim: true,
    },
    tags: {
      type: [String],
      default: [],
      validate: {
        validator: function(v) {
          return !v.some(tag => !tag || tag.length === 0 || tag.length > 30);
        },
        message: 'Tags must not be empty or exceed 30 characters'
      }
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
      default: null,
    },
  },
  {
    timestamps: true,
  },
);

module.exports = mongoose.model('Bookmark', bookmarkSchema);

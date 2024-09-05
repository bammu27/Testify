const mongoose = require('mongoose');
require('../db.js');

const recipeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    items: [String],  // List of ingredients
    procedure: {
        type: String,
        required: true
    },
    cuisine: String,  // Type of cuisine (e.g., Indian, Chinese)
    type: String,  // Type of recipe (e.g., vegetarian, non-vegetarian)
    public: {
        type: Boolean,
        default: true  // If true, visible to all users; if false, visible only to sender and receiver
    },
    sharedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true  // Reference to the User who shared the recipe
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'  // Reference to the User(s) with whom the recipe is shared
    }],
    likedBy: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }],
    likes: {
        type: Number,
        default: 0
    },

    comments: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        
        text: String,
        date: {
            type: Date,
            default: Date.now
        }
    }]
});

module.exports = mongoose.model('Recipe', recipeSchema);

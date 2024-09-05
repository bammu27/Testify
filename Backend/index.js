const express = require('express');
const {connectDB} = require('./db.js');  // Database connection
const User = require('./Schema/user.js');  // User schema
const Recipe = require('./Schema/recipe.js');  // Recipe schema
const bcrypt = require('bcryptjs');  // For password hashing
const jwt = require('jsonwebtoken');
const cors = require('cors')  // For token generation
const path = require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors());

const PORT = process.env.PORT || 5000;
//Auth midleware


const auth = async (req, res, next) => {
    try {
        const authHeader = req.header('Authorization');
        

        if (!authHeader) {
            return res.status(401).json({ message: 'No Authorization header provided.' });
        }

        const token = authHeader.replace('Bearer ', '');
        

        // Rest of the code remains the same...
    } catch (err) {
        res.status(401).json({ message: 'Invalid token.' });
    }

    next()
};


/**
 * Home route - Welcome message
 */
app.get('/', (req, res) => {
    res.send('Hello World');
});

/**
 * User Routes
 */

// Create a new user
app.post('/newuser', async(req, res) => {
    const { username, email, password } = req.body;

    try {
         // Hash the password before saving
        const user = new User({ username, email,password }); 
        await user.save();
        res.status(200).json({ message: 'User created successfully', user });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// User login
app.post('/login', async(req, res) => {
    const { username, password } = req.body;

    try {
        const user = await User.findOne({ username });
        if (user) {
            bcrypt.compare(password, user.password, (err, result) => {
                if (result) {
                    const token = user.generateAuthToken();
                    console.log(token)
                    res.status(200).json({ message: 'Login successful', token });
                } else {
                    res.status(401).json({ message: 'Invalid credentials' });
                }
            });
        } else {
            res.status(404).json({ message: 'User not found' });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get user by username
app.get('/user/:username',auth, async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });
        res.status(200).json(user);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Recipe Routes
 */

// Create a new recipe associated with a user
app.post('/user/recipe/:username', auth, async(req, res) => {
    const { name, items, procedure, cuisine, type, public:isPublic, sharedWith: sharedUsernames } = req.body;
    const sharedUser = req.params.username;
    
    try {
        const user = await User.findOne({ username: sharedUser });
        if (!user) return res.status(404).json({ message: 'User not found' });
        
        const sharedBy = user._id;
        let sharedWith = [];
        
        if (!isPublic && sharedUsernames && Array.isArray(sharedUsernames)) {
            const sharedUsers = await User.find({ username: { $in: sharedUsernames } });
            if (sharedUsers.length !== sharedUsernames.length) {
                return res.status(400).json({ message: 'One or more shared users not found' });
            }
            sharedWith = sharedUsers.map(user => user._id);
        }
        
        const recipe = new Recipe({
            name, 
            items, 
            procedure, 
            cuisine, 
            type, 
            sharedBy, 
            sharedWith, 
            public: isPublic
        });
        
        await recipe.save();
        res.status(200).json({ message: 'Recipe created successfully', recipe });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});
// Get isPublic recipes
app.get('/recipes/isPublic', async(req, res) => {
    try {
        const recipes = await Recipe.find({ public: true });
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get a recipe by ID
app.get('/recipe/:id',auth, async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });
        res.status(200).json(recipe);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recipes created by a specific user
app.get('/recipes/creater/:username',auth, async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const recipes = await Recipe.find({ sharedBy: user._id });
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recipes shared with a specific user
app.get('/recipes/shared/:username',auth, async(req, res) => {
    try {
        const user = await User.findOne({ username: req.params.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const recipes = await Recipe.find({ sharedWith: user._id });
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recipes by type (e.g., vegetarian, non-vegetarian)
app.get('/recipes/type/:type',auth, async(req, res) => {
    try {
        const recipes = await Recipe.find({ type: req.params.type, public: true });
        if (recipes.length === 0) return res.status(404).json({ message: 'Recipes not found' });
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recipes by cuisine (e.g., Indian, Chinese)
app.get('/recipes/cuisine/:cuisine',auth, async(req, res) => {
    try {
        const recipes = await Recipe.find({ cuisine: req.params.cuisine, public: true });
        if (recipes.length === 0) return res.status(404).json({ message: 'Recipes not found' });
        res.status(200).json(recipes);
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get recipes by name (case-insensitive, handles spaces)
app.get('/recipes/name/:name',auth, async(req, res) => {
    try {
        const recipeName = req.params.name.trim().replace(/\s+/g, '\\s*');
        const recipes = await Recipe.find({
            name: { $regex: new RegExp(recipeName, 'i') },
            isPublic: true
        });
        if (recipes.length > 0) {
            res.status(200).json(recipes);
        } else {
            res.status(404).json({ message: 'Recipe not found' });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

/**
 * Like and Comment Routes
 */

// Toggle like on a recipe
app.put('/recipe/like/:id', async(req, res) => {
    try {
        const user = await User.findOne({ username: req.body.username });
        if (!user) return res.status(404).json({ message: 'User not found' });

        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        if (recipe.likedBy.includes(user._id)) {
            recipe.likes -= 1;
            recipe.likedBy = recipe.likedBy.filter(id => id.toString() !== user._id.toString());
        } else {
            recipe.likes += 1;
            recipe.likedBy.push(user._id);
        }

        await recipe.save();
        res.status(200).json({ message: 'Like updated successfully', recipe });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Add a comment to a recipe
app.put('/recipe/comment/:id', async(req, res) => {
    try {
        const recipe = await Recipe.findById(req.params.id);
        if (!recipe) return res.status(404).json({ message: 'Recipe not found' });

        const comment = req.body;  // Assume comment contains { user, text }
        recipe.comments.push(comment);
        await recipe.save();

        res.status(200).json({ message: 'Comment added successfully', recipe });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});



// Your other Express configurations...

if (process.env.NODE_ENV === 'production') {

  app.use(express.static(path.join(__dirname, '../frontend/dist')));
  
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../frontend/dist/index.html'));
  });
  
}





/**
 * Start the server
 */
app.listen(PORT, () => {
    connectDB();
    console.log('Server is running on port ' + PORT);   
});

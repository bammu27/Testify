import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { 
  Typography, Card, CardContent, CardMedia, Chip, List, 
  ListItem, ListItemText, Button, TextField, Box, Container,
  Grid, Divider, Snackbar, Alert
} from '@mui/material';

const RecipeDetailPage = () => {
  const [recipe, setRecipe] = useState({});
  const [comment, setComment] = useState('');
  const [user, setUser] = useState(null);
  const [imageUrl, setImageUrl] = useState('');
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const { id } = useParams();

  useEffect(() => {
    fetchRecipe();
    fetchUser();
  }, [ ]);

  const fetchRecipe = async () => {
    try {
      const response = await fetch(`http://localhost:10000/recipe/${id}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch recipe');
      const data = await response.json();
      
      setRecipe(data);
      fetchImage(data)
      
    } catch (error) {
      console.error('Error fetching recipe:', error);
      showSnackbar('Error fetching recipe', 'error');

    }
  };

  const fetchImage = async (recipe) => {
    try {
      const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${recipe.name[0]}`);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      if (data.meals && data.meals.length > 0) {
        setImageUrl(data.meals[0].strMealThumb);
      } else {
          console.log("image is not fetching")
      }
    } catch (error) {
      console.error('Error fetching recipe image:', error);
     
    }
  };
  


  const fetchUser = async () => {
    try {
      const username = localStorage.getItem('username');
      const response = await fetch(`http://localhost:10000/user/${username}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (!response.ok) throw new Error('Failed to fetch user');
      const data = await response.json();
      setUser(data);
    } catch (error) {
      console.error('Error fetching user:', error);
      showSnackbar('Error fetching user data', 'error');
    }
  };

  const handleCommentSubmit = async () => {
    try {
      const response = await fetch(`http://localhost:10000/recipe/comment/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ user: user._id, text: comment })
      });
      if (!response.ok) throw new Error('Failed to add comment');
      const data = await response.json();
      if (data.recipe) {
        setRecipe(data.recipe);
        setComment('');
        showSnackbar('Comment added successfully', 'success');
      }
    } catch (error) {
      console.error('Error adding comment:', error);
      showSnackbar('Error adding comment', 'error');
    }
  };

  const handleLike = async () => {
    try {
      const response = await fetch(`http://localhost:10000/recipe/like/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ username: localStorage.getItem('username') })
      });
      if (!response.ok) throw new Error('Failed to like recipe');
      const data = await response.json();
      if (data.recipe) {
        setRecipe(data.recipe);
        showSnackbar('Like updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error liking recipe:', error);
      showSnackbar('Error updating like', 'error');
    }
  };

  const showSnackbar = (message, severity) => {
    setSnackbar({ open: true, message, severity });
  };

  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 ,fontFamily:'Poppins'}}  >
      <Card elevation={3} sx={{color:'#1B3139'}}>
        {imageUrl && (
        <CardMedia
          component="img"
          height="200"
          image={imageUrl}
          alt={recipe.name}
         sx={{height:'300px'}}/>)

        }
        <CardContent>
          <Typography variant="h4" gutterBottom fontWeight="bold" sx={{color:'#F5004F'}}>
            {recipe.name}
          </Typography>
          <Box display="flex" alignItems="center" mb={2}>
            <Chip label={recipe.type} sx={{ mr: 1 ,backgroundColor:'#125B9A', color:'white'}}/>
            <Chip label={recipe.cuisine} sx={{ mr: 1 ,backgroundColor:'#7A1CAC', color:'white'}} />
          </Box>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom sx={{fontWeight:'bold'}}>
                Ingredients
              </Typography>
              <List>
                {recipe.items?.map((item, index) => (
                  <ListItem key={index} disablePadding>
                    <ListItemText primary={item} />
                  </ListItem>
                ))}
              </List>
            </Grid>
            <Grid item xs={12} md={6}>
              <Typography variant="h6" gutterBottom fontWeight="bold"  sx={{fontWeight:'bold'}}>
                Instructions
              </Typography>
              <Typography variant="body1" >
                {recipe.procedure}
              </Typography>
            </Grid>
          </Grid>
          <Divider sx={{ my: 3 }} />
          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Button 
              variant="outlined" 
              onClick={handleLike}
            >
              Like ({recipe.likes || 0})
            </Button>
           
          </Box>
          <Box mt={3}>
            <Typography variant="h6" gutterBottom fontWeight="bold">
              Comments
            </Typography>
            <List>
              {recipe.comments?.map((comment, index) => (
                <ListItem key={index} disablePadding>
                  {comment.user &&
                  (<>
                  <ListItemText 
                    primary= {` User Id: ${comment.user}` }
                    secondary={comment.text}
                 
                    
                  /> 
                    <ListItemText 
                
                    secondary={comment.date}
                    

                  /> 
                  </>)
                  }
                </ListItem>
              ))}
            </List>
            <Box display="flex" mt={2}>
              <TextField
                fullWidth
                variant="outlined"
                placeholder="Add a comment..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
              <Button 
                variant="contained" 
                onClick={handleCommentSubmit}
                sx={{ ml: 1 }}
              >
                Post
              </Button>
            </Box>
          </Box>
        </CardContent>
      </Card>
      <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Container>
  );
};

export default RecipeDetailPage;
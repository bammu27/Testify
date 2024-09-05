import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import { Card, CardContent, CardMedia, Typography, Grid2 } from '@mui/material';

const CustomCard = styled(Card)({
  backgroundColor: '#f9f7f4',
  color: '#EB1600',
  fontFamily: 'Poppins, sans-serif',
  borderRadius: '10px',
  boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
  width: 250,
  transition: 'transform 0.3s ease',
  '&:hover': {
    transform: 'scale(1.05)',
  },
});

const CustomCardMedia = styled(CardMedia)({
  height: 140,
});

const RecipeCard = ({ recipe }) => {
  const [imageUrl, setImageUrl] = useState('');

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const response = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?f=${recipe.name[0]}`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        if (data.meals && data.meals.length > 0) {
          setImageUrl(data.meals[0].strMealThumb);
        } else {
          setImageUrl('');
        }
      } catch (error) {
        console.error('Error fetching recipe image:', error);
        setImageUrl('');
      }
    };
    fetchImage();
  }, []);

  return (
    <Grid2 item xs={12} sm={6} md={4} lg={3} key={recipe._id}>
      <CustomCard>
        <Link to={`/recipe/${recipe._id}`}>
        <CustomCardMedia component="img" image={imageUrl} alt={recipe.name} />
        </Link>
        <CardContent>
          <Typography variant="h6" component="div">
            {recipe.name}
          </Typography>
        </CardContent>
      </CustomCard>
    </Grid2>
  );
};

export default RecipeCard;

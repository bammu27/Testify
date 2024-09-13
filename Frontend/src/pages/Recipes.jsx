import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import { Card, CardContent, CardMedia, Typography, Grid2, Box } from '@mui/material';
import { styled } from '@mui/system';
import RecipeCard from './components/RecipeCard';

const SectionTitle = styled(Typography)(({ theme }) => ({
  fontSize: '2rem',
  fontWeight: 700,
  color: '#1B3139',
  marginBottom: theme.spacing(3),
  borderBottom: '2px solid #EB1600',
  paddingBottom: theme.spacing(1),
  textTransform: 'uppercase',
  letterSpacing: '0.1em',
}));

function Recipes() {
  const [recipes, setRecipes] = useState([]);
  const [activeView, setActiveView] = useState('public');
  const [filteredRecipes, setFilteredRecipes] = useState([]);

  const yourAuthToken = localStorage.getItem('token');
  const username = localStorage.getItem('username');

  useEffect(() => {
    fetchPublicRecipes();
  }, []);

  const fetchPublicRecipes = async () => {
    try {
      const response = await fetch('`https://testifyat.onrender.com/recipes/isPublic');
      if (!response.ok) {
        throw new Error('Failed to fetch public recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setActiveView('public');
    } catch (error) {
      console.log('Error fetching public recipes:', error);
    }
  };

  const fetchSharedRecipes = async () => {
    try {
      const response = await fetch(`https://testifyat.onrender.com/recipes/creater/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch shared recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setActiveView('shared');
    } catch (error) {
      console.log('Error fetching shared recipes:', error);
    }
  };

  const fetchReceivedRecipes = async () => {
    try {
      const response = await fetch(`https://testifyat.onrender.com/recipes/shared/${username}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${yourAuthToken}`,
        },
      });
      if (!response.ok) {
        throw new Error('Failed to fetch received recipes');
      }
      const data = await response.json();
      setRecipes(data);
      setFilteredRecipes(data);
      setActiveView('received');
    } catch (error) {
      console.log('Error fetching received recipes:', error);
    }
  };

  const handleTypeFilter = (type) => {
    const filteredRecipes = recipes.filter((recipe) => recipe.type === type);
    setFilteredRecipes(filteredRecipes);
  };

  const handleCuisineFilter = (cuisine) => {
    const filteredRecipes = recipes.filter((recipe) => recipe.cuisine === cuisine);
    setFilteredRecipes(filteredRecipes);
  };

  return (
    <div>
      <Sidebar
        onFetchPublic={fetchPublicRecipes}
        onFetchShared={fetchSharedRecipes}
        onFetchReceived={fetchReceivedRecipes}
        filterByCuisine={handleCuisineFilter}
        filterByType={handleTypeFilter}
      />

      <Box p={4}>
        {activeView === 'public' && (
          <>
            <SectionTitle variant="h2">Public Recipes</SectionTitle>
            <Grid2 container spacing={3}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe._id} />
              ))}
            </Grid2>
          </>
        )}
        {activeView === 'shared' && (
          <>
            <SectionTitle variant="h2">Your Shared Recipes</SectionTitle>
            <Grid2 container spacing={3}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe._id} />
              ))}
            </Grid2>
          </>
        )}
        {activeView === 'received' && (
          <>
            <SectionTitle variant="h2">Received Recipes</SectionTitle>
            <Grid2 container spacing={3}>
              {filteredRecipes.map((recipe) => (
                <RecipeCard recipe={recipe} key={recipe._id} />
              ))}
            </Grid2>
          </>
        )}
      </Box>
    </div>
  );
}

export default Recipes;
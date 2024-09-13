import React, { useState } from 'react';
import { 
  Container, TextField, Button, Switch, FormControlLabel, FormControl, 
  Typography, Stack, IconButton, InputLabel, Select, MenuItem, useTheme, useMediaQuery 
} from '@mui/material';
import { Add as AddIcon, Delete as DeleteIcon } from '@mui/icons-material';
import { Link, useNavigate } from 'react-router-dom';

const CreateRecipe = () => {
  const [name, setRecipeName] = useState('');
  const [cuisine, setCuisine] = useState('');
  const [type, setType] = useState('');
  const [items, setItems] = useState(['']);
  const [procedure, setProcedure] = useState('');
  const [isPublic, setIsPublic] = useState(true);
  const [sharedWith, setSharedWith] = useState(['']);

  const username = localStorage.getItem('username');
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));

  const handleItemChange = (index, event) => {
    const updatedItems = [...items];
    updatedItems[index] = event.target.value;
    setItems(updatedItems);
  };

  const handleAddItem = () => setItems([...items, '']);

  const handleRemoveItem = (index) => {
    const updatedItems = items.filter((_, i) => i !== index);
    setItems(updatedItems);
  };

  const handleUserChange = (index, event) => {
    const updatedUsers = [...sharedWith];
    updatedUsers[index] = event.target.value;
    setSharedWith(updatedUsers);
  };

  const handleAddUser = () => setSharedWith([...sharedWith, '']);

  const handleRemoveUser = (index) => {
    const updatedUsers = sharedWith.filter((_, i) => i !== index);
    setSharedWith(updatedUsers);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    const formData = {
      name,
      cuisine,
      type,
      items,
      procedure,
      isPublic,
      sharedWith
    };

    fetch(`http://localhost:10000/user/recipe/${username}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(formData)
    })
      .then(response => response.json())
      .then(data => {
        alert(data.message);
        navigate(`/recipes/${username}`);
      })
      .catch(error => {
        console.error('Error:', error);
        alert(error.message);
      });
  };

  const inputStyle = {
    '& .MuiOutlinedInput-root': {
      '& fieldset': {
        borderColor: '#007BFF',
      },
      '&:hover fieldset': {
        borderColor: '#0056b3',
      },
      '&.Mui-focused fieldset': {
        borderColor: '#0056b3',
      },
    },
  };

  return (
    <div style={{ margin: 0, padding: 0, minHeight: '100vh' }}>
      <Container
        maxWidth="sm"
        sx={{
          marginTop: '2rem',
          padding: isSmallScreen ? '1.2rem' : '1.5rem',
          borderRadius: '8px',
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.4)',
          backgroundColor: 'white',
          zIndex: '20',
          
        }}
      >
        <Typography variant="h4" gutterBottom sx={{ textAlign: 'center', fontWeight: 'bold', color: '#007BFF', fontSize: isSmallScreen ? '1.5rem' : '2rem' }}>
          Share Your Recipe
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Recipe Name"
            variant="outlined"
            margin="normal"
            value={name}
            onChange={(e) => setRecipeName(e.target.value)}
            sx={inputStyle}
          />

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Cuisine</InputLabel>
            <Select
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              label="Cuisine"
              sx={inputStyle}
            >
              <MenuItem value="Indian">Indian</MenuItem>
              <MenuItem value="Italian">Italian</MenuItem>
              <MenuItem value="Mexican">Mexican</MenuItem>
              <MenuItem value="Chinese">Chinese</MenuItem>
              <MenuItem value="American">American</MenuItem>
              <MenuItem value="Japanese">Japanese</MenuItem>
              <MenuItem value="Middle Eastern">Middle Eastern</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth variant="outlined" margin="normal">
            <InputLabel>Type</InputLabel>
            <Select
              value={type}
              onChange={(e) => setType(e.target.value)}
              label="Type"
              sx={inputStyle}
            >
              <MenuItem value="Vegetarian">Vegetarian</MenuItem>
              <MenuItem value="Non-Vegetarian">Non-Vegetarian</MenuItem>
              <MenuItem value="Vegan">Vegan</MenuItem>
            </Select>
          </FormControl>

          {items.map((item, index) => (
            <Stack direction="row" spacing={1} alignItems="center" key={index}>
              <TextField
                fullWidth
                label={`Item ${index + 1}`}
                value={item}
                variant="outlined"
                margin="normal"
                onChange={(e) => handleItemChange(index, e)}
                sx={{ ...inputStyle, marginBottom: '1rem' }}
              />
              <IconButton onClick={() => handleRemoveItem(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          <Button
            startIcon={<AddIcon />}
            variant="contained"
            color="primary"
            onClick={handleAddItem}
            sx={{ marginBottom: '1rem', marginTop: '1rem', backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' } }}
          >
            Add Item
          </Button>

          <TextField
            fullWidth
            label="Procedure"
            variant="outlined"
            margin="normal"
            multiline
            rows={4}
            value={procedure}
            onChange={(e) => setProcedure(e.target.value)}
            sx={inputStyle}
          />

          <FormControlLabel
            control={<Switch checked={isPublic} onChange={(e) => setIsPublic(e.target.checked)} />}
            label="Public"
            sx={{
              '& .MuiSwitch-thumb': {
                backgroundColor: '#007BFF',
              },
              '& .MuiSwitch-track': {
                backgroundColor: '#007BFF',
              },
            }}
          />

          {!isPublic && sharedWith.map((user, index) => (
            <Stack direction="row" spacing={1} alignItems="center" key={index}>
              <TextField
                fullWidth
                label={`User ${index + 1}`}
                value={user}
                variant="outlined"
                margin="normal"
                onChange={(e) => handleUserChange(index, e)}
                sx={{ ...inputStyle, marginBottom: '1rem' }}
              />
              <IconButton onClick={() => handleRemoveUser(index)} color="error">
                <DeleteIcon />
              </IconButton>
            </Stack>
          ))}

          {!isPublic && (
            <Button
              startIcon={<AddIcon />}
              variant="contained"
              color="primary"
              onClick={handleAddUser}
              sx={{ marginBottom: '1rem', marginTop: '1rem', backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' } }}
            >
              Add User
            </Button>
          )}

          <Stack direction={isSmallScreen ? "column" : "row"} spacing={2} sx={{ marginTop: '1rem' }}>
            <Button
              fullWidth
              variant="contained"
              color="primary"
              type="submit"
              sx={{ backgroundColor: '#007BFF', '&:hover': { backgroundColor: '#0056b3' } }}
            >
              Submit
            </Button>
            <Button fullWidth variant="outlined" color="secondary">
              <Link to={`/recipes/${username}`} style={{ textDecoration: 'none', color: 'inherit' }}>Cancel</Link>
            </Button>
          </Stack>
        </form>
      </Container>
    </div>
  );
};

export default CreateRecipe;
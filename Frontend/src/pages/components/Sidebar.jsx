import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Drawer, List, ListItem, ListItemText, Button, FormControl, InputLabel, Select, MenuItem, Divider, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

import { Menu, Settings, AccountCircle} from '@mui/icons-material/';
import LogoutIcon from '@mui/icons-material/Logout';
import { Link } from 'react-router-dom';

function Sidebar({onFetchPublic,onFetchShared,onFetchReceived,filterByCuisine, filterByType}) {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [type, setType] = useState('');
  const [cuisine, setCuisine] = useState('');


  const navigate = useNavigate();
  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
  };

  const logout =()=>{
    localStorage.removeItem('token')
    localStorage.removeItem('username')
    navigate('/')

  }

  const username = localStorage.getItem('username');

  return (
    <div style={{ display: 'flex' }}>
      <AppBar position="static" sx={{ backgroundColor:'#1B3139' }}>
        <Toolbar>
          <Typography variant="h4" component="div" sx={{ flexGrow: 1, fontFamily: 'Nerko One', color:'white'}}>
            Testify
          </Typography>
          <Button color="white" onClick={handleDrawerOpen} >
            <Menu />
          </Button>
        </Toolbar>
      </AppBar>

      <Drawer
        anchor="left"
        open={drawerOpen}
        onClose={handleDrawerClose}
        sx={{
          '& .MuiDrawer-paper': {
            width: 250,
            backgroundColor: '#EB1600', // Sidebar background color
            color: 'white', // Sidebar text color
            paddingTop: '1rem',
          },
        }}
      >
        
        <Button onClick={handleDrawerClose} sx={{ color: 'white', marginBottom: '1rem'  }}>Close</Button>
        <Box sx={{ padding: '1rem', borderBottom: '1px solid #444' }}>
          <Typography variant="h6" sx={{ marginBottom: '1rem' }}>Menu</Typography>
          <Typography sx={{ marginBottom: '1rem' }}><Link to={`/`}>Home</Link></Typography>
          <Typography  sx={{ marginBottom: '1rem' }}><Link to={`/createrecipe/${username}`}>CreateNewRecipe</Link></Typography>
         
        </Box>

        <List>
          <ListItem button sx={{ backgroundColor: '#EB1600', mb: 1,mr:2, '&:hover': { backgroundColor: '##1A2B2F' ,} }} onClick={onFetchPublic}>
            <ListItemText primary="Public Recipes" sx={{ color: 'white' }} />
          </ListItem>
          <ListItem button sx={{ backgroundColor: '#EB1600', mb: 1, '&:hover': { backgroundColor: '#1A2B2F' } }} onClick={onFetchShared}>
            <ListItemText primary="Your Recipes" sx={{ color: 'white' }} />
          </ListItem>
          <ListItem button sx={{ backgroundColor: '#EB1600', mb: 1, '&:hover': { backgroundColor: '#1A2B2F' } }} onClick={onFetchReceived}> 
            <ListItemText primary="Received Recipes" sx={{ color: 'white' }} />
          </ListItem>
          <Divider sx={{ my: 2, borderColor: '#444' }} />

          <ListItem>
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: 'white' }}>Type</InputLabel>
              <Select
                value={type}
                onChange={(e) =>{
                setType(e.target.value)
                filterByType(e.target.value)
                }}
                label="Type"
                sx={{ color: 'white', backgroundColor: '#1B3139' }}
              >
                <MenuItem value="Vegetarian">Veg</MenuItem>
                <MenuItem value="Non-Vegetarian">Non-Veg</MenuItem>
                <MenuItem value="Vegan">Vegan</MenuItem>
              </Select>
            </FormControl>
          </ListItem>
          <ListItem>
            
            <FormControl fullWidth variant="outlined">
              <InputLabel sx={{ color: 'white' }}>Cuisine</InputLabel>
              <Select
                value={cuisine}
                onChange={(e) =>{
                    setCuisine(e.target.value);
                    filterByCuisine(e.target.value); // Filter recipes by selected cuisine
                  }}
                label="Cuisine"
                sx={{ color: 'white', backgroundColor: '#1B3139' }}
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
          </ListItem>
        </List>

        <Button sx={{color:'white',fontWeight:'bold',fontSize:'1.2rem'}}  onClick={logout}>
           Logout  <LogoutIcon/>
        </Button>
      </Drawer>

     
    </div>
  );
}

export default Sidebar;

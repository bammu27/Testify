// App.jsx
import React, { Children } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate} from 'react-router-dom';
import Home from './pages/Home.jsx';
import Signup from './pages/Signup.jsx';
import Login from './pages/Login.jsx';
import Recipes from './pages/Recipes.jsx';
import CreateRecipe from './pages/CreateRecipe.jsx';
import DetaileRecipe from './pages/DetaileRecipe.jsx';




const PrivateRoute = ({children})=>{


  const token = localStorage.getItem('token')

  return token ? children : <Navigate to="/login" />


}


function App() {
  
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Signup" element={<Signup />} />
        <Route path="/Login" element={<Login />} />

        <Route path="/recipes/:id" element={<PrivateRoute><Recipes /></PrivateRoute>} />
        <Route path="/createrecipe/:id" element={<PrivateRoute><CreateRecipe /></PrivateRoute>} />
        <Route path="/recipe/:id" element={<PrivateRoute><DetaileRecipe/></PrivateRoute>}/>
      </Routes>
    </Router>
  );
}

export default App;

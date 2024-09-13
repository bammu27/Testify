import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);  // State to toggle password visibility

  const navigate = useNavigate();

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      const response = await fetch('`https://testifyat.onrender.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
  
      const data = await response.json();
  
      if (response.ok) {
        // Store JWT token in localStorage (or sessionStorage)
        localStorage.setItem('token', data.token);
        localStorage.setItem('username', username);
      
        
        navigate(`/recipes/${username}`);
      } else {
        // Handle error (e.g., invalid credentials)
        alert(data.message);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };

  
  const handleHomeRedirect = () => {
    navigate('/');
  };

  return (
    <div className="login-container min-h-screen flex items-center justify-center" style={{ backgroundColor: "#f6fffd" }}>
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md p-8 space-y-8 bg-white rounded-xl shadow-lg border-2 border-blue-900 md:m-6 sm:m-4">
        <h2 className="text-4xl font-bold text-center text-cyan-700">Login</h2>
        
        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="username" className="block text-sm font-medium text-teal-600">Username</label>
            <input  
              id="username" 
              name="username" 
              type="text" 
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required 
              className="mt-2 p-3 w-full border-2 border-blue-800 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="Enter your username"
            />
          </div>

          <div className="relative">
            <label htmlFor="password" className="block text-sm font-medium text-teal-600">Password</label>
            <input 
              id="password" 
              name="password" 
              type={showPassword ? "text" : "password"}  // Toggle type between 'text' and 'password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="mt-2 p-3 w-full border-2 flex item-center justify-end border-blue-800 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="Enter your password"
            />
           <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute inset-y-2 p-2 right-2 flex items-end justify-end px-3"
            >
              <span className={`text-teal-600 ${showPassword ? "font-bold" : "font-normal"}`}>
                {showPassword ? "Hide" : "Show"}
              </span>
            </button>
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg shadow-md bg-blue-100 hover:bg-blue-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="relative z-10 font-extrabold">Sign in</span>
              <span className="absolute inset-0 bg-blue-600 rounded-lg transform translate-x-1 translate-y-1 -z-10"></span>
            </button>

            <button 
             onClick={handleHomeRedirect}
             className="mt-4 w-full flex justify-center py-3 px-4 border-2 border-green-600 text-green-600 rounded-lg shadow-md bg-green-100 hover:bg-green-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 relative"
            >
            <span className="relative z-10 font-extrabold">Go to Home</span>
            <span className="absolute inset-0 bg-green-600 rounded-lg transform translate-x-1 translate-y-1 -z-10"></span>
        </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;

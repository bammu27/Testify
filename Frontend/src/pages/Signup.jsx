import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError(null); // Reset error before making the request

    fetch('http://localhost:10000/newuser', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, username, password }),
    })
    .then(response => response.json())
    .then(data => {
      if (data) {
        // Navigate to login page or show success message (implementation needed)
        navigate('/login');

      } else {
        setError(data.message || 'Something went wrong. Please try again.'); // Handle errors
        navigate('/signup');
      }
    })
    .catch((error) => {
      setError('Network error. Please try again later.');
    });
  };


  const handleHomeRedirect = () => {
    navigate('/');
  };


  return (
    <div className="signup-container min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#f6fffd"}}>
      <div className="sign-form w-full max-w-md p-8 space-y-8 rounded-xl shadow-lg border-2 border-blue-900">
        <h2 className="text-4xl font-bold text-center" style={{color:'blue'}}>Signup</h2>

        {error && (
          <div className="text-red-500 text-center text-sm font-medium bg-red-100 p-3 rounded-lg " onClick={()=>setError(nul)}>
            {error}


            
          </div>
        )}

        <form className="mt-6 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-lg font-bold" style={{color:'blue'}}>Email address</label>
            <input 
              id="email" 
              name="email" 
              type="email" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required 
              className="mt-2 p-3 w-full border-2 border-blue-800 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm" 
              placeholder="you@example.com"
            />
          </div>

          <div>
            <label htmlFor="username" className="block text-lg font-bold "  style={{color:'blue'}}>Username</label>
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

          <div>
            <label htmlFor="password" className="block text-lg font-bold" style={{color:'blue'}}>Password</label>
            <input 
              id="password" 
              name="password" 
              type="password" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required 
              className="mt-2 p-3 w-full border-2 border-blue-800 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm sm:mt-1" 
              placeholder="Enter your password"
            />
          </div>

          <div>
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border-2 border-blue-600 text-blue-600 rounded-lg shadow-md bg-blue-800 hover:bg-blue-200 hover:text-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 relative"
            >
              <span className="relative z-10 text-gray-300 font-extrabold">Signup</span>
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

export default Signup;

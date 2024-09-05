import React from 'react'
import { Link } from 'react-router-dom'
import '../css/Home.css'
const Home = () => {

const id = localStorage.getItem('username')

  return (
    <div className='Hero'>
        <div className='Herosection'>
            <div className='Navbar'>
                < div className='Nav'>
                <h2 className='Logo'>Testify</h2>

                <div className='Navlinks'>
                   
                    <Link   to={`/recipes/${id}`} className='nav-link'>Recipes</Link>
                    <Link   to='/Signup' className='nav-link'>Signup</Link>
                    <Link   to='/Login' className='nav-link'>Login</Link>
                </div>
                </div>
            </div>
            <div className='text-content'>
                <div className='Text'>
                    <h1 >Share, Explore, Savor</h1>
                    <p className='hero-subtitle'>Discover delicious recipes, share your culinary creations, and save your favorites—all in one place. Elevate your cooking journey!</p>
                </div>
            </div>

            <div className='container'>
                <div className='card'> 
                <div className='card-img'>
                    <img src='../../public/Food_img/delicious-indian-food-tray.jpg' alt='food' />
                </div>
                <div className='card-content'>
                    <h3>Spice Up Your Plate</h3>
                    <p>Experience the rich, vibrant flavors of Indian cuisine. From aromatic curries to sizzling street food, share your culinary passion and savor the diverse tastes of India.</p>
                </div>
                </div>
                </div>
            </div>


    </div>
  )
}

export default Home
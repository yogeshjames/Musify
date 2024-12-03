import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AiOutlineMenu, AiOutlineClose } from 'react-icons/ai';
import musicIcon from './assets/music.png';

function Header() {
  const navigate = useNavigate();
  const [activeItem, setActiveItem] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleItemClick = (item, path) => {
    setActiveItem(item);
    setMenuOpen(false); 
    navigate(path);
  };

  return (
    <header className="bg-gradient-to-r from-gray-300 z-10 via-gray-200 to-gray-100 shadow-md w-full h-16 flex items-center justify-between px-5 md:px-10">
     
      <img
        onClick={() => handleItemClick('Home', '/Home')}
        className="h-9 w-8 mr-8  cursor-pointer"
        src={musicIcon}
        alt="music"
      />

     
      <button
        className="text-2xl md:hidden focus:outline-none"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        {menuOpen ? <AiOutlineClose /> : <AiOutlineMenu />}
      </button>

     
      <ul
        className={`absolute top-16 left-0 w-full bg-white shadow-md md:static md:flex md:items-center md:space-x-10 md:bg-transparent md:shadow-none ${
          menuOpen ? 'block' : 'hidden'
        }`}
      >
        {[ 'Playlist', 'Liked', 'Friends', 'Artist', 'Stats'].map((item, index) => (
          <li
            key={index}
            onClick={() => handleItemClick(item, `/${item.replace(' ', '')}`)}
            className={`text-lg font-medium cursor-pointer hover:text-blue-600 transition-all p-3 md:p-0 ${
              activeItem === item ? 'font-extrabold text-blue-700' : 'text-gray-700'
            }`}
          >
            {item}
          </li>
        ))}
      </ul>

     
      <div className="hidden md:flex absolute right-40 items-center">
        <h1 className="text-lg font-bold text-gray-800">
          <span className="text-blue-700">Welcome!</span> {window.localStorage.getItem('name')}
        </h1>
      </div>

     
      <button
        className="hidden md:block absolute right-10 px-4 py-1 bg-red-500 text-white rounded-md shadow-md hover:bg-red-600 transition-all"
        onClick={() => {
          window.localStorage.removeItem('authToken');
          navigate('/login');
        }}
      >
        Logout
      </button>
    </header>
  );
}

export default Header;

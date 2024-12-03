import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Playlists from './Playlists.jsx';
import './index.css';
import Login from './Login.jsx';
import Register from './Register.jsx';
import Stats from './Stats.jsx';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Liked from './Liked.jsx';
import Friends from './Friends.jsx';
import Artist from './Artist.jsx';
import ProtectedRoute from './ProtectedRoute'; // Import ProtectedRoute

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />

        <Route path='/' element={<ProtectedRoute component={App} />} />
        <Route path='/Home' element={<ProtectedRoute component={App} />} />
        <Route path='/Liked' element={<ProtectedRoute component={Liked} />} />
        <Route path='/Playlist' element={<ProtectedRoute component={Playlists} />} />
        <Route path='/Friends' element={<ProtectedRoute component={Friends} />} />
        <Route path='/Artist' element={<ProtectedRoute component={Artist} />} />
        <Route path='/Stats' element={<ProtectedRoute component={Stats} />} />

        <Route path='/*' element={<ProtectedRoute component={App} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);

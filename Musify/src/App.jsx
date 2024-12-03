import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';  // Import the ProtectedRoute component
import Songs from './Songs.jsx';

function App() {
  const navigate = useNavigate();

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
console.log(authToken);
    if (!authToken) {
      console.log('No token found, redirecting to login...');
      navigate("/login");
    }
  }, [navigate]);

  return (
    <div>
      <ProtectedRoute component={Songs}></ProtectedRoute>
      
    </div>
  );
}

export default App;

import React, { useState, useEffect } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import axios from 'axios'; 

const ProtectedRoute = ({ component: Component, ...rest }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(null); 
  const location = useLocation();
  const token = localStorage.getItem('authToken'); 

  useEffect(() => {
    if (!token) {
      setIsAuthenticated(false);
    } else {
      axios.get('http://localhost:3000/verifyToken', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (response.status === 200) {
          setIsAuthenticated(true); 
        }
      })
      .catch((error) => {
        console.error('Token verification failed:', error);
        setIsAuthenticated(false); 
      });
    }
  }, [token]); 
  if (isAuthenticated === null) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return <Component {...rest} />;
};

export default ProtectedRoute;

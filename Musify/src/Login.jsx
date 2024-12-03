import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [cred, setcred] = useState({ username: '', password: '' });
  const [heading, setheading] = useState('Login');
  const navigate = useNavigate();

  function onchange(e) {
    const { name, value } = e.target;
    setcred({ ...cred, [name]: value });
  }

  async function submit(event) {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:3000/auth', { params: cred });

      if (response.status === 200 && response.data.success) {
        localStorage.setItem('authToken', response.data.token);
        localStorage.setItem('name', response.data.name);
        localStorage.setItem('isArtist', response.data.isartist);
        console.log()
        localStorage.setItem('id', response.data.id);
        console.log('Login successful');
        navigate('/App'); 
      } else {
        console.log('Login failed:', response.data.message);
        setheading('Incorrect credentials');
      }
    } catch (error) {
      console.error('Error during login:', error);
      setheading('Incorrect credentials');
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">{heading}</h2>
        <form>
          <div className="mb-4">
            <input
              type="text"
              name="username"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Username"
              onChange={onchange}
            />
          </div>
          <div className="mb-4">
            <input
              type="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              placeholder="Password"
              onChange={onchange}
            />
          </div>
          <div className="mb-4">
            <button
              onClick={submit}
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
            >
              Login
            </button>
          </div>
        </form>
        <p className="text-center text-gray-600 text-sm">
          Don't have an account? <a href="/register" className="text-blue-500 hover:text-blue-800">Sign up</a>
        </p>
      </div>
    </div>
  );
}

export default Login;

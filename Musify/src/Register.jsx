import React, { useState } from 'react';
import './index.css'; // CSS file contains the Tailwind directives
import { Navigate, useNavigate } from 'react-router-dom'
import axios from 'axios';
function Register() {
  const [active, setactive] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    artist:0
  });
const navigate = useNavigate();
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit  = async (e) => {
    try{
    e.preventDefault();
    console.log(formData);
    console.log('Form submitted:', formData);
    await axios.post("http://localhost:3000/register", formData);
    navigate("/login")
    }
    catch (err){
      console.log('error',err)
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-gray-800 text-center">Register</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <div className="block text-gray-700 text-sm font-bold mb-2">Name</div>
            <input
              type="text"
              name="name"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
              placeholder="Enter your name"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <div className="block text-gray-700 text-sm font-bold mb-2">Email</div>
            <input
              type="email"
              name="email"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 "
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          <div className="mb-4">
            <div className="block text-gray-700 text-sm font-bold mb-2">Password</div>
            <input
              type="password"
              name="password"
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>
          <button type='button' className={`font-bold py-10 px-4 rounded  ${active==="artist"? 'bg-green-500':''}`}  onClick={()=>{setactive("artist");
             setFormData({///if i dont specify type as buttin it gets submitted
              ...formData,
              artist:1////checkinmg artist true or not and making it dont wana use [] coz direct not like [name]:value
            });
          }}> Artist</button>
           <button type='button' className={`font-bold py-10 px-4 rounded  ${active==="user"? 'bg-green-500':''}`}  onClick={()=>{setactive("user");
             setFormData({
              ...formData,
              artist:0
            });
          }}> User</button>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded "
            >
              Register
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Register;

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header.jsx';
import Card from './Card.jsx';
import Audio from './Audioplayer/Audio.jsx';
import { toast } from 'react-toastify'; 

function Artist() {
  const [privsongs, setPrivSongs] = useState([]);
  const [playing, setPlaying] = useState(null);
  const navigate = useNavigate();



  
  useEffect(() => {
    const fetchPrivateSongs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/getprivsongs');
        console.log(res.data);
        setPrivSongs(res.data.songs || []);  // Ensure songs is an array
      } catch (err) {
        console.error(err);
      }
    };
    fetchPrivateSongs();
  }, []);

  
  const handleSubmit = async (event) => {
    event.preventDefault();

    const song = document.getElementById('a').value;
    const artist = document.getElementById('b').value;
    const mp3 = document.getElementById('c').value;
    const img = document.getElementById('d').value;

    if (!song || !artist || !mp3 || !img) {
      toast.error('Please fill in all fields.');
      return;  
    }

    const songData = { name: song, artist: artist, preview_url: mp3, image: img };
    try {
      const response = await axios.post('http://localhost:3000/uploadsong', songData);
      console.log(response);
      toast.success('Song uploaded successfully!');
    } catch (error) {
      console.error(error);
      toast.error('Error uploading the song!');
    }
  };

  return (
    <>
      <Header />
      <h1 className="text-3xl font-extrabold text-center text-gray-800 m-5">Private Songs</h1>

      {(window.localStorage.getItem('isArtist') === 'true') && (
        <div className="max-w-2xl mx-auto bg-white p-5 rounded-lg shadow-lg">
          <h2 className="text-xl font-semibold text-gray-700 mb-4">Upload a New Song</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              id="a"
              placeholder="Enter song name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              id="b"
              placeholder="Enter artist name"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              id="c"
              placeholder="Enter mp3 link of song"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              id="d"
              placeholder="Enter image source file"
              className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <p className="text-sm text-gray-600">All links should be without quotes ("")</p>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md transition-transform transform hover:scale-105 hover:bg-blue-700"
            >
              Upload
            </button>
          </form>
        </div>
      )}

      {privsongs.length > 0 ? (
        <div className="flex m-7 flex-wrap bg-slate-50 w-full rounded-md shadow-md">
          {privsongs.map((ele, index) => (
            <Card key={index} song={ele} is={false} playSong={setPlaying} priv={true} />
          ))}
        </div>
      ) : (
        <p className="text-center text-xl text-gray-500 mt-5">No private songs available.</p>
      )}

      {playing && (
        <div className="fixed bottom-3 left-0 w-full">
          <Audio src={playing} priv={true} />
        </div>
      )}
    </>
  );
}

export default Artist;

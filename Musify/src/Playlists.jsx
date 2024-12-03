import { useState, useEffect } from 'react';
import React from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import Header from './Header.jsx';
import axios from 'axios';
import Card from './Card.jsx';
import Cardplaylist from './Cardplaylist.jsx';
import Audio from './Audioplayer/Audio.jsx';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';

function Playlists() {
  const [name, setName] = useState('');
  const [partyplaylist, setPartyplaylist] = useState('');
  const [partyview, showParty] = useState(false);
  const [showform, setShowform] = useState(false);
  const [playlist, setAllPlaylist] = useState([]);
  const [show1, set1] = useState(false);
  const [show2, set2] = useState(true);
  const [playing, setPlaying] = useState(null);
  const [currentindex, setIndex] = useState();
  const [songsinplaylist, setSongsinplaylist] = useState([]);

  const navigate = useNavigate();
  async function addplaylist(x) {
    if (name === '') {
      toast.error('Playlist name cannot be empty!');
      return;
    }

    event.preventDefault();
    setShowform(!showform);
    navigate('/Playlist');
    try {
      const res = await axios.post('http://localhost:3000/newplaylist', {
        name: name,
        user: window.localStorage.getItem('id'),
        id: x === 1 ? 200 : window.localStorage.getItem('id'), // Set ID based on public/private
      });
      toast.success('Playlist added successfully!');
      setName('');
    } catch (err) {
      toast.error('Failed to add playlist. Please try again.');
    }
  }

  function toggle1() {
    setShowform(!showform);
  }

  useEffect(() => {
    async function fetchPlaylists() {
      try {
        const res = await axios.get('http://localhost:3000/playlists', {
          params: { id: window.localStorage.getItem('id') },
        });
        setAllPlaylist(res.data);
      } catch (err) {
        toast.error('Failed to fetch playlists.');
      }
    }
    fetchPlaylists();
  }, [showform]);

  function toggle() {
    set1(!show1);
    set2(!show2);
  }

  function party() {
    showParty(!partyview);
  }

  async function addparty() {
    event.preventDefault();
    const exists = playlist.some((ele) => ele.name === partyplaylist);

    if (exists && partyplaylist !== 'party') {
      try {
        await axios.post('http://localhost:3000/partymode', { partyplaylist });
        toast.success('Playlist added to party mode!');
        setPartyplaylist('');
        showParty(!partyview);
      } catch (error) {
        toast.error('Failed to add playlist to party mode.');
      }
    } else {
      toast.error('Playlist not found.');
    }
  }

  function SongEnd() {
    setPlaying(songsinplaylist[currentindex]);
  }

  return (
    <>
      <Header />
      <ToastContainer />
      {show2 && (
        <div className="container mx-auto p-4">
          <div className="flex flex-wrap gap-4">
            {playlist.map((play) => (
              <Cardplaylist
                key={play._id}
                mop={play}
                func={toggle}
                u={setSongsinplaylist}
              />
            ))}
          </div>
          <div className="mt-6 flex items-center gap-2">
            <AiOutlinePlus
              className="cursor-pointer w-10 h-10 border-opacity-70 border-2 border-black rounded-md hover:bg-gray-200 transition-all"
              onClick={toggle1}
            />
            <p className="text-lg font-medium">Add Playlist</p>
          </div>
          {showform && (
            <form className="mt-4 border border-gray-300 shadow-md rounded-md p-4 max-w-sm bg-white">
              <input
                type="text"
                placeholder="Name of the playlist"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
              <div className="flex justify-between">
                <button
                  type="submit"
                  onClick={() => addplaylist(1)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
                >
                  Public
                </button>
                <button
                  type="submit"
                  onClick={addplaylist}
                  className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-all"
                >
                  Private
                </button>
              </div>
            </form>
          )}
          <h1 className="mt-8 text-xl font-bold">Party Mode</h1>
          <div className="mt-2 flex items-center gap-2">
            <AiOutlinePlus
              className="cursor-pointer w-10 h-10 border-opacity-70 border-2 border-black rounded-md hover:bg-gray-200 transition-all"
              onClick={party}
            />
            <p className="text-lg font-medium">Add to Party Mode</p>
          </div>
          {partyview && (
            <form className="mt-4 border border-gray-300 shadow-md rounded-md p-4 max-w-sm bg-white">
              <input
                type="text"
                placeholder="Name of the playlist to add to party"
                className="w-full p-2 mb-4 border border-gray-300 rounded-md"
                value={partyplaylist}
                onChange={(e) => setPartyplaylist(e.target.value)}
              />
              <button
                type="submit"
                onClick={addparty}
                className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-all"
              >
                Add
              </button>
            </form>
          )}
        </div>
      )}
      {show1 && (
        <div className="flex flex-wrap gap-4 bg-gray-50 p-4 rounded-md">
          {songsinplaylist.map((song, index) => (
            <Card
              key={song.id}
              song={song}
              func={null}
              is={false}
              playSong={setPlaying}
              inc={setIndex}
              index={index}
            />
          ))}
        </div>
      )}
      {playing && (
        <div className="fixed bottom-3 left-0 w-full">
          <Audio src={playing} SongEnd={SongEnd} />
        </div>
      )}
    </>
  );
}

export default Playlists;

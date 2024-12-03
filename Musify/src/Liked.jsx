import { useState, useEffect } from 'react';
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AiOutlineSearch } from 'react-icons/ai';
import Header from './Header.jsx';
import axios from 'axios';
import Card from './Card.jsx';
import AudioPlayer from './Audioplayer/Audioplayer.jsx';
import Audio from './Audioplayer/Audio.jsx';

function Liked() {
  const [liked, setLiked] = useState([]);
  const [playing, setPlaying] = useState(null);
  var  [change, setChange] = useState(0);
  const token = window.localStorage.getItem('token');
  const navigate = useNavigate();


  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const res = await axios.get('http://localhost:3000/likedd', {
          params: { id: window.localStorage.getItem('id') },
        });
        const x = res.data.likedsongs;
        console.log(x); // gets the liked songs
        const songs = [];
        for (const ele of x) {
          const response = await axios.get(`https://api.spotify.com/v1/tracks/${ele}`, {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          });
          console.log(response.data);
          songs.push(response.data);
        }
        const newv = await axios.post('http://localhost:3000/likedplaylist',{
          name:'liked',
          user:window.localStorage.getItem('id'),
          songs:songs
        });
        console.log(newv.data.message);

        console.log(songs);
        setLiked(songs);
      } catch (err) {
        console.log(err);
      }
    };
    fetchSongs();
  }, [change]);

  function handleLike(songId) {
    setChange(++change);
    if (liked.includes(songId)) {
      setLiked(liked.filter((song) => song.id !== songId));
    }
  }

  return (
    <>
      <Header />
      <div className="flex mx-6 flex-wrap bg-slate-50 w-full rounded-md">
        {console.log(liked)}
        {liked.length==0 ? <p>NO liked songs</p>:''}
        {liked.map((song) => (
          <Card
            key={song.id}
            song={song}
            func={handleLike}
            is={true}
            playSong={setPlaying} // playing song
          />
        ))}
      </div>
      {playing && (
        <div className="fixed bottom-3 left-0 w-full ">
          
          <Audio src={playing}/>
        </div>
      )}
    </>
  );
}

export default Liked;
